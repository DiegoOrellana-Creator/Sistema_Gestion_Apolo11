import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        nombre: '',
    });

    const guardar = (event) => {
        event.preventDefault();

        post(route('marcas.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Nueva marca
                </h2>
            }
        >
            <Head title="Nueva marca" />

            <div className="p-6">
                <div className="mx-auto max-w-3xl">

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Nueva marca
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Registra una nueva marca de artículos.
                        </p>
                    </div>

                    <form
                        onSubmit={guardar}
                        className="rounded-xl border bg-white p-6 shadow-sm"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Nombre de la marca *
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
                                placeholder="Ej. Adidas"
                                className="w-full rounded-lg border-gray-300"
                                autoFocus
                            />

                            {errors.nombre && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.nombre}
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Link
                                href={route('marcas.index')}
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                            >
                                {processing
                                    ? 'Guardando...'
                                    : 'Guardar marca'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}