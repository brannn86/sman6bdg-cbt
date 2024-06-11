<?php

namespace App\Http\Controllers;

use App\Base\BaseController;
use App\Http\Requests\IndexRequest;
// use App\Http\Requests\Role\RoleStoreRequest;
// use App\Http\Requests\Role\RoleUpdateRequest;
use App\Repositories\RoleRepository;
use Illuminate\Http\Request;

class RoleController extends BaseController
{
    protected $repository;

    public function __construct()
    {
        $this->repository = new RoleRepository();
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexRequest $request)
    {
        $data['data'] = $this->repository->getAll($request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/user.role.name')]),
            200
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(RoleStoreRequest $request)
    {
        $data['data'] = $this->repository->create($request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.create_success', ['attribute' => __('Custom/user.role.name')]),
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        $data['data'] = $this->repository->find($role->id);

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/user.role.name')]),
            200
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(RoleUpdateRequest $request, Role $role)
    {
        $data['data'] = $this->repository->update($role->id, $request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.update_success', ['attribute' => __('Custom/user.role.name')]),
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        $data['data'] = $this->repository->delete($role->id);

        return $this->successResponse(
            $data,
            __('Custom/common.delete_success', ['attribute' => __('Custom/user.role.name')]),
            200
        );
    }
}
