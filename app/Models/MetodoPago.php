<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MetodoPago extends Model
{
    protected $table = 'metodo_pago';
    protected $primaryKey = 'id_metodo_pago';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
    ];

    public function ventas(): HasMany
    {
        return $this->hasMany(
            Venta::class,
            'metodo_pago_id',
            'id_metodo_pago'
        );
    }
}