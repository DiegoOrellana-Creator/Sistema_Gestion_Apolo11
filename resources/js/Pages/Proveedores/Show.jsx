import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ proveedor }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {proveedor.nombre}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Información del proveedor
                        </p>
                    </div>

                    <div className="flex gap-2">

                        <Link
                            href={route(
                                'proveedores.edit',
                                proveedor.id_proveedor
                            )}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Editar
                        </Link>

                        <Link
                            href={route('proveedores.index')}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            Volver
                        </Link>

                    </div>

                </div>
            }
        >
            <Head title={proveedor.nombre} />

            <div className="mx-auto max-w-6xl space-y-6">

                {/* ===================================================== */}
                {/* INFORMACIÓN GENERAL */}
                {/* ===================================================== */}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">

                        <div className="flex items-start justify-between">

                            <div>

                                <h3 className="text-lg font-semibold text-gray-900">
                                    {proveedor.nombre}
                                </h3>

                                {proveedor.nit && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        NIT: {proveedor.nit}
                                    </p>
                                )}

                            </div>

                            {proveedor.activo ? (

                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                    Activo
                                </span>

                            ) : (

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                                    Inactivo
                                </span>

                            )}

                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Contacto
                                </p>

                                <p className="mt-1 text-sm text-gray-800">
                                    {proveedor.contacto || 'No registrado'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Teléfono
                                </p>

                                <p className="mt-1 text-sm text-gray-800">
                                    {proveedor.telefono || 'No registrado'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Correo
                                </p>

                                <p className="mt-1 text-sm text-gray-800">
                                    {proveedor.correo || 'No registrado'}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Ciudad
                                </p>

                                <p className="mt-1 text-sm text-gray-800">
                                    {proveedor.ciudad || 'No registrada'}
                                </p>
                            </div>

                            <div className="sm:col-span-2">

                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Dirección
                                </p>

                                <p className="mt-1 text-sm text-gray-800">
                                    {proveedor.direccion || 'No registrada'}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* RESUMEN */}
                    {/* ================================================= */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h3 className="text-base font-semibold text-gray-900">
                            Resumen
                        </h3>

                        <div className="mt-5 space-y-5">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Marcas
                                </p>

                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {proveedor.marcas?.length ?? 0}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                    Compras
                                </p>

                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {proveedor.compras_count ?? 0}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* MARCAS */}
                {/* ===================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h3 className="text-base font-semibold text-gray-900">
                        Marcas que maneja
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-2">

                        {proveedor.marcas?.length > 0 ? (

                            proveedor.marcas.map((marca) => (

                                <span
                                    key={marca.id_marca}
                                    className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                                >
                                    {marca.nombre}
                                </span>

                            ))

                        ) : (

                            <p className="text-sm text-gray-500">
                                Este proveedor no tiene marcas asociadas.
                            </p>

                        )}

                    </div>

                </div>

                {/* ===================================================== */}
                {/* DESCRIPCIÓN */}
                {/* ===================================================== */}

                {proveedor.descripcion && (

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <h3 className="text-base font-semibold text-gray-900">
                            Descripción
                        </h3>

                        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-gray-600">
                            {proveedor.descripcion}
                        </p>

                    </div>

                )}

                {/* ===================================================== */}
                {/* COMPRAS */}
                {/* ===================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="border-b border-gray-200 p-6">

                        <h3 className="text-base font-semibold text-gray-900">
                            Compras realizadas
                        </h3>

                    </div>

                    <div className="overflow-x-auto">

                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="bg-gray-50">

                                <tr>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Compra
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Fecha
                                    </th>

                                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Detalles
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Total
                                    </th>

                                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        Acción
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {proveedor.compras?.length > 0 ? (

                                    proveedor.compras.map((compra) => (

                                        <tr
                                            key={compra.id_compra}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                #{compra.id_compra}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {compra.fecha_compra
                                                    ? new Date(
                                                          compra.fecha_compra
                                                      ).toLocaleDateString(
                                                          'es-BO'
                                                      )
                                                    : '—'}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {compra.detalles_count ?? 0}
                                            </td>

                                            <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                                Bs.{' '}
                                                {Number(
                                                    compra.total_compra
                                                ).toFixed(2)}
                                            </td>

                                            <td className="px-6 py-4 text-right">

                                                <Link
                                                    href={route(
                                                        'compras.show',
                                                        compra.id_compra
                                                    )}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    Ver
                                                </Link>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
                                            className="px-6 py-10 text-center text-sm text-gray-500"
                                        >
                                            Este proveedor todavía no tiene compras registradas.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>
        </AuthenticatedLayout>
    );
}