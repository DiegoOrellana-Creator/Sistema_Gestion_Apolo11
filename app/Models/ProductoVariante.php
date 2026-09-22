<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductoVariante extends Model
{
    protected $table = 'producto_variante';

    protected $primaryKey = 'id_producto_variante';

    public $timestamps = false;

    protected $fillable = [
        'producto_id',
        'atributos',
        'stock_actual',
        'stock_minimo',
    ];

    protected $casts = [
        'atributos' => 'array',
        'stock_actual' => 'integer',
        'stock_minimo' => 'integer',
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