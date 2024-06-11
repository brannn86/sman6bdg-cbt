<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\ClassStudent
 *
 * @property int $id
 * @property int $class_id Ini untuk menunjukan kelas mana yang mengambil siswa ini
 * @property int $student_id Ini untuk menunjukan siswa mana yang mengambil kelas ini
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|ClassStudent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClassStudent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClassStudent query()
 * @method static \Illuminate\Database\Eloquent\Builder|ClassStudent whereClassId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClassStudent whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClassStudent whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClassStudent whereStudentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClassStudent whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class ClassStudent extends Model
{
    use HasFactory;

    protected $table = 'classes_students';

    protected $guarded = [];

    protected $casts = [
        'class_id' => 'integer',
        'student_id' => 'integer',
    ];
}
