<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $guard_name = 'api';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function classesStudent()
    {
        return $this->belongsToMany(Classes::class, 'classes_students', 'student_id', 'class_id');
    }

    public function mainClass()
    {
        return $this->hasOneThrough(Classes::class, ClassStudent::class, 'student_id', 'id', 'id', 'class_id');
    }

    public function classesTeacher()
    {
        return $this->hasMany(Classes::class, 'teacher_id', 'id');
    }

    public function profile()
    {
        return $this->hasOne(UserProfiles::class, 'user_id', 'id');
    }
}
