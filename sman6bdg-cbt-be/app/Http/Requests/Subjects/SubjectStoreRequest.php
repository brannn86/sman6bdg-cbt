<?php

namespace App\Http\Requests\Subjects;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class SubjectStoreRequest extends BaseRequest
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
            'teacher_id' => 'required|integer',
            'name' => 'required|string|max:255',
            'classes_id' => 'sometimes|array',
            'classes_id.*' => 'sometimes|exists:classes,id',
        ];
    }
}
