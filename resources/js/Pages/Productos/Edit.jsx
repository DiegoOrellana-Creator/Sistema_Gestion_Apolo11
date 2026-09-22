import React, { useEffect, useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({
    producto,
    categorias,
    marcas,
}) {

    const [imagenesExistentes, setImagenesExistentes] =
        useState(producto.imagenes || []);

    const [previews, setPreviews] = useState([]);

    const [mensajeImagen, setMensajeImagen] =
        useState('');

    const variantesIniciales =
        (producto.variantes || []).map((variante) => ({
            id_producto_variante:
                variante.id_producto_variante,

            atributos:
                variante.atributos || {},

            stock_actual:
                Number(variante.stock_actual || 0),

            stock_minimo:
                Number(variante.stock_minimo || 0),
        }));

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        _method: 'put',

        codigo_barra:
            producto.codigo_barra || '',

        nombre:
            producto.nombre || '',

        precio_compra:
            producto.precio_compra || '',

        precio_venta:
            producto.precio_venta || '',

        stock_actual:
            Number(producto.stock_actual || 0),

        stock_minimo:
            Number(producto.stock_minimo || 0),

        categoria_id:
            producto.categoria_id || '',

        marca_id:
            producto.marca_id || '',

        atributos:
            producto.atributos || {},

        variantes:
            variantesIniciales,

        imagenes: [],

        eliminar_imagenes: [],
    });

    /*
    |--------------------------------------------------------------------------
    | Categoría
    |--------------------------------------------------------------------------
    */

    const categoriaSeleccionada = useMemo(() => {

        return categorias.find(
            (categoria) =>
                Number(categoria.id_categoria) ===
                Number(data.categoria_id)
        );

    }, [
        categorias,
        data.categoria_id,
    ]);

    const atributosCategoria =
        categoriaSeleccionada?.atributos || [];

    const atributosVariantes =
        atributosCategoria.filter(
            (atributo) =>
                atributo.es_variante === true ||
                atributo.es_variante === 1
        );

    const atributosNormales =
        atributosCategoria.filter(
            (atributo) =>
                !(
                    atributo.es_variante === true ||
                    atributo.es_variante === 1
                )
        );

    /*
    |--------------------------------------------------------------------------
    | Si cambia categoría
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (!data.categoria_id) {
            return;
        }

        const atributosActuales = {
            ...data.atributos,
        };

        atributosNormales.forEach((atributo) => {

            if (
                atributosActuales[atributo.nombre] ===
                undefined
            ) {
                atributosActuales[
                    atributo.nombre
                ] = '';
            }
        });

        setData(
            'atributos',
            atributosActuales
        );

    }, [data.categoria_id]);

    /*
    |--------------------------------------------------------------------------
    | Atributos normales
    |--------------------------------------------------------------------------
    */

    const actualizarAtributo = (
        nombre,
        valor
    ) => {

        setData('atributos', {
            ...data.atributos,
            [nombre]: valor,
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Variantes
    |--------------------------------------------------------------------------
    */

    const agregarVariante = () => {

        const atributos = {};

        atributosVariantes.forEach(
            (atributo) => {

                atributos[
                    atributo.nombre
                ] = '';

            }
        );

        setData('variantes', [
            ...data.variantes,
            {
                atributos,
                stock_actual: 0,
                stock_minimo: 0,
            },
        ]);
    };

    const eliminarVariante = (index) => {

        const variantes = [
            ...data.variantes,
        ];

        variantes.splice(index, 1);

        setData(
            'variantes',
            variantes
        );
    };

    const actualizarVarianteAtributo = (
        index,
        nombre,
        valor
    ) => {

        const variantes = [
            ...data.variantes,
        ];

        variantes[index] = {
            ...variantes[index],

            atributos: {
                ...variantes[index]
                    .atributos,

                [nombre]: valor,
            },
        };

        setData(
            'variantes',
            variantes
        );
    };

    const actualizarStockVariante = (
        index,
        valor
    ) => {

        const variantes = [
            ...data.variantes,
        ];

        variantes[index] = {
            ...variantes[index],

            stock_actual:
                Math.max(
                    0,
                    Number(valor || 0)
                ),
        };

        setData(
            'variantes',
            variantes
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Stock total
    |--------------------------------------------------------------------------
    */

    const stockTotalVariantes =
        useMemo(() => {

            return data.variantes.reduce(
                (total, variante) =>
                    total +
                    Number(
                        variante.stock_actual || 0
                    ),
                0
            );

        }, [data.variantes]);

    /*
    |--------------------------------------------------------------------------
    | Imágenes nuevas
    |--------------------------------------------------------------------------
    */

    const seleccionarImagenes = (
        event
    ) => {

        const archivos =
            Array.from(
                event.target.files || []
            );

        if (archivos.length === 0) {
            return;
        }

        const disponibles =
            10 -
            imagenesExistentes.length;

        const seleccionadas =
            archivos.slice(
                0,
                Math.max(
                    disponibles,
                    0
                )
            );

        if (
            archivos.length >
            seleccionadas.length
        ) {
            setMensajeImagen(
                'Solo puedes tener hasta 10 imágenes.'
            );
        } else {
            setMensajeImagen('');
        }

        previews.forEach(
            (preview) =>
                URL.revokeObjectURL(
                    preview.url
                )
        );

        const nuevasPreviews =
            seleccionadas.map(
                (archivo) => ({
                    archivo,
                    url: URL.createObjectURL(
                        archivo
                    ),
                })
            );

        setPreviews(
            nuevasPreviews
        );

        setData(
            'imagenes',
            seleccionadas
        );
    };

    const quitarImagenNueva = (
        index
    ) => {

        const nuevas =
            [...previews];

        const eliminada =
            nuevas[index];

        if (eliminada) {
            URL.revokeObjectURL(
                eliminada.url
            );
        }

        nuevas.splice(
            index,
            1
        );

        setPreviews(
            nuevas
        );

        setData(
            'imagenes',
            nuevas.map(
                (item) =>
                    item.archivo
            )
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Eliminar imagen existente
    |--------------------------------------------------------------------------
    */

    const eliminarImagenExistente =
        (id) => {

            if (
                !confirm(
                    '¿Eliminar esta imagen del producto?'
                )
            ) {
                return;
            }

            setImagenesExistentes(
                (actuales) =>
                    actuales.filter(
                        (imagen) =>
                            Number(
                                imagen.id_producto_imagen
                            ) !== Number(id)
                    )
            );

            setData(
                'eliminar_imagenes',
                [
                    ...data.eliminar_imagenes,
                    id,
                ]
            );
        };

    /*
    |--------------------------------------------------------------------------
    | Guardar
    |--------------------------------------------------------------------------
    */

    const guardar = (
        event
    ) => {

        event.preventDefault();

        post(
            route(
                'productos.update',
                producto.id_producto
            ),
            {
                forceFormData: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Editar producto
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Modifica la información e inventario
                    </p>
                </div>
            }
        >

            <Head
                title={`Editar ${producto.nombre}`}
            />

            <div className="mx-auto max-w-7xl p-6">

                {/* ENCABEZADO */}

                <div className="mb-6 flex items-center justify-between">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Editar producto
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            {producto.nombre}
                        </p>
                    </div>

                    <Link
                        href={route(
                            'productos.index'
                        )}
                        className="rounded-lg border px-4 py-2 hover:bg-gray-50"
                    >
                        Volver
                    </Link>

                </div>

                {/* ERROR GENERAL */}

                {errors.general && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {errors.general}
                    </div>
                )}

                <form
                    onSubmit={guardar}
                    encType="multipart/form-data"
                    className="space-y-6"
                >

                    {/* INFORMACIÓN GENERAL */}

                    <section className="rounded-xl border bg-white p-6 shadow-sm">

                        <h2 className="mb-5 text-lg font-semibold">
                            Información general
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Nombre */}

                            <div>

                                <label className="mb-1 block text-sm font-medium">
                                    Nombre
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
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                                {errors.nombre && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.nombre}
                                    </p>
                                )}

                            </div>

                            {/* Código */}

                            <div>

                                <label className="mb-1 block text-sm font-medium">
                                    Código de barras
                                </label>

                                <input
                                    type="text"
                                    value={
                                        data.codigo_barra
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'codigo_barra',
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                                {errors.codigo_barra && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {
                                            errors.codigo_barra
                                        }
                                    </p>
                                )}

                            </div>

                            {/* Categoría */}

                            <div>

                                <label className="mb-1 block text-sm font-medium">
                                    Categoría
                                </label>

                                <select
                                    value={
                                        data.categoria_id
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'categoria_id',
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2"
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

                            </div>

                            {/* Marca */}

                            <div>

                                <label className="mb-1 block text-sm font-medium">
                                    Marca
                                </label>

                                <select
                                    value={
                                        data.marca_id
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'marca_id',
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2"
                                >

                                    <option value="">
                                        Seleccionar marca
                                    </option>

                                    {marcas.map(
                                        (marca) => (
                                            <option
                                                key={
                                                    marca.id_marca
                                                }
                                                value={
                                                    marca.id_marca
                                                }
                                            >
                                                {
                                                    marca.nombre
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* Compra */}

                            <div>

                                <label className="mb-1 block text-sm font-medium">
                                    Precio de compra
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        data.precio_compra
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'precio_compra',
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                            </div>

                            {/* Venta */}

                            <div>

                                <label className="mb-1 block text-sm font-medium">
                                    Precio de venta
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        data.precio_venta
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'precio_venta',
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                            </div>

                            {/* Stock mínimo */}

                            <div>

                                <label className="mb-1 block text-sm font-medium">
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
                                    className="w-full rounded-lg border px-3 py-2"
                                />

                            </div>

                            {/* Stock general */}

                            {atributosVariantes.length ===
                                0 && (

                                <div>

                                    <label className="mb-1 block text-sm font-medium">
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
                                        className="w-full rounded-lg border px-3 py-2"
                                    />

                                </div>
                            )}

                        </div>

                    </section>

                    {/* ATRIBUTOS */}

                    {atributosNormales.length >
                        0 && (

                        <section className="rounded-xl border bg-white p-6 shadow-sm">

                            <h2 className="mb-5 text-lg font-semibold">
                                Características
                            </h2>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                {atributosNormales.map(
                                    (atributo) => {

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

                                                <label className="mb-1 block text-sm font-medium">

                                                    {
                                                        atributo.nombre
                                                    }

                                                    {atributo.requerido && (
                                                        <span className="text-red-500">
                                                            {' '}*
                                                        </span>
                                                    )}

                                                </label>

                                                {atributo.tipo ===
                                                'select' ? (

                                                    <select
                                                        value={
                                                            valor
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            actualizarAtributo(
                                                                atributo.nombre,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-lg border px-3 py-2"
                                                    >

                                                        <option value="">
                                                            Seleccionar
                                                        </option>

                                                        {(
                                                            atributo.opciones ||
                                                            []
                                                        ).map(
                                                            (
                                                                opcion
                                                            ) => (
                                                                <option
                                                                    key={
                                                                        opcion
                                                                    }
                                                                    value={
                                                                        opcion
                                                                    }
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
                                                            actualizarAtributo(
                                                                atributo.nombre,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-lg border px-3 py-2"
                                                    />

                                                )}

                                                {errors[
                                                    `atributos.${atributo.nombre}`
                                                ] && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors[
                                                                `atributos.${atributo.nombre}`
                                                            ]
                                                        }
                                                    </p>
                                                )}

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </section>
                    )}

                    {/* VARIANTES */}

                    {atributosVariantes.length >
                        0 && (

                        <section className="rounded-xl border bg-white p-6 shadow-sm">

                            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">

                                <div>
                                    <h2 className="text-lg font-semibold">
                                        Tallas e inventario
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Registra el stock de cada talla.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        agregarVariante
                                    }
                                    className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
                                >
                                    + Agregar talla
                                </button>

                            </div>

                            {data.variantes.length ===
                            0 ? (

                                <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
                                    No hay tallas registradas.
                                </div>

                            ) : (

                                <div className="space-y-3">

                                    {data.variantes.map(
                                        (
                                            variante,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    variante.id_producto_variante ||
                                                    `nueva-${index}`
                                                }
                                                className="rounded-lg border p-4"
                                            >

                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                                                    {atributosVariantes.map(
                                                        (
                                                            atributo
                                                        ) => (

                                                            <div
                                                                key={
                                                                    atributo.id_categoria_atributo
                                                                }
                                                            >

                                                                <label className="mb-1 block text-sm font-medium">
                                                                    {
                                                                        atributo.nombre
                                                                    }
                                                                </label>

                                                                {atributo.tipo ===
                                                                'select' ? (

                                                                    <select
                                                                        value={
                                                                            variante.atributos?.[
                                                                                atributo.nombre
                                                                            ] ||
                                                                            ''
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            actualizarVarianteAtributo(
                                                                                index,
                                                                                atributo.nombre,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="w-full rounded-lg border px-3 py-2"
                                                                    >

                                                                        <option value="">
                                                                            Seleccionar
                                                                        </option>

                                                                        {(
                                                                            atributo.opciones ||
                                                                            []
                                                                        ).map(
                                                                            (
                                                                                opcion
                                                                            ) => (
                                                                                <option
                                                                                    key={
                                                                                        opcion
                                                                                    }
                                                                                    value={
                                                                                        opcion
                                                                                    }
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
                                                                        type="text"
                                                                        value={
                                                                            variante.atributos?.[
                                                                                atributo.nombre
                                                                            ] ||
                                                                            ''
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            actualizarVarianteAtributo(
                                                                                index,
                                                                                atributo.nombre,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="w-full rounded-lg border px-3 py-2"
                                                                    />

                                                                )}

                                                            </div>
                                                        )
                                                    )}

                                                    <div>

                                                        <label className="mb-1 block text-sm font-medium">
                                                            Stock
                                                        </label>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                variante.stock_actual
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                actualizarStockVariante(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-full rounded-lg border px-3 py-2"
                                                        />

                                                    </div>

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        eliminarVariante(
                                                            index
                                                        )
                                                    }
                                                    className="mt-3 text-sm text-red-600 hover:underline"
                                                >
                                                    Eliminar talla
                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                            <div className="mt-5 rounded-lg bg-gray-50 p-4">

                                <div className="flex items-center justify-between">

                                    <span className="font-medium">
                                        Stock total
                                    </span>

                                    <span className="text-xl font-bold">
                                        {
                                            stockTotalVariantes
                                        }
                                    </span>

                                </div>

                            </div>

                        </section>
                    )}

                    {/* IMÁGENES */}

                    <section className="rounded-xl border bg-white p-6 shadow-sm">

                        <h2 className="mb-2 text-lg font-semibold">
                            Imágenes
                        </h2>

                        <p className="mb-5 text-sm text-gray-500">
                            JPG, PNG o WEBP. Máximo 5 MB por imagen.
                        </p>

                        {/* EXISTENTES */}

                        {imagenesExistentes.length >
                            0 && (

                            <div className="mb-6">

                                <h3 className="mb-3 text-sm font-medium">
                                    Imágenes actuales
                                </h3>

                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                                    {imagenesExistentes.map(
                                        (imagen) => (

                                            <div
                                                key={
                                                    imagen.id_producto_imagen
                                                }
                                                className="relative overflow-hidden rounded-lg border"
                                            >

                                                <img
                                                    src={
                                                        imagen.url
                                                    }
                                                    alt={
                                                        producto.nombre
                                                    }
                                                    className="h-32 w-full object-cover"
                                                />

                                                {imagen.principal && (
                                                    <span className="absolute left-2 top-2 rounded bg-black px-2 py-1 text-xs text-white">
                                                        Principal
                                                    </span>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        eliminarImagenExistente(
                                                            imagen.id_producto_imagen
                                                        )
                                                    }
                                                    className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs text-white"
                                                >
                                                    Eliminar
                                                </button>

                                            </div>
                                        )
                                    )}

                                </div>

                            </div>
                        )}

                        {/* NUEVAS */}

                        <div>

                            <label className="mb-2 block text-sm font-medium">
                                Agregar imágenes
                            </label>

                            <input
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp"
                                onChange={
                                    seleccionarImagenes
                                }
                                className="w-full rounded-lg border p-2"
                            />

                            {mensajeImagen && (
                                <p className="mt-2 text-sm text-orange-600">
                                    {
                                        mensajeImagen
                                    }
                                </p>
                            )}

                        </div>

                        {previews.length > 0 && (

                            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">

                                {previews.map(
                                    (
                                        preview,
                                        index
                                    ) => (

                                        <div
                                            key={
                                                preview.url
                                            }
                                            className="relative overflow-hidden rounded-lg border"
                                        >

                                            <img
                                                src={
                                                    preview.url
                                                }
                                                alt="Nueva imagen"
                                                className="h-32 w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    quitarImagenNueva(
                                                        index
                                                    )
                                                }
                                                className="absolute right-2 top-2 rounded bg-red-600 px-2 py-1 text-xs text-white"
                                            >
                                                Quitar
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </section>

                    {/* BOTONES */}

                    <div className="flex items-center justify-end gap-3">

                        <Link
                            href={route(
                                'productos.index'
                            )}
                            className="rounded-lg border px-5 py-2.5 hover:bg-gray-50"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-black px-6 py-2.5 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing
                                ? 'Guardando...'
                                : 'Guardar cambios'}
                        </button>

                    </div>

                </form>

            </div>

        </AuthenticatedLayout>
    );
}