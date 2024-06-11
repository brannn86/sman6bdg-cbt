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
        Schema::create('configs', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique()->comment('example: app_name');
            $table->string('value')->nullable()->comment('example: App Name');
            $table->string('label')->nullable()->comment('example: App Name');
            $table->string('type')->nullable()->comment('example: text, image');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configs');
    }
};
