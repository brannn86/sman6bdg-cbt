<?php

namespace App\Http\Requests\Classes;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class ClassUpdateRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'name' => 'required|string|max:255|unique:classes,name,' . $this->route('class')->id,
            'student_id' => 'sometimes|array',
            'student_id.*' => 'sometimes|exists:users,id',
        ];
    }
}
