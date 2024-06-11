<?php

namespace App\Services;

use App\Models\Question;

class QuestionService
{
    public function attachToExam($questionId, $examId)
    {
        $question = Question::find($questionId);

        $question->exams()->attach($examId);

        return true;
    }
}
