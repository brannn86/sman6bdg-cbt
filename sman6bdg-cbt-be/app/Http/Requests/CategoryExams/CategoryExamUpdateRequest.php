<?php

namespace App\Http\Requests\CategoryExams;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class CategoryExamUpdateRequest extends BaseRequest
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
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:category_exams,slug',
        ];
    }
}
