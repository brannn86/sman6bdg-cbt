<?php

namespace App\Http\Controllers;

use App\Base\BaseController;
use App\Http\Requests\IndexRequest;
use App\Http\Requests\CategoryExam\CategoryExamStoreRequest;
use App\Http\Requests\CategoryExam\CategoryExamUpdateRequest;
use App\Repositories\CategoryExamRepository;
use Illuminate\Http\Request;

class CategoryExamController extends BaseController
{
    protected $repository;

    public function __construct()
    {
        $this->repository = new CategoryExamRepository();
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexRequest $request)
    {
        $data['data'] = $this->repository->getAll($request->all(), false);

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/exam.category_exam.name')]),
            200
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryExamStoreRequest $request)
    {
        $data['data'] = $this->repository->create($request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.create_success', ['attribute' => __('Custom/exam.category_exam.name')]),
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(CategoryExam $categoryExam)
    {
        $data['data'] = $this->repository->find($categoryExam->id);

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/exam.category_exam.name')]),
            200
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CategoryExamUpdateRequest $request, CategoryExam $categoryExam)
    {
        $data['data'] = $this->repository->update($categoryExam->id, $request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.update_success', ['attribute' => __('Custom/exam.category_exam.name')]),
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CategoryExam $categoryExam)
    {
        $data['data'] = $this->repository->delete($categoryExam->id);

        return $this->successResponse(
            $data,
            __('Custom/common.delete_success', ['attribute' => __('Custom/exam.category_exam.name')]),
            200
        );
    }
}
