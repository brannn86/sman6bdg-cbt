<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\QuestionAnswer;
use Illuminate\Database\Seeder;

use App\Models\Classes;
use App\Models\Exam;
use App\Models\Question;
use App\Models\Subject;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class DummySeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->createClasses();
        $this->createSubjects();
        $this->createQuestion();
        $this->createExams();
    }

    private function createClasses()
    {
        $classes = [
            [
                'name' => 'XII RPL 1',
            ],
        ];

        foreach ($classes as $key => $value) {
            $classes = Classes::create($value);

            $classes->students()->sync([4, 5, 6]);
        }

        return $classes;
    }

    private function createSubjects()
    {
        $subjects = [
            [
                'name' => 'Bahasa Indonesia',
                'teacher_id' => 3
            ],
            [
                'name' => 'Bahasa Inggris',
                'teacher_id' => 3
            ]
        ];

        foreach ($subjects as $key => $value) {
            $subjects = Subject::create($value);

            $subjects->classes()->sync([1]);
        }

        return $subjects;
    }

    private function createQuestion()
    {
        $question = [
            [
                'subject_id' => 1,
                'question' => 'Siapakah nama presiden pertama Indonesia?',
                'options' => [
                    'Soekarno',
                    'Soeharto',
                    'Joko Widodo',
                    'Megawati',
                ],
                'answer' => 0, // index of options
            ],
            [
                'subject_id' => 1,
                'question' => 'Siapakah nama presiden kedua Indonesia?',
                'options' => [
                    'Soekarno',
                    'Soeharto',
                    'Joko Widodo',
                    'Megawati',
                ],
                'answer' => 1, // index of options
            ],

            [
                'subject_id' => 2,
                'question' => 'what is the capital city of Indonesia?',
                'options' => [
                    'Jakarta',
                    'Bandung',
                    'Surabaya',
                    'Bali',
                ],
                'answer' => 0, // index of options
            ],
            [
                'subject_id' => 2,
                'question' => 'what is the capital city of England?',
                'options' => [
                    'London',
                    'Manchester',
                    'Liverpool',
                    'Birmingham',
                ],
                'answer' => 0, // index of options
            ],
            [
                'subject_id' => 2,
                'question' => 'What is this?',
                'images' => [
                    'images/dummy/question/dummy.jpg'
                ],
                'options' => [
                    'Box',
                    'Ball',
                    'Book',
                    'Bottle',
                ],
                'answer' => 0, // index of options
            ],
            [
                'subject_id' => 2,
                'question' => 'Which one is reza',
                'images' => [
                    'images/dummy/question/dummy2.jpg',
                    'images/dummy/question/dummy3.jpg',
                ],
                'options' => [
                    'Image 1',
                    'Image 2',
                ],
                'answer' => 0, // index of options
            ],
            [
                'subject_id' => 2,
                'question' => 'Which one not reza',
                'images' => [
                    'images/dummy/question/dummy2.jpg',
                    'images/dummy/question/dummy3.jpg',
                ],
                'options' => [
                    'Image 1',
                    'Image 2',
                ],
                'answer' => 1, // index of options
            ],
        ];

        foreach ($question as $key => $value) {
            $question = Question::create([
                'subject_id' => $value['subject_id'],
                'question' => $value['question'],
                'options' => $value['options'],
                'images' => $value['images'] ?? null,
            ]);

            QuestionAnswer::create([
                'answer' => $value['answer'],
                'question_id' => $question->id,
            ]);
        }
    }

    private function createExams()
    {
        // exams now and two hours later
        $exams = [
            [
                'subject_id' => 1,
                'category_exam_id' => 2, // Ujian
                'name' => 'Ulangan Harian 1 - Bahasa Indonesia',
                'start_at' => now()->addDays(1),
                'end_at' => now()->addDays(1)->addHours(4),
                'duration' => Carbon::parse(now())->diffInMinutes(now()->addHours(2)), // 120 minutes
                'questions' => [1, 2],
                'total_question' => 2,
            ],
            [
                'subject_id' => 2,
                'category_exam_id' => 2, // Ujian
                'name' => 'Ulangan Harian 1 - Bahasa Inggris',
                'start_at' => now(),
                'end_at' => now()->addDays(1)->addHours(4),
                'duration' => Carbon::parse(now()->addHour(2)->addMinutes(30))->diffInMinutes(now()->addHours(4)->addMinutes(30)), // 120 minutes
                'questions' => [3, 4, 5, 6, 7],
                'total_question' => 5,
            ],
            [
                'subject_id' => 1,
                'category_exam_id' => 2, // Ujian
                'name' => 'Ulangan Harian 1 - Bahasa Indonesia',
                'start_at' => now()->subHour(3),
                'end_at' => now()->subHour(1),
                'duration' => Carbon::parse(now()->addHour(2)->addMinutes(30))->diffInMinutes(now()->addHours(4)->addMinutes(30)), // 120 minutes
                'questions' => [3, 4],
                'total_question' => 2,
            ],
            [
                'subject_id' => 1,
                'category_exam_id' => 1, // Tugas
                'name' => 'Tugas 1 - Bahasa Indonesia',
                'start_at' => now(),
                'end_at' => now()->addDays(2),
                'duration' => Carbon::parse(now())->diffInMinutes(now()->addDays(2)), // 2880 minutes
                'questions' => [1, 2],
                'total_question' => 2,
            ],
            [
                'subject_id' => 2,
                'category_exam_id' => 1, // Tugas
                'name' => 'Tugas 1 - Bahasa Inggris',
                'start_at' => now(),
                'end_at' => now()->addDays(2),
                'duration' => Carbon::parse(now())->diffInMinutes(now()->addDays(2)), // 2880 minutes
                'questions' => [3, 4],
                'total_question' => 2,
            ],
            [
                'subject_id' => 1,
                'category_exam_id' => 1, // Ulangan
                'name' => 'Ulangan Kilat 1 - Bahasa Indonesia',
                'start_at' => now(),
                'end_at' => now()->addMinutes(1),
                'duration' => Carbon::parse(now())->diffInMinutes(now()->addMinutes(1)), // 1 minutes
                'questions' => [1, 2],
                'total_question' => 2,
            ]
        ];

        foreach ($exams as $key => $value) {
            $questions = $value['questions'];
            unset($value['questions']);

            $exams = Exam::create($value);

            $exams->questions()->sync($questions);
        }
    }
}
