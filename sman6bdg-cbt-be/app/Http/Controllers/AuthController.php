<?php

namespace App\Http\Controllers;

use App\Base\BaseController;
use App\Services\AuthService;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Users\UserUpdateMeRequest;
use App\Http\Requests\Users\UserUpdateRequest;
use App\Http\Requests\UserUpdatePassword;
use Illuminate\Http\Request;
use App\Models\User;
use App\Repositories\UserRepository;
use App\Services\ImageService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends BaseController
{
    protected $authService;
    protected $userRepository;
    protected $imageService;

    public function __construct()
    {
        $this->authService = new AuthService();
        $this->userRepository = new UserRepository();
        $this->imageService = new ImageService();
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        // Create User
        $data['user'] = new User([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        $data['user']->save();

        // Create Token
        $data['token'] = $data['user']->createToken('authToken')->accessToken;

        // Return response
        return $this->successResponse(
            $data,
            __('Custom/common.create_success', ['attribute' => __('Custom/user.name')]),
            201
        );
    }

    public function loginAdmin(LoginRequest $request): JsonResponse
    {
        try {
            $data = $this->authService->login($request, 'developer|admin|teacher');

            return $this->successResponse(
                $data,
                __('Custom/auth.response.login.success'),
                200
            );
        } catch (\Throwable $th) {
            return $this->errorResponse(null, $th->getMessage(), $th->getCode() ? $th->getCode() : 401);
        }
    }

    public function loginStudent(LoginRequest $request): JsonResponse
    {
        try {
            $data = $this->authService->login($request, 'student');

            return $this->successResponse(
                $data,
                __('Custom/auth.response.login.success'),
                200
            );
        } catch (\Throwable $th) {
            return $this->errorResponse(null, $th->getMessage(), 401);
        }
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // return response()->noContent();
        // Return response
        return $this->successResponse(
            null,
            __('Custom/auth.response.logout.success'),
            200
        );
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me(Request $request)
    {
        if (!auth('sanctum')->user()) {
            return $this->errorResponse(null, 'Login terlebih dahulu', 401);
        }

        $data['user'] = auth('sanctum')->user()->load(
            'profile',
            'profile.province',
            'profile.regency',
            'profile.district',
            'roles',
            'mainClass',
            'classesStudent'
        );

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/user.name')]),
            200
        );
    }

    public function meUpdate(UserUpdateMeRequest $request)
    {
        $user = auth('sanctum')->user();
        $input = $request->all();

        if ($request->hasFile('images')) {
            $input['images'] = $this->imageService->uploadImages($request->file('images'), 'images/users', true);
        }

        $data['data'] = $this->userRepository->update($user->id, $input);

        return $this->successResponse(
            $data,
            __('Custom/common.update_success', ['attribute' => __('Custom/user.name')]),
            200
        );
    }

    public function mePassword(UserUpdatePassword $request)
    {
    }
}
