import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ marcas }) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        contacto: '',
        telefono: '',
        correo: '',
        direccion: '',
        ciudad: '',
        nit: '',
        descripcion: '',
        activo: true,
        marcas: [],
    });

    const toggleMarca = (idMarca) => {
        const id = Number(idMarca);

        if (data.marcas.includes(id)) {
            setData(
                'marcas',
                data.marcas.filter((idActual) => idActual !== id)
            );
        } else {
            setData(
                'marcas',
                [...data.marcas, id]
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('proveedores.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Nuevo proveedor
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Registra los datos del proveedor y las marcas que maneja.
                    </p>
                </div>
            }
        >
            <Head title="Nuevo proveedor" />

            <form
                onSubmit={submit}
                className="mx-auto max-w-5xl space-y-6"
            >

                {/* ===================================================== */}
                {/* DATOS PRINCIPALES */}
                {/* ===================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h3 className="text-base font-semibold text-gray-900">
                        Información del proveedor
                    </h3>

                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div className="md:col-span-2">

                            <label className="block text-sm font-medium text-gray-700">
                                Nombre del proveedor *
                            </label>

                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) =>
                                    setData('nombre', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ej. Comercial ABC"
                            />

                            {errors.nombre && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.nombre}
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Persona de contacto
                            </label>

                            <input
                                type="text"
                                value={data.contacto}
                                onChange={(e) =>
                                    setData('contacto', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Nombre del contacto"
                            />

                            {errors.contacto && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.contacto}
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Teléfono
                            </label>

                            <input
                                type="text"
                                value={data.telefono}
                                onChange={(e) =>
                                    setData('telefono', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ej. 70000000"
                            />

                            {errors.telefono && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.telefono}
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Correo electrónico
                            </label>

                            <input
                                type="email"
                                value={data.correo}
                                onChange={(e) =>
                                    setData('correo', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="proveedor@correo.com"
                            />

                            {errors.correo && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.correo}
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                NIT
                            </label>

                            <input
                                type="text"
                                value={data.nit}
                                onChange={(e) =>
                                    setData('nit', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="NIT"
                            />

                            {errors.nit && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.nit}
                                </p>
                            )}

                        </div>

                        <div>

                            <label className="block text-sm font-medium text-gray-700">
                                Ciudad
                            </label>

                            <input
                                type="text"
                                value={data.ciudad}
                                onChange={(e) =>
                                    setData('ciudad', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ej. Santa Cruz de la Sierra"
                            />

                            {errors.ciudad && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.ciudad}
                                </p>
                            )}

                        </div>

                        <div className="md:col-span-2">

                            <label className="block text-sm font-medium text-gray-700">
                                Dirección
                            </label>

                            <input
                                type="text"
                                value={data.direccion}
                                onChange={(e) =>
                                    setData('direccion', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Dirección física"
                            />

                            {errors.direccion && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.direccion}
                                </p>
                            )}

                        </div>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* MARCAS */}
                {/* ===================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <div>
                        <h3 className="text-base font-semibold text-gray-900">
                            Marcas que maneja
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Puedes seleccionar una o varias marcas.
                        </p>
                    </div>

                    {marcas.length === 0 ? (

                        <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                            No hay marcas registradas.
                        </div>

                    ) : (

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">

                            {marcas.map((marca) => {

                                const seleccionada =
                                    data.marcas.includes(
                                        marca.id_marca
                                    );

                                return (
                                    <label
                                        key={marca.id_marca}
                                        className={`flex cursor-pointer items-center rounded-lg border p-3 transition ${
                                            seleccionada
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >

                                        <input
                                            type="checkbox"
                                            checked={seleccionada}
                                            onChange={() =>
                                                toggleMarca(marca.id_marca)
                                            }
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />

                                        <span className="ml-3 text-sm font-medium text-gray-800">
                                            {marca.nombre}
                                        </span>

                                    </label>
                                );
                            })}

                        </div>
                    )}

                    {errors.marcas && (
                        <p className="mt-3 text-sm text-red-600">
                            {errors.marcas}
                        </p>
                    )}

                </div>

                {/* ===================================================== */}
                {/* DESCRIPCIÓN Y ESTADO */}
                {/* ===================================================== */}

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                    <h3 className="text-base font-semibold text-gray-900">
                        Información adicional
                    </h3>

                    <div className="mt-5">

                        <label className="block text-sm font-medium text-gray-700">
                            Descripción
                        </label>

                        <textarea
                            rows="4"
                            value={data.descripcion}
                            onChange={(e) =>
                                setData('descripcion', e.target.value)
                            }
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Observaciones sobre el proveedor..."
                        />

                        {errors.descripcion && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.descripcion}
                            </p>
                        )}

                    </div>

                    <label className="mt-5 flex items-center">

                        <input
                            type="checkbox"
                            checked={data.activo}
                            onChange={(e) =>
                                setData('activo', e.target.checked)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />

                        <span className="ml-3 text-sm font-medium text-gray-700">
                            Proveedor activo
                        </span>

                    </label>

                </div>

                {/* ===================================================== */}
                {/* BOTONES */}
                {/* ===================================================== */}

                <div className="flex items-center justify-end gap-3">

                    <Link
                        href={route('proveedores.index')}
                        className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing
                            ? 'Guardando...'
                            : 'Guardar proveedor'}
                    </button>

                </div>

            </form>
        </AuthenticatedLayout>
    );
}