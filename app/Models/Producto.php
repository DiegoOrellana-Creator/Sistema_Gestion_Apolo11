<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    protected $table = 'producto';

    protected $primaryKey = 'id_producto';

    public $timestamps = false;

    protected $fillable = [
        'codigo_barra',
        'nombre',
        'precio_compra',
        'precio_venta',
        'stock_actual',
        'stock_minimo',
        'atributos',
        'categoria_id',
        'marca_id',
    ];

    protected $casts = [
        'precio_compra' => 'decimal:2',
        'precio_venta' => 'decimal:2',
        'stock_actual' => 'integer',
        'stock_minimo' => 'integer',
        'atributos' => 'array',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(
            Categoria::class,
            'categoria_id',
            'id_categoria'
        );
    }

    public function marca(): BelongsTo
    {
        return $this->belongsTo(
            Marca::class,
            'marca_id',
            'id_marca'
        );
    }

    public function imagenes(): HasMany
    {
        return $this->hasMany(
            ProductoImagen::class,
            'producto_id',
            'id_producto'
        )->orderBy('orden');
    }

    public function variantes(): HasMany
    {
        return $this->hasMany(
            ProductoVariante::class,
            'producto_id',
            'id_producto'
        );
    }
}