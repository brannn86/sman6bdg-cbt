<?php

namespace App\Repositories;

use App\Base\BaseRepository;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new User());
    }

    /**
     * @param  array  $params
     * @param  bool  $withPaginate
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getAll($params = [], $withPaginate = true)
    {
        $model = $this->model->query();

        $model = $model->with(['roles', 'profile']);

        $model = $model->whereHas('roles', function ($query) {
            $query->where('id', '>', Auth::user()->roles->first()->id);
        });

        $model->orderBy($params['sort'] ?? 'id', $params['order'] ?? 'desc');

        if (isset($params['search'])) {
            $model->whereHas('profile', function ($query) use ($params) {
                $query->where('name', 'like', '%' . $params['search'] . '%');
            });
        }

        if (isset($params['role'])) {
            $model->whereHas('roles', function ($query) use ($params) {
                $query->where('name', $params['role']);
            });
        }

        if (isset($params['withTrashed'])) {
            $model->withTrashed();
        }

        if (isset($params['with'])) {
            $model->with($params['with']);
        }

        if ($withPaginate) {
            return $model->paginate($params['limit'] ?? 15);
        } else {
            return $model->get();
        }
    }

    public function find($id, $params = [])
    {
        $authUser = auth()->user();
        if (!$authUser->hasAnyRole('developer|admin') && $authUser->id != $id) {
            throw new \Exception(__('custom.user.response.not_found'), 404);
        }

        $model = $this->model->query();

        $model = $model->with(['roles', 'profile']);

        return $model->find($id);
    }

    public function create($data)
    {
        if (!$this->checkRole($data['role'])) {
            throw new \Exception(__('custom.user.role.response.not_valid'), 401);
        }

        $data['password'] = Hash::make($data['password']);

        $role = $data['role'];
        $userProfile = $this->userProfile($data);
        $data = $this->removeUserKey($data);

        $user = $this->model->create($data);

        $user->assignRole($role);
        $user->profile()->create($userProfile);

        return $user;
    }

    public function update($id, $data)
    {
        $model = $this->model->find($id);

        if (empty($model)) {
            return null;
        }

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if (isset($data['role']) && $model->id != Auth::user()->id) {
            if (!$this->checkRole($data['role'])) {
                throw new \Exception(__('custom.user.role.response.not_valid'), 401);
            }

            $model->syncRoles($data['role']);
            unset($data['role']);
        }

        $userProfile = $this->userProfile($data);
        $data = $this->removeUserKey($data);

        $model->update($data);

        if (!empty($userProfile)) {
            $model->profile()->update($userProfile);
        }

        return $model;
    }

    public function delete($id)
    {
        $model = $this->model->find($id);

        if (empty($model)) {
            return null;
        }

        $model->profile()->delete();
        return $model->delete();
    }

    // ================================ Helper =================================

    private function checkRole($role)
    {
        if (Auth::user()->hasRole('developer')) { {
                if ($role == 'developer') {
                    return false;
                }
            }
        }
        if (Auth::user()->hasRole('admin')) { {
                if ($role == 'developer' || $role == 'admin') {
                    return false;
                }
            }
        }
        if (Auth::user()->hasRole('teacher')) { {
                if ($role == 'developer' || $role == 'admin' || $role == 'user') {
                    return false;
                }
            }
        }
        if (Auth::user()->hasRole('user')) {
            return false;
        }

        return true;
    }

    private function userProfile($data)
    {
        $userProfile = [];
        $itemInput = [
            'name',
            'images',
            'phone',
            'address',
            'postal_code',
            'province_id',
            'regency_id',
            'district_id',
        ];

        foreach ($itemInput as $item) {
            if (isset($data[$item])) {
                $userProfile[$item] = $data[$item];
            }
        }

        return $userProfile;
    }

    private function removeUserKey($data)
    {
        $remove = [
            'name',
            'role',
            'images',
            'phone',
            'address',
            'postal_code',
            'province_id',
            'regency_id',
            'district_id',
        ];

        return array_diff_key(
            $data,
            array_flip($remove)
        );
    }
}
