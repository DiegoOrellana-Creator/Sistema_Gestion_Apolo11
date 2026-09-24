import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ ventas = [] }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Ventas
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Registro y administración de ventas
                    </p>
                </div>
            }
        >
            <Head title="Ventas" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">

                    {flash?.success && (
                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Ventas
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Consulta las ventas realizadas.
                            </p>
                        </div>

                        <Link
                            href={route('ventas.create')}
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            + Nueva venta
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">

                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Venta
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Fecha
                                    </th>

                                    <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                                        Productos
                                    </th>

                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Método
                                    </th>

                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">
                                        Total
                                    </th>

                                    <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                                        Estado
                                    </th>

                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">
                                        Acción
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {ventas.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-5 py-12 text-center text-gray-500"
                                        >
                                            No hay ventas registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    ventas.map((venta) => (
                                        <tr
                                            key={venta.id_venta}
                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 font-medium text-gray-900">
                                                #{venta.id_venta}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {new Date(
                                                    venta.fecha_venta
                                                ).toLocaleString('es-BO')}
                                            </td>

                                            <td className="px-5 py-4 text-center text-sm text-gray-600">
                                                {venta.detalles_count}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {venta.metodo_pago?.nombre}
                                            </td>

                                            <td className="px-5 py-4 text-right font-semibold text-gray-900">
                                                Bs. {Number(
                                                    venta.total_neto
                                                ).toFixed(2)}
                                            </td>

                                            <td className="px-5 py-4 text-center">
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    {venta.estado}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <Link
                                                    href={route(
                                                        'ventas.show',
                                                        venta.id_venta
                                                    )}
                                                    className="rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-gray-800"
                                                >
                                                    Ver
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}