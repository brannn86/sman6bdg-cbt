<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Exam
 *
 * @property int $id
 * @property int $subject_id Ini untuk menunjukan mata pelajaran mana yang diujikan
 * @property string $name Ini untuk menunjukan nama ujian
 * @property string $start_at Ini untuk menunjukan waktu mulai ujian
 * @property string $end_at Ini untuk menunjukan waktu selesai ujian
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read int|null $questions_count
 * @property-read \App\Models\Subject|null $subject
 * @method static \Illuminate\Database\Eloquent\Builder|Exam filterByStudent($studentId)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam filterByTeacher($teacherId)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Exam newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Exam query()
 * @method static \Illuminate\Database\Eloquent\Builder|Exam whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam whereEndAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam whereStartAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam whereSubjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam whereUpdatedAt($value)
 * @property string $slug
 * @method static \Illuminate\Database\Eloquent\Builder|CategoryExam whereSlug($value)
 * @mixin \Eloquent
 */
class CategoryExam extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug'];

    protected $casts = [
        'exam_id' => 'integer',
        'student_id' => 'integer',
        'subject_id' => 'integer',
    ];
}
