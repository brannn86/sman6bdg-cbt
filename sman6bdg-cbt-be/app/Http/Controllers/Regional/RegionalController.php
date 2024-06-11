<?php

namespace App\Http\Controllers\Regional;

use App\Helpers\ResponseHelper;
use App\Base\BaseController;
use App\Models\Indonesia\District;
use App\Models\Indonesia\Province;
use App\Models\Indonesia\Regency;
use App\Models\Indonesia\Village;

class RegionalController extends BaseController
{
    public function provinces()
    {
        $data['provinces'] = Province::all();

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/regional.province')]),
            200
        );
    }

    public function regencies($province_id)
    {
        $data['regencies'] = Regency::where('province_id', $province_id)->get();

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/regional.regency')]),
            200
        );
    }

    public function districts($regency_id)
    {
        $data['districts'] = District::where('regency_id', $regency_id)->get();

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/regional.district')]),
            200
        );
    }

    public function villages($district_id)
    {
        $data['villages'] = Village::where('district_id', $district_id)->get();

        return $this->successResponse(
            $data,
            __('Custom/common.retrieve_success', ['attribute' => __('Custom/regional.village')]),
            200
        );
    }
}
