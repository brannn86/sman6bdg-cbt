<?php

namespace App\Models\Indonesia;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Indonesia\Village
 *
 * @property-read \App\Models\Indonesia\District|null $district
 * @property-read \App\Models\Indonesia\Province|null $province
 * @property-read \App\Models\Indonesia\Regency|null $regency
 * @method static \Illuminate\Database\Eloquent\Builder|Village newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Village newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Village query()
 * @property int $id
 * @property string $district_id
 * @property string $name
 * @method static \Illuminate\Database\Eloquent\Builder|Village whereDistrictId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Village whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Village whereName($value)
 * @mixin \Eloquent
 */
class Village extends Model
{
    use HasFactory;

    protected $fillable = [];

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function regency()
    {
        return $this->belongsTo(Regency::class);
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }
}
