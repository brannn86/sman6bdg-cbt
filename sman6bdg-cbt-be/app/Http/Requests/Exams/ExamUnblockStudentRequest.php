<?php

namespace App\Http\Requests\Exams;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class ExamUnblockStudentRequest extends BaseRequest
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
            'student_id' => 'required|exists:users,id',
        ];
    }
}
