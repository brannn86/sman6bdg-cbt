<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_exams', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('exam_id')->comment('Ini untuk menunjukan ujian mana yang diujikan');
            $table->unsignedBigInteger('student_id')->comment('Ini untuk menunjukan siswa mana yang diujikan');
            $table->unsignedBigInteger('subject_id')->comment('Ini untuk menunjukan mata pelajaran mana yang diujikan');

            $table->longText('question')->nullable()->comment('Ini untuk menunjukan jawaban siswa');
            $table->integer('score')->nullable()->comment('Ini untuk menunjukan skor siswa');
            $table->boolean('is_done')->default(false)->comment('Ini untuk menunjukan apakah siswa sudah mengerjakan ujian atau belum');
            $table->timestamp('finished_at')->nullable()->comment('Ini untuk menunjukan kapan siswa selesai mengerjakan ujian');

            $table->boolean('blocked')->default(false)->comment('Ini untuk menunjukan apakah siswa diblokir atau tidak');
            $table->timestamp('blocked_at')->nullable()->comment('Ini untuk menunjukan kapan siswa diblokir');
            $table->string('blocked_reason')->nullable()->comment('Ini untuk menunjukan alasan siswa diblokir');

            $table->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_exams');
    }
};
