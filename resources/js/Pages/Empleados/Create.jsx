import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        numero: '',
        usuario: '',
        correo: '',
        password: '',
        password_confirmation: '',
        rol_id: '2',
        activo: true,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('empleados.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Nuevo empleado
                </h2>
            }
        >
            <Head title="Nuevo empleado" />

            <div className="mx-auto max-w-4xl">

                <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                    {/* ENCABEZADO */}
                    <div className="border-b border-gray-200 px-8 py-6">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Registrar nuevo empleado
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Completa los datos del empleado para registrarlo
                            en el sistema.
                        </p>
                    </div>

                    {/* FORMULARIO */}
                    <form onSubmit={submit}>

                        <div className="p-8">

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                {/* NOMBRE */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="nombre"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Nombre completo
                                    </label>

                                    <input
                                        id="nombre"
                                        name="nombre"
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData('nombre', e.target.value)
                                        }
                                        placeholder="Ej. Juan Pérez"
                                        autoComplete="name"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    {errors.nombre && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>

                                {/* NUMERO */}
                                <div>
                                    <label
                                        htmlFor="numero"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Número de teléfono
                                    </label>

                                    <input
                                        id="numero"
                                        name="numero"
                                        type="text"
                                        value={data.numero}
                                        onChange={(e) =>
                                            setData('numero', e.target.value)
                                        }
                                        placeholder="Ej. 72663448"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    {errors.numero && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.numero}
                                        </p>
                                    )}
                                </div>

                                {/* CORREO */}
                                <div>
                                    <label
                                        htmlFor="correo"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Correo electrónico
                                    </label>

                                    <input
                                        id="correo"
                                        name="correo"
                                        type="email"
                                        value={data.correo}
                                        onChange={(e) =>
                                            setData('correo', e.target.value)
                                        }
                                        placeholder="Ej. empleado@apolo.com"
                                        autoComplete="email"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    {errors.correo && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.correo}
                                        </p>
                                    )}
                                </div>

                                {/* USUARIO */}
                                <div>
                                    <label
                                        htmlFor="usuario"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Nombre de usuario
                                    </label>

                                    <input
                                        id="usuario"
                                        name="usuario"
                                        type="text"
                                        value={data.usuario}
                                        onChange={(e) =>
                                            setData('usuario', e.target.value)
                                        }
                                        placeholder="Ej. juan.perez"
                                        autoComplete="username"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    <p className="mt-1 text-xs text-gray-500">
                                        Este será el usuario utilizado para
                                        iniciar sesión.
                                    </p>

                                    {errors.usuario && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.usuario}
                                        </p>
                                    )}
                                </div>

                                {/* ROL */}
                                <div>
                                    <label
                                        htmlFor="rol_id"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Rol
                                    </label>

                                    <select
                                        id="rol_id"
                                        name="rol_id"
                                        value={data.rol_id}
                                        onChange={(e) =>
                                            setData('rol_id', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    >
                                        <option value="2">
                                            Empleado
                                        </option>

                                        <option value="1">
                                            Administrador
                                        </option>
                                    </select>

                                    {errors.rol_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.rol_id}
                                        </p>
                                    )}
                                </div>

                                {/* CONTRASEÑA */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Contraseña
                                    </label>

                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        placeholder="Mínimo 8 caracteres"
                                        autoComplete="new-password"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* CONFIRMAR CONTRASEÑA */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Confirmar contraseña
                                    </label>

                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                'password_confirmation',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Repite la contraseña"
                                        autoComplete="new-password"
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />

                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>

                                {/* ESTADO */}
                                <div className="md:col-span-2">
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">

                                        <label className="flex cursor-pointer items-center">

                                            <input
                                                type="checkbox"
                                                checked={data.activo}
                                                onChange={(e) =>
                                                    setData(
                                                        'activo',
                                                        e.target.checked
                                                    )
                                                }
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />

                                            <span className="ml-3">
                                                <span className="block text-sm font-medium text-gray-700">
                                                    Empleado activo
                                                </span>

                                                <span className="block text-xs text-gray-500">
                                                    El empleado podrá iniciar
                                                    sesión en el sistema.
                                                </span>
                                            </span>

                                        </label>

                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* BOTONES */}
                        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-8 py-5">

                            <Link
                                href={route('empleados.index')}
                                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
                            >
                                Cancelar
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-lg border border-black bg-black px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Guardar empleado'}
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}