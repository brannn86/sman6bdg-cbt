<?php

namespace App\Http\Controllers;

use App\Base\BaseController;
use App\Http\Requests\IndexRequest;
use App\Http\Requests\Questions\QuestionStoreRequest;
use App\Http\Requests\Questions\QuestionUpdateRequest;
use App\Models\Question;
use App\Repositories\QuestionRepository;
use App\Services\ImageService;
use Illuminate\Http\Request;

class QuestionController extends BaseController
{
    protected $repository;
    protected $imageService;

    public function __construct()
    {
        $this->repository = new QuestionRepository(new Question());
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
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/question.name')]),
            200
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(QuestionStoreRequest $request)
    {
        $input = $request->all();

        if (isset($input['images']) && $input['images']) {
            $input['images'] = $this->imageService->uploadMultipleImages($request['images'], 'images/question', true);
        }

        // images_options
        if (isset($input['images_options']) && $input['images_options']) {
            $input['images_options'] = $this->imageService->uploadMultipleImages(
                $request['images_options'],
                'images/question',
                true,
                true
            );
        }

        $data['data'] = $this->repository->create($input);

        return $this->successResponse(
            $data,
            __('Custom/common.create_success', ['attribute' => __('Custom/question.name')]),
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        $data['data'] = $this->repository->find($question->id);

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/question.name')]),
            200
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(QuestionUpdateRequest $request, Question $question)
    {
        $input = $request->all();

        if (isset($input['images']) && $input['images']) {
            $input['images'] = $this->imageService->updateMultipleImages(
                $request['images'],
                $question->images,
                'images/question',
                true
            );
        }

        // images_options
        if (isset($input['images_options']) && $input['images_options']) {
            $input['images_options'] = $this->imageService->updateMultipleImages(
                $request['images_options'],
                $question->images_options,
                'images/question',
                true,
                true
            );
        }

        $data['data'] = $this->repository->update($question->id, $input);

        return $this->successResponse(
            $data,
            __('Custom/common.update_success', ['attribute' => __('Custom/question.name')]),
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        $this->imageService->deleteMultipleImages($question->images);
        $data['data'] = $this->repository->delete($question->id);

        return $this->successResponse(
            $data,
            __('Custom/common.delete_success', ['attribute' => __('Custom/question.name')]),
            200
        );
    }
}
