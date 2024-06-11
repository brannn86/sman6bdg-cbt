<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\StudentExam
 *
 * @property int $id
 * @property int $exam_id Ini untuk menunjukan ujian mana yang diujikan
 * @property int $student_id Ini untuk menunjukan siswa mana yang diujikan
 * @property int $subject_id Ini untuk menunjukan mata pelajaran mana yang diujikan
 * @property array|null $question Ini untuk menunjukan jawaban siswa
 * @property int|null $score Ini untuk menunjukan skor siswa
 * @property bool $is_done Ini untuk menunjukan apakah siswa sudah mengerjakan ujian atau belum
 * @property \Illuminate\Support\Carbon|null $finished_at Ini untuk menunjukan kapan siswa selesai mengerjakan ujian
 * @property bool $blocked Ini untuk menunjukan apakah siswa diblokir atau tidak
 * @property \Illuminate\Support\Carbon|null $blocked_at Ini untuk menunjukan kapan siswa diblokir
 * @property string|null $blocked_reason Ini untuk menunjukan alasan siswa diblokir
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExamAnswer> $StudentExamAnswer
 * @property-read int|null $student_exam_answer_count
 * @property-read \App\Models\Exam $exam
 * @property-read \App\Models\User $student
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam query()
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereBlocked($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereBlockedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereBlockedReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereExamId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereFinishedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereIsDone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereQuestion($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereStudentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereSubjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|StudentExam whereUpdatedAt($value)
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExamAnswer> $StudentExamAnswer
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExamAnswer> $StudentExamAnswer
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExamAnswer> $StudentExamAnswer
 * @mixin \Eloquent
 */
class StudentExam extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'exam_id',
        'subject_id',
        'question',
        'score',
        'is_done',
        'finished_at',
        'blocked',
        'blocked_at',
        'blocked_reason'
    ];

    protected $casts = [
        'is_done' => 'boolean',
        'question' => 'array',
        'finished_at' => 'datetime',
        'blocked' => 'boolean',
        'blocked_at' => 'datetime',
        'student_id' => 'integer',
        'exam_id' => 'integer',
        'subject_id' => 'integer',
    ];

    public function StudentExamAnswer()
    {
        return $this->hasMany(StudentExamAnswer::class, 'student_exam_id', 'id');
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id', 'id');
    }

    public function finish()
    {
        $score = 0;
        foreach ($this->StudentExamAnswer as $studentAnswer) {
            $question = Question::find($studentAnswer['question_id']);

            if ($question['answer']['answer'] == $studentAnswer['answer']) {
                $score++;
            }
        }

        $this->update([
            'score' => $score,
            'is_done' => true,
            'finished_at' => now(),
        ]);
    }

    public function unblock()
    {
        $this->update([
            'blocked' => false,
            'blocked_at' => null,
            'blocked_reason' => null,
        ]);
    }
}
