<?php

namespace App\Models;

use App\Models\Indonesia\District;
use App\Models\Indonesia\Province;
use App\Models\Indonesia\Regency;
use App\Models\Indonesia\Village;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\UserProfiles
 *
 * @property int $id
 * @property int $user_id User ID
 * @property string $name
 * @property string|null $images
 * @property string|null $phone
 * @property string|null $address
 * @property string|null $postal_code
 * @property int|null $province_id Provinsi ID
 * @property int|null $regency_id Kota/Kabupaten ID
 * @property int|null $district_id Kecamatan ID
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read District|null $district
 * @property-read mixed $image_path
 * @property-read Province|null $province
 * @property-read Regency|null $regency
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles query()
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereDistrictId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereImages($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles wherePostalCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereProvinceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereRegencyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|UserProfiles whereVillageId($value)
 * @mixin \Eloquent
 */
class UserProfiles extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'images',
        'phone',
        'address',
        'postal_code',
        'province_id',
        'regency_id',
        'district_id',
    ];

    protected $appends = ['image_path'];

    protected $casts = [
        'province_id' => 'integer',
        'regency_id' => 'integer',
        'district_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_id', 'id');
    }

    public function regency()
    {
        return $this->belongsTo(Regency::class, 'regency_id', 'id');
    }

    public function district()
    {
        return $this->belongsTo(District::class, 'district_id', 'id');
    }

    public function getImagePathAttribute()
    {
        if (!$this->images) {
            return null;
        }

        // localhost to 127.0.0.1
        $asset = asset('storage/' . $this->images);
        $asset = str_replace('http://localhost', 'http://127.0.0.1', $asset);

        return $asset;
    }
}
