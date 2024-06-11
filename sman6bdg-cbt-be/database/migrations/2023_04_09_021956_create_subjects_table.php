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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();

            // $table->unsignedBigInteger('class_id')->comment('Ini untuk menunjukan kelas mana yang mengambil mata pelajaran ini');
            $table->unsignedBigInteger('teacher_id')->comment('Ini untuk menunjukan guru yang mengajar mata pelajaran ini');
            $table->string('name')->comment('Ini untuk menunjukan nama mata pelajaran');

            // $table->foreign('class_id')->references('id')->on('classes')->onDelete('cascade');
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
