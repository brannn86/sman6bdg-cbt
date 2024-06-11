<?php

declare(strict_types=1);

return [
    'name' => 'Exam',
    'response' => [
        'submitted_exam' => 'Successfully submitted the exam',
        'not_teacher' => 'User are not the teacher of this subject',
        'start_cant_below_now' => 'Start time can not be below now',
        'end_cant_below_start' => 'End time can not be below start time',
        'end_cant_below_now' => 'End time can not be below now',
        'already_started' => 'Exam already started',
        'not_started_yet' => 'Exam not started yet',
        'already_ended' => 'Exam already ended',
    ],
    'category_exam' => [
        'name' => 'Category Exam',
    ],
    'student_exam' => [
        'name' => 'Student Exam',
        'response' => [
            'success_start_exam' => 'Successfully started the student exam',
            'unblock_success' => 'Successfully unblocked the student exam',
            'block_success' => 'Successfully blocked the student exam',
            'already_submitted' => 'Student already submitted the exam',
            'blocked' => 'Student are blocked from this exam',
            'student_not_started' => 'Student not started the exam yet',
            'not_student' => 'Student are not a student of this subject',
        ],
        'label' => [
            'score' => 'Score',
            'right_answer' => 'Right Answer', // 'Jawaban Benar
            'wrong_answer' => 'Wrong Answer', // 'Jawaban Salah
            'not_answered' => 'Not Answered', // 'Tidak Dijawab
        ],
        'role' => [
            'student' => 'Student',
            'teacher' => 'Teacher',
        ]
    ],
    'exam_question' => [
        'name' => 'Exam Question',
        'response' => [
            'not_available' => 'This question is not belong to this exam',
        ]
    ],
];
