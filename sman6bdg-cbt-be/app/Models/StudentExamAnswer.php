<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\StudentExamAnswer
 *
 * @property int $id
 * @property int $question_id
 * @property int $student_exam_id
 * @property string|null $answer
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExamAnswer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExamAnswer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExamAnswer query()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExamAnswer whereAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExamAnswer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExamAnswer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExamAnswer whereQuestionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExamAnswer whereStudentExamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExamAnswer whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class StudentExamAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'question_id',
        'student_exam_id',
        'answer',
    ];

    protected $casts = [
        'question_id' => 'integer',
        'student_exam_id' => 'integer',
    ];
}
