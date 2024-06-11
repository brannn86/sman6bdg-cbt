<?php

namespace App\Base;

use App\Helpers\ResponseHelper;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseControllerLaravel;

class BaseController extends BaseControllerLaravel
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, ResponseHelper;
}
