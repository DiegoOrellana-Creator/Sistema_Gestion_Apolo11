<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProveedorController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | LISTADO
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $proveedores = Proveedor::query()
            ->with('marcas:id_marca,nombre')
            ->withCount('compras')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Proveedores/Index', [
            'proveedores' => $proveedores,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | FORMULARIO CREAR
    |--------------------------------------------------------------------------
    */

    public function create()
    {
        $marcas = Marca::query()
            ->orderBy('nombre')
            ->get([
                'id_marca',
                'nombre',
            ]);

        return Inertia::render('Proveedores/Create', [
            'marcas' => $marcas,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GUARDAR
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:150',
            ],

            'contacto' => [
                'nullable',
                'string',
                'max:150',
            ],

            'telefono' => [
                'nullable',
                'string',
                'max:50',
            ],

            'correo' => [
                'nullable',
                'email',
                'max:150',
            ],

            'direccion' => [
                'nullable',
                'string',
                'max:255',
            ],

            'ciudad' => [
                'nullable',
                'string',
                'max:100',
            ],

            'nit' => [
                'nullable',
                'string',
                'max:50',
            ],

            'descripcion' => [
                'nullable',
                'string',
            ],

            'activo' => [
                'boolean',
            ],

            'marcas' => [
                'nullable',
                'array',
            ],

            'marcas.*' => [
                'integer',
                'exists:marca,id_marca',
            ],
        ], [
            'nombre.required' =>
                'El nombre del proveedor es obligatorio.',

            'nombre.max' =>
                'El nombre del proveedor no puede superar los 150 caracteres.',

            'correo.email' =>
                'El correo electrónico no es válido.',

            'marcas.array' =>
                'Las marcas seleccionadas no son válidas.',

            'marcas.*.exists' =>
                'Una de las marcas seleccionadas no existe.',
        ]);

        $proveedor = Proveedor::create([
            'nombre' => $validated['nombre'],
            'contacto' => $validated['contacto'] ?? null,
            'telefono' => $validated['telefono'] ?? null,
            'correo' => $validated['correo'] ?? null,
            'direccion' => $validated['direccion'] ?? null,
            'ciudad' => $validated['ciudad'] ?? null,
            'nit' => $validated['nit'] ?? null,
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => $validated['activo'] ?? true,
        ]);

        $proveedor->marcas()->sync(
            $validated['marcas'] ?? []
        );

        return redirect()
            ->route('proveedores.index')
            ->with(
                'success',
                'Proveedor registrado correctamente.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | VER PROVEEDOR
    |--------------------------------------------------------------------------
    */

    public function show(Proveedor $proveedor)
    {
        $proveedor->loadCount('compras');

        $proveedor->load([
            'marcas:id_marca,nombre',

            'compras' => function ($query) {
                $query
                    ->orderByDesc('fecha_compra')
                    ->withCount('detalles');
            },
        ]);

        return Inertia::render('Proveedores/Show', [
            'proveedor' => $proveedor,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | FORMULARIO EDITAR
    |--------------------------------------------------------------------------
    */

    public function edit(Proveedor $proveedor)
    {
        $proveedor->load(
            'marcas:id_marca,nombre'
        );

        $marcas = Marca::query()
            ->orderBy('nombre')
            ->get([
                'id_marca',
                'nombre',
            ]);

        return Inertia::render('Proveedores/Edit', [
            'proveedor' => $proveedor,
            'marcas' => $marcas,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | ACTUALIZAR
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        Proveedor $proveedor
    ) {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:150',
            ],

            'contacto' => [
                'nullable',
                'string',
                'max:150',
            ],

            'telefono' => [
                'nullable',
                'string',
                'max:50',
            ],

            'correo' => [
                'nullable',
                'email',
                'max:150',
            ],

            'direccion' => [
                'nullable',
                'string',
                'max:255',
            ],

            'ciudad' => [
                'nullable',
                'string',
                'max:100',
            ],

            'nit' => [
                'nullable',
                'string',
                'max:50',
            ],

            'descripcion' => [
                'nullable',
                'string',
            ],

            'activo' => [
                'boolean',
            ],

            'marcas' => [
                'nullable',
                'array',
            ],

            'marcas.*' => [
                'integer',
                'exists:marca,id_marca',
            ],
        ], [
            'nombre.required' =>
                'El nombre del proveedor es obligatorio.',

            'nombre.max' =>
                'El nombre del proveedor no puede superar los 150 caracteres.',

            'correo.email' =>
                'El correo electrónico no es válido.',

            'marcas.*.exists' =>
                'Una de las marcas seleccionadas no existe.',
        ]);

        $proveedor->update([
            'nombre' => $validated['nombre'],
            'contacto' => $validated['contacto'] ?? null,
            'telefono' => $validated['telefono'] ?? null,
            'correo' => $validated['correo'] ?? null,
            'direccion' => $validated['direccion'] ?? null,
            'ciudad' => $validated['ciudad'] ?? null,
            'nit' => $validated['nit'] ?? null,
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => $validated['activo'] ?? true,
        ]);

        $proveedor->marcas()->sync(
            $validated['marcas'] ?? []
        );

        return redirect()
            ->route('proveedores.index')
            ->with(
                'success',
                'Proveedor actualizado correctamente.'
            );
    }

    /*
    |--------------------------------------------------------------------------
    | ELIMINAR
    |--------------------------------------------------------------------------
    */

    public function destroy(Proveedor $proveedor)
    {
        $proveedor->delete();

        return redirect()
            ->route('proveedores.index')
            ->with(
                'success',
                'Proveedor eliminado correctamente.'
            );
    }
}