<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePaymentReceiptRequest extends FormRequest
{
    /**
     * Only the owner may upload, and only when no receipt is under review.
     */
    public function authorize(): bool
    {
        return $this->user()->can('uploadReceipt', $this->route('enrollment'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'receipt' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:'.config('titangym.receipts.max_kilobytes'),
            ],
            'operation_code' => ['nullable', 'string', 'max:30'],
        ];
    }
}
