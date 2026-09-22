<?php

namespace App\Http\Controllers;

use App\Models\Categoria;

class CategoriaAtributoController extends Controller
{
    public function index(Categoria $categoria)
    {
        return response()->json(
            $categoria
                ->atributos()
                ->orderBy('orden')
                ->get()
        );
    }
}