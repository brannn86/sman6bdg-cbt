<?php

namespace App\Models\Indonesia;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Indonesia\Regency
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read int|null $districts_count
 * @property-read \App\Models\Indonesia\Province|null $province
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @property-read int|null $villages_count
 * @method static \Illuminate\Database\Eloquent\Builder|Regency newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Regency newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Regency query()
 * @property int $id
 * @property string $province_id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @method static \Illuminate\Database\Eloquent\Builder|Regency whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Regency whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Regency whereProvinceId($value)
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @mixin \Eloquent
 */
class Regency extends Model
{
    use HasFactory;

    protected $fillable = [];

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function districts()
    {
        return $this->hasMany(District::class);
    }

    public function villages()
    {
        return $this->hasManyThrough(Village::class, District::class);
    }
}
