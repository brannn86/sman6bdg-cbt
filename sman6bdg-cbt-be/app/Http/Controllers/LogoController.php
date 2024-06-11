<?php

namespace App\Http\Controllers;

use App\Base\BaseController;
use Illuminate\Http\Request;
use Str;
use App\Models\Config;

class LogoController extends BaseController
{
    public function show($key)
    {
        $config = Config::where('name', $key)->first();
        if (!$config) {
            return $this->errorResponse('Config not found', 404);
        }

        if ($config->type == 'image') {
            $config->image_path = asset($config->value);

            if (!file_exists(public_path($config->value))) {
                $config->image_path = asset('assets/images/logo.png');
            }

            $config->image_path = $this->changeLocalhost($config->image_path);
        }

        return $this->successResponse($config, 'Config retrieved successfully');
    }

    public function updateLogo(Request $request)
    {
        $validated = $request->validate([
            'logo_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $logo_image = $request->file('logo_image');
        $logo_image_name = 'logo_' . Str::random(40) . '.' . $logo_image->getClientOriginalExtension();
        $logo_image->move(public_path('storage/images/config'), $logo_image_name);

        $config = Config::where('name', 'logo_image')->first();
        if (!$config) {
            $config = new Config();
            $config->name = 'logo_image';
        }

        if ($config->type == 'image') {
            if (file_exists(public_path($config->value))) {
                unlink(public_path($config->value));
            }
        }

        $config->value = 'storage/images/config/' . $logo_image_name;
        $config->type = 'image';
        $config->save();

        if ($config->type == 'image') {
            $config->image_path = asset($config->value);

            if (!file_exists(public_path($config->value))) {
                $config->image_path = asset('assets/images/logo.png');
            }

            $config->image_path = $this->changeLocalhost($config->image_path);
        }

        return $this->successResponse($config, 'Logo image updated successfully');
    }

    //

    private function changeLocalhost($string)
    {
        // localhost to 127.0.0.1
        return str_replace('localhost', '127.0.0.1', $string);
    }
}
