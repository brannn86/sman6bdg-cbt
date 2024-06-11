<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Log;

/**
 * App\Models\Question
 *
 * @property int $id
 * @property int $subject_id Ini untuk menunjukan mata pelajaran mana yang diujikan
 * @property string|null $images Ini untuk menunjukan gambar pertanyaan
 * @property string $question Ini untuk menunjukan pertanyaan
 * @property string $options Ini untuk menunjukan pilihan jawaban
 * @property int $answer Ini untuk menunjukan jawaban yang benar
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Question newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Question newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Question query()
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereImages($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereOptions($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereQuestion($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereSubjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Question whereUpdatedAt($value)
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExamAnswer> $StudentExamAnswer
 * @property-read int|null $student_exam_answer_count
 * @property-read mixed $image_url
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExamAnswer> $StudentExamAnswer
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExamAnswer> $StudentExamAnswer
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\StudentExamAnswer> $StudentExamAnswer
 * @mixin \Eloquent
 */
class Question extends Model
{
    use HasFactory;

    protected $fillable = ['subject_id', 'images', 'question', 'total_question', 'options', 'answer', 'images_options'];

    protected $casts = [
        'options' => 'array',
        'total_question' => 'integer',
        'images' => 'array',
        'images_options' => 'array',
        'subject_id' => 'integer',
        'pivot.exam_id' => 'string',
        'pivot.question_id' => 'integer',
    ];

    protected $hidden = [
        'created_at', 'updated_at'
    ];

    protected $appends = [
        'image_url',
        'image_options_url'
    ];

    public function answer()
    {
        return $this->hasOne(QuestionAnswer::class);
    }

    public function getImageUrlAttribute()
    {
        $imagesPath = [];
        if ($this->images) {
            if (is_array($this->images)) {
                foreach ($this->images as $image) {
                    $imagesPath[] = asset('storage/' . $image);
                }
            } else {
                $imagesPath[] = asset('storage/' . $this->images);
            }
        }

        return $imagesPath;
    }

    public function getImageOptionsUrlAttribute()
    {
        $imagesPath = [];
        if ($this->images_options) {
            if (is_array($this->images_options)) {
                foreach ($this->images_options as $image) {
                    $imagesPath[] = asset('storage/' . $image);
                }
            } else {
                $imagesPath[] = asset('storage/' . $this->images_options);
            }
        }

        return $imagesPath;
    }

    public function StudentExamAnswer()
    {
        return $this->hasMany(StudentExamAnswer::class, 'question_id', 'id');
    }
}
