import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index() {
    const { compras = [] } = usePage().props;

    /*
    |--------------------------------------------------------------------------
    | Formateadores
    |--------------------------------------------------------------------------
    */

    const formatoMoneda = (valor) => {
        const numero = Number(valor || 0);

        return new Intl.NumberFormat('es-BO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numero);
    };

    const formatoFecha = (fecha) => {
        if (!fecha) {
            return '-';
        }

        const date = new Date(fecha);

        if (Number.isNaN(date.getTime())) {
            return fecha;
        }

        return new Intl.DateTimeFormat('es-BO', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Compras
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Historial de compras e ingresos de productos.
                    </p>
                </div>
            }
        >
            <Head title="Compras" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* ENCABEZADO */}

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Compras
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Consulta las compras registradas y sus
                                productos.
                            </p>
                        </div>

                        <Link
                            href={route('compras.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 5v14M5 12h14"
                                />
                            </svg>

                            Nueva compra
                        </Link>
                    </div>

                    {/* RESUMEN */}

                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                        {/* TOTAL COMPRAS */}

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Compras registradas
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {compras.length}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100">
                                    <svg
                                        className="h-6 w-6 text-indigo-600"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 2.5A1 1 0 006 17h11m-1 4a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 000-2 1 1 0 000 2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* PRODUCTOS */}

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Productos ingresados
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {compras.reduce(
                                            (total, compra) =>
                                                total +
                                                Number(
                                                    compra.detalles_count || 0
                                                ),
                                            0
                                        )}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100">
                                    <svg
                                        className="h-6 w-6 text-green-600"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20 7l-8 4-8-4m16 0l-8-4-8 4m16 0v10l-8 4-8-4V7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* TOTAL COMPRADO */}

                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Total comprado
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        Bs.{' '}
                                        {formatoMoneda(
                                            compras.reduce(
                                                (total, compra) =>
                                                    total +
                                                    Number(
                                                        compra.total_compra ||
                                                            0
                                                    ),
                                                0
                                            )
                                        )}
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
                                    <svg
                                        className="h-6 w-6 text-blue-600"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 8c-2.21 0-4 .895-4 2s1.79 2 4 2 4 .895 4 2-1.79 2-4 2m0-10V6m0 12v-2m8-4a8 8 0 11-16 0 8 8 0 0116 0z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABLA */}

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        {/* CABECERA */}

                        <div className="border-b border-gray-200 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Historial de compras
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Todas las compras registradas en el
                                        sistema.
                                    </p>
                                </div>

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                    {compras.length}{' '}
                                    {compras.length === 1
                                        ? 'compra'
                                        : 'compras'}
                                </span>
                            </div>
                        </div>

                        {/* SIN COMPRAS */}

                        {compras.length === 0 ? (
                            <div className="px-6 py-16 text-center">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        className="h-8 w-8 text-gray-400"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 2.5A1 1 0 006 17h11m-1 4a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z"
                                        />
                                    </svg>
                                </div>

                                <h3 className="mt-5 text-base font-semibold text-gray-900">
                                    No hay compras registradas
                                </h3>

                                <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
                                    Cuando registres una compra aparecerá aquí
                                    el historial de productos adquiridos.
                                </p>

                                <Link
                                    href={route('compras.create')}
                                    className="mt-5 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                >
                                    Registrar primera compra
                                </Link>
                            </div>
                        ) : (
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
                                                Proveedor
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Productos
                                            </th>

                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Total
                                            </th>

                                            <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                Acción
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {compras.map((compra) => (
                                            <tr
                                                key={compra.id_compra}
                                                className="transition hover:bg-gray-50"
                                            >

                                                {/* COMPRA */}

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                                                            <svg
                                                                className="h-5 w-5 text-indigo-600"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="1.8"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 2.5A1 1 0 006 17h11m-1 4a1 1 0 100-2 1 1 0 000 2zm-8 0a1 1 0 100-2 1 1 0 000 2z"
                                                                />
                                                            </svg>
                                                        </div>

                                                        <div>
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                Compra #
                                                                {
                                                                    compra.id_compra
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Registro de
                                                                inventario
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* FECHA */}

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <p className="text-sm text-gray-700">
                                                        {formatoFecha(
                                                            compra.fecha_compra
                                                        )}
                                                    </p>
                                                </td>

                                                {/* PROVEEDOR */}

                                                <td className="px-6 py-4">
                                                    {compra.proveedor ? (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {compra.proveedor
                                                                    .nombre ||
                                                                    `Proveedor #${compra.proveedor.id_proveedor}`}
                                                            </p>

                                                            {compra.proveedor
                                                                .telefono && (
                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    Tel:{' '}
                                                                    {
                                                                        compra
                                                                            .proveedor
                                                                            .telefono
                                                                    }
                                                                </p>
                                                            )}

                                                            {compra.proveedor
                                                                .correo && (
                                                                <p className="mt-1 max-w-xs truncate text-xs text-gray-500">
                                                                    {
                                                                        compra
                                                                            .proveedor
                                                                            .correo
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                            Sin proveedor
                                                        </span>
                                                    )}
                                                </td>

                                                {/* PRODUCTOS */}

                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                        {compra.detalles_count ??
                                                            0}{' '}
                                                        {Number(
                                                            compra.detalles_count ||
                                                                0
                                                        ) === 1
                                                            ? 'producto'
                                                            : 'productos'}
                                                    </span>
                                                </td>

                                                {/* TOTAL */}

                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <p className="text-sm font-bold text-gray-900">
                                                        Bs.{' '}
                                                        {formatoMoneda(
                                                            compra.total_compra
                                                        )}
                                                    </p>
                                                </td>

                                                {/* ACCIÓN */}

                                                <td className="whitespace-nowrap px-6 py-4 text-center">
                                                    <Link
                                                        href={route(
                                                            'compras.show',
                                                            compra.id_compra
                                                        )}
                                                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                                                    >
                                                        Ver detalle
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}