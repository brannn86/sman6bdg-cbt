<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use App\Models\UserProfiles;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = [
            [
                'username' => 'itsDeveloper',
                'email' => 'developer@gmail.com',
                'password' => Hash::make('Dev3l@per2023'),
                'role' => 'developer',
                'profile' => [
                    'name' => 'Developer',
                ]
            ],
            [
                'username' => 'itsAdmin',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('Adm1n2023'),
                'role' => 'admin',
                'profile' => [
                    'name' => 'Admin',
                ]
            ],
            [
                'username' => 'itsTeacher',
                'email' => 'teacher@gmail.com',
                'password' => Hash::make('Te@cher2023'),
                'role' => 'teacher',
                'profile' => [
                    'name' => 'Teacher',
                ]
            ],
            [
                'username' => 'itsStudent',
                'email' => 'student@gmail.com',
                'password' => Hash::make('Stud3nt2023'),
                'role' => 'student',
                'profile' => [
                    'name' => 'Student',
                    'address' => 'Jl. Student',
                    'phone' => '081234567890',
                    'postal_code' => '12345',
                    'province_id' => 32,
                    'regency_id' => 3204,
                    'district_id' => 3204190,
                ]
            ],
            [
                'username' => 'itsStudent2',
                'email' => 'student2@gmail.com',
                'password' => Hash::make('Stud3nt2023'),
                'role' => 'student',
                'profile' => [
                    'name' => 'Student2',
                    'address' => 'Jl. Student',
                    'phone' => '081234567891',
                    'postal_code' => '12345',
                    'province_id' => 32,
                    'regency_id' => 3204,
                    'district_id' => 3204190,
                ]
            ],
            [
                'username' => 'itsStudent3',
                'email' => 'student3@gmail.com',
                'password' => Hash::make('Stud3nt2023'),
                'role' => 'student',
                'profile' => [
                    'name' => 'Student3',
                    'address' => 'Jl. Student',
                    'phone' => '081234567892',
                    'postal_code' => '12345',
                    'province_id' => 32,
                    'regency_id' => 3204,
                    'district_id' => 3204190,
                ]
            ]
        ];

        foreach ($user as $key => $value) {
            $user = User::create([
                'username' => $value['username'],
                'email' => $value['email'],
                'password' => $value['password'],
            ]);

            $user->assignRole($value['role']);

            UserProfiles::create([
                'user_id' => $user->id,
                'name' => $value['profile']['name'],
                'address' => $value['profile']['address'] ?? null,
                'phone' => $value['profile']['phone'] ?? null,
                'postal_code' => $value['profile']['postal_code'] ?? null,
                'province_id' => $value['profile']['province_id'] ?? null,
                'regency_id' => $value['profile']['regency_id'] ?? null,
                'district_id' => $value['profile']['district_id'] ?? null,
            ]);

        }
    }
}
