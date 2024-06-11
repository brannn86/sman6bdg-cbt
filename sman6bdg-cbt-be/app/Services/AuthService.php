<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function login($request, $hasAnyrole)
    {
        $loginType = $this->getLoginType($request['username']);

        // Check credentials
        $this->checkCredentials($request, $loginType);

        // Create Token
        $data['user'] = $request->user();

        // Check role
        if(!$data['user']->hasAnyRole($hasAnyrole))
        {
            throw new \Exception(__('Custom/user.role.response.not_valid'), 401);
        }

        $data['user'] = $data['user']->load('profile', 'roles');

        $data['token'] = $data['user']->createToken('auth_token')->plainTextToken;

        return $data;
    }

    // Helper
    private function getLoginType($username)
    {
        return filter_var($username, FILTER_VALIDATE_EMAIL)? 'email': 'username';
    }

    private function checkCredentials($request, $loginType): void
    {
        $credentials = [
            $loginType => $request['username'],
            'password' => $request['password'],
        ];

        if (User::where($loginType, $credentials[$loginType])->doesntExist()) {
            throw new \Exception(__('Custom/common.not_found', ['attribute' => __('Custom/user.name')]), 404);
        }

        if (!Auth::attempt($credentials)) {
            throw new \Exception(__('Custom/auth.response.wrong_password'), 401);
        }
    }
}
