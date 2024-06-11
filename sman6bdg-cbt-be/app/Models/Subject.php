<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Subject
 *
 * @property int $id
 * @property int $teacher_id Ini untuk menunjukan guru yang mengajar mata pelajaran ini
 * @property string $name Ini untuk menunjukan nama mata pelajaran
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Classes> $classes
 * @property-read int|null $classes_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam> $exams
 * @property-read int|null $exams_count
 * @method static \Illuminate\Database\Eloquent\Builder|Subject filterByStudent($studentId)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Subject newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Subject query()
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereTeacherId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Subject whereUpdatedAt($value)
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Classes> $classes
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam> $exams
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Classes> $classes
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam> $exams
 * @property-read \App\Models\User $teacher
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Classes> $classes
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam> $exams
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Classes> $classes
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam> $exams
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Classes> $classes
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Exam> $exams
 * @mixin \Eloquent
 */
class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'teacher_id'];

    protected $casts = [
        'teacher_id' => 'integer',
    ];

    public function classes()
    {
        return $this->belongsToMany(Classes::class, 'class_subjects', 'subject_id', 'class_id');
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function exams()
    {
        return $this->hasMany(Exam::class);
    }

    // Helper
    public function scopeFilterByStudent($query, $studentId)
    {
        return $query->whereHas('classes', function ($query) use ($studentId) {
            $query->filterByStudent($studentId);
        });
    }
}
