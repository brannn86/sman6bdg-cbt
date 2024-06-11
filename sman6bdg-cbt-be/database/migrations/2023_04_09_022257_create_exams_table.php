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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('subject_id')->comment('Ini untuk menunjukan mata pelajaran mana yang diujikan');
            $table->unsignedBigInteger('category_exam_id')->comment('Ini untuk menunjukan kategori ujian');

            $table->string('name')->comment('Ini untuk menunjukan nama ujian');
            $table->timestamp('start_at')->nullable()->comment('Ini untuk menunjukan waktu mulai ujian');
            $table->timestamp('end_at')->nullable()->comment('Ini untuk menunjukan waktu selesai ujian');
            $table->integer('duration')->comment('ini untuk menunjukan menit ujian');
            $table->integer('total_question')->comment('Ini untuk menunjukan jumlah soal ujian');

            $table->foreign('subject_id')->references('id')->on('subjects')->onDelete('cascade');
            $table->foreign('category_exam_id')->references('id')->on('category_exams')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
