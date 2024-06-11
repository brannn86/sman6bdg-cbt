<?php

namespace App\Http\Requests\Exams;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class ExamUpdateRequest extends BaseRequest
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
            'subject_id' => 'sometimes|integer|exists:subjects,id',
            'category_exam_id' => 'sometimes|integer|exists:category_exams,id',
            'name' => 'sometimes|string|max:255',
            'start_at' => 'sometimes|date',
            'end_at' => 'sometimes|date|after:start_at',
            'question_id' => 'required|array',
            'question_id.*' => 'required|integer|exists:questions,id',
        ];
    }
}
