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
        Schema::create('exam_question', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('exam_id')->comment('Ini untuk menunjukan ujian mana yang diujikan');
            $table->unsignedBigInteger('question_id')->comment('Ini untuk menunjukan pertanyaan mana yang diujikan');

            $table->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_question');
    }
};
