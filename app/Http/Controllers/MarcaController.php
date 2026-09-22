<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MarcaController extends Controller
{
    public function index()
    {
        $marcas = Marca::withCount('productos')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Marcas/Index', [
            'marcas' => $marcas,
        ]);
    }

    public function create()
    {
        return Inertia::render('Marcas/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('marca', 'nombre'),
            ],
        ], [
            'nombre.required' => 'El nombre de la marca es obligatorio.',
            'nombre.unique' => 'Ya existe una marca con ese nombre.',
            'nombre.max' => 'El nombre no puede superar los 100 caracteres.',
        ]);

        Marca::create([
            'nombre' => trim($validated['nombre']),
        ]);

        return redirect()
            ->route('marcas.index')
            ->with('success', 'Marca creada correctamente.');
    }

    public function edit(Marca $marca)
    {
        return Inertia::render('Marcas/Edit', [
            'marca' => $marca,
        ]);
    }

    public function update(Request $request, Marca $marca)
    {
        $validated = $request->validate([
            'nombre' => [
                'required',
                'string',
                'max:100',
                Rule::unique('marca', 'nombre')
                    ->ignore(
                        $marca->id_marca,
                        'id_marca'
                    ),
            ],
        ], [
            'nombre.required' => 'El nombre de la marca es obligatorio.',
            'nombre.unique' => 'Ya existe una marca con ese nombre.',
            'nombre.max' => 'El nombre no puede superar los 100 caracteres.',
        ]);

        $marca->update([
            'nombre' => trim($validated['nombre']),
        ]);

        return redirect()
            ->route('marcas.index')
            ->with('success', 'Marca actualizada correctamente.');
    }

    public function destroy(Marca $marca)
    {
        if ($marca->productos()->exists()) {
            return redirect()
                ->route('marcas.index')
                ->with(
                    'error',
                    'No se puede eliminar esta marca porque tiene productos asociados.'
                );
        }

        $marca->delete();

        return redirect()
            ->route('marcas.index')
            ->with('success', 'Marca eliminada correctamente.');
    }
}