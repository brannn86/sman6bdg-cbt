<?php

namespace App\Http\Controllers;

use App\Base\BaseController;
use App\Http\Requests\Classes\ClassStoreRequest;
use App\Http\Requests\Classes\ClassUpdateRequest;
use App\Http\Requests\Classes\ClassUpdateStudentRequest;
use App\Http\Requests\IndexRequest;
use App\Models\Classes;
use App\Repositories\ClassRepository;
use Illuminate\Http\Request;

class ClassController extends BaseController
{
    protected $repository;

    public function __construct()
    {
        $this->repository = new ClassRepository();
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexRequest $request)
    {
        $data['data'] = $this->repository->getAll($request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/class.name')]),
            200
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ClassStoreRequest $request)
    {
        $data['data'] = $this->repository->create($request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.create_success', ['attribute' => __('Custom/class.name')]),
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Classes $class)
    {
        $data['data'] = $this->repository->find($class->id);

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/class.name')]),
            200
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ClassUpdateRequest $request, Classes $class)
    {
        $data['data'] = $this->repository->update($class->id, $request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.update_success', ['attribute' => __('Custom/class.name')]),
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Classes $class)
    {
        $data['data'] = $this->repository->delete($class->id);

        return $this->successResponse(
            $data,
            __('Custom/common.delete_success', ['attribute' => __('Custom/class.name')]),
            200
        );
    }
}
