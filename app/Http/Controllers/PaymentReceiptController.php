<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentReceiptRequest;
use App\Models\Enrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PaymentReceiptController extends Controller
{
    /**
     * Store a Yape screenshot and put the enrollment under review.
     */
    public function store(StorePaymentReceiptRequest $request, Enrollment $enrollment): RedirectResponse
    {
        $file = $request->file('receipt');
        $disk = config('titangym.receipts.disk');
        $path = $file->store("receipts/{$enrollment->id}", $disk);

        DB::transaction(function () use ($request, $enrollment, $file, $disk, $path) {
            $enrollment->receipts()->create([
                'disk' => $disk,
                'path' => $path,
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'operation_code' => $request->validated('operation_code'),
            ]);

            $enrollment->resubmit();
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Comprobante enviado. Te avisaremos cuando validemos tu pago.',
        ]);

        return to_route('enrollments.show', $enrollment);
    }
}
