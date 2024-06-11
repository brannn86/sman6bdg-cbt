<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Classes
 *
 * @property int $id
 * @property string $name Ini untuk menunjukan nama kelas
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $students
 * @property-read int|null $students_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Subject> $subjects
 * @property-read int|null $subjects_count
 * @method static \Illuminate\Database\Eloquent\Builder|Classes filterByStudent($studentId)
 * @method static \Illuminate\Database\Eloquent\Builder|Classes newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Classes newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Classes query()
 * @method static \Illuminate\Database\Eloquent\Builder|Classes whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Classes whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Classes whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Classes whereUpdatedAt($value)
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $students
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Subject> $subjects
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $students
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Subject> $subjects
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $students
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Subject> $subjects
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $students
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Subject> $subjects
 * @mixin \Eloquent
 */
class Classes extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'name',
        'description',
        'status',
        'created_by',
        'updated_by',
    ];

    public function students()
    {
        return $this->belongsToMany(User::class, 'classes_students', 'class_id', 'student_id');
    }

    public function subjects()
    {
        return $this->belongsToMany(Subject::class, 'class_subjects', 'class_id', 'subject_id');
    }

    // Helper
    public function scopeFilterByStudent($query, $studentId)
    {
        return $query->whereHas('students', function ($query) use ($studentId) {
            $query->where('student_id', $studentId);
        });
    }
}
