<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;


/**
 * App\Models\ExamQuestion
 *
 * @property int $id
 * @property int $exam_id Ini untuk menunjukan ujian mana yang diujikan
 * @property int $question_id Ini untuk menunjukan pertanyaan mana yang diujikan
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|ExamQuestion newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ExamQuestion newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ExamQuestion query()
 * @method static \Illuminate\Database\Eloquent\Builder|ExamQuestion whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ExamQuestion whereExamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ExamQuestion whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ExamQuestion whereQuestionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ExamQuestion whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ExamQuestion extends Pivot
{
    use HasFactory;

    protected $table = 'exam_question';

    protected $casts = [
        'exam_id' => 'integer',
        'question_id' => 'integer',
    ];
}
