<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\ClientResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Number of days ahead that counts as "por vencer".
     */
    public const EXPIRING_WITHIN_DAYS = 7;

    /**
     * List clients with their membership and expiration date.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'membership' => ['nullable', Rule::in(['all', 'active', 'expiring', 'inactive'])],
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        $membership = $filters['membership'] ?? 'active';
        $search = trim($filters['search'] ?? '');

        $current = fn (Builder $query) => $query
            ->where('status', EnrollmentStatus::Active)
            ->whereDate('ends_at', '>=', today());

        $clients = User::query()
            ->where('role', UserRole::Client)
            ->with(['profile', 'latestMembership.plan'])
            ->when($membership === 'active', fn (Builder $query) => $query->whereHas('enrollments', $current))
            ->when($membership === 'expiring', fn (Builder $query) => $query->whereHas(
                'enrollments',
                fn (Builder $query) => $current($query)->whereDate('ends_at', '<=', today()->addDays(self::EXPIRING_WITHIN_DAYS)),
            ))
            ->when($membership === 'inactive', fn (Builder $query) => $query->whereDoesntHave('enrollments', $current))
            ->when($search !== '', fn (Builder $query) => $query->where(function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('profile', fn (Builder $query) => $query->where('dni', 'like', "{$search}%"));
            }))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $client) => ClientResource::make($client)->resolve());

        return Inertia::render('admin/clients/index', [
            'clients' => $clients,
            'filters' => ['membership' => $membership, 'search' => $search],
            'expiringWithinDays' => self::EXPIRING_WITHIN_DAYS,
        ]);
    }
}
