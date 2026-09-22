import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Index({ empleados = [] }) {
    const [busqueda, setBusqueda] = useState('');

    const empleadosFiltrados = useMemo(() => {
        const texto = busqueda.toLowerCase().trim();

        if (!texto) {
            return empleados;
        }

        return empleados.filter((empleado) => {
            return (
                String(empleado.id_personal)
                    .toLowerCase()
                    .includes(texto) ||
                String(empleado.nombre)
                    .toLowerCase()
                    .includes(texto) ||
                String(empleado.numero)
                    .toLowerCase()
                    .includes(texto) ||
                String(empleado.usuario)
                    .toLowerCase()
                    .includes(texto)
            );
        });
    }, [busqueda, empleados]);

    return (
        <AuthenticatedLayout>
            <Head title="Empleados" />

            <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">

                    {/* ENCABEZADO */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Empleados
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Gestiona el personal registrado en el sistema.
                            </p>
                        </div>

                        <Link
                            href={route('empleados.create')}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>

                            Nuevo empleado
                        </Link>
                    </div>

                    {/* CONTENEDOR */}
                    <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                        {/* BUSCADOR */}
                        <div className="border-b border-gray-200 p-5">
                            <div className="relative max-w-2xl">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                                        />
                                    </svg>
                                </div>

                                <input
                                    type="text"
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                    placeholder="Buscar por ID, nombre, número o usuario..."
                                    className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {/* TABLA */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            ID
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Nombre
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Número
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Usuario
                                        </th>

                                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Estado
                                        </th>

                                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Acción
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {empleadosFiltrados.length > 0 ? (
                                        empleadosFiltrados.map((empleado) => (
                                            <tr
                                                key={empleado.id_personal}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-700">
                                                    #{empleado.id_personal}
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                                                            {empleado.nombre
                                                                ?.charAt(0)
                                                                ?.toUpperCase()}
                                                        </div>

                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {empleado.nombre}
                                                            </p>

                                                            <p className="text-xs text-gray-500">
                                                                {empleado.correo ||
                                                                    'Sin correo'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {empleado.numero || '—'}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {empleado.usuario}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4">
                                                    {empleado.activo ? (
                                                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                            Activo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                            Inactivo
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <Link
                                                        href={route(
                                                            'empleados.edit',
                                                            empleado.id_personal,
                                                        )}
                                                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        Editar
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="mb-3 h-10 w-10 text-gray-300"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M15 19a3 3 0 1 0-6 0m9-8a6 6 0 1 1-12 0 6 6 0 0 1 12 0Zm3 8a3 3 0 0 0-3-3"
                                                        />
                                                    </svg>

                                                    <p className="font-medium text-gray-600">
                                                        No se encontraron empleados
                                                    </p>

                                                    <p className="mt-1 text-sm text-gray-400">
                                                        Prueba con otro término
                                                        de búsqueda.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PIE */}
                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <p className="text-sm text-gray-500">
                                Mostrando{' '}
                                <span className="font-semibold text-gray-700">
                                    {empleadosFiltrados.length}
                                </span>{' '}
                                de{' '}
                                <span className="font-semibold text-gray-700">
                                    {empleados.length}
                                </span>{' '}
                                empleados
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}