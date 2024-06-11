<?php

namespace App\Repositories;

use App\Base\BaseRepository;
use App\Models\Classes;
use App\Models\User;

class ClassRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Classes());
    }

    public function getAll($params = [], $withPaginate = true)
    {
        $model = $this->model->query();

        $model->orderBy($params['sort'] ?? 'id', $params['order'] ?? 'desc');

        if (isset($params['search'])) {
            $model->where('name', 'like', '%' . $params['search'] . '%');
        }

        $model = $model->with('students');

        if ($withPaginate) {
            return $model->paginate($params['limit'] ?? 15);
        } else {
            return $model->get();
        }
    }

    public function find($id, $params = [])
    {
        $model = $this->model->query();

        $model = $model->with('students.profile');

        return $model->find($id);
    }

    public function create($data)
    {
        if (isset($data['student_id'])) {
            $syncStudent = $this->checkListStudent($data['student_id']);
        }

        $classModel = $this->model->create($data);

        if (isset($data['student_id'])) {
            $this->updateStudent($classModel->id, $syncStudent);
        }

        return $classModel;
    }

    public function update($id, $data)
    {
        $model = $this->model->find($id);

        if (empty($model)) {
            return null;
        }

        if (isset($data['student_id'])) {
            $syncStudent = $this->checkListStudent($data['student_id'], $model->id);
            $this->updateStudent($model->id, $syncStudent);

            unset($data['student_id']);
        }

        return $model->update($data);
    }

    public function delete($id)
    {
        $model = $this->model->find($id);

        if (empty($model)) {
            return null;
        }

        $model->delete();

        $model->students()->detach();

        return true;
    }

    // ========================= RELATIONSHIP =========================

    private function updateStudent(int $classId, array $syncStudent)
    {
        $class = $this->model->find($classId);

        $class->students()->sync($syncStudent);

        return true;
    }

    private function checkListStudent($studentId, $classId = null)
    {
        $syncStudent = [];
        foreach ($studentId as $id) {
            if (!$this->checkStudent($id, $classId)) {
                continue;
            }
            array_push($syncStudent, $id);
        }

        return $syncStudent;
    }

    private function checkStudent($studentId, $classId = null)
    {
        $student = User::with(['roles', 'profile'])->where('id', $studentId)->first();

        if (empty($student)) {
            throw new \Exception(__('common.not_found', ['attribute' => 'Siswa']), 404);
        }

        if ($student->roles->first()->name !== 'student') {
            throw new \Exception(__('class.response.not_student', ['attribute' => $student['profile']['name']]), 401);
        }

        if ($student->classesStudent->count() > 0 && $student->classesStudent->first()->id !== $classId) {
            throw new \Exception(__('class.response.already_registered', ['attribute' => $student['profile']['name']]), 401);
        }

        return true;
    }
}
