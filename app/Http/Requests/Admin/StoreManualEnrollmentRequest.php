<?php

namespace App\Http\Requests\Admin;

use App\Enums\EnrollmentStatus;
use App\Enums\UserRole;
use App\Models\Plan;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreManualEnrollmentRequest extends FormRequest
{
    /**
     * Admin access is enforced by the route middleware.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'plan_id' => ['required', 'integer', Rule::exists(Plan::class, 'id')->where('is_active', true)],
            'client_type' => ['required', Rule::in(['existing', 'new'])],
            'user_id' => [
                'exclude_unless:client_type,existing',
                'required',
                'integer',
                Rule::exists(User::class, 'id')->where('role', UserRole::Client->value),
            ],
            'name' => ['exclude_unless:client_type,new', 'required', 'string', 'max:255'],
            'email' => ['exclude_unless:client_type,new', 'required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)],
            'dni' => ['exclude_unless:client_type,new', 'required', 'digits:8', Rule::unique(Profile::class)],
            'phone' => ['exclude_unless:client_type,new', 'required', 'regex:/^9\d{8}$/'],
        ];
    }

    /**
     * An existing client cannot get a second membership on top of a running or open one.
     *
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($this->input('client_type') !== 'existing' || $validator->errors()->has('user_id')) {
                    return;
                }

                $client = User::find($this->integer('user_id'));

                if ($client?->currentEnrollment !== null) {
                    $validator->errors()->add(
                        'user_id',
                        'Este cliente ya tiene una membresía activa hasta el '.$client->currentEnrollment->ends_at->format('d/m/Y').'.',
                    );

                    return;
                }

                $hasOpenEnrollment = $client?->enrollments()
                    ->whereIn('status', [EnrollmentStatus::Pending, EnrollmentStatus::Rejected])
                    ->exists();

                if ($hasOpenEnrollment) {
                    $validator->errors()->add(
                        'user_id',
                        'Este cliente tiene una matrícula en línea sin cerrar. Revísala desde la cola de matrículas.',
                    );
                }
            },
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'Selecciona un cliente de la lista.',
            'phone.regex' => 'El celular debe tener 9 dígitos y empezar con 9.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'plan_id' => 'plan',
            'user_id' => 'cliente',
        ];
    }
}
