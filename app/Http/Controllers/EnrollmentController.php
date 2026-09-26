<?php

namespace App\Http\Controllers;

use App\Enums\EnrollmentStatus;
use App\Http\Requests\StoreEnrollmentRequest;
use App\Http\Resources\EnrollmentResource;
use App\Http\Resources\PlanResource;
use App\Models\Enrollment;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    /**
     * Show the enrollment form for the chosen plan.
     */
    public function create(Request $request, Plan $plan): Response|RedirectResponse
    {
        abort_unless($plan->is_active, 404);

        $user = $request->user();

        if ($user === null) {
            $request->session()->put('url.intended', $request->url());
        } else {
            Gate::authorize('create', Enrollment::class);

            if ($redirect = $this->redirectIfAlreadyEnrolled($user)) {
                return $redirect;
            }
        }

        return Inertia::render('enrollments/create', [
            'plan' => PlanResource::make($plan)->resolve(),
            'needsAccount' => $user === null,
            'needsProfile' => $user?->profile === null,
        ]);
    }

    /**
     * Register the client (if needed) and create a pending enrollment.
     */
    public function store(StoreEnrollmentRequest $request, Plan $plan): RedirectResponse
    {
        abort_unless($plan->is_active, 404);

        if ($request->user() && ($redirect = $this->redirectIfAlreadyEnrolled($request->user()))) {
            return $redirect;
        }

        $data = $request->validated();

        [$user, $enrollment] = DB::transaction(function () use ($request, $plan, $data) {
            $user = $request->user() ?? User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
            ]);

            if ($user->profile === null) {
                $user->profile()->create([
                    'dni' => $data['dni'],
                    'phone' => $data['phone'],
                ]);
            }

            $enrollment = $user->enrollments()->create([
                'plan_id' => $plan->id,
                'amount' => $plan->price,
            ]);

            return [$user, $enrollment];
        });

        if ($request->user() === null) {
            event(new Registered($user));
            Auth::login($user);
            $request->session()->regenerate();
        }

        return to_route('enrollments.show', $enrollment);
    }

    /**
     * Show the Yape payment instructions and the receipt upload form.
     */
    public function show(Enrollment $enrollment): Response
    {
        Gate::authorize('view', $enrollment);

        $enrollment->load(['plan', 'receipt']);
        $qrPath = config('titangym.yape.qr_path');

        return Inertia::render('enrollments/show', [
            'enrollment' => EnrollmentResource::make($enrollment)->resolve(),
            'yape' => [
                'phone' => config('titangym.yape.phone'),
                'holder' => config('titangym.yape.holder'),
                'qr_url' => file_exists(public_path($qrPath)) ? asset($qrPath) : null,
            ],
            'maxUploadKilobytes' => config('titangym.receipts.max_kilobytes'),
        ]);
    }

    /**
     * Send the client to an unfinished or running enrollment instead of creating a duplicate.
     */
    private function redirectIfAlreadyEnrolled(User $user): ?RedirectResponse
    {
        $openEnrollment = $user->enrollments()
            ->whereIn('status', [EnrollmentStatus::Pending, EnrollmentStatus::Rejected])
            ->latest('id')
            ->first();

        if ($openEnrollment !== null) {
            Inertia::flash('toast', ['type' => 'info', 'message' => 'Ya tienes una matrícula en curso. Completa el pago aquí.']);

            return to_route('enrollments.show', $openEnrollment);
        }

        $current = $user->currentEnrollment;

        if ($current !== null) {
            Inertia::flash('toast', [
                'type' => 'info',
                'message' => 'Ya tienes una membresía activa hasta el '.$current->ends_at->format('d/m/Y').'.',
            ]);

            return to_route('dashboard');
        }

        return null;
    }
}
