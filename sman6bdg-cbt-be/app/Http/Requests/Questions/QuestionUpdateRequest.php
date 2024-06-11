<?php

namespace App\Http\Requests\Questions;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class QuestionUpdateRequest extends BaseRequest
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
            'question' => 'sometimes|string|max:255',
            'options' => 'sometimes|array',
            'options.*.option' => 'sometimes|string|max:255',
            'answer' => 'sometimes|integer',
            'images' => 'sometimes|array',
        ];
    }
}
