<?php

namespace App\Models;

use Database\Factories\PromotionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * @property int $id
 * @property string|null $title
 * @property string $image_path
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['title', 'image_path', 'is_active'])]
class Promotion extends Model
{
    /** @use HasFactory<PromotionFactory> */
    use HasFactory;

    /**
     * Flyers live on the public disk so the CDN can cache them.
     */
    public const DISK = 'public';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * The flyer shown in the home page popup, if any.
     */
    public static function current(): ?self
    {
        return self::query()->where('is_active', true)->latest('id')->first();
    }

    /**
     * Make this the only active promotion.
     */
    public function activate(): void
    {
        DB::transaction(function () {
            self::query()->whereKeyNot($this->id)->where('is_active', true)->update(['is_active' => false]);
            $this->forceFill(['is_active' => true])->save();
        });
    }

    /**
     * Path relative to public/, suitable for the CDN image helper.
     */
    public function publicPath(): string
    {
        return 'storage/'.$this->image_path;
    }
}
