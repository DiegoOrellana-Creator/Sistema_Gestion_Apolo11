import React, { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({
    productos = [],
    categorias = [],
    marcas = [],
}) {
    const [busqueda, setBusqueda] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroMarca, setFiltroMarca] = useState('');
    const [filtroStock, setFiltroStock] = useState('todos');

    const formatoPrecio = (valor) => {
        return new Intl.NumberFormat('es-BO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(valor ?? 0));
    };

    const obtenerImagen = (producto) => {
        const imagenPrincipal = producto.imagenes?.find(
            (imagen) => imagen.principal === true
        );

        return (
            imagenPrincipal?.url ??
            producto.imagenes?.[0]?.url ??
            null
        );
    };

    const obtenerAtributosTexto = (producto) => {
        const atributos = producto.atributos ?? {};

        return Object.entries(atributos)
            .map(([nombre, valor]) => {
                if (valor === null || valor === undefined) {
                    return '';
                }

                if (Array.isArray(valor)) {
                    return `${nombre}: ${valor.join(', ')}`;
                }

                return `${nombre}: ${valor}`;
            })
            .filter(Boolean)
            .join(' ');
    };

    const obtenerVariantesTexto = (producto) => {
        const variantes = producto.variantes ?? [];

        return variantes
            .map((variante) => {
                const atributos = variante.atributos ?? {};

                return Object.values(atributos).join(' ');
            })
            .join(' ');
    };

    const productosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return productos.filter((producto) => {
            const coincideBusqueda =
                texto === '' ||
                producto.nombre?.toLowerCase().includes(texto) ||
                producto.codigo_barra
                    ?.toLowerCase()
                    .includes(texto) ||
                producto.categoria?.nombre
                    ?.toLowerCase()
                    .includes(texto) ||
                producto.marca?.nombre
                    ?.toLowerCase()
                    .includes(texto) ||
                obtenerAtributosTexto(producto)
                    .toLowerCase()
                    .includes(texto) ||
                obtenerVariantesTexto(producto)
                    .toLowerCase()
                    .includes(texto);

            const coincideCategoria =
                filtroCategoria === '' ||
                String(producto.categoria_id) ===
                    String(filtroCategoria);

            const coincideMarca =
                filtroMarca === '' ||
                String(producto.marca_id) ===
                    String(filtroMarca);

            const stock = Number(producto.stock_actual ?? 0);
            const minimo = Number(producto.stock_minimo ?? 0);

            let coincideStock = true;

            if (filtroStock === 'disponible') {
                coincideStock = stock > minimo;
            }

            if (filtroStock === 'bajo') {
                coincideStock = stock > 0 && stock <= minimo;
            }

            if (filtroStock === 'agotado') {
                coincideStock = stock <= 0;
            }

            return (
                coincideBusqueda &&
                coincideCategoria &&
                coincideMarca &&
                coincideStock
            );
        });
    }, [
        productos,
        busqueda,
        filtroCategoria,
        filtroMarca,
        filtroStock,
    ]);

    const eliminarProducto = (producto) => {
        const confirmar = window.confirm(
            `¿Seguro que deseas eliminar "${producto.nombre}"?`
        );

        if (!confirmar) {
            return;
        }

        router.delete(
            route(
                'productos.destroy',
                producto.id_producto
            ),
            {
                preserveScroll: true,
            }
        );
    };

    const limpiarFiltros = () => {
        setBusqueda('');
        setFiltroCategoria('');
        setFiltroMarca('');
        setFiltroStock('todos');
    };

    const obtenerEstadoStock = (producto) => {
        const stock = Number(producto.stock_actual ?? 0);
        const minimo = Number(producto.stock_minimo ?? 0);

        if (stock <= 0) {
            return {
                texto: 'Agotado',
                clase: 'bg-red-100 text-red-800',
            };
        }

        if (stock <= minimo) {
            return {
                texto: 'Stock bajo',
                clase: 'bg-yellow-100 text-yellow-800',
            };
        }

        return {
            texto: 'Disponible',
            clase: 'bg-green-100 text-green-800',
        };
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Productos
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Administración del catálogo de productos
                        </p>
                    </div>

                    <Link
                        href={route('productos.create')}
                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                    >
                        + Nuevo producto
                    </Link>
                </div>
            }
        >
            <Head title="Productos" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">

                        {/* FILTROS */}
                        <div className="p-5 border-b border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Buscar
                                    </label>

                                    <input
                                        type="text"
                                        value={busqueda}
                                        onChange={(e) =>
                                            setBusqueda(e.target.value)
                                        }
                                        placeholder="Nombre, código, categoría, marca, talla..."
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Categoría
                                    </label>

                                    <select
                                        value={filtroCategoria}
                                        onChange={(e) =>
                                            setFiltroCategoria(e.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">
                                            Todas
                                        </option>

                                        {categorias.map((categoria) => (
                                            <option
                                                key={categoria.id_categoria}
                                                value={categoria.id_categoria}
                                            >
                                                {categoria.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Marca
                                    </label>

                                    <select
                                        value={filtroMarca}
                                        onChange={(e) =>
                                            setFiltroMarca(e.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="">
                                            Todas
                                        </option>

                                        {marcas.map((marca) => (
                                            <option
                                                key={marca.id_marca}
                                                value={marca.id_marca}
                                            >
                                                {marca.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock
                                    </label>

                                    <select
                                        value={filtroStock}
                                        onChange={(e) =>
                                            setFiltroStock(e.target.value)
                                        }
                                        className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        <option value="todos">
                                            Todos
                                        </option>

                                        <option value="disponible">
                                            Disponible
                                        </option>

                                        <option value="bajo">
                                            Stock bajo
                                        </option>

                                        <option value="agotado">
                                            Agotado
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-gray-500">
                                    Mostrando{' '}
                                    <span className="font-semibold text-gray-700">
                                        {productosFiltrados.length}
                                    </span>{' '}
                                    de{' '}
                                    <span className="font-semibold text-gray-700">
                                        {productos.length}
                                    </span>{' '}
                                    productos
                                </p>

                                <button
                                    type="button"
                                    onClick={limpiarFiltros}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        </div>

                        {/* TABLA */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Producto
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Categoría
                                        </th>

                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Marca
                                        </th>

                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Precio
                                        </th>

                                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Stock
                                        </th>

                                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                    {productosFiltrados.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="text-gray-400 text-4xl mb-3">
                                                    📦
                                                </div>

                                                <p className="text-gray-600 font-medium">
                                                    No se encontraron productos
                                                </p>

                                                <p className="text-sm text-gray-400 mt-1">
                                                    Prueba cambiando los filtros
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        productosFiltrados.map((producto) => {
                                            const imagen = obtenerImagen(producto);
                                            const estado = obtenerEstadoStock(producto);

                                            return (
                                                <tr
                                                    key={producto.id_producto}
                                                    className="hover:bg-gray-50"
                                                >
                                                    {/* PRODUCTO */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">

                                                            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                                {imagen ? (
                                                                    <img
                                                                        src={imagen}
                                                                        alt={producto.nombre}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                                                                        📦
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="ml-4">
                                                                <Link
                                                                    href={route(
                                                                        'productos.show',
                                                                        producto.id_producto
                                                                    )}
                                                                    className="font-semibold text-gray-900 hover:text-indigo-600"
                                                                >
                                                                    {producto.nombre}
                                                                </Link>

                                                                {producto.codigo_barra && (
                                                                    <p className="text-sm text-gray-500">
                                                                        Código:{' '}
                                                                        {producto.codigo_barra}
                                                                    </p>
                                                                )}

                                                                {producto.variantes?.length > 0 && (
                                                                    <p className="text-xs text-indigo-600 mt-1">
                                                                        {producto.variantes.length}{' '}
                                                                        variante(s)
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* CATEGORIA */}
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                            {producto.categoria?.nombre ??
                                                                'Sin categoría'}
                                                        </span>
                                                    </td>

                                                    {/* MARCA */}
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-gray-700">
                                                            {producto.marca?.nombre ??
                                                                'Sin marca'}
                                                        </span>
                                                    </td>

                                                    {/* PRECIO */}
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="font-semibold text-gray-900">
                                                            Bs.{' '}
                                                            {formatoPrecio(
                                                                producto.precio_venta
                                                            )}
                                                        </div>

                                                        <div className="text-xs text-gray-400">
                                                            Compra: Bs.{' '}
                                                            {formatoPrecio(
                                                                producto.precio_compra
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* STOCK */}
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="font-semibold text-gray-900">
                                                            {producto.stock_actual}
                                                        </div>

                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${estado.clase}`}
                                                        >
                                                            {estado.texto}
                                                        </span>
                                                    </td>

                                                    {/* ACCIONES */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">

                                                            <Link
                                                                href={route(
                                                                    'productos.show',
                                                                    producto.id_producto
                                                                )}
                                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                                            >
                                                                Ver
                                                            </Link>

                                                            <Link
                                                                href={route(
                                                                    'productos.edit',
                                                                    producto.id_producto
                                                                )}
                                                                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                                            >
                                                                Editar
                                                            </Link>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    eliminarProducto(
                                                                        producto
                                                                    )
                                                                }
                                                                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}