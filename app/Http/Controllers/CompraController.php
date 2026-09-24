<?php

namespace App\Http\Controllers;

use App\Models\Compra;
use App\Models\Producto;
use App\Models\ProductoVariante;
use App\Models\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CompraController extends Controller
{
    public function index()
    {
        $compras = Compra::with([
            'proveedor:id_proveedor,nombre,contacto,telefono,correo',
        ])
            ->withCount('detalles')
            ->orderByDesc('fecha_compra')
            ->get();

        return Inertia::render('Compras/Index', [
            'compras' => $compras,
        ]);
    }

    public function create()
    {
        $productos = Producto::with([
            'categoria:id_categoria,nombre',
            'marca:id_marca,nombre',
            'variantes:id_producto_variante,producto_id,atributos,stock_actual,stock_minimo',
            'imagenes:id_producto_imagen,producto_id,url,orden,principal',
        ])
            ->orderBy('nombre')
            ->get();

        $proveedores = Proveedor::query()
            ->where('activo', true)
            ->orderBy('nombre')
            ->get([
                'id_proveedor',
                'nombre',
                'contacto',
                'telefono',
                'correo',
            ]);

        return Inertia::render('Compras/Create', [
            'productos' => $productos,
            'proveedores' => $proveedores,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'proveedor_id' => [
                'nullable',
                'integer',
                'exists:proveedores,id_proveedor',
            ],

            'items' => [
                'required',
                'array',
                'min:1',
            ],

            'items.*.producto_id' => [
                'required',
                'integer',
                'exists:producto,id_producto',
            ],

            'items.*.producto_variante_id' => [
                'nullable',
                'integer',
                'exists:producto_variante,id_producto_variante',
            ],

            'items.*.cantidad' => [
                'required',
                'integer',
                'min:1',
            ],

            'items.*.precio_unitario' => [
                'required',
                'numeric',
                'min:0',
            ],
        ], [
            'items.required' =>
                'Debes agregar al menos un producto.',

            'items.min' =>
                'Debes agregar al menos un producto.',

            'items.*.producto_id.required' =>
                'Hay un producto inválido.',

            'items.*.producto_id.exists' =>
                'Uno de los productos ya no existe.',

            'items.*.cantidad.required' =>
                'La cantidad es obligatoria.',

            'items.*.cantidad.min' =>
                'La cantidad debe ser mayor a cero.',

            'items.*.precio_unitario.required' =>
                'El precio de compra es obligatorio.',

            'items.*.precio_unitario.min' =>
                'El precio de compra no puede ser negativo.',
        ]);

        try {
            $compra = DB::transaction(function () use ($validated) {

                $totalCompra = 0;

                $lineas = [];

                foreach ($validated['items'] as $item) {

                    $producto = Producto::query()
                        ->lockForUpdate()
                        ->findOrFail($item['producto_id']);

                    $cantidad = (int) $item['cantidad'];

                    $precioCosto =
                        (float) $item['precio_unitario'];

                    $variante = null;

                    if ($producto->variantes()->exists()) {

                        if (empty($item['producto_variante_id'])) {
                            throw new \RuntimeException(
                                "Debes seleccionar una variante para {$producto->nombre}."
                            );
                        }

                        $variante = ProductoVariante::query()
                            ->lockForUpdate()
                            ->where(
                                'id_producto_variante',
                                $item['producto_variante_id']
                            )
                            ->where(
                                'producto_id',
                                $producto->id_producto
                            )
                            ->firstOrFail();

                        $variante->increment(
                            'stock_actual',
                            $cantidad
                        );

                        $producto->increment(
                            'stock_actual',
                            $cantidad
                        );

                    } else {

                        $producto->increment(
                            'stock_actual',
                            $cantidad
                        );
                    }

                    $subtotalLinea =
                        $cantidad * $precioCosto;

                    $totalCompra += $subtotalLinea;

                    $lineas[] = [
                        'producto_id' =>
                            $producto->id_producto,

                        'producto_variante_id' =>
                            $variante?->id_producto_variante,

                        'cantidad' =>
                            $cantidad,

                        'precio_costo_unitario' =>
                            $precioCosto,
                    ];
                }

                $compra = Compra::create([
                    'fecha_compra' =>
                        now(),

                    'total_compra' =>
                        $totalCompra,

                    'proveedor_id' =>
                        $validated['proveedor_id'] ?? null,
                ]);

                foreach ($lineas as $linea) {
                    $compra->detalles()->create($linea);
                }

                return $compra;
            });

            return redirect()
                ->route(
                    'compras.show',
                    $compra->id_compra
                )
                ->with(
                    'success',
                    'Compra registrada correctamente.'
                );

        } catch (\RuntimeException $e) {

            return back()
                ->withInput()
                ->withErrors([
                    'general' => $e->getMessage(),
                ]);
        }
    }

    public function show(Compra $compra)
    {
        $compra->load([
            'detalles.producto.marca',
            'detalles.producto.categoria',
            'detalles.variante',
            'proveedor',
        ]);

        return Inertia::render('Compras/Show', [
            'compra' => $compra,
        ]);
    }
}