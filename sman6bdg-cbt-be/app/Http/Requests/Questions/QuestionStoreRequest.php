<?php

namespace App\Http\Requests\Questions;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class QuestionStoreRequest extends BaseRequest
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
            'question' => 'required|string|max:255',
            'options' => 'required|array|max:5',
            'options.*' => 'required|string|max:255',
            'answer' => 'required|integer',
            'image_options' => 'nullable|array',
            'image_options.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }
}
