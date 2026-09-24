import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ proveedores }) {
    const eliminarProveedor = (proveedor) => {
        if (
            !confirm(
                `¿Estás seguro de eliminar al proveedor "${proveedor.nombre}"?`
            )
        ) {
            return;
        }

        router.delete(
            route('proveedores.destroy', proveedor.id_proveedor)
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Proveedores
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Gestiona proveedores, contactos y marcas.
                        </p>
                    </div>

                    <Link
                        href={route('proveedores.create')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Nuevo proveedor
                    </Link>
                </div>
            }
        >
            <Head title="Proveedores" />

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="min-w-full divide-y divide-gray-200">

                        <thead className="bg-gray-50">

                            <tr>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Proveedor
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Contacto
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Teléfono
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Marcas
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Estado
                                </th>

                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Compras
                                </th>

                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Acciones
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {proveedores.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        No hay proveedores registrados.
                                    </td>
                                </tr>

                            ) : (

                                proveedores.map((proveedor) => (

                                    <tr
                                        key={proveedor.id_proveedor}
                                        className="transition hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">

                                            <div className="font-semibold text-gray-900">
                                                {proveedor.nombre}
                                            </div>

                                            {proveedor.nit && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                    NIT: {proveedor.nit}
                                                </div>
                                            )}

                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="text-sm text-gray-800">
                                                {proveedor.contacto || '—'}
                                            </div>

                                            {proveedor.correo && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                    {proveedor.correo}
                                                </div>
                                            )}

                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {proveedor.telefono || '—'}
                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="flex max-w-xs flex-wrap gap-1">

                                                {proveedor.marcas?.length > 0 ? (

                                                    proveedor.marcas.map((marca) => (

                                                        <span
                                                            key={marca.id_marca}
                                                            className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                                                        >
                                                            {marca.nombre}
                                                        </span>

                                                    ))

                                                ) : (

                                                    <span className="text-sm text-gray-400">
                                                        Sin marcas
                                                    </span>

                                                )}

                                            </div>

                                        </td>

                                        <td className="px-6 py-4">

                                            {proveedor.activo ? (

                                                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                    Activo
                                                </span>

                                            ) : (

                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                                                    Inactivo
                                                </span>

                                            )}

                                        </td>

                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {proveedor.compras_count ?? 0}
                                        </td>

                                        <td className="px-6 py-4">

                                            <div className="flex justify-end gap-2">

                                                <Link
                                                    href={route(
                                                        'proveedores.show',
                                                        proveedor.id_proveedor
                                                    )}
                                                    className="rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
                                                >
                                                    Ver
                                                </Link>

                                                <Link
                                                    href={route(
                                                        'proveedores.edit',
                                                        proveedor.id_proveedor
                                                    )}
                                                    className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
                                                >
                                                    Editar
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        eliminarProveedor(proveedor)
                                                    }
                                                    className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
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
        </AuthenticatedLayout>
    );
}