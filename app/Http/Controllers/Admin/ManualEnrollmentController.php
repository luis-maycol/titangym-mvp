<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PaymentMethod;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreManualEnrollmentRequest;
use App\Http\Resources\PlanResource;
use App\Models\Enrollment;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ManualEnrollmentController extends Controller
{
    /**
     * Form to enroll a client who pays in person at the front desk.
     */
    public function create(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        return Inertia::render('admin/enrollments/create', [
            'plans' => PlanResource::collection(Plan::active()->get())->resolve(),
            'search' => $search,
            'clients' => fn () => $search === '' ? [] : $this->searchClients($search),
        ]);
    }

    /**
     * Create the enrollment already active, registering the client if needed.
     */
    public function store(StoreManualEnrollmentRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $plan = Plan::query()->findOrFail($request->integer('plan_id'));
        $isNewClient = $data['client_type'] === 'new';

        $enrollment = DB::transaction(function () use ($request, $data, $plan, $isNewClient) {
            if ($isNewClient) {
                $client = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Str::password(32),
                ]);
                $client->profile()->create(['dni' => $data['dni'], 'phone' => $data['phone']]);
            } else {
                $client = User::query()->findOrFail($request->integer('user_id'));
            }

            $enrollment = $client->enrollments()->create([
                'plan_id' => $plan->id,
                'amount' => $plan->price,
                'payment_method' => PaymentMethod::Cash,
            ]);
            $enrollment->setRelation('plan', $plan);
            $enrollment->approve($request->user());

            return $enrollment;
        });

        if ($isNewClient) {
            Password::sendResetLink(['email' => $data['email']]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Matrícula presencial registrada. Vence el '.$enrollment->ends_at->format('d/m/Y').'.'
                .($isNewClient ? ' Enviamos al cliente un correo para crear su contraseña.' : ''),
        ]);

        return to_route('admin.enrollments.show', $enrollment);
    }

    /**
     * @return array<int, array{id: int, name: string, email: string, dni: string|null, current_ends_at: string|null}>
     */
    private function searchClients(string $search): array
    {
        return User::query()
            ->where('role', UserRole::Client)
            ->where(function (Builder $query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('profile', fn (Builder $query) => $query->where('dni', 'like', "{$search}%"));
            })
            ->with(['profile', 'currentEnrollment'])
            ->orderBy('name')
            ->limit(8)
            ->get()
            ->map(fn (User $client) => [
                'id' => $client->id,
                'name' => $client->name,
                'email' => $client->email,
                'dni' => $client->profile?->dni,
                'current_ends_at' => $client->currentEnrollment?->ends_at?->toDateString(),
            ])
            ->all();
    }
}
