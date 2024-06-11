<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\CategoryExam;
use App\Models\QuestionAnswer;
use Illuminate\Database\Seeder;

use App\Models\Classes;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Str;

class CategoryExamSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->createCategoryExam();
    }

    private function createCategoryExam()
    {
        $categoryExams = [
            [
                'name' => 'UTS',
            ],
            [
                'name' => 'UAS',
            ],
        ];

        foreach ($categoryExams as $key => $value) {
            $categoryExams = CategoryExam::create([
                'name' => $value['name'],
                'slug' => Str::slug($value['name']),
            ]);
        }

        return $categoryExams;
    }
}
