<?php

namespace App\Imports;

use App\Models\Classes;
use App\Models\Indonesia\Province;
use App\Models\User;
use Hash;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Spatie\Permission\Models\Role;
use Str;

class UsersImport implements ToModel, WithStartRow
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $user = User::where('username', $row[1])->orWhere('email', $row[2])->first();
        if ($user) {
            return null;
        }

        // Validasi username is valid
        if (!preg_match('/^[a-zA-Z0-9_]+$/', $row[1])) {
            return null;
        }

        $rowRole = Str::lower($row[5]);
        if (in_array($rowRole, ['admin', 'teacher', 'student'])) {
            $role = Role::where('name', $rowRole)->first();
        } else {
            $role = Role::where('name', 'student')->first();
        }

        $classroom = Classes::where('name', 'LIKE', '%' . $row[4] . '%')->first();

        $province = Province::where('name', Str::upper($row[9]))->first();
        $regency = null;
        $district = null;

        if ($province) {
            $regency = $province->regencies()->where('name', Str::upper($row[10]))->first();
        }

        if ($regency) {
            $district = $regency->districts()->where('name', Str::upper($row[11]))->first();
        }

        $user = new User([
            'username' => $row[1],
            'email' => $row[2],
            'password' => Hash::make($row[3]),
        ]);

        $user->save();

        $user->profile()->create([
            'name' => $row[0],
            'images' => null,
            'phone' => $row[6],
            'address' => $row[7],
            'postal_code' => $row[8],
            'province_id' => $province['id'] ?? null,
            'regency_id' => $regency['id'] ?? null,
            'district_id' => $district['id'] ?? null,
        ]);

        if (!$user) {
            return null;
        }

        $user->assignRole($role);

        if (
            $classroom &&
            $role->name == 'student' &&
            $classroom->students()->where('student_id', $user->id)->count() == 0
        ) {
            $classroom->students()->attach($user->id);
        }

        return $user;
    }

    public function startRow(): int
    {
        return 2;
    }
}
