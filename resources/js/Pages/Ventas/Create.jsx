import React, { useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({
    productos = [],
    metodosPago = [],
}) {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        metodo_pago_id: '',
        descuento: 0,
        items: [],
    });

    const [busqueda, setBusqueda] = useState('');
    const [productoSeleccionado, setProductoSeleccionado] = useState('');
    const [varianteSeleccionada, setVarianteSeleccionada] = useState('');
    const [cantidad, setCantidad] = useState(1);

    const productoActual = useMemo(() => {
        return productos.find(
            producto =>
                Number(producto.id_producto) ===
                Number(productoSeleccionado)
        );
    }, [productos, productoSeleccionado]);

    const productosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        if (!texto) {
            return productos;
        }

        return productos.filter(producto => {
            return (
                producto.nombre?.toLowerCase().includes(texto) ||
                producto.codigo_barra
                    ?.toLowerCase()
                    .includes(texto)
            );
        });
    }, [productos, busqueda]);

    const subtotal = useMemo(() => {
        return data.items.reduce((total, item) => {
            return total +
                Number(item.precio_unitario) *
                Number(item.cantidad);
        }, 0);
    }, [data.items]);

    const descuento = Math.max(
        0,
        Number(data.descuento) || 0
    );

    const total = Math.max(
        0,
        subtotal - descuento
    );

    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto.id_producto);
        setVarianteSeleccionada('');

        const tieneVariantes =
            producto.variantes?.length > 0;

        if (!tieneVariantes && producto.stock_actual <= 0) {
            return;
        }
    };

    const agregarProducto = () => {
        if (!productoActual) {
            return;
        }

        const cantidadNumero = Number(cantidad);

        if (
            !Number.isInteger(cantidadNumero) ||
            cantidadNumero <= 0
        ) {
            return;
        }

        const tieneVariantes =
            productoActual.variantes?.length > 0;

        if (tieneVariantes && !varianteSeleccionada) {
            return;
        }

        let variante = null;

        if (tieneVariantes) {
            variante = productoActual.variantes.find(
                item =>
                    Number(item.id_producto_variante) ===
                    Number(varianteSeleccionada)
            );

            if (!variante) {
                return;
            }

            if (variante.stock_actual < cantidadNumero) {
                alert('No hay suficiente stock para esta variante.');
                return;
            }
        } else {

            if (productoActual.stock_actual < cantidadNumero) {
                alert('No hay suficiente stock.');
                return;
            }
        }

        const precio = Number(
            productoActual.precio_venta
        );

        const itemExistente = data.items.find(
            item =>
                Number(item.producto_id) ===
                    Number(productoActual.id_producto) &&
                Number(item.producto_variante_id || 0) ===
                    Number(variante?.id_producto_variante || 0)
        );

        if (itemExistente) {
            const itemsActualizados = data.items.map(item => {

                if (
                    Number(item.producto_id) ===
                        Number(productoActual.id_producto) &&
                    Number(item.producto_variante_id || 0) ===
                        Number(variante?.id_producto_variante || 0)
                ) {
                    return {
                        ...item,
                        cantidad:
                            Number(item.cantidad) +
                            cantidadNumero,
                    };
                }

                return item;
            });

            setData('items', itemsActualizados);
        } else {

            setData('items', [
                ...data.items,
                {
                    producto_id:
                        productoActual.id_producto,

                    producto_variante_id:
                        variante?.id_producto_variante || null,

                    nombre:
                        productoActual.nombre,

                    variante:
                        variante?.atributos || null,

                    cantidad:
                        cantidadNumero,

                    precio_unitario:
                        precio,

                    stock_disponible:
                        variante
                            ? variante.stock_actual
                            : productoActual.stock_actual,
                },
            ]);
        }

        setProductoSeleccionado('');
        setVarianteSeleccionada('');
        setCantidad(1);
    };

    const actualizarCantidad = (
        index,
        nuevaCantidad
    ) => {
        const cantidadNumero = Number(nuevaCantidad);

        if (
            !Number.isInteger(cantidadNumero) ||
            cantidadNumero <= 0
        ) {
            return;
        }

        const items = [...data.items];

        const item = items[index];

        if (
            cantidadNumero >
            Number(item.stock_disponible)
        ) {
            return;
        }

        items[index] = {
            ...item,
            cantidad: cantidadNumero,
        };

        setData('items', items);
    };

    const eliminarItem = (index) => {
        const items = [...data.items];

        items.splice(index, 1);

        setData('items', items);
    };

    const guardar = (e) => {
        e.preventDefault();

        post(route('ventas.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Nueva venta
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Registra una nueva venta.
                    </p>
                </div>
            }
        >
            <Head title="Nueva venta" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Nueva venta
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Agrega los productos y confirma el pago.
                            </p>
                        </div>

                        <Link
                            href={route('ventas.index')}
                            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
                        >
                            Volver
                        </Link>
                    </div>

                    {errors.general && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errors.general}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                        {/* PRODUCTOS */}
                        <div className="lg:col-span-2">

                            <div className="rounded-xl border bg-white p-6 shadow-sm">

                                <h2 className="mb-4 text-lg font-semibold">
                                    Agregar productos
                                </h2>

                                <div className="mb-4">
                                    <label className="mb-1 block text-sm font-medium">
                                        Buscar producto
                                    </label>

                                    <input
                                        type="text"
                                        value={busqueda}
                                        onChange={e =>
                                            setBusqueda(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nombre o código de barras..."
                                        className="w-full rounded-lg border px-3 py-2"
                                    />
                                </div>

                                <div className="max-h-64 overflow-y-auto rounded-lg border">

                                    {productosFiltrados.length === 0 ? (
                                        <div className="p-6 text-center text-sm text-gray-500">
                                            No se encontraron productos.
                                        </div>
                                    ) : (
                                        productosFiltrados.map(
                                            producto => (
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
                                                    className={`flex w-full items-center justify-between border-b px-4 py-3 text-left last:border-b-0 hover:bg-gray-50 ${
                                                        Number(
                                                            productoSeleccionado
                                                        ) ===
                                                        Number(
                                                            producto.id_producto
                                                        )
                                                            ? 'bg-gray-100'
                                                            : ''
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {
                                                                producto.nombre
                                                            }
                                                        </div>

                                                        <div className="text-xs text-gray-500">
                                                            {producto.codigo_barra ||
                                                                'Sin código'}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="font-semibold">
                                                            Bs. {Number(
                                                                producto.precio_venta
                                                            ).toFixed(2)}
                                                        </div>

                                                        <div className="text-xs text-gray-500">
                                                            Stock:{' '}
                                                            {
                                                                producto.stock_actual
                                                            }
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        )
                                    )}

                                </div>

                                {productoActual && (
                                    <div className="mt-5 rounded-lg border bg-gray-50 p-4">

                                        <div className="mb-4">
                                            <div className="font-semibold">
                                                {productoActual.nombre}
                                            </div>

                                            <div className="text-sm text-gray-500">
                                                Bs. {Number(
                                                    productoActual.precio_venta
                                                ).toFixed(2)}
                                            </div>
                                        </div>

                                        {productoActual.variantes?.length > 0 && (
                                            <div className="mb-4">
                                                <label className="mb-1 block text-sm font-medium">
                                                    Variante
                                                </label>

                                                <select
                                                    value={
                                                        varianteSeleccionada
                                                    }
                                                    onChange={e =>
                                                        setVarianteSeleccionada(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border px-3 py-2"
                                                >
                                                    <option value="">
                                                        Seleccionar variante
                                                    </option>

                                                    {productoActual.variantes.map(
                                                        variante => (
                                                            <option
                                                                key={
                                                                    variante.id_producto_variante
                                                                }
                                                                value={
                                                                    variante.id_producto_variante
                                                                }
                                                            >
                                                                {Object.entries(
                                                                    variante.atributos ||
                                                                    {}
                                                                )
                                                                    .map(
                                                                        ([clave, valor]) =>
                                                                            `${clave}: ${valor}`
                                                                    )
                                                                    .join(
                                                                        ' · '
                                                                    )}{' '}
                                                                — Stock:{' '}
                                                                {
                                                                    variante.stock_actual
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </div>
                                        )}

                                        <div className="flex items-end gap-3">

                                            <div className="flex-1">
                                                <label className="mb-1 block text-sm font-medium">
                                                    Cantidad
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={cantidad}
                                                    onChange={e =>
                                                        setCantidad(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full rounded-lg border px-3 py-2"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={agregarProducto}
                                                className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
                                            >
                                                Agregar
                                            </button>

                                        </div>

                                    </div>
                                )}

                            </div>

                            {/* CARRITO */}
                            <div className="mt-6 rounded-xl border bg-white shadow-sm">

                                <div className="border-b px-6 py-4">
                                    <h2 className="text-lg font-semibold">
                                        Productos de la venta
                                    </h2>
                                </div>

                                {data.items.length === 0 ? (
                                    <div className="p-10 text-center text-gray-500">
                                        No hay productos agregados.
                                    </div>
                                ) : (
                                    <div className="divide-y">

                                        {data.items.map(
                                            (item, index) => (
                                                <div
                                                    key={`${item.producto_id}-${item.producto_variante_id || 0}`}
                                                    className="flex items-center justify-between gap-4 px-6 py-4"
                                                >
                                                    <div className="min-w-0 flex-1">

                                                        <div className="font-medium">
                                                            {item.nombre}
                                                        </div>

                                                        {item.variante && (
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                {Object.entries(
                                                                    item.variante
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

                                                        <div className="mt-1 text-sm text-gray-500">
                                                            Bs. {Number(
                                                                item.precio_unitario
                                                            ).toFixed(2)}{' '}
                                                            c/u
                                                        </div>

                                                    </div>

                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            item.stock_disponible
                                                        }
                                                        value={
                                                            item.cantidad
                                                        }
                                                        onChange={e =>
                                                            actualizarCantidad(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-20 rounded-lg border px-2 py-2 text-center"
                                                    />

                                                    <div className="w-28 text-right font-semibold">
                                                        Bs. {(
                                                            Number(
                                                                item.precio_unitario
                                                            ) *
                                                            Number(
                                                                item.cantidad
                                                            )
                                                        ).toFixed(2)}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            eliminarItem(
                                                                index
                                                            )
                                                        }
                                                        className="text-sm text-red-600 hover:underline"
                                                    >
                                                        Quitar
                                                    </button>

                                                </div>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>

                        </div>

                        {/* RESUMEN */}
                        <div>

                            <div className="sticky top-6 rounded-xl border bg-white p-6 shadow-sm">

                                <h2 className="mb-5 text-lg font-semibold">
                                    Resumen
                                </h2>

                                <div className="space-y-3 text-sm">

                                    <div className="flex justify-between">
                                        <span className="text-gray-500">
                                            Subtotal
                                        </span>

                                        <span className="font-medium">
                                            Bs. {subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Descuento
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                data.descuento
                                            }
                                            onChange={e =>
                                                setData(
                                                    'descuento',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border px-3 py-2"
                                        />
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold">
                                                Total
                                            </span>

                                            <span className="text-2xl font-bold">
                                                Bs. {total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <div className="mt-6">

                                    <label className="mb-2 block text-sm font-medium">
                                        Método de pago
                                    </label>

                                    <div className="grid grid-cols-1 gap-2">
                                        {metodosPago.map(
                                            metodo => (
                                                <button
                                                    type="button"
                                                    key={
                                                        metodo.id_metodo_pago
                                                    }
                                                    onClick={() =>
                                                        setData(
                                                            'metodo_pago_id',
                                                            metodo.id_metodo_pago
                                                        )
                                                    }
                                                    className={`rounded-lg border px-4 py-3 text-left text-sm ${
                                                        Number(
                                                            data.metodo_pago_id
                                                        ) ===
                                                        Number(
                                                            metodo.id_metodo_pago
                                                        )
                                                            ? 'border-black bg-gray-100 font-semibold'
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {metodo.nombre}
                                                </button>
                                            )
                                        )}
                                    </div>

                                </div>

                                {errors.metodo_pago_id && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.metodo_pago_id}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    disabled={
                                        processing ||
                                        data.items.length === 0 ||
                                        !data.metodo_pago_id
                                    }
                                    onClick={guardar}
                                    className="mt-6 w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Registrando...'
                                        : 'Confirmar venta'}
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}