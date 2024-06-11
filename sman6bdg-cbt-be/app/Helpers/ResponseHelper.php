<?php

namespace App\Helpers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response as HttpResponse;

/**
 * Class ResponseHelper
 *
 * @method JsonResponse success($data, $message = null, $statusCode = 200)
 * @method JsonResponse error($data, $message = null, $statusCode = 400)
 *
 */
trait ResponseHelper
{
    /**
     * @param  bool  $success
     * @param  string|null  $message
     * @param  int  $statusCode
     * @param  string|array|integer|null  $data
     */
    private function responseJson($success, $message, $statusCode, $data = [])
    {
        return response()->json([
            'success' => $success,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * @param  string|array|integer|null  $data
     * @param  string|null  $message
     * @param  int  $statusCode
     */
    public function successResponse($data, $message = null, $statusCode = 200)
    {
        return $this->responseJson(true, $message, $statusCode, $data);
    }

    /**
     * @param  string|array|integer|null  $errors
     * @param  string|null  $message
     * @param  int  $statusCode
     */
    public function errorResponse($data, $message = null, $statusCode = 400)
    {
        return $this->responseJson(false, $message, $statusCode, $data);
    }
}
