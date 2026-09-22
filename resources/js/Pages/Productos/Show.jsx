import React, { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ producto }) {
    const [imagenSeleccionada, setImagenSeleccionada] = useState(0);

    const imagenes = producto?.imagenes ?? [];
    const variantes = producto?.variantes ?? [];
    const atributos = producto?.atributos ?? {};

    /*
    |--------------------------------------------------------------------------
    | Imagen principal
    |--------------------------------------------------------------------------
    */

    const imagenPrincipal = useMemo(() => {
        if (imagenes.length === 0) {
            return null;
        }

        const principal = imagenes.find(
            (imagen) => imagen.principal === true
        );

        return principal ?? imagenes[0];
    }, [imagenes]);

    /*
    |--------------------------------------------------------------------------
    | Imagen actualmente seleccionada
    |--------------------------------------------------------------------------
    */

    const imagenActual = imagenes[imagenSeleccionada] ?? imagenPrincipal;

    /*
    |--------------------------------------------------------------------------
    | Stock
    |--------------------------------------------------------------------------
    */

    const stockActual = Number(producto?.stock_actual ?? 0);
    const stockMinimo = Number(producto?.stock_minimo ?? 0);

    const estadoStock = useMemo(() => {
        if (stockActual <= 0) {
            return {
                texto: 'Agotado',
                clase: 'bg-red-100 text-red-800',
            };
        }

        if (stockActual <= stockMinimo) {
            return {
                texto: 'Stock bajo',
                clase: 'bg-yellow-100 text-yellow-800',
            };
        }

        return {
            texto: 'Disponible',
            clase: 'bg-green-100 text-green-800',
        };
    }, [stockActual, stockMinimo]);

    /*
    |--------------------------------------------------------------------------
    | Precio
    |--------------------------------------------------------------------------
    */

    const formatoPrecio = (valor) => {
        return new Intl.NumberFormat('es-BO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(valor ?? 0));
    };

    /*
    |--------------------------------------------------------------------------
    | Capitalizar texto
    |--------------------------------------------------------------------------
    */

    const capitalizar = (texto) => {
        if (!texto) {
            return '';
        }

        return texto.charAt(0).toUpperCase() + texto.slice(1);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Detalle del producto
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={route('productos.index')}
                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700"
                        >
                            Volver
                        </Link>

                        <Link
                            href={route(
                                'productos.edit',
                                producto.id_producto
                            )}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500"
                        >
                            Editar
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Producto - ${producto.nombre}`} />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* ======================================================
                        ENCABEZADO DEL PRODUCTO
                    ======================================================= */}

                    <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Código de producto
                                    </p>

                                    <h1 className="mt-1 text-3xl font-bold text-gray-900">
                                        {producto.nombre}
                                    </h1>

                                    <div className="mt-3 flex flex-wrap items-center gap-2">
                                        {producto.categoria && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {producto.categoria.nombre}
                                            </span>
                                        )}

                                        {producto.marca && (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {producto.marca.nombre}
                                            </span>
                                        )}

                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${estadoStock.clase}`}
                                        >
                                            {estadoStock.texto}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-left md:text-right">
                                    <p className="text-sm text-gray-500">
                                        Código de barras
                                    </p>

                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                        {producto.codigo_barra ||
                                            'Sin código'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ======================================================
                        GALERÍA + INFORMACIÓN GENERAL
                    ======================================================= */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* --------------------------------------------------
                            GALERÍA
                        --------------------------------------------------- */}

                        <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                            <div className="p-6">

                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Imágenes
                                </h3>

                                {imagenes.length > 0 ? (
                                    <>
                                        <div className="w-full h-[420px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                            {imagenActual ? (
                                                <img
                                                    src={
                                                        imagenActual.url
                                                    }
                                                    alt={
                                                        producto.nombre
                                                    }
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="text-gray-400">
                                                    Sin imagen
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-3">
                                            {imagenes.map(
                                                (
                                                    imagen,
                                                    indice
                                                ) => (
                                                    <button
                                                        key={
                                                            imagen.id_producto_imagen ??
                                                            indice
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setImagenSeleccionada(
                                                                indice
                                                            )
                                                        }
                                                        className={`relative h-20 rounded-md overflow-hidden border-2 ${
                                                            imagenSeleccionada ===
                                                            indice
                                                                ? 'border-indigo-600'
                                                                : 'border-gray-200 hover:border-gray-400'
                                                        }`}
                                                    >
                                                        <img
                                                            src={
                                                                imagen.url
                                                            }
                                                            alt={`${producto.nombre} ${
                                                                indice +
                                                                1
                                                            }`}
                                                            className="w-full h-full object-cover"
                                                        />

                                                        {imagen.principal && (
                                                            <span className="absolute bottom-0 left-0 right-0 bg-indigo-600 text-white text-[10px] py-1">
                                                                Principal
                                                            </span>
                                                        )}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-[420px] rounded-lg bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                                        <svg
                                            className="w-16 h-16 mb-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M4 16l4.586-4.586a2 2 0 015.828 0L20 17m-2-8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>

                                        <p className="text-sm">
                                            Este producto no tiene
                                            imágenes.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --------------------------------------------------
                            INFORMACIÓN GENERAL
                        --------------------------------------------------- */}

                        <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                            <div className="p-6">

                                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                                    Información general
                                </h3>

                                <div className="space-y-5">

                                    {/* Categoría */}
                                    <div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500">
                                            Categoría
                                        </span>

                                        <span className="text-sm font-medium text-gray-900">
                                            {producto.categoria
                                                ?.nombre ||
                                                'Sin categoría'}
                                        </span>
                                    </div>

                                    {/* Marca */}
                                    <div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500">
                                            Marca
                                        </span>

                                        <span className="text-sm font-medium text-gray-900">
                                            {producto.marca
                                                ?.nombre ||
                                                'Sin marca'}
                                        </span>
                                    </div>

                                    {/* Código */}
                                    <div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500">
                                            Código de barras
                                        </span>

                                        <span className="text-sm font-medium text-gray-900">
                                            {producto.codigo_barra ||
                                                'Sin código'}
                                        </span>
                                    </div>

                                    {/* Precio compra */}
                                    <div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500">
                                            Precio de compra
                                        </span>

                                        <span className="text-sm font-semibold text-gray-900">
                                            Bs.{' '}
                                            {formatoPrecio(
                                                producto.precio_compra
                                            )}
                                        </span>
                                    </div>

                                    {/* Precio venta */}
                                    <div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500">
                                            Precio de venta
                                        </span>

                                        <span className="text-lg font-bold text-indigo-600">
                                            Bs.{' '}
                                            {formatoPrecio(
                                                producto.precio_venta
                                            )}
                                        </span>
                                    </div>

                                    {/* Stock */}
                                    <div className="flex justify-between gap-4 border-b border-gray-100 pb-4">
                                        <span className="text-sm text-gray-500">
                                            Stock actual
                                        </span>

                                        <span className="text-sm font-bold text-gray-900">
                                            {stockActual}
                                        </span>
                                    </div>

                                    {/* Stock mínimo */}
                                    <div className="flex justify-between gap-4">
                                        <span className="text-sm text-gray-500">
                                            Stock mínimo
                                        </span>

                                        <span className="text-sm font-medium text-gray-900">
                                            {stockMinimo}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ======================================================
                        ATRIBUTOS
                    ======================================================= */}

                    {Object.keys(atributos).length > 0 && (
                        <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                            <div className="p-6">

                                <h3 className="text-lg font-semibold text-gray-800 mb-5">
                                    Características del producto
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {Object.entries(atributos).map(
                                        ([nombre, valor]) => (
                                            <div
                                                key={nombre}
                                                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                                            >
                                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                    {nombre}
                                                </p>

                                                <p className="mt-2 text-base font-semibold text-gray-900">
                                                    {valor ||
                                                        'No especificado'}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======================================================
                        VARIANTES
                    ======================================================= */}

                    {variantes.length > 0 && (
                        <div className="bg-white shadow-sm sm:rounded-lg overflow-hidden">
                            <div className="p-6">

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Variantes
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Stock disponible por variante.
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-indigo-50 px-4 py-2">
                                        <span className="text-xs text-indigo-600">
                                            Stock total
                                        </span>

                                        <span className="ml-2 font-bold text-indigo-800">
                                            {variantes.reduce(
                                                (
                                                    total,
                                                    variante
                                                ) =>
                                                    total +
                                                    Number(
                                                        variante.stock_actual ??
                                                            0
                                                    ),
                                                0
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    #
                                                </th>

                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Variante
                                                </th>

                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Stock
                                                </th>

                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Stock mínimo
                                                </th>

                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {variantes.map(
                                                (
                                                    variante,
                                                    indice
                                                ) => {
                                                    const stock =
                                                        Number(
                                                            variante.stock_actual ??
                                                                0
                                                        );

                                                    const minimo =
                                                        Number(
                                                            variante.stock_minimo ??
                                                                0
                                                        );

                                                    let estado =
                                                        'Disponible';

                                                    let clase =
                                                        'bg-green-100 text-green-800';

                                                    if (
                                                        stock <=
                                                        0
                                                    ) {
                                                        estado =
                                                            'Agotado';

                                                        clase =
                                                            'bg-red-100 text-red-800';
                                                    } else if (
                                                        stock <=
                                                        minimo
                                                    ) {
                                                        estado =
                                                            'Stock bajo';

                                                        clase =
                                                            'bg-yellow-100 text-yellow-800';
                                                    }

                                                    return (
                                                        <tr
                                                            key={
                                                                variante.id_producto_variante ??
                                                                indice
                                                            }
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <td className="px-4 py-4 text-sm text-gray-500">
                                                                {indice +
                                                                    1}
                                                            </td>

                                                            <td className="px-4 py-4">
                                                                <div className="flex flex-wrap gap-2">
                                                                    {Object.entries(
                                                                        variante.atributos ??
                                                                            {}
                                                                    ).map(
                                                                        ([
                                                                            nombre,
                                                                            valor,
                                                                        ]) => (
                                                                            <span
                                                                                key={`${nombre}-${valor}`}
                                                                                className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm"
                                                                            >
                                                                                <span className="font-medium">
                                                                                    {capitalizar(
                                                                                        nombre
                                                                                    )}
                                                                                    :
                                                                                </span>

                                                                                <span className="ml-1">
                                                                                    {
                                                                                        valor
                                                                                    }
                                                                                </span>
                                                                            </span>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </td>

                                                            <td className="px-4 py-4 text-center">
                                                                <span className="text-lg font-bold text-gray-900">
                                                                    {
                                                                        stock
                                                                    }
                                                                </span>
                                                            </td>

                                                            <td className="px-4 py-4 text-center text-sm text-gray-600">
                                                                {
                                                                    minimo
                                                                }
                                                            </td>

                                                            <td className="px-4 py-4 text-center">
                                                                <span
                                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${clase}`}
                                                                >
                                                                    {
                                                                        estado
                                                                    }
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ======================================================
                        RESUMEN
                    ======================================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Precio */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <p className="text-sm text-gray-500">
                                Precio de venta
                            </p>

                            <p className="mt-2 text-2xl font-bold text-indigo-600">
                                Bs.{' '}
                                {formatoPrecio(
                                    producto.precio_venta
                                )}
                            </p>
                        </div>

                        {/* Stock */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <p className="text-sm text-gray-500">
                                Stock actual
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {stockActual}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Mínimo: {stockMinimo}
                            </p>
                        </div>

                        {/* Variantes */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <p className="text-sm text-gray-500">
                                Variantes
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {variantes.length}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {variantes.length === 1
                                    ? 'variante registrada'
                                    : 'variantes registradas'}
                            </p>
                        </div>
                    </div>

                    {/* ======================================================
                        ACCIONES
                    ======================================================= */}

                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 flex flex-col sm:flex-row justify-end gap-3">
                            <Link
                                href={route(
                                    'productos.index'
                                )}
                                className="inline-flex justify-center items-center px-5 py-2.5 bg-white border border-gray-300 rounded-md font-semibold text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Volver a productos
                            </Link>

                            <Link
                                href={route(
                                    'productos.edit',
                                    producto.id_producto
                                )}
                                className="inline-flex justify-center items-center px-5 py-2.5 bg-indigo-600 border border-transparent rounded-md font-semibold text-sm text-white hover:bg-indigo-500"
                            >
                                Editar producto
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}