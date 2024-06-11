<?php

namespace App\Base\Construct;

interface BaseRepositoryInterface
{
    public function getAll($params, $withPaginate);
    public function find($id, $params);
    public function create($data);
    public function update($id, $data);
    public function delete($id);
}
