<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductoImagen extends Model
{
    protected $table = 'producto_imagen';

    protected $primaryKey = 'id_producto_imagen';

    public $timestamps = false;

    protected $fillable = [
        'producto_id',
        'url',
        'orden',
        'principal',
    ];

    protected $casts = [
        'orden' => 'integer',
        'principal' => 'boolean',
    ];

    public function producto(): BelongsTo
    {
        return $this->belongsTo(
            Producto::class,
            'producto_id',
            'id_producto'
        );
    }
}