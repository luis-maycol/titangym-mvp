<?php

namespace App\Http\Requests;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Profile;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnrollmentRequest extends FormRequest
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Guests register while enrolling; authenticated users must be clients.
     */
    public function authorize(): bool
    {
        return $this->user() === null || $this->user()->isClient();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [];

        if ($this->user() === null) {
            $rules = [
                ...$this->profileRules(),
                'password' => $this->passwordRules(),
            ];
        }

        if ($this->user()?->profile === null) {
            $rules = [
                ...$rules,
                'dni' => ['required', 'digits:8', Rule::unique(Profile::class)],
                'phone' => ['required', 'regex:/^9\d{8}$/'],
            ];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'El celular debe tener 9 dígitos y empezar con 9.',
            'dni.unique' => 'Ya existe una cuenta registrada con este DNI. Inicia sesión para continuar.',
            'email.unique' => 'Ya existe una cuenta con este correo. Inicia sesión para continuar.',
        ];
    }
}
