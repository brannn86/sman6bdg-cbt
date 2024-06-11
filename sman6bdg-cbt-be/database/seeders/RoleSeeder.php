<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $role = [
            'developer',
            'admin',
            'teacher',
            'student'
        ];

        foreach ($role as $key => $value) {
            Role::create([
                'name' => $value,
                'guard_name' => 'api'
            ]);
        }
    }
}
