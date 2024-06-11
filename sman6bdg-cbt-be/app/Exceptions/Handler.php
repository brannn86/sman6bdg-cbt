<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Throwable $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Throwable $throwable)
    {
        // Model not found
        if ($throwable instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => $throwable->getMessage(),
                'data' => method_exists($throwable, 'errors') ? $throwable->errors() : null
            ], 404);
        }

        // Unauthorized
        if ($throwable instanceof \Illuminate\Auth\Access\AuthorizationException) {
            return response()->json([
                'success' => false,
                'message' => $throwable->getMessage(),
                'data' => method_exists($throwable, 'errors') ? $throwable->errors() : null
            ], 403);
        }

        // Unauthenticated
        if ($throwable instanceof \Illuminate\Auth\AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => $throwable->getMessage(),
                'data' => method_exists($throwable, 'errors') ? $throwable->errors() : null
            ], 401);
        }

        // UnauthorizedException Spatie
        if ($throwable instanceof \Spatie\Permission\Exceptions\UnauthorizedException) {
            return response()->json([
                'success' => false,
                'message' => $throwable->getMessage(),
                'data' => method_exists($throwable, 'errors') ? $throwable->errors() : null
            ], 403);
        }

        // ValidationException
        if ($throwable instanceof \Illuminate\Validation\ValidationException) {
            return response()->json([
                'success' => false,
                'message' => $throwable->getMessage(),
                'data' => method_exists($throwable, 'errors') ? $throwable->errors() : null
            ], 422);
        }

        // Exception
        if ($throwable instanceof \Exception) {
            return response()->json([
                'success' => false,
                'message' => $throwable->getMessage(),
                'data' => method_exists($throwable, 'errors') ? $throwable->errors() : null
            ], 400);
        }

        return parent::render($request, $throwable);
    }
}
