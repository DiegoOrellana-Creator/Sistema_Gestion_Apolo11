<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CategoriaAtributo extends Model
{
    protected $table = 'categoria_atributo';

    protected $primaryKey = 'id_categoria_atributo';

    public $timestamps = false;

    protected $fillable = [
        'categoria_id',
        'nombre',
        'tipo',
        'opciones',
        'requerido',
        'orden',
        'es_variante',
    ];

    protected $casts = [
        'opciones' => 'array',
        'requerido' => 'boolean',
        'es_variante' => 'boolean',
        'orden' => 'integer',
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(
            Categoria::class,
            'categoria_id',
            'id_categoria'
        );
    }
}