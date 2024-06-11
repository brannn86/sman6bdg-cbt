<?php

namespace App\Repositories;

use App\Base\BaseRepository;
use App\Models\QuestionAnswer;
use App\Models\Question;
use Exception;

class QuestionRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Question());
    }

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
            $model->where('question', 'like', '%'.$params['search'].'%');
        }

        if (isset($params['subject_id'])) {
            $model->where('subject_id', $params['subject_id']);
        }

        $model->with('answer');

        if ($withPaginate) {
            return $model->paginate($params['limit'] ?? 15);
        } else {
            return $model->get();
        }
    }

    public function create($data)
    {
        $this->validateAnswer($data['options'], $data['answer']);

        $answer = $data['answer'];
        unset($data['answer']);

        $model = $this->model->create($data);

        QuestionAnswer::create([
            'question_id' => $model->id,
            'answer' => $answer,
        ]);
    }

    public function update($id, $data)
    {
        $model = $this->model->find($id);
        if (isset($data['options']) && isset($data['answer'])) {
            $this->validateAnswer($data['options'], $data['answer']);
        }

        if (empty($model)) {
            return null;
        }

        if (isset($data['answer'])) {
            $questionAnswer = QuestionAnswer::where('question_id', $model->id)->first();
            $questionAnswer->update([
                'answer' => $data['answer'],
            ]);
            unset($data['answer']);
        }

        return $model->update($data);
    }

    private function validateAnswer($options, $answer): void
    {
        if (!array_key_exists($answer, $options)) {
            throw new Exception(__('question.response.answer_not_in_options'));
        }
    }
}
