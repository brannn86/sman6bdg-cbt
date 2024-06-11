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
        Schema::create('classes_students', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('class_id')->comment('Ini untuk menunjukan kelas mana yang mengambil siswa ini');
            $table->unsignedBigInteger('student_id')->comment('Ini untuk menunjukan siswa mana yang mengambil kelas ini');

            $table->foreign('class_id')->references('id')->on('classes')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes_students');
    }
};
