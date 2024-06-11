<?php

namespace App\Http\Requests;

use App\Base\BaseRequest;
use Illuminate\Support\Facades\Auth;

class IndexRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return Auth::check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:255',
            'search' => 'nullable|string|max:255',
            'sort' => 'nullable|string|max:255',
            'order' => 'nullable|string|max:255',
            'limit' => 'nullable|integer',
            'withTrashed' => 'nullable|boolean',
            'with' => 'nullable',
        ];
    }
}
