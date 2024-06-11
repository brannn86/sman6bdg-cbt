<?php

namespace App\Http\Requests\Exams;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class ExamStoreRequest extends BaseRequest
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
            'subject_id' => 'required|integer|exists:subjects,id',
            'category_exam_id' => 'required|integer|exists:category_exams,id',
            'name' => 'required|string|max:255',
            'start_at' => 'required|date|after:now',
            'end_at' => 'required|date|after:start_at',
        ];
    }
}
