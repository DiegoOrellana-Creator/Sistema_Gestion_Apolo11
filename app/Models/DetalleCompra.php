<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleCompra extends Model
{
    protected $table = 'detalle_compra';

    protected $primaryKey = 'id_detalle_compra';

    public $timestamps = false;

    protected $fillable = [
        'precio_costo_unitario',
        'cantidad',
        'compra_id',
        'producto_id',
        'producto_variante_id',
    ];

    protected $casts = [
        'precio_costo_unitario' => 'decimal:2',
        'cantidad' => 'integer',
    ];

    public function compra(): BelongsTo
    {
        return $this->belongsTo(
            Compra::class,
            'compra_id',
            'id_compra'
        );
    }

    public function producto(): BelongsTo
    {
        return $this->belongsTo(
            Producto::class,
            'producto_id',
            'id_producto'
        );
    }

    public function variante(): BelongsTo
    {
        return $this->belongsTo(
            ProductoVariante::class,
            'producto_variante_id',
            'id_producto_variante'
        );
    }
}