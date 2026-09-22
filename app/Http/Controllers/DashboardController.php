<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1. Capturar la opción seleccionada ('hoy', 'semana', 'mes')
        $periodo = $request->input('periodo', 'hoy');

        // 2. Establecer rango de fechas según la selección
        switch ($periodo) {
            case 'semana':
                $inicio = Carbon::now()->startOfWeek();
                $fin    = Carbon::now()->endOfWeek();
                break;

            case 'mes':
                $inicio = Carbon::now()->startOfMonth();
                $fin    = Carbon::now()->endOfMonth();
                break;

            case 'hoy':
            default:
                $inicio = Carbon::today()->startOfDay();
                $fin    = Carbon::today()->endOfDay();
                break;
        }

        // --- CONSULTAS A LA BASE DE DATOS ---

        // 1. Total de ventas en el periodo elegido
        $totalVentas = DB::table('ventas')
            ->whereBetween('fecha_venta', [$inicio, $fin])
            ->sum('total_neto') ?? 0;

        // 2. Total de compras / gastos en el periodo
        $totalGastos = DB::table('compra')
            ->whereBetween('fecha_compra', [$inicio, $fin])
            ->sum('total_compra') ?? 0;

        // 3. Costo de los productos vendidos (Costo de ventas)
        $costoProductosVendidos = DB::table('detalle_venta')
            ->join('ventas', 'detalle_venta.venta_id', '=', 'ventas.id_venta')
            ->join('producto', 'detalle_venta.producto_id', '=', 'producto.id_producto')
            ->whereBetween('ventas.fecha_venta', [$inicio, $fin])
            ->sum(DB::raw('detalle_venta.cantidad * producto.precio_compra')) ?? 0;

        // Cálculo de Ganancia Bruta y Neta
        $gananciaBruta = $totalVentas - $costoProductosVendidos;
        $gananciaNeta  = $gananciaBruta - $totalGastos;

        // 4. Ventas desglosadas por método de pago en el periodo
        $pagos = DB::table('ventas')
            ->join('metodo_pago', 'ventas.metodo_pago_id', '=', 'metodo_pago.id_metodo_pago')
            ->whereBetween('ventas.fecha_venta', [$inicio, $fin])
            ->select('metodo_pago.nombre', DB::raw('SUM(ventas.total_neto) as total'))
            ->groupBy('metodo_pago.nombre')
            ->pluck('total', 'nombre');

        // 5. Las últimas 5 ventas dentro del rango
        $ultimasVentas = DB::table('ventas')
            ->leftJoin('metodo_pago', 'ventas.metodo_pago_id', '=', 'metodo_pago.id_metodo_pago')
            ->whereBetween('ventas.fecha_venta', [$inicio, $fin])
            ->select(
                'ventas.id_venta',
                'ventas.total_neto',
                'ventas.fecha_venta',
                'metodo_pago.nombre as metodo_pago'
            )
            ->orderBy('ventas.fecha_venta', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($venta) {
                return [
                    'id'     => $venta->id_venta,
                    'total'  => number_format($venta->total_neto, 2),
                    'metodo' => $venta->metodo_pago ?? 'N/A',
                    'hora'   => Carbon::parse($venta->fecha_venta)->format('d/m/Y H:i A'),
                ];
            });

        // Retornar la vista Inertia enviando los datos procesados
        return Inertia::render('Dashboard', [
            'periodoActual' => $periodo,
            'metricas' => [
                'totalVentas'   => 'Bs. ' . number_format($totalVentas, 2),
                'gananciaBruta' => 'Bs. ' . number_format($gananciaBruta, 2),
                'totalGastos'   => 'Bs. ' . number_format($totalGastos, 2),
                'gananciaNeta'  => 'Bs. ' . number_format($gananciaNeta, 2),
            ],
            'metodosPago' => [
                'efectivo'      => 'Bs. ' . number_format($pagos->get('Efectivo', 0), 2),
                'qr'            => 'Bs. ' . number_format($pagos->get('QR', 0), 2),
                'transferencia' => 'Bs. ' . number_format($pagos->get('Transferencia', 0), 2),
                'tarjeta'       => 'Bs. ' . number_format($pagos->get('Tarjeta', 0), 2),
            ],
            'ultimasVentas' => $ultimasVentas,
        ]);
    }
}