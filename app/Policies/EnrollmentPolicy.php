<?php

namespace App\Policies;

use App\Enums\EnrollmentStatus;
use App\Models\Enrollment;
use App\Models\User;

class EnrollmentPolicy
{
    /**
     * Only clients enroll; admins manage enrollments from the admin panel.
     */
    public function create(User $user): bool
    {
        return $user->isClient();
    }

    /**
     * The owner and administrators can see an enrollment.
     */
    public function view(User $user, Enrollment $enrollment): bool
    {
        return $user->isAdmin() || $enrollment->user_id === $user->id;
    }

    /**
     * Admins approve or reject only pending enrollments that have a receipt to check.
     */
    public function review(User $user, Enrollment $enrollment): bool
    {
        return $user->isAdmin()
            && $enrollment->status === EnrollmentStatus::Pending
            && $enrollment->hasReceipt();
    }

    /**
     * The owner may upload a receipt while none is under review, or after a rejection.
     */
    public function uploadReceipt(User $user, Enrollment $enrollment): bool
    {
        if ($enrollment->user_id !== $user->id) {
            return false;
        }

        return match ($enrollment->status) {
            EnrollmentStatus::Rejected => true,
            EnrollmentStatus::Pending => ! $enrollment->hasReceipt(),
            EnrollmentStatus::Active => false,
        };
    }
}
