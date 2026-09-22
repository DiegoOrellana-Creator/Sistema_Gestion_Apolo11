import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        usuario: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="w-full max-w-[430px] rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-lg sm:px-7">

                {/* Título */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Log in
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Please log-in to your account
                    </p>
                </div>

                {/* Mensaje de estado */}
                {status && (
                    <div className="mt-5 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="mt-7">

                    {/* Usuario */}
                    <div>
                        <InputLabel
                            htmlFor="usuario"
                            value="Usuario"
                            className="mb-2 text-sm font-medium text-gray-800"
                        />

                        <div className="relative">
                            {/* Icono usuario */}
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4.5 20.25a8.25 8.25 0 0115 0"
                                    />
                                </svg>
                            </div>

                            <input
                                id="usuario"
                                type="text"
                                name="usuario"
                                value={data.usuario}
                                autoComplete="username"
                                autoFocus
                                placeholder="Enter your username"
                                onChange={(e) =>
                                    setData('usuario', e.target.value)
                                }
                                className="block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                            />
                        </div>

                        <InputError
                            message={errors.usuario}
                            className="mt-2"
                        />
                    </div>

                    {/* Password */}
                    <div className="mt-5">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="mb-2 text-sm font-medium text-gray-800"
                        />

                        <div className="relative">
                            {/* Candado */}
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <rect
                                        x="4"
                                        y="10"
                                        width="16"
                                        height="10"
                                        rx="2"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 10V7a4 4 0 018 0v3"
                                    />
                                </svg>
                            </div>

                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                className="block w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                            />

                            {/* Mostrar contraseña */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-700"
                                aria-label={
                                    showPassword
                                        ? 'Ocultar contraseña'
                                        : 'Mostrar contraseña'
                                }
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 3l18 18"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.58 10.58a2 2 0 002.84 2.84"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.88 4.24A9.77 9.77 0 0112 4c5 0 8.5 4 9.5 8a10.5 10.5 0 01-4.06 5.7"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6.61 6.61C4.59 7.96 3.35 10.02 2.5 12c.7 2.8 2.9 5.5 6.2 7.1"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                                        />
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="2.5"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    {/* Remember + Forgot */}
                    <div className="mt-4 flex items-center justify-between">

                        <label className="flex items-center">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData(
                                        'remember',
                                        e.target.checked
                                    )
                                }
                            />

                            <span className="ml-2 text-xs text-gray-600">
                                Remember me
                            </span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-gray-500 underline hover:text-gray-900"
                            >
                                Forgot Password?
                            </Link>
                        )}
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-5 w-full rounded-md bg-[#171717] py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {processing ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                {/* Registro */}
                <div className="mt-5 text-center text-xs text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        href={route('register')}
                        className="font-medium text-gray-500 underline hover:text-gray-900"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}