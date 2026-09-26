<?php

namespace App\Http\Controllers;

use App\Enums\EnrollmentStatus;
use App\Http\Controllers\Admin\ClientController;
use App\Http\Resources\Admin\AdminEnrollmentResource;
use App\Http\Resources\EnrollmentResource;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the membership status to clients and the summary report to admins.
     */
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return $this->adminDashboard();
        }

        $current = $user->currentEnrollment()->with('plan')->first();
        $latest = $user->enrollments()->with(['plan', 'receipt'])->latest('id')->first();

        return Inertia::render('dashboard', [
            'currentEnrollment' => $current ? EnrollmentResource::make($current)->resolve() : null,
            'latestEnrollment' => $latest ? EnrollmentResource::make($latest)->resolve() : null,
        ]);
    }

    /**
     * Simple report: review queue, active members and this month's income.
     */
    private function adminDashboard(): Response
    {
        $monthStart = now()->startOfMonth();

        $approvedThisMonth = Enrollment::query()
            ->where('status', EnrollmentStatus::Active)
            ->where('reviewed_at', '>=', $monthStart);

        $revenueByPlan = (clone $approvedThisMonth)
            ->with('plan:id,name')
            ->selectRaw('plan_id, count(*) as total, sum(amount) as revenue')
            ->groupBy('plan_id')
            ->get()
            ->map(fn (Enrollment $row) => [
                'plan' => $row->plan->name,
                'total' => (int) $row->getAttribute('total'),
                'revenue' => number_format((float) $row->getAttribute('revenue'), 2, '.', ''),
            ])
            ->sortByDesc('revenue')
            ->values();

        $awaitingReview = Enrollment::pending()
            ->whereHas('receipts')
            ->with(['user.profile', 'plan', 'receipt'])
            ->oldest('id')
            ->limit(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'awaiting_review' => Enrollment::pending()->whereHas('receipts')->count(),
                'awaiting_payment' => Enrollment::pending()->whereDoesntHave('receipts')->count(),
                'active_members' => Enrollment::current()->distinct()->count('user_id'),
                'expiring_soon' => Enrollment::current()
                    ->whereDate('ends_at', '<=', today()->addDays(ClientController::EXPIRING_WITHIN_DAYS))
                    ->distinct()
                    ->count('user_id'),
                'total_clients' => User::query()->where('role', 'client')->count(),
                'revenue_this_month' => number_format((float) (clone $approvedThisMonth)->sum('amount'), 2, '.', ''),
            ],
            'revenueByPlan' => $revenueByPlan,
            'awaitingReview' => AdminEnrollmentResource::collection($awaitingReview)->resolve(),
            'expiringWithinDays' => ClientController::EXPIRING_WITHIN_DAYS,
        ]);
    }
}
