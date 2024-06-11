<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryExamController;
use App\Http\Controllers\ClassController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\LogoController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\Regional\RegionalController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth

Route::group(['name' => 'auth.', 'as' => 'auth.', 'prefix' => 'auth'], function () {
    Route::middleware('guest')->group(function () {
        Route::post('login', [AuthController::class, 'loginAdmin'])->name('login.admin');
        Route::post('login/student', [AuthController::class, 'loginStudent'])->name('login.student');
        Route::post('register', [AuthController::class, 'register'])->name('register');
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', [AuthController::class, 'me'])->name('me');
        Route::match(['put', 'post'], 'me', [AuthController::class, 'meUpdate'])->name('me.update');
    });
    // Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
});

Route::group([
    'name' => 'regional.',
    'as' => 'regional.',
    'prefix' => 'regional',
], function () {
    Route::get('provinces', [RegionalController::class, 'provinces'])->name('provinces');
    Route::get('regencies/{province_id}', [RegionalController::class, 'regencies'])->name('regency');
    Route::get('districts/{regency_id}', [RegionalController::class, 'districts'])->name('districts');
    Route::get('villages/{district_id}', [RegionalController::class, 'villages'])->name('villages');
});

Route::group(['name' => 'config.', 'as' => 'config.', 'prefix' => 'config'], function () {
    Route::match(['put', 'post'], '/logo_image', [LogoController::class, 'updateLogo'])->name('update')->middleware('auth:api', 'role:developer|admin');
    Route::get('/{key}', [LogoController::class, 'show'])->name('show');
});

Route::middleware(['auth:api'])->group(function () {
    // Users
    Route::group([
        'name' => 'users.',
        'as' => 'users.',
        'prefix' => 'users',
        // 'middleware' => ['role:developer|admin'],
    ], function () {
        Route::group(['middleware' => ['role:developer|admin']], function () {
            Route::post('/import', [UserController::class, 'storeImport'])->name('storeImport');

            Route::get('/', [UserController::class, 'index'])->name('index');
            Route::post('/', [UserController::class, 'store'])->name('store');
            Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
        });

        Route::group(['middleware' => ['role:developer|admin|teacher|student']], function () {
            Route::get('/{user}', [UserController::class, 'show'])->name('show');
            Route::match(['put', 'post'], '/{user}', [UserController::class, 'update'])->name('update');
        });
    });

    // Roles
    Route::group([
        'name' => 'roles.',
        'as' => 'roles.',
        'prefix' => 'roles',
        'middleware' => ['role:developer|admin'],
    ], function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::get('/{role}', [RoleController::class, 'show'])->name('show');
    });

    // Classes
    Route::group([
        'name' => 'classes.',
        'as' => 'classes.',
        'prefix' => 'classes',
        'middleware' => ['role:developer|admin'],
    ], function () {
        Route::get('/', [ClassController::class, 'index'])->name('index');
        Route::post('/', [ClassController::class, 'store'])->name('store');
        Route::get('/{class}', [ClassController::class, 'show'])->name('show');
        Route::put('/{class}', [ClassController::class, 'update'])->name('update');
        Route::delete('/{class}', [ClassController::class, 'destroy'])->name('destroy');
    });

    // Subjects
    Route::group([
        'name' => 'subjects.',
        'as' => 'subjects.',
        'prefix' => 'subjects',
    ], function () {
        Route::get('/', [SubjectController::class, 'index'])->name('index');
        Route::get('/{subject}', [SubjectController::class, 'show'])->name('show');

        Route::group(['middleware' => ['role:developer|admin']], function () {
            Route::post('/', [SubjectController::class, 'store'])->name('store');
            Route::put('/{subject}', [SubjectController::class, 'update'])->name('update');
            Route::delete('/{subject}', [SubjectController::class, 'destroy'])->name('destroy');
        });
    });

    // Category Exam
    Route::group([
        'name' => 'category.exam',
        'as' => 'category.exam',
        'prefix' => 'category-exam',
    ], function () {
        Route::get('/', [CategoryExamController::class, 'index'])->name('index');
        // Route::post('/', [CategoryExamController::class, 'store'])->name('store');
        // Route::get('/{categoryExam}', [CategoryExamController::class, 'show'])->name('show');
        // Route::put('/{categoryExam}', [CategoryExamController::class, 'update'])->name('update');
        // Route::delete('/{categoryExam}', [CategoryExamController::class, 'destroy'])->name('destroy');
    });

    // Exams
    Route::group([
        'name' => 'exams.',
        'as' => 'exams.',
        'prefix' => 'exams',
    ], function () {
        Route::get('/', [ExamController::class, 'index'])->name('index');
        Route::get('/{exam}', [ExamController::class, 'show'])->name('show');

        Route::group(['middleware' => ['role:developer|admin|teacher']], function () {
            Route::post('/', [ExamController::class, 'store'])->name('store');
            Route::put('/{exam}', [ExamController::class, 'update'])->name('update');
            Route::delete('/{exam}', [ExamController::class, 'destroy'])->name('destroy');
            Route::get('/{exam}/export', [ExamController::class, 'exportStudentExam'])->name('exportStudentExam');
        });

        // Block Exam
        Route::post(
            '/{exam}/unblock-exam',
            [ExamController::class, 'unblockedExam']
        )->name('unblocked.exam');

        Route::group(['middleware' => ['role:student']], function () {
            // Block Exam
            Route::post(
                '/{exam}/block-exam',
                [ExamController::class, 'blockExam']
            )->name('block.exam');

            // Student Exam
            Route::match(
                ['put', 'post'],
                '/{exam}/start-exam',
                [ExamController::class, 'startStudentExam']
            )->name('startStudentExam');
            Route::get(
                '/{exam}/get-exam',
                [ExamController::class, 'getStudentExam']
            )->name('getStudentExam');
            Route::match(
                ['put', 'post'],
                '/{exam}/submit-exam',
                [ExamController::class, 'submitExam']
            )->name('submitExam');

            Route::get(
                '/{exam}/{question}',
                [ExamController::class, 'getExamsQuestion']
            )->name('getExamsQuestion');
            Route::match(
                ['put', 'post'],
                '/{exam}/{question}',
                [ExamController::class, 'storeExamsQuestion']
            )->name('storeExamsQuestion');
        });
    });

    // Questions
    Route::group([
        'name' => 'questions.',
        'as' => 'questions.',
        'prefix' => 'questions',
        'middleware' => ['role:developer|admin|teacher'],
    ], function () {
        Route::get('/', [QuestionController::class, 'index'])->name('index');
        Route::post('/', [QuestionController::class, 'store'])->name('store');
        Route::get('/{question}', [QuestionController::class, 'show'])->name('show');
        Route::match(['put', 'post'], '/{question}', [QuestionController::class, 'update'])->name('update');
        Route::delete('/{question}', [QuestionController::class, 'destroy'])->name('destroy');
    });
});
