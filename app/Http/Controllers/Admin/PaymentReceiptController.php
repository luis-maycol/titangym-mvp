<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentReceipt;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PaymentReceiptController extends Controller
{
    /**
     * Stream a private Yape screenshot to an administrator.
     */
    public function show(PaymentReceipt $receipt): StreamedResponse
    {
        $disk = Storage::disk($receipt->disk);

        abort_unless($disk->exists($receipt->path), 404);

        return $disk->response($receipt->path, $receipt->original_name, [
            'Cache-Control' => 'private, max-age=600',
            'Content-Type' => $receipt->mime_type,
        ]);
    }
}
