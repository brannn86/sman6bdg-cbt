<?php

namespace App\Models\Indonesia;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Indonesia\Province
 *
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read int|null $districts_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read int|null $regencies_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @property-read int|null $villages_count
 * @method static \Illuminate\Database\Eloquent\Builder|Province newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Province newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Province query()
 * @property int $id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @method static \Illuminate\Database\Eloquent\Builder|Province whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Province whereName($value)
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\District> $districts
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @mixin \Eloquent
 */
class Province extends Model
{
    use HasFactory;

    protected $fillable = [];

    public function regencies()
    {
        return $this->hasMany(Regency::class);
    }

    public function districts()
    {
        return $this->hasManyThrough(District::class, Regency::class);
    }

    public function villages()
    {
        return $this->hasManyThrough(Village::class, District::class);
    }
}
