<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categoria extends Model
{
    protected $table = 'categoria';

    protected $primaryKey = 'id_categoria';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
    ];

    public function atributos(): HasMany
    {
        return $this->hasMany(
            CategoriaAtributo::class,
            'categoria_id',
            'id_categoria'
        )->orderBy('orden');
    }

    public function productos(): HasMany
    {
        return $this->hasMany(
            Producto::class,
            'categoria_id',
            'id_categoria'
        );
    }
}