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
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('user_id')->unique()->comment('User ID');

            $table->string('name');
            $table->text('images')->nullable();
            $table->string('phone')->nullable();

            $table->text('address')->nullable();
            $table->string('postal_code')->nullable();
            $table->unsignedBigInteger('province_id')->nullable()->comment('Provinsi ID');
            $table->unsignedBigInteger('regency_id')->nullable()->comment('Kota/Kabupaten ID');
            $table->unsignedBigInteger('district_id')->nullable()->comment('Kecamatan ID');

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
