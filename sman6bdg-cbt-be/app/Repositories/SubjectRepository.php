<?php

namespace App\Repositories;

use App\Base\BaseRepository;
use App\Models\Exam;
use App\Models\Subject;

class SubjectRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Subject());
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

        $model = $model->with('classes', 'teacher.profile');

        $authUser = auth()->user();
        if ($authUser->hasRole('teacher')) {
            $model->where('teacher_id', $authUser->id);
        } elseif ($authUser->hasRole('student')) {
            $model->filterByStudent($authUser->id);
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

        $model = $model->with(['classes', 'exams', 'teacher.profile']);

        return $model->find($id);
    }

    public function create($data)
    {
        $subject = $this->model->create($data);

        if (isset($data['classes_id'])) {
            $this->updateClasses($subject->id, $data['classes_id']);
        }

        return $subject;
    }

    public function update($id, $data)
    {
        $subject = $this->model->find($id);

        $subject->update($data);

        if (isset($data['classes_id'])) {
            $this->updateClasses($subject->id, $data['classes_id']);
        }

        return $subject;
    }

    // ========================= RELATIONSHIP =========================

    public function updateClasses(int $subjectId, array|int $classesId)
    {
        $class = $this->model->find($subjectId);

        $class->classes()->sync($classesId);

        return true;
    }
}
