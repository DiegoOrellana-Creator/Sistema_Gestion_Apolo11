<?php

namespace App\Http\Controllers;

use App\Models\Personal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PersonalController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Lista de empleados
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $empleados = Personal::orderBy('id_personal', 'desc')->get();

        return Inertia::render('Empleados/Index', [
            'empleados' => $empleados,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Formulario nuevo empleado
    |--------------------------------------------------------------------------
    */

    public function create()
    {
        return Inertia::render('Empleados/Create');
    }


    /*
    |--------------------------------------------------------------------------
    | Guardar nuevo empleado
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:255',
            ],

            'numero' => [
                'nullable',
                'string',
                'max:50',
            ],

            'usuario' => [
                'required',
                'string',
                'max:100',
                Rule::unique('personal', 'usuario'),
            ],

            'correo' => [
                'nullable',
                'email',
                'max:255',
            ],

            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
            ],

            'rol_id' => [
                'required',
                'integer',
                Rule::exists('rol', 'id_rol'),
            ],

            'activo' => [
                'boolean',
            ],
        ]);


        Personal::create([
            'nombre' => $validated['nombre'],

            'activo' => $validated['activo'] ?? true,

            'numero' => $validated['numero'] ?? null,

            'usuario' => $validated['usuario'],

            'correo' => $validated['correo'] ?? null,

            'password' => Hash::make($validated['password']),

            'rol_id' => $validated['rol_id'],
        ]);


        return redirect()
            ->route('empleados.index')
            ->with('success', 'Empleado registrado correctamente.');
    }


    /*
    |--------------------------------------------------------------------------
    | Formulario editar empleado
    |--------------------------------------------------------------------------
    */

    public function edit(Personal $empleado)
    {
        return Inertia::render('Empleados/Edit', [
            'empleado' => $empleado,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Actualizar empleado
    |--------------------------------------------------------------------------
    */

    public function update(Request $request, Personal $empleado)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:255',
            ],

            'numero' => [
                'nullable',
                'string',
                'max:50',
            ],

            'usuario' => [
                'required',
                'string',
                'max:100',

                Rule::unique('personal', 'usuario')
                    ->ignore($empleado->id_personal, 'id_personal'),
            ],

            'correo' => [
                'nullable',
                'email',
                'max:255',
            ],

            'password' => [
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],

            'rol_id' => [
                'required',
                'integer',
                Rule::exists('rol', 'id_rol'),
            ],

            'activo' => [
                'boolean',
            ],
        ]);


        $empleado->nombre = $validated['nombre'];

        $empleado->numero = $validated['numero'] ?? null;

        $empleado->usuario = $validated['usuario'];

        $empleado->correo = $validated['correo'] ?? null;

        $empleado->rol_id = $validated['rol_id'];

        $empleado->activo = $validated['activo'] ?? false;


        /*
        |--------------------------------------------------------------------------
        | Solo cambiar contraseña si se escribió una nueva
        |--------------------------------------------------------------------------
        */

        if (!empty($validated['password'])) {
            $empleado->password = Hash::make(
                $validated['password']
            );
        }


        $empleado->save();


        return redirect()
            ->route('empleados.index')
            ->with('success', 'Empleado actualizado correctamente.');
    }


    /*
    |--------------------------------------------------------------------------
    | Activar / desactivar empleado
    |--------------------------------------------------------------------------
    */

    public function toggleEstado(Personal $empleado)
    {
        $empleado->activo = !$empleado->activo;

        $empleado->save();


        return redirect()
            ->route('empleados.index')
            ->with(
                'success',
                $empleado->activo
                    ? 'Empleado activado correctamente.'
                    : 'Empleado desactivado correctamente.'
            );
    }
}