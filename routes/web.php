<?php

use App\Http\Controllers\CategoriaAtributoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\PersonalController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\VentaController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])
    ->name('dashboard');

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Empleados
    |--------------------------------------------------------------------------
    */

    Route::get('/empleados', [
        PersonalController::class,
        'index'
    ])->name('empleados.index');

    Route::get('/empleados/create', [
        PersonalController::class,
        'create'
    ])->name('empleados.create');

    Route::post('/empleados', [
        PersonalController::class,
        'store'
    ])->name('empleados.store');

    Route::get('/empleados/{empleado}/edit', [
        PersonalController::class,
        'edit'
    ])->name('empleados.edit');

    Route::put('/empleados/{empleado}', [
        PersonalController::class,
        'update'
    ])->name('empleados.update');

    Route::patch('/empleados/{empleado}/estado', [
        PersonalController::class,
        'toggleEstado'
    ])->name('empleados.toggle-estado');


    /*
    |--------------------------------------------------------------------------
    | Productos
    |--------------------------------------------------------------------------
    */

    Route::get('/productos', [
        ProductoController::class,
        'index'
    ])->name('productos.index');

    Route::get('/productos/create', [
        ProductoController::class,
        'create'
    ])->name('productos.create');

    Route::post('/productos', [
        ProductoController::class,
        'store'
    ])->name('productos.store');

    Route::get('/productos/{producto}', [
        ProductoController::class,
        'show'
    ])->name('productos.show');

    Route::get('/productos/{producto}/edit', [
        ProductoController::class,
        'edit'
    ])->name('productos.edit');

    Route::put('/productos/{producto}', [
        ProductoController::class,
        'update'
    ])->name('productos.update');

    Route::delete('/productos/{producto}', [
        ProductoController::class,
        'destroy'
    ])->name('productos.destroy');


    /*
    |--------------------------------------------------------------------------
    | Ventas
    |--------------------------------------------------------------------------
    */

    Route::get('/ventas', [
        VentaController::class,
        'index'
    ])->name('ventas.index');

    Route::get('/ventas/create', [
        VentaController::class,
        'create'
    ])->name('ventas.create');

    Route::post('/ventas', [
        VentaController::class,
        'store'
    ])->name('ventas.store');

    Route::get('/ventas/{venta}', [
        VentaController::class,
        'show'
    ])->name('ventas.show');


    /*
    |--------------------------------------------------------------------------
    | Compras
    |--------------------------------------------------------------------------
    */

    Route::get('/compras', [
        CompraController::class,
        'index'
    ])->name('compras.index');

    Route::get('/compras/create', [
        CompraController::class,
        'create'
    ])->name('compras.create');

    Route::post('/compras', [
        CompraController::class,
        'store'
    ])->name('compras.store');

    Route::get('/compras/{compra}', [
        CompraController::class,
        'show'
    ])->name('compras.show');


    /*
    |--------------------------------------------------------------------------
    | Proveedores
    |--------------------------------------------------------------------------
    */

    Route::get('/proveedores', [
        ProveedorController::class,
        'index'
    ])->name('proveedores.index');

    Route::get('/proveedores/create', [
        ProveedorController::class,
        'create'
    ])->name('proveedores.create');

    Route::post('/proveedores', [
        ProveedorController::class,
        'store'
    ])->name('proveedores.store');

    Route::get('/proveedores/{proveedor}', [
        ProveedorController::class,
        'show'
    ])->name('proveedores.show');

    Route::get('/proveedores/{proveedor}/edit', [
        ProveedorController::class,
        'edit'
    ])->name('proveedores.edit');

    Route::put('/proveedores/{proveedor}', [
        ProveedorController::class,
        'update'
    ])->name('proveedores.update');

    Route::delete('/proveedores/{proveedor}', [
        ProveedorController::class,
        'destroy'
    ])->name('proveedores.destroy');


    /*
    |--------------------------------------------------------------------------
    | Categorías
    |--------------------------------------------------------------------------
    */

    Route::get('/categorias', [
        CategoriaController::class,
        'index'
    ])->name('categorias.index');

    Route::get('/categorias/create', [
        CategoriaController::class,
        'create'
    ])->name('categorias.create');

    Route::post('/categorias', [
        CategoriaController::class,
        'store'
    ])->name('categorias.store');

    Route::get('/categorias/{categoria}/edit', [
        CategoriaController::class,
        'edit'
    ])->name('categorias.edit');

    Route::put('/categorias/{categoria}', [
        CategoriaController::class,
        'update'
    ])->name('categorias.update');

    Route::delete('/categorias/{categoria}', [
        CategoriaController::class,
        'destroy'
    ])->name('categorias.destroy');


    /*
    |--------------------------------------------------------------------------
    | Atributos de categorías
    |--------------------------------------------------------------------------
    */

    Route::get('/categorias/{categoria}/atributos', [
        CategoriaAtributoController::class,
        'index'
    ])->name('categorias.atributos');


    /*
    |--------------------------------------------------------------------------
    | Marcas
    |--------------------------------------------------------------------------
    */

    Route::get('/marcas', [
        MarcaController::class,
        'index'
    ])->name('marcas.index');

    Route::get('/marcas/create', [
        MarcaController::class,
        'create'
    ])->name('marcas.create');

    Route::post('/marcas', [
        MarcaController::class,
        'store'
    ])->name('marcas.store');

    Route::get('/marcas/{marca}/edit', [
        MarcaController::class,
        'edit'
    ])->name('marcas.edit');

    Route::put('/marcas/{marca}', [
        MarcaController::class,
        'update'
    ])->name('marcas.update');

    Route::delete('/marcas/{marca}', [
        MarcaController::class,
        'destroy'
    ])->name('marcas.destroy');


    /*
    |--------------------------------------------------------------------------
    | Perfil
    |--------------------------------------------------------------------------
    */

    Route::get('/profile', [
        ProfileController::class,
        'edit'
    ])->name('profile.edit');

    Route::patch('/profile', [
        ProfileController::class,
        'update'
    ])->name('profile.update');

    Route::delete('/profile', [
        ProfileController::class,
        'destroy'
    ])->name('profile.destroy');
});


require __DIR__.'/auth.php';