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
        Schema::create('questions', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('subject_id')->comment('Ini untuk menunjukan mata pelajaran mana yang diujikan');
            $table->text('images')->nullable()->comment('Ini untuk menunjukan gambar pertanyaan');
            $table->string('question')->comment('Ini untuk menunjukan pertanyaan');
            $table->longText('options')->comment('Ini untuk menunjukan pilihan jawaban');
            $table->longText('images_options')->nullable()->comment('Ini untuk menunjukan gambar pilihan jawaban');
            // $table->integer('answer')->comment('Ini untuk menunjukan jawaban yang benar');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
