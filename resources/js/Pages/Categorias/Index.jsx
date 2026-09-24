import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ categorias = [] }) {
    const { flash } = usePage().props;

    const eliminar = (categoria) => {
        if (
            !confirm(
                `¿Seguro que deseas eliminar la categoría "${categoria.nombre}"?`
            )
        ) {
            return;
        }

        router.delete(
            route('categorias.destroy', categoria.id_categoria)
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Categorías
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Administración de categorías de artículos
                    </p>
                </div>
            }
        >
            <Head title="Categorías" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl">

                    {flash?.success && (
                        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Categorías
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Administra las categorías de tus artículos.
                            </p>
                        </div>

                        <Link
                            href={route('categorias.create')}
                            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            + Nueva categoría
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                        <table className="w-full">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                                        Categoría
                                    </th>

                                    <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                                        Atributos
                                    </th>

                                    <th className="px-5 py-3 text-center text-sm font-semibold text-gray-700">
                                        Productos
                                    </th>

                                    <th className="px-5 py-3 text-right text-sm font-semibold text-gray-700">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {categorias.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-5 py-12 text-center text-gray-500"
                                        >
                                            No hay categorías registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    categorias.map((categoria) => (
                                        <tr
                                            key={categoria.id_categoria}
                                            className="border-b last:border-b-0 hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {categoria.nombre}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-center text-sm text-gray-600">
                                                {categoria.atributos_count}
                                            </td>

                                            <td className="px-5 py-4 text-center text-sm text-gray-600">
                                                {categoria.productos_count}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            'categorias.edit',
                                                            categoria.id_categoria
                                                        )}
                                                        className="rounded-lg bg-black px-3 py-1.5 text-sm text-white hover:bg-gray-800"
                                                    >
                                                        Editar
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            eliminar(categoria)
                                                        }
                                                        className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}