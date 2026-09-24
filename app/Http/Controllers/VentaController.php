<?php

namespace App\Http\Controllers;

use App\Models\MetodoPago;
use App\Models\Producto;
use App\Models\ProductoVariante;
use App\Models\Venta;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VentaController extends Controller
{
    public function index()
    {
        $ventas = Venta::with([
            'metodoPago:id_metodo_pago,nombre',
            'personal:id_personal,nombre',
        ])
            ->withCount('detalles')
            ->orderByDesc('fecha_venta')
            ->get();

        return Inertia::render('Ventas/Index', [
            'ventas' => $ventas,
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

        $metodosPago = MetodoPago::orderBy('nombre')->get();

        return Inertia::render('Ventas/Create', [
            'productos' => $productos,
            'metodosPago' => $metodosPago,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'metodo_pago_id' => [
                'required',
                'integer',
                'exists:metodo_pago,id_metodo_pago',
            ],

            'descuento' => [
                'nullable',
                'numeric',
                'min:0',
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
        ], [
            'metodo_pago_id.required' => 'Selecciona un método de pago.',
            'metodo_pago_id.exists' => 'El método de pago seleccionado no existe.',

            'items.required' => 'Debes agregar al menos un producto.',
            'items.min' => 'Debes agregar al menos un producto.',

            'items.*.producto_id.required' => 'Hay un producto inválido.',
            'items.*.producto_id.exists' => 'Uno de los productos ya no existe.',

            'items.*.cantidad.required' => 'La cantidad es obligatoria.',
            'items.*.cantidad.min' => 'La cantidad debe ser mayor a cero.',
        ]);

        try {
            $venta = DB::transaction(function () use ($validated) {

                $subTotal = 0;

                $lineas = [];

                foreach ($validated['items'] as $item) {

                    $producto = Producto::query()
                        ->lockForUpdate()
                        ->findOrFail($item['producto_id']);

                    $cantidad = (int) $item['cantidad'];

                    $variante = null;

                    if (!empty($item['producto_variante_id'])) {

                        $variante = ProductoVariante::query()
                            ->lockForUpdate()
                            ->where('id_producto_variante', $item['producto_variante_id'])
                            ->where('producto_id', $producto->id_producto)
                            ->firstOrFail();

                        if ($variante->stock_actual < $cantidad) {
                            throw new \RuntimeException(
                                "Stock insuficiente para {$producto->nombre}."
                            );
                        }

                        $precio = (float) $producto->precio_venta;

                        $variante->decrement(
                            'stock_actual',
                            $cantidad
                        );

                        $producto->decrement(
                            'stock_actual',
                            $cantidad
                        );
                    } else {

                        if ($producto->variantes()->exists()) {
                            throw new \RuntimeException(
                                "Debes seleccionar una variante para {$producto->nombre}."
                            );
                        }

                        if ($producto->stock_actual < $cantidad) {
                            throw new \RuntimeException(
                                "Stock insuficiente para {$producto->nombre}."
                            );
                        }

                        $precio = (float) $producto->precio_venta;

                        $producto->decrement(
                            'stock_actual',
                            $cantidad
                        );
                    }

                    $subtotalLinea = $precio * $cantidad;

                    $subTotal += $subtotalLinea;

                    $lineas[] = [
                        'producto_id' => $producto->id_producto,
                        'producto_variante_id' => $variante?->id_producto_variante,
                        'cantidad' => $cantidad,
                        'precio_unitario' => $precio,
                    ];
                }

                $descuento = (float) ($validated['descuento'] ?? 0);

                if ($descuento > $subTotal) {
                    throw new \RuntimeException(
                        'El descuento no puede ser mayor al subtotal.'
                    );
                }

                $totalNeto = $subTotal - $descuento;

                $venta = Venta::create([
                    'sub_total' => $subTotal,
                    'descuento' => $descuento,
                    'total_neto' => $totalNeto,
                    'estado' => 'Completado',
                    'personal_id' => auth()->id(),
                    'metodo_pago_id' => $validated['metodo_pago_id'],
                ]);

                foreach ($lineas as $linea) {
                    $venta->detalles()->create($linea);
                }

                return $venta;
            });

            return redirect()
                ->route('ventas.show', $venta->id_venta)
                ->with(
                    'success',
                    'Venta registrada correctamente.'
                );

        } catch (\RuntimeException $e) {

            return back()
                ->withInput()
                ->withErrors([
                    'general' => $e->getMessage(),
                ]);
        }
    }

    public function show(Venta $venta)
    {
        $venta->load([
            'detalles.producto',
            'detalles.variante',
            'metodoPago',
            'personal',
        ]);

        return Inertia::render('Ventas/Show', [
            'venta' => $venta,
        ]);
    }
}