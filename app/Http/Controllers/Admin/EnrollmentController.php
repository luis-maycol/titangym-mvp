<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EnrollmentStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\AdminEnrollmentResource;
use App\Models\Enrollment;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    /**
     * List enrollments by status; pending ones are shown oldest first, like a queue.
     */
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'status' => ['nullable', Rule::in(['all', ...array_column(EnrollmentStatus::cases(), 'value')])],
            'search' => ['nullable', 'string', 'max:100'],
        ]);

        $status = $filters['status'] ?? EnrollmentStatus::Pending->value;
        $search = trim($filters['search'] ?? '');

        $enrollments = Enrollment::query()
            ->with(['user.profile', 'plan', 'receipt'])
            ->when($status !== 'all', fn (Builder $query) => $query->where('status', $status))
            ->when($search !== '', fn (Builder $query) => $query->whereHas('user', function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('profile', fn (Builder $query) => $query->where('dni', 'like', "{$search}%"));
            }))
            ->when(
                $status === EnrollmentStatus::Pending->value,
                fn (Builder $query) => $query->oldest('id'),
                fn (Builder $query) => $query->latest('id'),
            )
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Enrollment $enrollment) => AdminEnrollmentResource::make($enrollment)->resolve());

        return Inertia::render('admin/enrollments/index', [
            'enrollments' => $enrollments,
            'filters' => ['status' => $status, 'search' => $search],
            'counts' => Enrollment::query()
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status'),
        ]);
    }

    /**
     * Show an enrollment with every receipt the client uploaded.
     */
    public function show(Enrollment $enrollment): Response
    {
        $enrollment->load([
            'user.profile',
            'plan',
            'reviewer',
            'receipt',
            'receipts' => fn ($query) => $query->latest('id'),
        ]);

        return Inertia::render('admin/enrollments/show', [
            'enrollment' => AdminEnrollmentResource::make($enrollment)->resolve(),
        ]);
    }
}
