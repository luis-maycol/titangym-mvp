<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectEnrollmentRequest;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EnrollmentReviewController extends Controller
{
    /**
     * Approve the Yape payment and activate the membership.
     */
    public function approve(Request $request, Enrollment $enrollment): RedirectResponse
    {
        DB::transaction(function () use ($request, $enrollment) {
            $locked = $this->lock($enrollment);
            Gate::authorize('review', $locked);
            $locked->approve($request->user());
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => "Matrícula #{$enrollment->id} aprobada. La membresía ya está activa."]);

        return to_route('admin.enrollments.index');
    }

    /**
     * Reject the receipt so the client can upload a new one.
     */
    public function reject(RejectEnrollmentRequest $request, Enrollment $enrollment): RedirectResponse
    {
        DB::transaction(function () use ($request, $enrollment) {
            $locked = $this->lock($enrollment);
            Gate::authorize('review', $locked);
            $locked->reject($request->user(), $request->validated('reason'));
        });

        Inertia::flash('toast', ['type' => 'info', 'message' => "Matrícula #{$enrollment->id} rechazada. El cliente podrá subir otro comprobante."]);

        return to_route('admin.enrollments.index');
    }

    /**
     * Re-read the row with a lock so two admins cannot review it at the same time.
     */
    private function lock(Enrollment $enrollment): Enrollment
    {
        return Enrollment::query()->with('plan')->lockForUpdate()->findOrFail($enrollment->id);
    }
}
