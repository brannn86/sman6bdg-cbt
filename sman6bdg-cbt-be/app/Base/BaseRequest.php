<?php

namespace App\Base;

use App\Helpers\ResponseHelper;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

abstract class BaseRequest extends FormRequest
{
    use ResponseHelper;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            //
        ];
    }

    public function messages()
    {
        return [
            'required' => trans('validation.required'),
            'string' => trans('validation.string'),
            'max' => trans('validation.max'),
            'unique' => trans('validation.unique'),
            'min' => trans('validation.min'),
            'confirmed' => trans('validation.confirmed'),
            'in' => trans('validation.in'),
            'email' => trans('validation.email'),
            'exists' => trans('validation.exists'),
            'numeric' => trans('validation.numeric'),
            'integer' => trans('validation.integer'),
        ];
    }
}
