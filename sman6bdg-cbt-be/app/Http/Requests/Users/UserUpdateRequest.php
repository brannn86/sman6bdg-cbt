<?php

namespace App\Http\Requests\Users;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class UserUpdateRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $authUser = auth()->user();
        if (!$authUser->hasAnyRole('developer|admin') && $authUser->id != $this->route('user')->id) {
            throw new \Exception(__('Custom/user.role.response.not_valid'));
        }

        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|alpha_dash|min:6|max:255|unique:users,username,' . $this->route('user')->id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $this->route('user')->id,
            'password' => 'nullable|string|min:8|confirmed',
            'role' => ' sometimes|string|in:developer,admin,teacher,student',

            'images' => 'nullable|image|mimes:jpeg,png,jpg',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:255',
            'province_id' => 'nullable|exists:provinces,id',
            'regency_id' => 'nullable|exists:regencies,id',
            'district_id' => 'nullable|exists:districts,id',
        ];
    }
}
