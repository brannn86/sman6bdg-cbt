<?php

namespace App\Repositories;

use App\Base\BaseRepository;
use App\Models\CategoryExam;

class CategoryExamRepository extends BaseRepository
{
    public function __construct()
    {
        parent::__construct(new CategoryExam());
    }
}
