<?php

namespace App\Repositories;

use App\Base\BaseRepository;
use App\Models\StudentExamAnswer;
use App\Models\Exam;
use App\Models\Question;
use App\Models\StudentExam;
use App\Models\Subject;
use App\Models\WarningExamLog;
use Arr;
use Carbon\Carbon;
use Request;

class ExamRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new Exam());
    }


    /**
     * @param  array  $params
     * @param  bool  $withPaginate
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getAll($params = [], $withPaginate = true)
    {
        $model = $this->model->query();

        // $model->orderBy($params['sort'] ?? 'id', $params['order'] ?? 'desc');
        $model->orderBy('start_at', 'asc')->orderBy('end_at', 'asc');

        if (isset($params['search'])) {
            $model->where('name', 'like', '%' . $params['search'] . '%');
        }

        if (isset($params['subject_id'])) {
            $model->where('subject_id', $params['subject_id']);
        }

        if (isset($params['category_exam_id'])) {
            $model->filterByCategoryExam($params['category_exam_id']);
        }

        if (isset($params['status_exam'])) {
            $model->filterByStatusExam($params['status_exam']);
        }

        $authUser = auth()->user();
        if ($authUser->hasRole('teacher')) {
            $model->filterByTeacher($authUser->id);
        } elseif ($authUser->hasRole('student')) {
            $model->filterByStudent($authUser->id);
            $model->where('start_at', '<=', Carbon::now()->subDays(7));
        }

        $model->with(['subject', 'questions']);

        $model = $model->withCount(['studentExams as student_exam_blocked_count' => function ($query) {
            $query->where('blocked', true);
        }]);

        if ($withPaginate) {
            return $model->paginate($params['limit'] ?? 15);
        } else {
            return $model->get();
        }
    }

    public function find($id, $params = [])
    {
        $model = $this->model->query();

        $model->with(['subject', 'questions']);

        // Developer, Admin, Teacher can see all questions, answers and student answers
        if (auth()->user()->hasAnyRole('developer|admin|teacher')) {
            $model->with('questions.answer', 'warningLogs.studentExam.student.profile');

            $model->withCount('questions');

            $model->with(['studentExams.student.profile' => function ($query) use ($params) {
                if (isset($params['student_blocked']) && $params['student_blocked'] == true) {
                    $query->where('blocked', true);
                }
            }]);
        }

        // Student can see only his answers
        if (auth()->user()->hasRole('student')) {
            $model->with(['studentExams' => function ($query) {
                $query->where('student_id', auth()->user()->id);
            }]);
        }

        return $model->find($id);
    }

    public function create($data)
    {
        if (auth()->user()->hasRole('teacher')) {
            $subject = Subject::find($data['subject_id']);

            if ($subject['teacher_id'] != auth()->user()->id) {
                throw new \Exception(__('exam.response.not_teacher'));
            }
        }

        if ($data['start_at'] < Carbon::now()) {
            throw new \Exception(__('exam.response.start_cant_below_now'));
        }

        if ($data['end_at'] < Carbon::now()) {
            throw new \Exception(__('exam.response.end_cant_below_now'));
        }

        if ($data['end_at'] < $data['start_at']) {
            throw new \Exception(__('exam.response.end_cant_below_start'));
        }

        // start at to end at
        $data['duration'] = Carbon::parse($data['end_at'])->diffInMinutes(Carbon::parse($data['start_at']));

        $randomQuestions = $this->randomQuestion($data['subject_id'], $data['total_question']);

        $examModel = $this->model->create($data);

        // insert to pivot table
        $examModel->questions()->attach($randomQuestions);

        if (isset($data['question_id'])) {
            $this->updateQuestion($examModel->id, $data['question_id']);
        }

        return $examModel;
    }

    public function update($id, $data)
    {
        $model = $this->model->find($id);

        if (auth()->user()->hasRole('teacher')) {
            $subject = Subject::find($model['subject_id']);

            if ($subject['teacher_id'] != auth()->user()->id) {
                throw new \Exception(__('exam.response.not_teacher'));
            }
        }

        if ($model['start_at'] < Carbon::now()) {
            throw new \Exception(__('exam.response.already_started'));
        }

        if ($data['start_at'] < Carbon::now()) {
            throw new \Exception(__('exam.response.start_cant_below_now'));
        }

        if ($data['end_at'] < Carbon::now()) {
            throw new \Exception(__('exam.response.end_cant_below_now'));
        }

        if ($data['end_at'] < $data['start_at']) {
            throw new \Exception(__('exam.response.end_cant_below_start'));
        }

        if (empty($model)) {
            return null;
        }

        $examModel = $model->update($data);

        if (isset($data['question_id'])) {
            $this->updateQuestion($model->id, $data['question_id']);
        }

        return $examModel;
    }

    public function delete($id)
    {
        $model = $this->model->find($id);

        if (auth()->user()->hasRole('teacher')) {
            $subject = Subject::find($model['subject_id']);

            if ($subject['teacher_id'] != auth()->user()->id) {
                throw new \Exception(__('exam.response.not_teacher'));
            }
        }

        if (empty($model)) {
            return null;
        }

        return $model->delete();
    }

    // Exams Student
    public function startStudentExam($id)
    {
        $exam = Exam::find($id);

        if ($exam['start_at'] > Carbon::now()) {
            throw new \Exception(__('exam.response.not_started_yet'));
        }

        if ($exam['end_at'] < Carbon::now()) {
            throw new \Exception(__('exam.response.already_ended'));
        }

        $studentExam = StudentExam::where('exam_id', $id)->where('student_id', auth()->user()->id)->with('StudentExamAnswer')->first();

        if ($studentExam) {
            if ($studentExam['is_done']) {
                throw new \Exception(__('exam.student_exam.response.already_submitted'));
            }

            if ($studentExam['blocked']) {
                throw new \Exception(__('exam.student_exam.response.blocked'));
            }

            return $studentExam;
        }

        $studentExam = $this->generateStudentAnswer($exam, auth()->user());

        $studentExam['question_answer_count'] = count($studentExam['question']);
        $studentExam['question_answered_count'] = count($studentExam->studentExamAnswer()->where('answer', '!=', null)->get());
        $studentExam['question_not_answered_count'] = $studentExam['question_answer_count'] - $studentExam['question_answered_count'];

        return $studentExam;
    }

    public function getStudentExam($id)
    {
        $exam = Exam::find($id);

        $studentExam = StudentExam::where('exam_id', $id)->where('student_id', auth()->user()->id)->with('StudentExamAnswer')->first();

        if (!$studentExam) {
            throw new \Exception(__('exam.student_exam.response.student_not_started'));
        }

        if ($studentExam['blocked']) {
            throw new \Exception(__('exam.student_exam.response.blocked'));
        }

        $studentExam['question_answer_count'] = count($studentExam['question']);
        $studentExam['question_answered_count'] = count($studentExam->studentExamAnswer()->where('answer', '!=', null)->get());
        $studentExam['question_not_answered_count'] = $studentExam['question_answer_count'] - $studentExam['question_answered_count'];
        $studentExam['question_answered_percentage'] = round($studentExam['question_answered_count'] / $studentExam['question_answer_count'] * 100, 2);

        return $studentExam;
    }

    public function getExamsQuestion($id, $questionId)
    {
        $this->validateStudentExam($id, $questionId);

        $question = Question::find($questionId);
        $studentExam = StudentExam::where('exam_id', $id)->where('student_id', auth()->user()->id)->with('StudentExamAnswer')->first();

        $question['student_exam_answer'] = $question->StudentExamAnswer()->where('student_exam_id', $studentExam->id)->first();

        return $question;
    }

    public function getNavigationQuestion($id, $questionId)
    {
        $this->validateStudentExam($id, $questionId);

        $studentExam = StudentExam::where('exam_id', $id)->where('student_id', auth()->user()->id)->first();

        $questionAnswer = $studentExam->question;

        $currentQuestionIndex = array_search($questionId, $questionAnswer);

        $previousQuestionId = $questionAnswer[$currentQuestionIndex - 1] ?? null;
        $nextQuestionId = $questionAnswer[$currentQuestionIndex + 1] ?? null;

        return [
            'previous_question_id' => $previousQuestionId,
            'next_question_id' => $nextQuestionId,
        ];
    }

    public function storeExamsQuestion($id, $questionId, $answer)
    {
        $this->validateStudentExam($id, $questionId);

        $studentExam = StudentExam::where('exam_id', $id)->where('student_id', auth()->user()->id)->first();

        $questionAnswer = StudentExamAnswer::where('student_exam_id', $studentExam->id)->where('question_id', $questionId)->first();


        if ($questionAnswer) {
            $questionAnswer->update([
                'answer' => $answer['answer'] ?? null,
            ]);
        } else {
            StudentExamAnswer::create([
                'student_exam_id' => $studentExam->id,
                'question_id' => $questionId,
                'answer' => $answer['answer'] ?? null,
            ]);
        }

        return $studentExam;
    }

    public function submitExam($id)
    {
        $exam = Exam::find($id);

        $studentExam = StudentExam::where('exam_id', $id)->where('student_id', auth()->user()->id)->first();

        if ($studentExam['is_done']) {
            throw new \Exception(__('exam.student_exam.response.already_submitted'));
        }

        if ($studentExam['blocked']) {
            throw new \Exception(__('exam.student_exam.response.blocked'));
        }

        $studentExam->finish();

        return $studentExam;
    }

    // Block
    public function unblockedExam($id, $data)
    {
        $exam = Exam::find($id);

        $studentExam = StudentExam::where('exam_id', $id)->where('student_id', $data['student_id'])->first();

        if (!$studentExam) {
            throw new \Exception(__('exam.student_exam.response.student_not_started'));
        }

        $studentExam->unblock();

        return true;
    }

    public function blockExam($id, $data)
    {
        $exam = Exam::find($id);
        $warning = $data['warning'];

        $studentExam = StudentExam::where('exam_id', $id)->where('student_id', auth()->user()->id)->first();

        if (!$studentExam) {
            throw new \Exception(__('exam.student_exam.response.student_not_started'));
        }

        if ($studentExam['is_done']) {
            throw new \Exception(__('exam.student_exam.response.already_submitted'));
        }

        $warningExamLog = WarningExamLog::create([
            'exam_id' => $exam->id,
            'student_exam_id' => $studentExam->id,
            'warning' => $warning,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);

        $studentExam->update([
            'blocked' => true,
            'blocked_at' => now(),
            'blocked_reason' => $warning,
        ]);

        return $warningExamLog;
    }


    // Private Function

    private function validateStudentExam($examId, $questionId)
    {
        $user = auth()->user();
        $exam = Exam::find($examId);
        $question = Question::find($questionId);

        if (!$user->hasRole('student')) {
            throw new \Exception(__('exam.student_exam.response.not_student'));
        }

        if ($exam->subject()->filterByStudent($user->id)->count() == 0) {
            throw new \Exception(__('exam.student_exam.response.not_student'));
        }

        if ($exam->start_at > now()) {
            throw new \Exception(__('exam.response.not_started_yet'));
        }

        if ($exam->end_at < now()) {
            throw new \Exception(__('exam.response.already_ended'));
        }


        if (!$exam->questions()->where('question_id', $questionId)->first()) {
            throw new \Exception(__('exam.exam_question.response.not_available'));
        }

        $studentExam = $exam->studentExams()->where('student_id', $user->id)->first();

        if (!$studentExam) {
            throw new \Exception(__('exam.student_exam.response.student_not_started'));
        }

        if ($studentExam->is_done) {
            throw new \Exception(__('exam.student_exam.response.already_submitted'));
        }

        if ($studentExam->blocked) {
            throw new \Exception(__('exam.student_exam.response.blocked'));
        }

        if ($exam->start_at > now()) {
            $studentExam->update([
                'is_done' => true,
            ]);

            throw new \Exception(__('exam.response.not_started_yet'));
        }

        if ($exam->end_at < now()) {
            $studentExam->update([
                'is_done' => true,
            ]);

            throw new \Exception(__('exam.response.already_ended'));
        }

        return true;
    }

    private function generateStudentAnswer($exam, $user)
    {
        $examQuestion = [];

        $question = $exam->questions();

        // rand question
        $question->get()->map(function ($item) use (&$examQuestion) {
            $examQuestion[] = $item->id;
        });

        shuffle($examQuestion);

        $studentExam = StudentExam::create([
            'exam_id' => $exam->id,
            'student_id' => $user->id,
            'subject_id' => $exam->subject_id,
            'question' => $examQuestion,
        ]);

        return $studentExam;
    }

    // Private Function
    private function updateQuestion(int $examId, array $questionIds)
    {
        $exam = Exam::find($examId);

        $exam->questions()->sync($questionIds);

        return true;
    }

    private function randomQuestion($subjectId, $totalQuestion)
    {
        $questions = Question::where('subject_id', $subjectId)->get();

        // random array question with max total question
        $randomQuestions = Arr::random(
            $questions->toArray(),
            $totalQuestion <= $questions->count() ? $totalQuestion : $questions->count()
        );

        $randomQuestions = array_map(function ($question) {
            return $question['id'];
        }, $randomQuestions);

        return $randomQuestions;
    }
}
