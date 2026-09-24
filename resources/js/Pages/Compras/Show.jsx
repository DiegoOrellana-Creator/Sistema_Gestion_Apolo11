import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show() {
    const { compra } = usePage().props;

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

    const obtenerTextoAtributos = (variante) => {
        if (!variante?.atributos) {
            return '';
        }

        const atributos = variante.atributos;

        if (typeof atributos !== 'object') {
            return String(atributos);
        }

        return Object.entries(atributos)
            .map(([clave, valor]) => {
                const nombre = clave
                    .replaceAll('_', ' ')
                    .replace(/\b\w/g, (letra) => letra.toUpperCase());

                return `${nombre}: ${valor}`;
            })
            .join(' • ');
    };

    const obtenerNombreProveedor = () => {
        if (!compra?.proveedor) {
            return 'Sin proveedor';
        }

        return (
            compra.proveedor.nombre ||
            compra.proveedor.contacto ||
            `Proveedor #${compra.proveedor.id_proveedor}`
        );
    };

    const calcularSubtotal = (detalle) => {
        return (
            Number(detalle.cantidad || 0) *
            Number(detalle.precio_costo_unitario || 0)
        );
    };

    const cantidadTotal = (compra?.detalles || []).reduce(
        (total, detalle) => total + Number(detalle.cantidad || 0),
        0
    );

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detalle de compra
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Información de la compra y productos adquiridos.
                    </p>
                </div>
            }
        >
            <Head title={`Compra #${compra?.id_compra || ''}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* ======================================================
                        ENCABEZADO
                    ====================================================== */}

                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route('compras.index')}
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50"
                                    title="Volver"
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
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                </Link>

                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Compra #{compra?.id_compra}
                                    </h1>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Registrada el{' '}
                                        {formatoFecha(compra?.fecha_compra)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={route('compras.index')}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
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
                                    d="M3 7h18M3 12h18M3 17h18"
                                />
                            </svg>

                            Volver a compras
                        </Link>
                    </div>

                    {/* ======================================================
                        INFORMACIÓN GENERAL
                    ====================================================== */}

                    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* PROVEEDOR */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    <svg
                                        className="h-6 w-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16 11a4 4 0 100-8 4 4 0 000 8zM8 13a4 4 0 100-8 4 4 0 000 8z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2 21a6 6 0 0112 0M14 15a6 6 0 018 6"
                                        />
                                    </svg>
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Proveedor
                                    </p>

                                    <p className="mt-1 truncate text-base font-semibold text-gray-900">
                                        {obtenerNombreProveedor()}
                                    </p>

                                    {compra?.proveedor && (
                                        <>
                                            {compra.proveedor.contacto && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Contacto:{' '}
                                                    {compra.proveedor.contacto}
                                                </p>
                                            )}

                                            {compra.proveedor.telefono && (
                                                <p className="text-sm text-gray-500">
                                                    Teléfono:{' '}
                                                    {compra.proveedor.telefono}
                                                </p>
                                            )}

                                            {compra.proveedor.correo && (
                                                <p className="truncate text-sm text-gray-500">
                                                    {compra.proveedor.correo}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* PRODUCTOS */}

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <svg
                                        className="h-6 w-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 2h12v20H6z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 6h6M9 10h6M9 14h4"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Productos
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {(compra?.detalles || []).length}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {cantidadTotal === 1
                                            ? 'unidad adquirida'
                                            : `${cantidadTotal} unidades adquiridas`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* TOTAL */}

                        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm">
                            <div className="flex items-start gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                    <svg
                                        className="h-6 w-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                                        Total de compra
                                    </p>

                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        Bs.{' '}
                                        {formatoMoneda(
                                            compra?.total_compra
                                        )}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Monto total registrado
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ======================================================
                        DETALLES
                    ====================================================== */}

                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b border-gray-200 px-6 py-5">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Productos de la compra
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Detalle de productos, cantidades y precios de
                                adquisición.
                            </p>
                        </div>

                        {(compra?.detalles || []).length === 0 ? (
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
                                            d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 0L4 7m8 4v10"
                                        />
                                    </svg>
                                </div>

                                <h3 className="mt-5 text-base font-semibold text-gray-900">
                                    No hay productos registrados
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    Esta compra no contiene detalles de
                                    productos.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* ==================================================
                                    VISTA DESKTOP
                                ================================================== */}

                                <div className="hidden overflow-x-auto md:block">
                                    <table className="min-w-full divide-y divide-gray-200">

                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Producto
                                                </th>

                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Variante
                                                </th>

                                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Cantidad
                                                </th>

                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Precio unitario
                                                </th>

                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-200 bg-white">

                                            {compra.detalles.map((detalle) => {
                                                const producto =
                                                    detalle.producto;

                                                const variante =
                                                    detalle.variante;

                                                return (
                                                    <tr
                                                        key={
                                                            detalle.id_detalle_compra
                                                        }
                                                        className="transition hover:bg-gray-50"
                                                    >
                                                        {/* PRODUCTO */}

                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="font-semibold text-gray-900">
                                                                    {producto?.nombre ||
                                                                        `Producto #${detalle.producto_id}`}
                                                                </p>

                                                                {producto?.codigo_barra && (
                                                                    <p className="mt-1 text-xs text-gray-500">
                                                                        Código:{' '}
                                                                        {
                                                                            producto.codigo_barra
                                                                        }
                                                                    </p>
                                                                )}

                                                                {producto?.marca?.nombre && (
                                                                    <p className="text-xs text-gray-500">
                                                                        Marca:{' '}
                                                                        {
                                                                            producto
                                                                                .marca
                                                                                .nombre
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </td>

                                                        {/* VARIANTE */}

                                                        <td className="px-6 py-4">
                                                            {variante ? (
                                                                <div>
                                                                    <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                                                                        Variante
                                                                    </span>

                                                                    {obtenerTextoAtributos(
                                                                        variante
                                                                    ) && (
                                                                        <p className="mt-2 max-w-xs text-xs text-gray-600">
                                                                            {obtenerTextoAtributos(
                                                                                variante
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-gray-400">
                                                                    —
                                                                </span>
                                                            )}
                                                        </td>

                                                        {/* CANTIDAD */}

                                                        <td className="px-6 py-4 text-center">
                                                            <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-800">
                                                                {
                                                                    detalle.cantidad
                                                                }
                                                            </span>
                                                        </td>

                                                        {/* PRECIO */}

                                                        <td className="px-6 py-4 text-right">
                                                            <span className="text-sm text-gray-700">
                                                                Bs.{' '}
                                                                {formatoMoneda(
                                                                    detalle.precio_costo_unitario
                                                                )}
                                                            </span>
                                                        </td>

                                                        {/* SUBTOTAL */}

                                                        <td className="px-6 py-4 text-right">
                                                            <span className="font-semibold text-gray-900">
                                                                Bs.{' '}
                                                                {formatoMoneda(
                                                                    calcularSubtotal(
                                                                        detalle
                                                                    )
                                                                )}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>

                                        {/* TOTAL */}

                                        <tfoot className="border-t border-gray-200 bg-gray-50">
                                            <tr>
                                                <td
                                                    colSpan="4"
                                                    className="px-6 py-4 text-right text-sm font-semibold text-gray-700"
                                                >
                                                    Total de compra
                                                </td>

                                                <td className="px-6 py-4 text-right">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        Bs.{' '}
                                                        {formatoMoneda(
                                                            compra?.total_compra
                                                        )}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* ==================================================
                                    VISTA MOBILE
                                ================================================== */}

                                <div className="divide-y divide-gray-200 md:hidden">

                                    {compra.detalles.map((detalle) => {
                                        const producto =
                                            detalle.producto;

                                        const variante =
                                            detalle.variante;

                                        return (
                                            <div
                                                key={
                                                    detalle.id_detalle_compra
                                                }
                                                className="p-5"
                                            >
                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-gray-900">
                                                            {producto?.nombre ||
                                                                `Producto #${detalle.producto_id}`}
                                                        </p>

                                                        {producto?.codigo_barra && (
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                Código:{' '}
                                                                {
                                                                    producto.codigo_barra
                                                                }
                                                            </p>
                                                        )}

                                                        {producto?.marca?.nombre && (
                                                            <p className="text-xs text-gray-500">
                                                                Marca:{' '}
                                                                {
                                                                    producto
                                                                        .marca
                                                                        .nombre
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <span className="shrink-0 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-semibold text-gray-800">
                                                        x{detalle.cantidad}
                                                    </span>
                                                </div>

                                                {variante && (
                                                    <div className="mt-3 rounded-lg bg-indigo-50 p-3">
                                                        <p className="text-xs font-semibold text-indigo-700">
                                                            Variante
                                                        </p>

                                                        {obtenerTextoAtributos(
                                                            variante
                                                        ) && (
                                                            <p className="mt-1 text-xs text-indigo-700">
                                                                {obtenerTextoAtributos(
                                                                    variante
                                                                )}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                                    <div>
                                                        <p className="text-xs text-gray-500">
                                                            Precio unitario
                                                        </p>

                                                        <p className="text-sm font-medium text-gray-700">
                                                            Bs.{' '}
                                                            {formatoMoneda(
                                                                detalle.precio_costo_unitario
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">
                                                            Subtotal
                                                        </p>

                                                        <p className="text-base font-bold text-gray-900">
                                                            Bs.{' '}
                                                            {formatoMoneda(
                                                                calcularSubtotal(
                                                                    detalle
                                                                )
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="flex items-center justify-between bg-gray-50 px-5 py-4">
                                        <span className="font-semibold text-gray-700">
                                            Total
                                        </span>

                                        <span className="text-lg font-bold text-gray-900">
                                            Bs.{' '}
                                            {formatoMoneda(
                                                compra?.total_compra
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ======================================================
                        INFORMACIÓN FINAL
                    ====================================================== */}

                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="text-sm font-semibold text-gray-900">
                                    Información de la compra
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    ID de compra:{' '}
                                    <span className="font-medium text-gray-700">
                                        #{compra?.id_compra}
                                    </span>
                                </p>

                                <p className="text-sm text-gray-500">
                                    Fecha:{' '}
                                    <span className="font-medium text-gray-700">
                                        {formatoFecha(
                                            compra?.fecha_compra
                                        )}
                                    </span>
                                </p>
                            </div>

                            <div className="text-left sm:text-right">
                                <p className="text-sm text-gray-500">
                                    Total registrado
                                </p>

                                <p className="text-2xl font-bold text-indigo-600">
                                    Bs.{' '}
                                    {formatoMoneda(
                                        compra?.total_compra
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}