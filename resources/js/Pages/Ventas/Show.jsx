import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ venta }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Venta #{venta.id_venta}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Detalle de la venta
                    </p>
                </div>
            }
        >
            <Head title={`Venta #${venta.id_venta}`} />

            <div className="p-6">
                <div className="mx-auto max-w-5xl">

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">
                                Venta #{venta.id_venta}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                {new Date(
                                    venta.fecha_venta
                                ).toLocaleString('es-BO')}
                            </p>
                        </div>

                        <Link
                            href={route('ventas.index')}
                            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Volver
                        </Link>
                    </div>

                    <div className="rounded-xl border bg-white shadow-sm">

                        <div className="grid grid-cols-1 gap-4 border-b p-6 md:grid-cols-3">

                            <div>
                                <div className="text-sm text-gray-500">
                                    Vendedor
                                </div>

                                <div className="mt-1 font-medium">
                                    {venta.personal?.nombre}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">
                                    Método de pago
                                </div>

                                <div className="mt-1 font-medium">
                                    {venta.metodo_pago?.nombre}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">
                                    Estado
                                </div>

                                <div className="mt-1 font-medium text-green-600">
                                    {venta.estado}
                                </div>
                            </div>

                        </div>

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="border-b bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold">
                                            Producto
                                        </th>

                                        <th className="px-6 py-3 text-center text-sm font-semibold">
                                            Cantidad
                                        </th>

                                        <th className="px-6 py-3 text-right text-sm font-semibold">
                                            Precio
                                        </th>

                                        <th className="px-6 py-3 text-right text-sm font-semibold">
                                            Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {venta.detalles.map(
                                        detalle => (
                                            <tr
                                                key={
                                                    detalle.id_detalle_venta
                                                }
                                                className="border-b"
                                            >
                                                <td className="px-6 py-4">

                                                    <div className="font-medium">
                                                        {
                                                            detalle.producto
                                                                ?.nombre
                                                        }
                                                    </div>

                                                    {detalle.variante && (
                                                        <div className="mt-1 text-xs text-gray-500">
                                                            {Object.entries(
                                                                detalle.variante
                                                                    .atributos ||
                                                                {}
                                                            )
                                                                .map(
                                                                    ([clave, valor]) =>
                                                                        `${clave}: ${valor}`
                                                                )
                                                                .join(
                                                                    ' · '
                                                                )}
                                                        </div>
                                                    )}

                                                </td>

                                                <td className="px-6 py-4 text-center">
                                                    {
                                                        detalle.cantidad
                                                    }
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    Bs. {Number(
                                                        detalle.precio_unitario
                                                    ).toFixed(2)}
                                                </td>

                                                <td className="px-6 py-4 text-right font-medium">
                                                    Bs. {(
                                                        Number(
                                                            detalle.precio_unitario
                                                        ) *
                                                        Number(
                                                            detalle.cantidad
                                                        )
                                                    ).toFixed(2)}
                                                </td>

                                            </tr>
                                        )
                                    )}
                                </tbody>

                            </table>

                        </div>

                        <div className="flex justify-end p-6">

                            <div className="w-full max-w-sm space-y-3">

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span>
                                        Bs. {Number(
                                            venta.sub_total
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Descuento
                                    </span>

                                    <span>
                                        Bs. {Number(
                                            venta.descuento
                                        ).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex justify-between border-t pt-3">
                                    <span className="text-lg font-bold">
                                        Total
                                    </span>

                                    <span className="text-2xl font-bold">
                                        Bs. {Number(
                                            venta.total_neto
                                        ).toFixed(2)}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}