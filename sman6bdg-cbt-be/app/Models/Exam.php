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
 * @property int $category_exam_id Ini untuk menunjukan kategori ujian
 * @property int $duration ini untuk menunjukan menit ujian
 * @property-read mixed $status
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExam> $studentExams
 * @property-read int|null $student_exams_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WarningExamLog> $warningLogs
 * @property-read int|null $warning_logs_count
 * @method static \Illuminate\Database\Eloquent\Builder|Exam filterByCategoryExam($categoryExamId)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam filterByStatusExam($status)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam whereCategoryExamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Exam whereDuration($value)
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExam> $studentExams
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WarningExamLog> $warningLogs
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExam> $studentExams
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WarningExamLog> $warningLogs
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Question> $questions
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExam> $studentExams
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\WarningExamLog> $warningLogs
 * @mixin \Eloquent
 */
class Exam extends Model
{
    use HasFactory;

    protected $fillable = ['subject_id', 'category_exam_id', 'name', 'start_at', 'end_at', 'duration', 'total_question'];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'total_question' => 'integer',
        'duration' => 'integer',
        'subject_id' => 'integer',
        'category_exam_id' => 'integer',
    ];

    protected $appends = ['status'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function questions()
    {
        return $this->belongsToMany(Question::class)->using(ExamQuestion::class);
    }

    public function studentExams()
    {
        return $this->hasMany(StudentExam::class);
    }

    public function warningLogs()
    {
        return $this->hasMany(WarningExamLog::class);
    }

    // Append
    public function getStatusAttribute()
    {
        $now = now();

        if ($now->isBefore($this->start_at)) {
            return 'upcoming';
        }

        if ($now->isAfter($this->end_at)) {
            return 'finished';
        }

        return 'ongoing';
    }

    // Helper
    public function scopeFilterByStudent($query, $studentId)
    {
        return $query->whereHas('subject', function ($query) use ($studentId) {
            $query->filterByStudent($studentId);
        });
    }

    public function scopeFilterByTeacher($query, $teacherId)
    {
        return $query->whereHas('subject', function ($query) use ($teacherId) {
            $query->where('teacher_id', $teacherId);
        });
    }

    public function scopeFilterByCategoryExam($query, $categoryExamId)
    {
        if (is_array($categoryExamId)) {
            return $query->whereIn('category_exam_id', $categoryExamId);
        }

        return $query->where('category_exam_id', $categoryExamId);
    }

    public function scopeFilterByStatusExam($query, $status)
    {
        if (!in_array($status, ['upcoming', 'ongoing', 'finished'])) {
            return $query;
        }

        if ($status == 'upcoming') {
            return $this->filterStatusUpcoming($query);
        }

        if ($status == 'ongoing') {
            return $this->filterStatusOngoing($query);
        }

        if ($status == 'finished') {
            return $this->filterStatusFinished($query);
        }
    }

    // Helper Model
    private function filterStatusUpcoming($query, $orStatus = false)
    {
        if ($orStatus) {
            return $query->orWhere('start_at', '>', now());
        }

        return $query->where('start_at', '>', now());
    }

    private function filterStatusOngoing($query, $orStatus = false)
    {
        if ($orStatus) {
            return $query->orWhere('start_at', '<=', now())->where('end_at', '>=', now());
        }

        return $query->where('start_at', '<=', now())->where('end_at', '>=', now());
    }

    private function filterStatusFinished($query, $orStatus = false)
    {
        if ($orStatus) {
            return $query->orWhere('end_at', '<', now());
        }

        return $query->where('end_at', '<', now());
    }
}
