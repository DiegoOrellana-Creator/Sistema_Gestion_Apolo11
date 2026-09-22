import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [openArticulos, setOpenArticulos] = useState(false);
    const [openInventario, setOpenInventario] = useState(false);
    const [openFinanzas, setOpenFinanzas] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">

            {/* ========================================================= */}
            {/* BARRA LATERAL */}
            {/* ========================================================= */}

            <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white">

                {/* LOGO */}
                <div className="flex h-20 items-center justify-center border-b border-gray-100">
                    <Link href={route('dashboard')}>
                        <ApplicationLogo className="block h-12 w-auto fill-current text-gray-800" />
                    </Link>
                </div>

                {/* MENÚ */}
                <nav className="mt-4 px-3">

                    {/* ================================================= */}
                    {/* INICIO */}
                    {/* ================================================= */}

                    <NavItem
                        label="Inicio"
                        icon="home"
                        href={route('dashboard')}
                        routeName="dashboard"
                    />

                    {/* ================================================= */}
                    {/* COMPRAS */}
                    {/* ================================================= */}

                    <NavItem
                        label="Compras"
                        icon="cart"
                    />

                    {/* ================================================= */}
                    {/* VENTAS */}
                    {/* ================================================= */}

                    <NavItem
                        label="Ventas"
                        icon="sales"
                    />

                    {/* ================================================= */}
                    {/* ARTÍCULOS */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        onClick={() => setOpenArticulos(!openArticulos)}
                        className="mb-1 flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                    >
                        <span className="flex items-center">
                            <NavIcon type="box" />
                            Artículos
                        </span>

                        <svg
                            className={`h-4 w-4 transition-transform ${
                                openArticulos ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {openArticulos && (
                        <div className="mb-1 ml-11 space-y-1">

                            {/* PRODUCTOS */}
                            <SubItem
                                label="Productos"
                                href={route('productos.index')}
                                routeName="productos.*"
                            />

                            {/* CATEGORÍAS */}
                            <SubItem
                                label="Categorías"
                                href="#"
                            />

                            {/* MARCAS */}
                            <SubItem
                                label="Marcas"
                                href="#"
                            />

                        </div>
                    )}

                    {/* ================================================= */}
                    {/* INVENTARIO */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        onClick={() => setOpenInventario(!openInventario)}
                        className="mb-1 flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                    >
                        <span className="flex items-center">
                            <NavIcon type="inventory" />
                            Inventario
                        </span>

                        <svg
                            className={`h-4 w-4 transition-transform ${
                                openInventario ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {openInventario && (
                        <div className="mb-1 ml-11 space-y-1">

                            <SubItem
                                label="Stock"
                                href="#"
                            />

                            <SubItem
                                label="Movimientos"
                                href="#"
                            />

                        </div>
                    )}

                    {/* ================================================= */}
                    {/* FINANZAS */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        onClick={() => setOpenFinanzas(!openFinanzas)}
                        className="mb-1 flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                    >
                        <span className="flex items-center">
                            <NavIcon type="money" />
                            Finanzas
                        </span>

                        <svg
                            className={`h-4 w-4 transition-transform ${
                                openFinanzas ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {openFinanzas && (
                        <div className="mb-1 ml-11 space-y-1">

                            <SubItem
                                label="Métodos de pago"
                                href="#"
                            />

                            <SubItem
                                label="Ingresos"
                                href="#"
                            />

                            <SubItem
                                label="Egresos"
                                href="#"
                            />

                        </div>
                    )}

                    {/* ================================================= */}
                    {/* EMPLEADOS */}
                    {/* ================================================= */}

                    <NavItem
                        label="Empleados"
                        icon="users"
                        href={route('empleados.index')}
                        routeName="empleados.*"
                    />

                    {/* ================================================= */}
                    {/* PROVEEDORES */}
                    {/* ================================================= */}

                    <NavItem
                        label="Proveedores"
                        icon="building"
                    />

                    {/* ================================================= */}
                    {/* REPORTES */}
                    {/* ================================================= */}

                    <NavItem
                        label="Reportes"
                        icon="report"
                    />

                </nav>
            </aside>

            {/* ========================================================= */}
            {/* CONTENIDO PRINCIPAL */}
            {/* ========================================================= */}

            <div className="ml-64 min-h-screen">

                {/* ================================================= */}
                {/* BARRA SUPERIOR */}
                {/* ================================================= */}

                <nav className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-8">

                    <div>
                        <span className="text-lg font-semibold text-gray-800">
                            Proyecto Apolo
                        </span>
                    </div>

                    {/* USUARIO */}
                    <div className="relative">

                        <Dropdown>

                            <Dropdown.Trigger>

                                <span className="inline-flex rounded-md">

                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-600 transition hover:text-gray-900 focus:outline-none"
                                    >

                                        {user?.nombre || user?.usuario}

                                        <svg
                                            className="-me-0.5 ms-2 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>

                                    </button>

                                </span>

                            </Dropdown.Trigger>

                            <Dropdown.Content>

                                <Dropdown.Link
                                    href={route('profile.edit')}
                                >
                                    Perfil
                                </Dropdown.Link>

                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Cerrar sesión
                                </Dropdown.Link>

                            </Dropdown.Content>

                        </Dropdown>

                    </div>

                </nav>

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                {header && (
                    <header className="border-b border-gray-200 bg-white">
                        <div className="px-8 py-6">
                            {header}
                        </div>
                    </header>
                )}

                {/* ================================================= */}
                {/* CONTENIDO */}
                {/* ================================================= */}

                <main className="p-8">
                    {children}
                </main>

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| NAV ITEM
|--------------------------------------------------------------------------
*/

function NavItem({ label, icon, href, routeName }) {

    const isActive = routeName
        ? route().current(routeName)
        : false;

    return (
        <Link
            href={href || '#'}
            className={`mb-1 flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            <NavIcon type={icon} />

            {label}
        </Link>
    );
}


/*
|--------------------------------------------------------------------------
| SUB ITEM
|--------------------------------------------------------------------------
*/

function SubItem({ label, href, routeName }) {

    const isActive = routeName
        ? route().current(routeName)
        : false;

    return (
        <Link
            href={href || '#'}
            className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                isActive
                    ? 'bg-blue-50 font-semibold text-blue-700'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            {label}
        </Link>
    );
}


/*
|--------------------------------------------------------------------------
| ICONOS
|--------------------------------------------------------------------------
*/

function NavIcon({ type }) {

    const common = {
        className: 'mr-3 h-5 w-5',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24',
    };

    switch (type) {

        /*
        |--------------------------------------------------------------------------
        | HOME
        |--------------------------------------------------------------------------
        */

        case 'home':

            return (
                <svg {...common}>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12l9-9 9 9"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 10v10h14V10"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 20v-6h6v6"
                    />
                </svg>
            );


        /*
        |--------------------------------------------------------------------------
        | CARRITO
        |--------------------------------------------------------------------------
        */

        case 'cart':

            return (
                <svg {...common}>

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l2.4 12.4a2 2 0 002 1.6h7.8a2 2 0 001.9-1.4L21 8H6"
                    />

                    <circle
                        cx="10"
                        cy="20"
                        r="1"
                    />

                    <circle
                        cx="18"
                        cy="20"
                        r="1"
                    />

                </svg>
            );


        /*
        |--------------------------------------------------------------------------
        | VENTAS
        |--------------------------------------------------------------------------
        */

        case 'sales':

            return (
                <svg {...common}>

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3v18h18"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16l4-5 3 3 5-7"
                    />

                </svg>
            );


        /*
        |--------------------------------------------------------------------------
        | ARTÍCULOS
        |--------------------------------------------------------------------------
        */

        case 'box':

            return (
                <svg {...common}>

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 16V8l-9-5-9 5v8l9 5 9-5z"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3.3 7.8L12 13l8.7-5.2M12 13v8"
                    />

                </svg>
            );


        /*
        |--------------------------------------------------------------------------
        | INVENTARIO
        |--------------------------------------------------------------------------
        */

        case 'inventory':

            return (
                <svg {...common}>

                    <rect
                        x="4"
                        y="4"
                        width="16"
                        height="16"
                        rx="2"
                        strokeWidth="2"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 8h8M8 12h8M8 16h5"
                    />

                </svg>
            );


        /*
        |--------------------------------------------------------------------------
        | FINANZAS
        |--------------------------------------------------------------------------
        */

        case 'money':

            return (
                <svg {...common}>

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7H15a3.5 3.5 0 010 7H6"
                    />

                </svg>
            );


        /*
        |--------------------------------------------------------------------------
        | EMPLEADOS
        |--------------------------------------------------------------------------
        */

        case 'users':

            return (
                <svg {...common}>

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                    />

                    <circle
                        cx="9"
                        cy="7"
                        r="4"
                        strokeWidth="2"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                    />

                </svg>
            );


        /*
        |--------------------------------------------------------------------------
        | PROVEEDORES
        |--------------------------------------------------------------------------
        */

        case 'building':

            return (
                <svg {...common}>

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h1M14 9h1M9 13h1M14 13h1"
                    />

                </svg>
            );


        /*
        |--------------------------------------------------------------------------
        | REPORTES
        |--------------------------------------------------------------------------
        */

        case 'report':

            return (
                <svg {...common}>

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 17v-5M12 17V8M16 17v-3"
                    />

                </svg>
            );


        default:
            return null;
    }
}