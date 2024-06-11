<?php

namespace App\Exports;

use App\Models\Exam;
use App\Models\StudentExam;
use Maatwebsite\Excel\Excel;
use Maatwebsite\Excel\Concerns\FromCollection;
use Illuminate\Contracts\Support\Responsable;
use Log;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentExamExport implements
    FromQuery,
    WithMapping,
    WithHeadings,
    Responsable
{
    use Exportable;

    private $examId;
    private $exam;
    private $fileName;
    private $rows = 0;
    private $writerType = Excel::XLSX;
    private $headers = [
        'Content-Type' => 'text/csv',
    ];

    public function __construct($id)
    {
        $this->fileName = __('Custom/exam.student_exam.name') . '.xlsx';
        $this->examId = $id;
        $this->exam = Exam::find($this->examId);
    }

    public function query()
    {
        return StudentExam::query()->where('exam_id', $this->examId)->with('StudentExamAnswer', 'student.profile');
    }

    public function headings(): array
    {
        return [
            [$this->exam->name],
            [
                '#',
                __('Custom/exam.student_exam.role.student'),
                __('Custom/exam.student_exam.label.score'),
                __('Custom/exam.student_exam.label.right_answer'),
                __('Custom/exam.student_exam.label.wrong_answer'),
            ]
        ];
    }

    /**
     * @return array
     */
    public function map($studentExam): array
    {
        ++$this->rows;

        return [
            $this->rows,
            $studentExam->student->profile->name ?? $studentExam->student->username,
            strval($studentExam->score > 0 ? ($studentExam->score / $this->exam->questions_count) * 100 : 0),
            strval($studentExam->score ?? 0),
            strval($this->exam->total_question - ($studentExam->score ?? 0)),
        ];
    }
}
