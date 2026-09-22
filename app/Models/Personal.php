<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Personal extends Authenticatable
{
    use Notifiable;

    protected $table = 'personal';

    protected $primaryKey = 'id_personal';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'activo',
        'numero',
        'usuario',
        'correo',
        'password',
        'rol_id',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];
}