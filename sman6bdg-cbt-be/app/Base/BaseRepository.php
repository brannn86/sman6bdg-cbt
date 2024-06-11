<?php

namespace App\Base;

use App\Base\Construct\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

class BaseRepository implements BaseRepositoryInterface
{
    protected $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    // Start BaseCore CRUD

    /**
     * @param  array  $params
     * @param  bool  $withPaginate
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getAll($params = [], $withPaginate = true)
    {
        $model = $this->model->query();

        $model->orderBy($params['sort'] ?? 'id', $params['order'] ?? 'desc');

        if (isset($params['search'])) {
            $model->where('name', 'like', '%'.$params['search'].'%');
        }

        if ($withPaginate) {
            return $model->paginate($params['limit'] ?? 15);
        } else {
            return $model->get();
        }
    }

    public function find($id, $params = [])
    {
        $model = $this->model->query();

        return $model->find($id);
    }

    public function create($data)
    {
        return $this->model->create($data);
    }

    public function update($id, $data)
    {
        $model = $this->model->find($id);

        if (empty($model)) {
            return null;
        }

        return $model->update($data);
    }

    public function delete($id)
    {
        $model = $this->model->find($id);

        if (empty($model)) {
            return null;
        }

        return $model->delete();
    }

    // End BaseCore CRUD
}
