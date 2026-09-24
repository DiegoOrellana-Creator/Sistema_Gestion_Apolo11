<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Compra extends Model
{
    protected $table = 'compra';

    protected $primaryKey = 'id_compra';

    public $timestamps = false;

    protected $fillable = [
        'fecha_compra',
        'total_compra',
        'proveedor_id',
    ];

    protected $casts = [
        'fecha_compra' => 'datetime',
        'total_compra' => 'decimal:2',
    ];

    public function detalles(): HasMany
    {
        return $this->hasMany(
            DetalleCompra::class,
            'compra_id',
            'id_compra'
        );
    }

    public function proveedor(): BelongsTo
    {
        return $this->belongsTo(
            Proveedor::class,
            'proveedor_id',
            'id_proveedor'
        );
    }
}