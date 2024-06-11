<?php

namespace App\Models\Indonesia;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Indonesia\District
 *
 * @property-read \App\Models\Indonesia\Province|null $province
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read int|null $regencies_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @property-read int|null $villages_count
 * @method static \Illuminate\Database\Eloquent\Builder|District newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|District newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|District query()
 * @property int $id
 * @property string $regency_id
 * @property string $name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @method static \Illuminate\Database\Eloquent\Builder|District whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|District whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|District whereRegencyId($value)
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Regency> $regencies
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Indonesia\Village> $villages
 * @mixin \Eloquent
 */
class District extends Model
{
    use HasFactory;

    protected $fillable = [];

    public function regencies()
    {
        return $this->hasMany(Regency::class);
    }

    public function villages()
    {
        return $this->hasMany(Village::class);
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }
}
