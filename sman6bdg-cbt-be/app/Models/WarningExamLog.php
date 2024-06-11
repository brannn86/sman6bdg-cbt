<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\WarningExamLog
 *
 * @property int $id
 * @property int $exam_id
 * @property int $student_exam_id
 * @property string $warning
 * @property string|null $ip_address
 * @property string|null $user_agent
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Exam $exam
 * @property-read \App\Models\StudentExam $studentExam
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog query()
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog whereExamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog whereStudentExamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog whereUserAgent($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WarningExamLog whereWarning($value)
 * @mixin \Eloquent
 */
class WarningExamLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_id',
        'student_exam_id',
        'warning',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'exam_id' => 'integer',
        'student_exam_id' => 'integer',
    ];

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function studentExam()
    {
        return $this->belongsTo(StudentExam::class);
    }
}
