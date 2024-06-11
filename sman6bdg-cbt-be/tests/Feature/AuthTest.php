<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\AssertableJson;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Login Admin Testing.
     */
    public function test_login_admin_validation(): void
    {
        $response = $this->post('/api/auth/login');

        $response->assertStatus(422);
        $response->assertJson([
            'success' => false,
            'message' => 'The given data was invalid.',
        ]);
    }

    public function test_login_admin_success(): void
    {
        $user = $this->createUser('admin', $password = 'admin');

        $response = $this->post('/api/auth/login', [
            'username' => $user['username'],
            'password' => $password,
        ]);

        $response->assertStatus(200);
        $response->assertJson(
            fn (AssertableJson $json) =>
            $json->where('success', true)->where('message', 'User telah login dengan sukses')
                ->has(
                    'data',
                    fn ($json) =>
                    $json
                        ->where('user.username', $user['username'])
                        ->has('user.roles')
                        ->has('user.profile')
                        ->has('token')
                )
        );
    }

    public function test_login_admin_wrong_password(): void
    {
        $user = $this->createUser('admin', 'admin');

        $response = $this->post('/api/auth/login', [
            'username' => $user['username'],
            'password' => 'wrong_password',
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'success' => false,
            'message' => 'Salah Password',
        ]);
    }

    public function test_login_admin_account_not_found(): void
    {
        $response = $this->post('/api/auth/login', [
            'username' => 'admin',
            'password' => 'not_found',
        ]);

        $response->assertStatus(400);
        $response->assertJson([
            'success' => false,
            'message' => 'Akun tidak ditemukan',
        ]);
    }

    public function test_login_admin_role_not_admin(): void
    {
        $user = $this->createUser('student', $password = 'admin');

        $response = $this->post('/api/auth/login', [
            'username' => $user['username'],
            'password' => $password,
        ]);

        $response->assertStatus(400);
        $response->assertJson([
            'success' => false,
            'message' => 'Akun tidak dapat mengakses',
        ]);
    }

    // Helper Function
    private function createUser($roleUser, $password): User
    {
        $user = User::factory()->create([
            'username' => 'user',
            'password' => Hash::make($password),
        ]);

        Role::create(['name' => $roleUser, 'guard_name' => 'api']);

        $user->assignRole($roleUser);

        return $user;
    }
}
