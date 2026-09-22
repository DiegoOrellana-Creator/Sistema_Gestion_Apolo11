import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Dashboard({ auth, metricas, metodosPago, ultimasVentas, periodoActual }) {
    
    // Opciones del filtro
    const periodos = [
        { key: 'hoy', label: 'Hoy' },
        { key: 'semana', label: 'Esta Semana' },
        { key: 'mes', label: 'Este Mes' },
    ];

    // Cambia el periodo al hacer clic en un botón
    const cambiarPeriodo = (key) => {
        if (periodoActual === key) return;
        
        router.get(
            route('dashboard'),
            { periodo: key },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Panel de Control" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
                
                {/* Encabezado con Botones / Pestañas de Selección */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
                        <p className="text-sm text-gray-500">Resumen de ventas y actividad</p>
                    </div>

                    {/* Botones Interactivos (Pestañas) */}
                    <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
                        {periodos.map((p) => {
                            const activo = (periodoActual || 'hoy') === p.key;
                            return (
                                <button
                                    key={p.key}
                                    onClick={() => cambiarPeriodo(p.key)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                                        activo
                                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200/60'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                                    }`}
                                >
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tarjetas de Métricas Principales */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50/60 border border-blue-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                        <div>
                            <span className="text-xs text-gray-500 font-medium">Total Ventas</span>
                            <h3 className="text-2xl font-extrabold text-blue-900 mt-1">{metricas?.totalVentas || 'Bs. 0.00'}</h3>
                            <span className="text-xs text-gray-400 capitalize">{periodoActual || 'hoy'}</span>
                        </div>
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">📈</div>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                        <div>
                            <span className="text-xs text-gray-500 font-medium">Ganancia Bruta</span>
                            <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{metricas?.gananciaBruta || 'Bs. 0.00'}</h3>
                            <span className="text-xs text-gray-400 capitalize">{periodoActual || 'hoy'}</span>
                        </div>
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">💵</div>
                    </div>

                    <div className="bg-rose-50/60 border border-rose-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                        <div>
                            <span className="text-xs text-gray-500 font-medium">Total Gastos</span>
                            <h3 className="text-2xl font-extrabold text-rose-700 mt-1">{metricas?.totalGastos || 'Bs. 0.00'}</h3>
                            <span className="text-xs text-gray-400 capitalize">{periodoActual || 'hoy'}</span>
                        </div>
                        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">💳</div>
                    </div>

                    <div className="bg-teal-50/60 border border-teal-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                        <div>
                            <span className="text-xs text-gray-500 font-medium">Ganancia Neta</span>
                            <h3 className="text-2xl font-extrabold text-teal-800 mt-1">{metricas?.gananciaNeta || 'Bs. 0.00'}</h3>
                            <span className="text-xs text-gray-400 capitalize">{periodoActual || 'hoy'}</span>
                        </div>
                        <div className="p-3 bg-teal-100 text-teal-600 rounded-xl">📊</div>
                    </div>
                </div>

                {/* Métodos de Pago */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-gray-800">💳 Métodos de Pago</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="border border-gray-100 rounded-xl p-4 text-center">
                            <span className="text-xs text-gray-500 block font-medium">Efectivo</span>
                            <span className="text-lg font-bold text-emerald-600">{metodosPago?.efectivo || 'Bs. 0.00'}</span>
                        </div>
                        <div className="border border-gray-100 rounded-xl p-4 text-center">
                            <span className="text-xs text-gray-500 block font-medium">QR</span>
                            <span className="text-lg font-bold text-blue-600">{metodosPago?.qr || 'Bs. 0.00'}</span>
                        </div>
                        <div className="border border-gray-100 rounded-xl p-4 text-center">
                            <span className="text-xs text-gray-500 block font-medium">Transferencia</span>
                            <span className="text-lg font-bold text-amber-600">{metodosPago?.transferencia || 'Bs. 0.00'}</span>
                        </div>
                        <div className="border border-gray-100 rounded-xl p-4 text-center">
                            <span className="text-xs text-gray-500 block font-medium">Tarjeta</span>
                            <span className="text-lg font-bold text-rose-600">{metodosPago?.tarjeta || 'Bs. 0.00'}</span>
                        </div>
                    </div>
                </div>

                {/* Últimas Ventas */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <h2 className="text-base font-bold text-gray-800">⏱️ Últimas Ventas</h2>
                    <div className="divide-y divide-gray-100">
                        {ultimasVentas && ultimasVentas.length > 0 ? (
                            ultimasVentas.map((venta) => (
                                <div key={venta.id} className="py-3 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">Venta #{venta.id}</p>
                                        <span className="text-xs text-gray-400">{venta.hora}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                                            {venta.metodo}
                                        </span>
                                        <span className="font-bold text-blue-600 text-sm">
                                            Bs. {venta.total}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">No hay ventas registradas en este periodo.</p>
                        )}
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}