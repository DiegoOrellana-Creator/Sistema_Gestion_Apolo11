import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ categorias = [], marcas = [] }) {
    const [imagenesPreview, setImagenesPreview] = useState([]);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        transform,
    } = useForm({
        codigo_barra: '',
        nombre: '',
        precio_compra: '',
        precio_venta: '',
        stock_actual: 0,
        stock_minimo: 0,
        categoria_id: '',
        marca_id: '',
        atributos: {},
        variantes: [],
        imagenes: [],
    });

    /*
     * Categoría seleccionada
     */
    const categoriaSeleccionada = useMemo(() => {
        return categorias.find(
            (categoria) =>
                Number(categoria.id_categoria) ===
                Number(data.categoria_id)
        );
    }, [categorias, data.categoria_id]);

    const atributosCategoria =
        categoriaSeleccionada?.atributos ?? [];

    /*
     * Atributos que funcionan como variantes
     */
    const atributosVariantes = useMemo(() => {
        return atributosCategoria.filter(
            (atributo) => atributo.es_variante === true
        );
    }, [atributosCategoria]);

    const tieneVariantes = atributosVariantes.length > 0;

    /*
     * Buscar específicamente el atributo Talla
     */
    const atributoTalla = useMemo(() => {
        return atributosVariantes.find(
            (atributo) =>
                String(atributo.nombre).toLowerCase() === 'talla'
        );
    }, [atributosVariantes]);

    /*
     * Inicializar los atributos cuando cambia la categoría
     */
    useEffect(() => {
        if (!categoriaSeleccionada) {
            setData('atributos', {});
            setData('variantes', []);
            setData('stock_actual', 0);
            return;
        }

        const atributosIniciales = {};

        atributosCategoria.forEach((atributo) => {
            atributosIniciales[atributo.nombre] = '';
        });

        setData('atributos', atributosIniciales);

        /*
         * Si existe Talla como variante, mostramos
         * todas las tallas configuradas en la categoría.
         */
        if (
            atributoTalla &&
            atributoTalla.tipo === 'select' &&
            Array.isArray(atributoTalla.opciones)
        ) {
            const variantesIniciales =
                atributoTalla.opciones.map((opcion) => ({
                    atributos: {
                        [atributoTalla.nombre]: String(opcion),
                    },
                    stock_actual: '',
                    stock_minimo: '',
                }));

            setData('variantes', variantesIniciales);
        } else {
            setData('variantes', []);
        }

        setData('stock_actual', 0);
    }, [data.categoria_id]);

    /*
     * Cambiar atributo normal
     */
    const cambiarAtributo = (nombre, valor) => {
        setData('atributos', {
            ...data.atributos,
            [nombre]: valor,
        });
    };

    /*
     * Cambiar stock de una variante
     */
    const cambiarStockVariante = (indice, campo, valor) => {
        const nuevasVariantes = [...data.variantes];

        nuevasVariantes[indice] = {
            ...nuevasVariantes[indice],
            [campo]: valor,
        };

        setData('variantes', nuevasVariantes);
    };

    /*
     * Cambiar atributo de una variante
     */
    const cambiarAtributoVariante = (
        indice,
        nombreAtributo,
        valor
    ) => {
        const nuevasVariantes = [...data.variantes];

        nuevasVariantes[indice] = {
            ...nuevasVariantes[indice],
            atributos: {
                ...nuevasVariantes[indice].atributos,
                [nombreAtributo]: valor,
            },
        };

        setData('variantes', nuevasVariantes);
    };

    /*
     * Agregar una variante manualmente
     */
    const agregarVariante = () => {
        const atributosIniciales = {};

        atributosVariantes.forEach((atributo) => {
            atributosIniciales[atributo.nombre] = '';
        });

        setData('variantes', [
            ...data.variantes,
            {
                atributos: atributosIniciales,
                stock_actual: '',
                stock_minimo: '',
            },
        ]);
    };

    /*
     * Eliminar una variante
     */
    const eliminarVariante = (indice) => {
        const nuevasVariantes = data.variantes.filter(
            (_, index) => index !== indice
        );

        setData('variantes', nuevasVariantes);
    };

    /*
     * Calcular stock total
     */
    const stockTotalVariantes = useMemo(() => {
        if (!tieneVariantes) {
            return Number(data.stock_actual || 0);
        }

        return data.variantes.reduce(
            (total, variante) =>
                total + Number(variante.stock_actual || 0),
            0
        );
    }, [
        data.stock_actual,
        data.variantes,
        tieneVariantes,
    ]);

    /*
     * Seleccionar imágenes
     */
    const seleccionarImagenes = (event) => {
        const archivos = Array.from(
            event.target.files || []
        );

        if (archivos.length === 0) {
            return;
        }

        const nuevasPreviews = archivos.map((archivo) => ({
            file: archivo,
            url: URL.createObjectURL(archivo),
        }));

        setImagenesPreview((prev) => [
            ...prev,
            ...nuevasPreviews,
        ]);

        setData('imagenes', [
            ...data.imagenes,
            ...archivos,
        ]);

        event.target.value = '';
    };

    /*
     * Eliminar imagen
     */
    const eliminarImagen = (indice) => {
        const imagen = imagenesPreview[indice];

        if (imagen?.url) {
            URL.revokeObjectURL(imagen.url);
        }

        setImagenesPreview((prev) =>
            prev.filter((_, index) => index !== indice)
        );

        setData(
            'imagenes',
            data.imagenes.filter(
                (_, index) => index !== indice
            )
        );
    };

    /*
     * Guardar producto
     */
    const guardar = (event) => {
        event.preventDefault();

        /*
         * Solo enviamos variantes que tengan
         * stock actual o stock mínimo.
         *
         * Ejemplo:
         *
         * 38 -> 2
         * 39 -> 1
         * 40 -> vacío
         * 41 -> 2
         *
         * Solo se guardarán 38, 39 y 41.
         */
        const variantesParaEnviar =
            data.variantes
                .filter((variante) => {
                    const tieneStock =
                        variante.stock_actual !== '' &&
                        variante.stock_actual !== null &&
                        variante.stock_actual !== undefined;

                    const tieneStockMinimo =
                        variante.stock_minimo !== '' &&
                        variante.stock_minimo !== null &&
                        variante.stock_minimo !== undefined;

                    return (
                        tieneStock ||
                        tieneStockMinimo
                    );
                })
                .map((variante) => ({
                    ...variante,

                    stock_actual:
                        variante.stock_actual === '' ||
                        variante.stock_actual === null ||
                        variante.stock_actual === undefined
                            ? 0
                            : Number(
                                  variante.stock_actual
                              ),

                    stock_minimo:
                        variante.stock_minimo === '' ||
                        variante.stock_minimo === null ||
                        variante.stock_minimo === undefined
                            ? 0
                            : Number(
                                  variante.stock_minimo
                              ),
                }));

        /*
         * Usamos transform para asegurarnos de que
         * post() reciba las variantes filtradas.
         */
        transform((formData) => ({
            ...formData,
            variantes: variantesParaEnviar,
        }));

        post(route('productos.store'), {
            forceFormData: true,
            preserveScroll: true,

            onSuccess: () => {
                imagenesPreview.forEach((preview) => {
                    if (preview?.url) {
                        URL.revokeObjectURL(preview.url);
                    }
                });

                reset();
                setImagenesPreview([]);
            },
        });
    };

    /*
     * Obtener error de un atributo
     */
    const obtenerErrorAtributo = (nombre) => {
        return errors[`atributos.${nombre}`];
    };

    /*
     * Obtener error de una variante
     */
    const obtenerErrorVariante = (indice, campo) => {
        return errors[`variantes.${indice}.${campo}`];
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Nuevo producto
                </h2>
            }
        >
            <Head title="Nuevo producto" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Encabezado */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Registrar producto
                            </h1>

                            <p className="mt-1 text-sm text-gray-600">
                                Completa la información del producto.
                            </p>
                        </div>

                        <Link
                            href={route('productos.index')}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                            Volver
                        </Link>
                    </div>

                    {/* Errores generales */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                            <h3 className="font-semibold text-red-800">
                                No se pudo guardar el producto
                            </h3>

                            <div className="mt-2 space-y-1">
                                {Object.entries(errors).map(
                                    ([campo, mensaje]) => (
                                        <p
                                            key={campo}
                                            className="text-sm text-red-700"
                                        >
                                            {mensaje}
                                        </p>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    <form
                        onSubmit={guardar}
                        className="space-y-6"
                    >

                        {/* Información básica */}
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                Información básica
                            </h2>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                {/* Código de barra */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Código de barra
                                    </label>

                                    <input
                                        type="text"
                                        value={data.codigo_barra}
                                        onChange={(e) =>
                                            setData(
                                                'codigo_barra',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300"
                                    />

                                    {errors.codigo_barra && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.codigo_barra}
                                        </p>
                                    )}
                                </div>

                                {/* Nombre */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Nombre *
                                    </label>

                                    <input
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData(
                                                'nombre',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300"
                                        required
                                    />

                                    {errors.nombre && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>

                                {/* Precio compra */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Precio de compra *
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.precio_compra}
                                        onChange={(e) =>
                                            setData(
                                                'precio_compra',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300"
                                        required
                                    />

                                    {errors.precio_compra && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.precio_compra}
                                        </p>
                                    )}
                                </div>

                                {/* Precio venta */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Precio de venta *
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.precio_venta}
                                        onChange={(e) =>
                                            setData(
                                                'precio_venta',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300"
                                        required
                                    />

                                    {errors.precio_venta && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.precio_venta}
                                        </p>
                                    )}
                                </div>

                                {/* Categoría */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Categoría *
                                    </label>

                                    <select
                                        value={data.categoria_id}
                                        onChange={(e) =>
                                            setData(
                                                'categoria_id',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300"
                                        required
                                    >
                                        <option value="">
                                            Seleccionar categoría
                                        </option>

                                        {categorias.map(
                                            (categoria) => (
                                                <option
                                                    key={
                                                        categoria.id_categoria
                                                    }
                                                    value={
                                                        categoria.id_categoria
                                                    }
                                                >
                                                    {
                                                        categoria.nombre
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {errors.categoria_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.categoria_id}
                                        </p>
                                    )}
                                </div>

                                {/* Marca */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Marca *
                                    </label>

                                    <select
                                        value={data.marca_id}
                                        onChange={(e) =>
                                            setData(
                                                'marca_id',
                                                e.target.value
                                            )
                                        }
                                        className="w-full rounded-lg border-gray-300"
                                        required
                                    >
                                        <option value="">
                                            Seleccionar marca
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

                                    {errors.marca_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.marca_id}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Inventario para productos sin variantes */}
                        {!tieneVariantes && (
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                    Inventario
                                </h2>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Stock actual
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                data.stock_actual
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'stock_actual',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300"
                                        />

                                        {errors.stock_actual && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors.stock_actual
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Stock mínimo
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            value={
                                                data.stock_minimo
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'stock_minimo',
                                                    e.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border-gray-300"
                                        />

                                        {errors.stock_minimo && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {
                                                    errors.stock_minimo
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Atributos normales */}
                        {atributosCategoria.filter(
                            (atributo) =>
                                atributo.es_variante !== true
                        ).length > 0 && (
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                                <h2 className="mb-5 text-lg font-semibold text-gray-900">
                                    Características
                                </h2>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    {atributosCategoria
                                        .filter(
                                            (atributo) =>
                                                atributo.es_variante !==
                                                true
                                        )
                                        .map((atributo) => {
                                            const valor =
                                                data.atributos?.[
                                                    atributo.nombre
                                                ] ?? '';

                                            return (
                                                <div
                                                    key={
                                                        atributo.id_categoria_atributo
                                                    }
                                                >
                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                        {
                                                            atributo.nombre
                                                        }

                                                        {atributo.requerido && (
                                                            <span className="text-red-500">
                                                                {' '}
                                                                *
                                                            </span>
                                                        )}
                                                    </label>

                                                    {atributo.tipo ===
                                                        'select' &&
                                                    Array.isArray(
                                                        atributo.opciones
                                                    ) ? (
                                                        <select
                                                            value={
                                                                valor
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                cambiarAtributo(
                                                                    atributo.nombre,
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full rounded-lg border-gray-300"
                                                            required={
                                                                atributo.requerido
                                                            }
                                                        >
                                                            <option value="">
                                                                Seleccionar
                                                            </option>

                                                            {atributo.opciones.map(
                                                                (
                                                                    opcion
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            opcion
                                                                        }
                                                                        value={String(
                                                                            opcion
                                                                        )}
                                                                    >
                                                                        {
                                                                            opcion
                                                                        }
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            type={
                                                                atributo.tipo ===
                                                                'number'
                                                                    ? 'number'
                                                                    : 'text'
                                                            }
                                                            value={
                                                                valor
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                cambiarAtributo(
                                                                    atributo.nombre,
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            className="w-full rounded-lg border-gray-300"
                                                            required={
                                                                atributo.requerido
                                                            }
                                                        />
                                                    )}

                                                    {obtenerErrorAtributo(
                                                        atributo.nombre
                                                    ) && (
                                                        <p className="mt-1 text-sm text-red-600">
                                                            {
                                                                obtenerErrorAtributo(
                                                                    atributo.nombre
                                                                )
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                        {/* Variantes */}
                        {tieneVariantes && (
                            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">

                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            Variantes
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Ingresa únicamente las tallas
                                            que realmente llegaron.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            agregarVariante
                                        }
                                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                                    >
                                        + Agregar variante
                                    </button>
                                </div>

                                {/* Tabla de tallas */}
                                {atributoTalla ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        Talla
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        Stock actual
                                                    </th>

                                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        Stock mínimo
                                                    </th>

                                                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                                                        Acción
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                {data.variantes.map(
                                                    (
                                                        variante,
                                                        indice
                                                    ) => {
                                                        const talla =
                                                            variante
                                                                .atributos?.[
                                                                atributoTalla
                                                                    .nombre
                                                            ] ?? '';

                                                        return (
                                                            <tr
                                                                key={`${talla}-${indice}`}
                                                            >
                                                                <td className="whitespace-nowrap px-4 py-3">
                                                                    <span className="inline-flex min-w-[60px] justify-center rounded-lg bg-gray-100 px-3 py-2 font-semibold text-gray-800">
                                                                        {
                                                                            talla
                                                                        }
                                                                    </span>
                                                                </td>

                                                                <td className="px-4 py-3">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={
                                                                            variante.stock_actual ??
                                                                            ''
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            cambiarStockVariante(
                                                                                indice,
                                                                                'stock_actual',
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="Vacío"
                                                                        className="w-full max-w-[180px] rounded-lg border-gray-300"
                                                                    />

                                                                    {obtenerErrorVariante(
                                                                        indice,
                                                                        'stock_actual'
                                                                    ) && (
                                                                        <p className="mt-1 text-sm text-red-600">
                                                                            {
                                                                                obtenerErrorVariante(
                                                                                    indice,
                                                                                    'stock_actual'
                                                                                )
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </td>

                                                                <td className="px-4 py-3">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={
                                                                            variante.stock_minimo ??
                                                                            ''
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            cambiarStockVariante(
                                                                                indice,
                                                                                'stock_minimo',
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                        placeholder="Vacío"
                                                                        className="w-full max-w-[180px] rounded-lg border-gray-300"
                                                                    />

                                                                    {obtenerErrorVariante(
                                                                        indice,
                                                                        'stock_minimo'
                                                                    ) && (
                                                                        <p className="mt-1 text-sm text-red-600">
                                                                            {
                                                                                obtenerErrorVariante(
                                                                                    indice,
                                                                                    'stock_minimo'
                                                                                )
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </td>

                                                                <td className="px-4 py-3 text-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            eliminarVariante(
                                                                                indice
                                                                            )
                                                                        }
                                                                        className="text-sm font-medium text-red-600 hover:text-red-800"
                                                                    >
                                                                        Quitar
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    /* Otras variantes */
                                    <div className="space-y-4">
                                        {data.variantes.map(
                                            (
                                                variante,
                                                indice
                                            ) => (
                                                <div
                                                    key={
                                                        indice
                                                    }
                                                    className="rounded-lg border border-gray-200 p-4"
                                                >
                                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                                        {atributosVariantes.map(
                                                            (
                                                                atributo
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        atributo.id_categoria_atributo
                                                                    }
                                                                >
                                                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                        {
                                                                            atributo.nombre
                                                                        }
                                                                    </label>

                                                                    {atributo.tipo ===
                                                                        'select' &&
                                                                    Array.isArray(
                                                                        atributo.opciones
                                                                    ) ? (
                                                                        <select
                                                                            value={
                                                                                variante
                                                                                    .atributos?.[
                                                                                    atributo.nombre
                                                                                ] ??
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                cambiarAtributoVariante(
                                                                                    indice,
                                                                                    atributo.nombre,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="w-full rounded-lg border-gray-300"
                                                                        >
                                                                            <option value="">
                                                                                Seleccionar
                                                                            </option>

                                                                            {atributo.opciones.map(
                                                                                (
                                                                                    opcion
                                                                                ) => (
                                                                                    <option
                                                                                        key={
                                                                                            opcion
                                                                                        }
                                                                                        value={String(
                                                                                            opcion
                                                                                        )}
                                                                                    >
                                                                                        {
                                                                                            opcion
                                                                                        }
                                                                                    </option>
                                                                                )
                                                                            )}
                                                                        </select>
                                                                    ) : (
                                                                        <input
                                                                            type={
                                                                                atributo.tipo ===
                                                                                'number'
                                                                                    ? 'number'
                                                                                    : 'text'
                                                                            }
                                                                            value={
                                                                                variante
                                                                                    .atributos?.[
                                                                                    atributo.nombre
                                                                                ] ??
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                cambiarAtributoVariante(
                                                                                    indice,
                                                                                    atributo.nombre,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            className="w-full rounded-lg border-gray-300"
                                                                        />
                                                                    )}
                                                                </div>
                                                            )
                                                        )}

                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                Stock actual
                                                            </label>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={
                                                                    variante.stock_actual ??
                                                                    ''
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    cambiarStockVariante(
                                                                        indice,
                                                                        'stock_actual',
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Vacío"
                                                                className="w-full rounded-lg border-gray-300"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                                Stock mínimo
                                                            </label>

                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={
                                                                    variante.stock_minimo ??
                                                                    ''
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    cambiarStockVariante(
                                                                        indice,
                                                                        'stock_minimo',
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                placeholder="Vacío"
                                                                className="w-full rounded-lg border-gray-300"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                eliminarVariante(
                                                                    indice
                                                                )
                                                            }
                                                            className="text-sm font-medium text-red-600 hover:text-red-800"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}

                                {/* Stock total */}
                                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-700">
                                            Stock total
                                        </span>

                                        <span className="text-xl font-bold text-gray-900">
                                            {
                                                stockTotalVariantes
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Imágenes */}
                        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                            <h2 className="mb-2 text-lg font-semibold text-gray-900">
                                Imágenes
                            </h2>

                            <p className="mb-5 text-sm text-gray-600">
                                Puedes seleccionar varias imágenes.
                            </p>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={
                                    seleccionarImagenes
                                }
                                className="block w-full text-sm text-gray-600"
                            />

                            {imagenesPreview.length > 0 && (
                                <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                    {imagenesPreview.map(
                                        (
                                            imagen,
                                            indice
                                        ) => (
                                            <div
                                                key={
                                                    indice
                                                }
                                                className="relative overflow-hidden rounded-lg border border-gray-200"
                                            >
                                                <img
                                                    src={
                                                        imagen.url
                                                    }
                                                    alt={`Imagen ${
                                                        indice +
                                                        1
                                                    }`}
                                                    className="h-32 w-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        eliminarImagen(
                                                            indice
                                                        )
                                                    }
                                                    className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end gap-3">
                            <Link
                                href={route(
                                    'productos.index'
                                )}
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Guardando...'
                                    : 'Guardar producto'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}