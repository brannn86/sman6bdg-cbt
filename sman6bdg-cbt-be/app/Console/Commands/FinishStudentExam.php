<?php

namespace App\Console\Commands;

use App\Models\Exam;
use Illuminate\Console\Command;

// /usr/local/bin/php /{location laravel}/artisan schedule:run >> /dev/null 2>&1
class FinishStudentExam extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:finish-student-exam';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Finish student exam';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $exam = Exam::where('end_at', '<=', now())
            ->whereHas('studentExams', function ($query) {
                $query->where('is_done', false)->orWhere('blocked', true);
            })
            ->with(['studentExams' => function ($query) {
                $query->where('is_done', false)->orWhere('blocked', true);
            }])
            ->first();

        if ($exam) {
            $exam->studentExams->each(function ($studentExam) {
                if ($studentExam->blocked) {
                    $studentExam->unblock();
                }

                if ($studentExam->is_done) {
                    return;
                }

                $studentExam->finish();
            });
        }

        $this->info('Finish student exam success');
    }
}
