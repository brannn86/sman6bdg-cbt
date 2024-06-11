<?php

namespace App\Repositories;

use App\Base\BaseRepository;
use Spatie\Permission\Models\Role;

class RoleRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Role());
    }

    /**
     * @param  array  $params
     * @param  bool  $withPaginate
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getAll($params = [], $withPaginate = true)
    {
        $model = $this->model->query();
        $user = auth()->user();

        $model->orderBy($params['sort'] ?? 'id', $params['order'] ?? 'desc');

        if (isset($params['search'])) {
            $model->where('name', 'like', '%'.$params['search'].'%');
        }

        $model = $model->where('id', '>', $user->roles->first()->id);

        if ($withPaginate) {
            return $model->paginate($params['limit'] ?? 15);
        } else {
            return $model->get();
        }
    }
}
