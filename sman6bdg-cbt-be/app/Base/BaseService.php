<?php

namespace App\Base;

use App\Base\Construct\BaseServiceInterface;
use App\Models\User;
use App\Repositories\UserRepository;

class BaseService implements BaseServiceInterface
{
    protected $repository;

    public function __construct()
    {
        $this->repository = new UserRepository(new User());
    }

    public function getAll($params, $withPaginate = true)
    {
        return $this->repository->getAll($params, $withPaginate);
    }

    public function find($id, $params = [])
    {
        return $this->repository->find($id, $params);
    }

    public function create($data)
    {
        return $this->repository->create($data);
    }

    public function update($id, $data)
    {
        $this->repository->update($id, $data);

        return $this->repository->find($id);
    }

    public function delete($id)
    {
        return $this->repository->delete($id);
    }

    public function restore($id)
    {
        return $this->repository->restore($id);
    }

    public function forceDelete($id)
    {
        return $this->repository->forceDelete($id);
    }
}
