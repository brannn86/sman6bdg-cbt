<?php

namespace App\Http\Controllers;

use App\Base\BaseController;
use App\Exports\StudentExamExport;
use App\Http\Requests\Exams\ExamStoreAnswerRequest;
use App\Http\Requests\Exams\ExamStoreRequest;
use App\Http\Requests\Exams\ExamUpdateRequest;
use App\Http\Requests\Exams\ExamBlockStudentRequest;
use App\Http\Requests\Exams\ExamUnblockStudentRequest;
use App\Http\Requests\IndexRequest;
use App\Models\Exam;
use App\Models\Question;
use App\Repositories\ExamRepository;
use Illuminate\Http\Request;

class ExamController extends BaseController
{
    protected $repository;

    public function __construct()
    {
        $this->repository = new ExamRepository(new Exam());
    }

    /**
     * Display a listing of the resource.
     */
    public function index(IndexRequest $request)
    {
        $data['data'] = $this->repository->getAll($request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/exam.name')]),
            200
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ExamStoreRequest $request)
    {
        $data['data'] = $this->repository->create($request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.create_success', ['attribute' => __('Custom/exam.name')]),
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Exam $exam)
    {
        $data['data'] = $this->repository->find($exam->id, $request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/exam.name')]),
            200
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ExamUpdateRequest $request, Exam $exam)
    {
        $data['data'] = $this->repository->update($exam->id, $request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.update_success', ['attribute' => __('Custom/exam.name')]),
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Exam $exam)
    {
        $data['data'] = $this->repository->delete($exam->id);

        return $this->successResponse(
            $data,
            __('Custom/common.delete_success', ['attribute' => __('Custom/exam.name')]),
            200
        );
    }

    // Student Answer
    public function startStudentExam(Request $request, Exam $exam)
    {
        $data['data'] = $this->repository->startStudentExam($exam->id);

        return $this->successResponse(
            $data,
            __('Custom/exam.student_exam.response.success_start_exam'),
            200
        );
    }

    public function getStudentExam(Exam $exam)
    {
        $data['data'] = $this->repository->getStudentExam($exam->id);

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/exam.student_exam.name')]),
            200
        );
    }

    public function getExamsQuestion(Request $request, Exam $exam, Question $question)
    {
        $data['data'] = $this->repository->getExamsQuestion($exam->id, $question->id);
        $data['navigation'] = $this->repository->getNavigationQuestion($exam->id, $question->id);

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/exam.exam_question.name')]),
            200
        );
    }

    public function storeExamsQuestion(ExamStoreAnswerRequest $request, Exam $exam, Question $question)
    {
        $data['data'] = $this->repository->storeExamsQuestion($exam->id, $question->id, $request->all());

        return $this->successResponse(
            $data,
            __('Custom/common.create_success', ['attribute' => __('Custom/exam.exam_question.name')]),
            200
        );
    }

    public function submitExam(Request $request, Exam $exam)
    {
        $data['data'] = $this->repository->submitExam($exam->id);

        return $this->successResponse(
            $data,
            __('Custom/exam.response.submitted_exam'),
            200
        );
    }

    public function unblockedExam(ExamUnblockStudentRequest $request, Exam $exam)
    {
        $data['data'] = $this->repository->unblockedExam($exam->id, $request->all());

        return $this->successResponse(
            $data,
            __('Custom/exam.student_exam.response.unblock_success'),
            200
        );
    }

    public function blockExam(ExamBlockStudentRequest $request, Exam $exam)
    {
        $data['data'] = $this->repository->blockExam($exam->id, $request->all());

        return $this->successResponse(
            $data,
            __('Custom/exam.student_exam.response.block_success'),
            200
        );
    }

    public function exportStudentExam($id)
    {
        return new StudentExamExport($id);
    }
}
