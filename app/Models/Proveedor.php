<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proveedor extends Model
{
    protected $table = 'proveedores';

    protected $primaryKey = 'id_proveedor';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'contacto',
        'telefono',
        'correo',
        'direccion',
        'ciudad',
        'nit',
        'descripcion',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | COMPRAS
    |--------------------------------------------------------------------------
    */

    public function compras(): HasMany
    {
        return $this->hasMany(
            Compra::class,
            'proveedor_id',
            'id_proveedor'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | MARCAS
    |--------------------------------------------------------------------------
    */

    public function marcas(): BelongsToMany
    {
        return $this->belongsToMany(
            Marca::class,
            'proveedor_marca',
            'id_proveedor',
            'id_marca',
            'id_proveedor',
            'id_marca'
        );
    }
}