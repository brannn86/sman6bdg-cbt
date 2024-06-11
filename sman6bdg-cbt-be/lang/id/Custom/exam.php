<?php

declare(strict_types=1);

return [
    'name' => 'Ujian',
    'response' => [
        'submitted_exam' => 'Pengguna sudah mengumpulkan ujian ini',
        'not_teacher' => 'Pengguna bukan guru',
        'start_cant_below_now' => 'Waktu mulai tidak boleh dibawah waktu sekarang',
        'end_cant_below_start' => 'Waktu selesai tidak boleh dibawah waktu mulai',
        'end_cant_below_now' => 'Waktu selesai tidak boleh dibawah waktu sekarang',
        'already_started' => 'Ujian sudah dimulai',
        'not_started_yet' => 'Ujian belum dimulai',
        'already_ended' => 'Ujian sudah berakhir',
    ],
    'category_exam' => [
        'name' => 'Kategori Ujian',
    ],
    'student_exam' => [
        'name' => 'Ujian Siswa',
        'response' => [
            'success_start_exam' => 'Berhasil memulai ujian',
            'unblock_success' => 'Berhasil membuka block ujian siswa',
            'block_success' => 'Berhasil memblockir ujian siswa',
            'already_submitted' => 'Siswa sudah mengumpulkan ujian',
            'blocked' => 'Ujian siswa diblock',
            'student_not_started' => 'Siswa belum memulai ujian',
            'not_student' => 'Pengguna bukan siswa',
        ],
        'label' => [
            'score' => 'Skor',
            'right_answer' => 'Jawaban Benar',
            'wrong_answer' => 'Jawaban Salah',
            'not_answered' => 'Tidak Dijawab',
        ],
        'role' => [
            'student' => 'Siswa',
            'teacher' => 'Guru',
        ]
    ],
    'exam_question' => [
        'name' => 'Soal Ujian',
        'response' => [
            'not_available' => 'Soal tidak tersedia untuk ujian ini',
        ]
    ],
];
