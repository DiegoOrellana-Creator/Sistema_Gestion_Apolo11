<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Venta extends Model
{
    protected $table = 'ventas';
    protected $primaryKey = 'id_venta';

    public $timestamps = false;

    protected $fillable = [
        'fecha_venta',
        'sub_total',
        'descuento',
        'total_neto',
        'estado',
        'personal_id',
        'metodo_pago_id',
    ];

    protected $casts = [
        'fecha_venta' => 'datetime',
        'sub_total' => 'decimal:2',
        'descuento' => 'decimal:2',
        'total_neto' => 'decimal:2',
    ];

    public function detalles(): HasMany
    {
        return $this->hasMany(
            DetalleVenta::class,
            'venta_id',
            'id_venta'
        );
    }

    public function personal(): BelongsTo
    {
        return $this->belongsTo(
            Personal::class,
            'personal_id',
            'id_personal'
        );
    }

    public function metodoPago(): BelongsTo
    {
        return $this->belongsTo(
            MetodoPago::class,
            'metodo_pago_id',
            'id_metodo_pago'
        );
    }
}