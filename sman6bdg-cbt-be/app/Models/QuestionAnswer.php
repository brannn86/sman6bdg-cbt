<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\QuestionAnswer
 *
 * @property int $id
 * @property int $question_id
 * @property string $answer
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|QuestionAnswer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QuestionAnswer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|QuestionAnswer query()
 * @method static \Illuminate\Database\Eloquent\Builder|QuestionAnswer whereAnswer($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuestionAnswer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuestionAnswer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuestionAnswer whereQuestionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|QuestionAnswer whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class QuestionAnswer extends Model
{
    use HasFactory;

    protected $fillable = ['question_id', 'answer'];

    protected $casts = [
        'question_id' => 'integer',
    ];
}
