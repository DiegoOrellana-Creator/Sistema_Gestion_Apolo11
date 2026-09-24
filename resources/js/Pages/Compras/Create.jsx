import React, { useMemo, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create() {
    const { productos = [], proveedores = [] } = usePage().props;

    const [busqueda, setBusqueda] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [varianteSeleccionada, setVarianteSeleccionada] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [precioCompra, setPrecioCompra] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        proveedor_id: '',
        items: [],
    });

    /*
    |--------------------------------------------------------------------------
    | Productos filtrados
    |--------------------------------------------------------------------------
    */

    const productosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        if (!texto) {
            return [];
        }

        return productos
            .filter((producto) => {
                const nombre = producto.nombre?.toLowerCase() || '';
                const codigo = producto.codigo_barra?.toLowerCase() || '';
                const marca = producto.marca?.nombre?.toLowerCase() || '';

                return (
                    nombre.includes(texto) ||
                    codigo.includes(texto) ||
                    marca.includes(texto)
                );
            })
            .slice(0, 10);
    }, [busqueda, productos]);

    /*
    |--------------------------------------------------------------------------
    | Producto seleccionado
    |--------------------------------------------------------------------------
    */

    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setBusqueda(producto.nombre || '');
        setVarianteSeleccionada('');

        const precio = producto.precio_compra ?? '';

        setPrecioCompra(precio !== null ? String(precio) : '');
        setCantidad(1);
    };

    const limpiarSeleccion = () => {
        setProductoSeleccionado(null);
        setVarianteSeleccionada('');
        setCantidad(1);
        setPrecioCompra('');
        setBusqueda('');
    };

    /*
    |--------------------------------------------------------------------------
    | Variantes
    |--------------------------------------------------------------------------
    */

    const tieneVariantes =
        productoSeleccionado &&
        Array.isArray(productoSeleccionado.variantes) &&
        productoSeleccionado.variantes.length > 0;

    const varianteActual = useMemo(() => {
        if (!productoSeleccionado || !varianteSeleccionada) {
            return null;
        }

        return (
            productoSeleccionado.variantes?.find(
                (variante) =>
                    String(variante.id_producto_variante) ===
                    String(varianteSeleccionada)
            ) || null
        );
    }, [productoSeleccionado, varianteSeleccionada]);

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

    /*
    |--------------------------------------------------------------------------
    | Atributos de variante
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Agregar producto
    |--------------------------------------------------------------------------
    */

    const agregarProducto = () => {
        if (!productoSeleccionado) {
            return;
        }

        if (tieneVariantes && !varianteSeleccionada) {
            alert('Debes seleccionar una variante.');
            return;
        }

        const cantidadNumerica = Number(cantidad);
        const precioNumerico = Number(precioCompra);

        if (!Number.isInteger(cantidadNumerica) || cantidadNumerica < 1) {
            alert('La cantidad debe ser un número entero mayor a cero.');
            return;
        }

        if (Number.isNaN(precioNumerico) || precioNumerico < 0) {
            alert('El precio de compra no es válido.');
            return;
        }

        const varianteId = varianteActual?.id_producto_variante ?? null;

        /*
        |--------------------------------------------------------------------------
        | Buscar si ya existe el mismo producto + variante
        |--------------------------------------------------------------------------
        */

        const indiceExistente = data.items.findIndex((item) => {
            return (
                Number(item.producto_id) ===
                    Number(productoSeleccionado.id_producto) &&
                Number(item.producto_variante_id || 0) ===
                    Number(varianteId || 0)
            );
        });

        if (indiceExistente !== -1) {
            const itemsActualizados = [...data.items];

            itemsActualizados[indiceExistente] = {
                ...itemsActualizados[indiceExistente],
                cantidad:
                    Number(itemsActualizados[indiceExistente].cantidad) +
                    cantidadNumerica,
                precio_unitario: precioNumerico,
            };

            setData('items', itemsActualizados);
        } else {
            setData('items', [
                ...data.items,
                {
                    producto_id: productoSeleccionado.id_producto,
                    producto_variante_id: varianteId,
                    cantidad: cantidadNumerica,
                    precio_unitario: precioNumerico,
                },
            ]);
        }

        limpiarSeleccion();
    };

    /*
    |--------------------------------------------------------------------------
    | Eliminar producto
    |--------------------------------------------------------------------------
    */

    const eliminarItem = (indice) => {
        const itemsActualizados = data.items.filter(
            (_, index) => index !== indice
        );

        setData('items', itemsActualizados);
    };

    /*
    |--------------------------------------------------------------------------
    | Cambiar cantidad
    |--------------------------------------------------------------------------
    */

    const cambiarCantidad = (indice, nuevaCantidad) => {
        const cantidadNumerica = Number(nuevaCantidad);

        const itemsActualizados = [...data.items];

        itemsActualizados[indice] = {
            ...itemsActualizados[indice],
            cantidad:
                Number.isInteger(cantidadNumerica) && cantidadNumerica > 0
                    ? cantidadNumerica
                    : 1,
        };

        setData('items', itemsActualizados);
    };

    /*
    |--------------------------------------------------------------------------
    | Cambiar precio
    |--------------------------------------------------------------------------
    */

    const cambiarPrecio = (indice, nuevoPrecio) => {
        const precioNumerico = Number(nuevoPrecio);

        const itemsActualizados = [...data.items];

        itemsActualizados[indice] = {
            ...itemsActualizados[indice],
            precio_unitario:
                !Number.isNaN(precioNumerico) && precioNumerico >= 0
                    ? precioNumerico
                    : 0,
        };

        setData('items', itemsActualizados);
    };

    /*
    |--------------------------------------------------------------------------
    | Obtener producto de una línea
    |--------------------------------------------------------------------------
    */

    const obtenerProductoItem = (item) => {
        return productos.find(
            (producto) =>
                Number(producto.id_producto) === Number(item.producto_id)
        );
    };

    const obtenerVarianteItem = (item) => {
        const producto = obtenerProductoItem(item);

        if (!producto || !item.producto_variante_id) {
            return null;
        }

        return (
            producto.variantes?.find(
                (variante) =>
                    Number(variante.id_producto_variante) ===
                    Number(item.producto_variante_id)
            ) || null
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Totales
    |--------------------------------------------------------------------------
    */

    const totalCompra = useMemo(() => {
        return data.items.reduce((total, item) => {
            const cantidadItem = Number(item.cantidad || 0);
            const precioItem = Number(item.precio_unitario || 0);

            return total + cantidadItem * precioItem;
        }, 0);
    }, [data.items]);

    const cantidadProductos = useMemo(() => {
        return data.items.reduce((total, item) => {
            return total + Number(item.cantidad || 0);
        }, 0);
    }, [data.items]);

    /*
    |--------------------------------------------------------------------------
    | Guardar compra
    |--------------------------------------------------------------------------
    */

    const guardarCompra = (e) => {
        e.preventDefault();

        if (data.items.length === 0) {
            alert('Debes agregar al menos un producto.');
            return;
        }

        post(route('compras.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Compras
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Registra una nueva compra y actualiza el inventario.
                    </p>
                </div>
            }
        >
            <Head title="Registrar compra" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* ENCABEZADO */}

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Nueva compra
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Agrega los productos que ingresaron al
                                inventario.
                            </p>
                        </div>

                        <Link
                            href={route('compras.index')}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            Volver
                        </Link>
                    </div>

                    {/* ERRORES GENERALES */}

                    {errors.general && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                            <p className="text-sm font-medium text-red-800">
                                {errors.general}
                            </p>
                        </div>
                    )}

                    <form onSubmit={guardarCompra}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                            {/* COLUMNA PRINCIPAL */}

                            <div className="space-y-6 lg:col-span-2">

                                {/* PROVEEDOR */}

                                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="mb-5">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Proveedor
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            El proveedor es opcional.
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="proveedor_id"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Proveedor
                                        </label>

                                        <select
                                            id="proveedor_id"
                                            value={data.proveedor_id}
                                            onChange={(e) =>
                                                setData(
                                                    'proveedor_id',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        >
                                            <option value="">
                                                Sin proveedor
                                            </option>

                                            {proveedores.map((proveedor) => (
                                                <option
                                                    key={proveedor.id_proveedor}
                                                    value={proveedor.id_proveedor}
                                                >
                                                    {proveedor.nombre ||
                                                        `Proveedor #${proveedor.id_proveedor}`}
                                                </option>
                                            ))}
                                        </select>

                                        {errors.proveedor_id && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.proveedor_id}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* AGREGAR PRODUCTO */}

                                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <div className="mb-5">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Agregar productos
                                        </h3>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Busca por nombre, código de barras
                                            o marca.
                                        </p>
                                    </div>

                                    {/* BÚSQUEDA */}

                                    <div className="relative">
                                        <label
                                            htmlFor="busqueda"
                                            className="mb-2 block text-sm font-medium text-gray-700"
                                        >
                                            Buscar producto
                                        </label>

                                        <input
                                            id="busqueda"
                                            type="text"
                                            value={busqueda}
                                            onChange={(e) =>
                                                setBusqueda(e.target.value)
                                            }
                                            placeholder="Nombre, código de barras o marca..."
                                            className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />

                                        {/* RESULTADOS */}

                                        {busqueda.trim() !== '' &&
                                            !productoSeleccionado &&
                                            productosFiltrados.length > 0 && (
                                                <div className="absolute z-20 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                                    {productosFiltrados.map(
                                                        (producto) => (
                                                            <button
                                                                type="button"
                                                                key={
                                                                    producto.id_producto
                                                                }
                                                                onClick={() =>
                                                                    seleccionarProducto(
                                                                        producto
                                                                    )
                                                                }
                                                                className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-gray-50"
                                                            >
                                                                <div className="min-w-0">
                                                                    <p className="truncate text-sm font-semibold text-gray-900">
                                                                        {
                                                                            producto.nombre
                                                                        }
                                                                    </p>

                                                                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                                                                        {producto.codigo_barra && (
                                                                            <span>
                                                                                Código:{' '}
                                                                                {
                                                                                    producto.codigo_barra
                                                                                }
                                                                            </span>
                                                                        )}

                                                                        {producto.marca?.nombre && (
                                                                            <span>
                                                                                Marca:{' '}
                                                                                {
                                                                                    producto
                                                                                        .marca
                                                                                        .nombre
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="ml-4 text-right">
                                                                    <p className="text-sm font-semibold text-gray-900">
                                                                        Bs.{' '}
                                                                        {formatoMoneda(
                                                                            producto.precio_compra
                                                                        )}
                                                                    </p>

                                                                    <p className="text-xs text-gray-500">
                                                                        Stock:{' '}
                                                                        {producto.stock_actual ??
                                                                            0}
                                                                    </p>
                                                                </div>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                        {busqueda.trim() !== '' &&
                                            !productoSeleccionado &&
                                            productosFiltrados.length ===
                                                0 && (
                                                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                                    <p className="text-sm text-gray-500">
                                                        No se encontraron
                                                        productos.
                                                    </p>
                                                </div>
                                            )}
                                    </div>

                                    {/* PRODUCTO SELECCIONADO */}

                                    {productoSeleccionado && (
                                        <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                                                        Producto seleccionado
                                                    </p>

                                                    <h4 className="mt-1 text-base font-semibold text-gray-900">
                                                        {
                                                            productoSeleccionado.nombre
                                                        }
                                                    </h4>

                                                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                                                        {productoSeleccionado.codigo_barra && (
                                                            <span>
                                                                Código:{' '}
                                                                {
                                                                    productoSeleccionado.codigo_barra
                                                                }
                                                            </span>
                                                        )}

                                                        {productoSeleccionado.marca?.nombre && (
                                                            <span>
                                                                Marca:{' '}
                                                                {
                                                                    productoSeleccionado
                                                                        .marca
                                                                        .nombre
                                                                }
                                                            </span>
                                                        )}

                                                        <span>
                                                            Stock actual:{' '}
                                                            {
                                                                productoSeleccionado.stock_actual
                                                            }
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={limpiarSeleccion}
                                                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                                                >
                                                    Cambiar
                                                </button>
                                            </div>

                                            {/* VARIANTE */}

                                            {tieneVariantes && (
                                                <div className="mt-5">
                                                    <label
                                                        htmlFor="variante"
                                                        className="mb-2 block text-sm font-medium text-gray-700"
                                                    >
                                                        Variante
                                                    </label>

                                                    <select
                                                        id="variante"
                                                        value={
                                                            varianteSeleccionada
                                                        }
                                                        onChange={(e) =>
                                                            setVarianteSeleccionada(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-lg border-gray-300 bg-white text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    >
                                                        <option value="">
                                                            Selecciona una
                                                            variante
                                                        </option>

                                                        {productoSeleccionado.variantes.map(
                                                            (variante) => (
                                                                <option
                                                                    key={
                                                                        variante.id_producto_variante
                                                                    }
                                                                    value={
                                                                        variante.id_producto_variante
                                                                    }
                                                                >
                                                                    {obtenerTextoAtributos(
                                                                        variante
                                                                    ) ||
                                                                        `Variante #${variante.id_producto_variante}`}{' '}
                                                                    — Stock:{' '}
                                                                    {
                                                                        variante.stock_actual
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>

                                                    {varianteActual && (
                                                        <div className="mt-2 rounded-md bg-white px-3 py-2 text-xs text-gray-600">
                                                            <span className="font-medium">
                                                                Variante:
                                                            </span>{' '}
                                                            {obtenerTextoAtributos(
                                                                varianteActual
                                                            ) || '-'}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* CANTIDAD + PRECIO */}

                                            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label
                                                        htmlFor="cantidad"
                                                        className="mb-2 block text-sm font-medium text-gray-700"
                                                    >
                                                        Cantidad
                                                    </label>

                                                    <input
                                                        id="cantidad"
                                                        type="number"
                                                        min="1"
                                                        step="1"
                                                        value={cantidad}
                                                        onChange={(e) =>
                                                            setCantidad(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-lg border-gray-300 bg-white text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="precio_compra"
                                                        className="mb-2 block text-sm font-medium text-gray-700"
                                                    >
                                                        Precio de compra
                                                        unitario
                                                    </label>

                                                    <div className="relative">
                                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">
                                                            Bs.
                                                        </span>

                                                        <input
                                                            id="precio_compra"
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={
                                                                precioCompra
                                                            }
                                                            onChange={(e) =>
                                                                setPrecioCompra(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full rounded-lg border-gray-300 bg-white pl-10 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SUBTOTAL */}

                                            <div className="mt-4 flex items-center justify-between rounded-lg bg-white px-4 py-3">
                                                <span className="text-sm text-gray-600">
                                                    Subtotal
                                                </span>

                                                <span className="text-base font-semibold text-gray-900">
                                                    Bs.{' '}
                                                    {formatoMoneda(
                                                        Number(cantidad || 0) *
                                                            Number(
                                                                precioCompra ||
                                                                    0
                                                            )
                                                    )}
                                                </span>
                                            </div>

                                            {/* AGREGAR */}

                                            <button
                                                type="button"
                                                onClick={agregarProducto}
                                                className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                            >
                                                Agregar a la compra
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* DETALLE DE COMPRA */}

                                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                                    <div className="border-b border-gray-200 px-6 py-5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Productos de la compra
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {data.items.length === 0
                                                        ? 'Todavía no agregaste productos.'
                                                        : `${data.items.length} línea(s) · ${cantidadProductos} unidad(es)`}
                                                </p>
                                            </div>

                                            {data.items.length > 0 && (
                                                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                                                    {data.items.length}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {data.items.length === 0 ? (
                                        <div className="px-6 py-12 text-center">
                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                                <svg
                                                    className="h-7 w-7 text-gray-400"
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

                                            <p className="mt-4 text-sm font-medium text-gray-900">
                                                No hay productos agregados
                                            </p>

                                            <p className="mt-1 text-sm text-gray-500">
                                                Busca un producto arriba para
                                                comenzar.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                            Producto
                                                        </th>

                                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                            Cantidad
                                                        </th>

                                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                            Precio
                                                        </th>

                                                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                            Subtotal
                                                        </th>

                                                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                            Acción
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="divide-y divide-gray-100 bg-white">
                                                    {data.items.map(
                                                        (item, indice) => {
                                                            const producto =
                                                                obtenerProductoItem(
                                                                    item
                                                                );

                                                            const variante =
                                                                obtenerVarianteItem(
                                                                    item
                                                                );

                                                            const subtotal =
                                                                Number(
                                                                    item.cantidad ||
                                                                        0
                                                                ) *
                                                                Number(
                                                                    item.precio_unitario ||
                                                                        0
                                                                );

                                                            return (
                                                                <tr
                                                                    key={`${item.producto_id}-${item.producto_variante_id || 'base'}-${indice}`}
                                                                    className="hover:bg-gray-50"
                                                                >
                                                                    <td className="px-6 py-4">
                                                                        <div>
                                                                            <p className="text-sm font-semibold text-gray-900">
                                                                                {producto?.nombre ||
                                                                                    `Producto #${item.producto_id}`}
                                                                            </p>

                                                                            {producto?.codigo_barra && (
                                                                                <p className="mt-1 text-xs text-gray-500">
                                                                                    Código:{' '}
                                                                                    {
                                                                                        producto.codigo_barra
                                                                                    }
                                                                                </p>
                                                                            )}

                                                                            {variante && (
                                                                                <p className="mt-1 text-xs text-indigo-600">
                                                                                    {obtenerTextoAtributos(
                                                                                        variante
                                                                                    )}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </td>

                                                                    <td className="px-4 py-4">
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            step="1"
                                                                            value={
                                                                                item.cantidad
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                cambiarCantidad(
                                                                                    indice,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="w-24 rounded-md border-gray-300 text-center text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                        />
                                                                    </td>

                                                                    <td className="px-4 py-4">
                                                                        <div className="relative">
                                                                            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-xs text-gray-500">
                                                                                Bs.
                                                                            </span>

                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                step="0.01"
                                                                                value={
                                                                                    item.precio_unitario
                                                                                }
                                                                                onChange={(
                                                                                    e
                                                                                ) =>
                                                                                    cambiarPrecio(
                                                                                        indice,
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                }
                                                                                className="w-32 rounded-md border-gray-300 pl-8 text-right text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                                            />
                                                                        </div>
                                                                    </td>

                                                                    <td className="whitespace-nowrap px-4 py-4 text-right">
                                                                        <span className="text-sm font-semibold text-gray-900">
                                                                            Bs.{' '}
                                                                            {formatoMoneda(
                                                                                subtotal
                                                                            )}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-4 py-4 text-center">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                eliminarItem(
                                                                                    indice
                                                                                )
                                                                            }
                                                                            className="rounded-md px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                                                                        >
                                                                            Eliminar
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RESUMEN */}

                            <div className="lg:col-span-1">
                                <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Resumen de compra
                                    </h3>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Líneas
                                            </span>

                                            <span className="text-sm font-medium text-gray-900">
                                                {data.items.length}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Cantidad total
                                            </span>

                                            <span className="text-sm font-medium text-gray-900">
                                                {cantidadProductos}
                                            </span>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex items-end justify-between gap-4">
                                                <span className="text-base font-medium text-gray-700">
                                                    Total compra
                                                </span>

                                                <span className="text-2xl font-bold text-gray-900">
                                                    Bs.{' '}
                                                    {formatoMoneda(
                                                        totalCompra
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                                        <p className="text-xs leading-5 text-gray-600">
                                            Al registrar la compra, el stock
                                            del producto se incrementará
                                            automáticamente con las cantidades
                                            ingresadas.
                                        </p>
                                    </div>

                                    {Object.keys(errors).some((key) =>
                                        key.startsWith('items.')
                                    ) && (
                                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                                            <p className="text-sm font-medium text-red-800">
                                                Revisa los productos de la
                                                compra.
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6 space-y-3">
                                        <button
                                            type="submit"
                                            disabled={
                                                processing ||
                                                data.items.length === 0
                                            }
                                            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {processing
                                                ? 'Registrando compra...'
                                                : 'Registrar compra'}
                                        </button>

                                        <Link
                                            href={route('compras.index')}
                                            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}