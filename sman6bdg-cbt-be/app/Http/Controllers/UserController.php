<?php

namespace App\Http\Controllers;

use App\Base\BaseController;
use App\Http\Requests\IndexRequest;
use App\Http\Requests\Users\UserStoreRequest;
use App\Http\Requests\Users\UserUpdateRequest;
use App\Imports\UsersImport;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\ImageService;
use Excel;
use Illuminate\Http\Request;

class UserController extends BaseController
{
    protected $repository;
    protected $imageService;

    public function __construct()
    {
        $this->repository = new UserRepository();
        $this->imageService = new ImageService();
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexRequest $request)
    {
        $data['data'] = $this->repository->getAll($request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/user.name')]),
            200
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserStoreRequest $request)
    {
        try {
            $input = $request->all();

            if ($request->hasFile('images')) {
                $input['images'] = $this->imageService->uploadImages($request->file('images'), 'images/users', true);
            }

            $data['data'] = $this->repository->create($input);

            return $this->successResponse(
                $data,
                __('Custom/common.create_success', ['attribute' => __('Custom/user.name')]),
                201
            );
        } catch (\Throwable $th) {
            return $this->errorResponse([], $th->getMessage());
        }
    }

    /**
     * Store file import.
     */
    public function storeImport(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:xlsx,xls',
            ]);

            Excel::import(new UsersImport(), $request->file('file'));

            return $this->successResponse(
                [],
                __('Custom/common.create_success', ['attribute' => __('Custom/user.name')]),
                201
            );
        } catch (\Throwable $th) {
            return $this->errorResponse([], $th->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $data['data'] = $this->repository->find($user->id);

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/user.name')]),
            200
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request, User $user)
    {
        $input = $request->all();

        if ($request->hasFile('images')) {
            $input['images'] = $this->imageService->uploadImages($request->file('images'), 'images/users', true);
        }

        $data['data'] = $this->repository->update($user->id, $input);

        return $this->successResponse(
            $data,
            __('Custom/common.update_success', ['attribute' => __('Custom/user.name')]),
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $data['data'] = $this->repository->delete($user->id);

        return $this->successResponse(
            $data,
            __('Custom/common.delete_success', ['attribute' => __('Custom/user.name')]),
            200
        );
    }
}
