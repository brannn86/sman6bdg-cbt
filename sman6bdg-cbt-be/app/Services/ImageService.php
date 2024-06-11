<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ImageService
{
    // Upload One Image
    public function uploadImages($image, $path = 'images', $public = false)
    {
        if (!$image->isValid()) {
            return null;
        }

        $imageName = uniqid() . '.' . $image->getClientOriginalExtension();
        $savePath = $public ? 'public/' . $path : $path;
        $pathFile = $savePath . '/' . $imageName;

        if (!Storage::exists($savePath)) {
            Storage::makeDirectory($savePath);
        }

        $fullPath = Storage::path($pathFile);

        $image = Image::make($image);
        $image = $image->orientate($image);
        $image = $this->resizeImage($image);

        $image->save($fullPath);

        return $path . '/' . $imageName;
    }

    public function deleteImages($image, $public = false)
    {
        if (empty($image)) {
            return;
        }

        $image = $public ? 'public/' . $image : $image;

        if (Storage::exists($image)) {
            Storage::delete($image);
        }
    }

    public function updateImages($images, $oldImages, $path = 'images', $public = false)
    {
        $this->deleteImages($oldImages, $public);

        return $this->uploadImages($images, $path, $public);
    }

    // Upload Multiple Imagess
    public function uploadMultipleImages($images, $path = 'images', $public = false, $keepEmpty = false)
    {
        $imagesPath = [];

        if (!is_array($images)) {
            $imagesPath[] = $this->uploadImages($images, $path, $public);
        }

        foreach ($images as $image) {
            if (($image === null || $image === 'null') && $keepEmpty) {
                $imagesPath[] = null;
                continue;
            }

            if (is_string($image)) {
                $imagesPath[] = $image;
                continue;
            }

            $imagesPath[] = $this->uploadImages($image, $path, $public);
        }

        return $imagesPath;
    }

    public function deleteMultipleImages($images, $public = false)
    {
        if (empty($images)) {
            return;
        }

        foreach ($images as $image) {
            $this->deleteImages($image, $public);
        }
    }

    public function updateMultipleImages($images, $oldImages, $path = 'images', $public = false, $keepEmpty = false)
    {
        if ($oldImages) {
            $notIncludedImages = array_diff($oldImages, $images);
            $this->deleteMultipleImages($notIncludedImages, $public);

            $images = array_diff($images, $notIncludedImages);
        }

        return $this->uploadMultipleImages($images, $path, $public, $keepEmpty);
    }

    public function resizeImage($image)
    {
        if ($image->width() > 1080 || $image->height() > 10800) {
            $image = $image->resize(1080, 1080, function ($constraint) {
                $constraint->aspectRatio();
            });
        }

        return $image;
    }
}
