<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\Marca;
use App\Models\Producto;
use App\Models\ProductoImagen;
use App\Models\ProductoVariante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Throwable;

class ProductoController extends Controller
{
    /**
     * Listado de productos.
     */
    public function index()
    {
        $productos = Producto::with([
            'categoria.atributos',
            'marca',
            'imagenes',
            'variantes',
        ])
            ->orderBy('id_producto', 'desc')
            ->get();

        $categorias = Categoria::with('atributos')
            ->orderBy('nombre')
            ->get();

        $marcas = Marca::orderBy('nombre')->get();

        return inertia('Productos/Index', [
            'productos' => $productos,
            'categorias' => $categorias,
            'marcas' => $marcas,
        ]);
    }

    /**
     * Formulario de creación.
     */
    public function create()
    {
        $categorias = Categoria::with([
            'atributos' => function ($query) {
                $query->orderBy('orden');
            },
        ])
            ->orderBy('nombre')
            ->get();

        $marcas = Marca::orderBy('nombre')->get();

        return inertia('Productos/Create', [
            'categorias' => $categorias,
            'marcas' => $marcas,
        ]);
    }

    /**
     * Guardar nuevo producto.
     */
    public function store(Request $request)
    {
        // ============================================================
        // 1. VALIDACIÓN DE DATOS PRINCIPALES
        // ============================================================

        $validated = $request->validate([
            'codigo_barra' => [
                'nullable',
                'string',
                'max:100',
                'unique:producto,codigo_barra',
            ],

            'nombre' => [
                'required',
                'string',
                'max:150',
            ],

            'precio_compra' => [
                'required',
                'numeric',
                'min:0',
            ],

            'precio_venta' => [
                'required',
                'numeric',
                'min:0',
            ],

            'stock_actual' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'stock_minimo' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'categoria_id' => [
                'required',
                'integer',
                'exists:categoria,id_categoria',
            ],

            'marca_id' => [
                'required',
                'integer',
                'exists:marca,id_marca',
            ],

            'atributos' => [
                'nullable',
                'array',
            ],

            'variantes' => [
                'nullable',
                'array',
            ],

            'variantes.*.atributos' => [
                'nullable',
                'array',
            ],

            'variantes.*.stock_actual' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'variantes.*.stock_minimo' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'imagenes' => [
                'nullable',
                'array',
                'max:10',
            ],

            'imagenes.*' => [
                'file',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);

        try {

            // ========================================================
            // 2. OBTENER CATEGORÍA Y SUS ATRIBUTOS
            // ========================================================

            $categoria = Categoria::with([
                'atributos' => function ($query) {
                    $query->orderBy('orden');
                },
            ])->findOrFail(
                $validated['categoria_id']
            );

            $atributos =
                $validated['atributos'] ?? [];

            // ========================================================
            // 3. VALIDAR ATRIBUTOS NORMALES
            //
            // IMPORTANTE:
            // Los atributos con es_variante = true NO se validan aquí.
            //
            // Ejemplo:
            // Talla de Zapato es una variante.
            // ========================================================

            foreach ($categoria->atributos as $atributo) {

                /*
                 * Los atributos de variante se validarán
                 * posteriormente dentro de cada variante.
                 */
                if ($atributo->es_variante) {
                    continue;
                }

                $nombreAtributo =
                    $atributo->nombre;

                $valor =
                    $atributos[$nombreAtributo]
                    ?? null;

                // ----------------------------------------------------
                // Atributo obligatorio
                // ----------------------------------------------------

                if ($atributo->requerido) {

                    if (
                        $valor === null ||
                        $valor === ''
                    ) {
                        return back()
                            ->withErrors([
                                "atributos.{$nombreAtributo}" =>
                                    "El atributo {$nombreAtributo} es obligatorio.",
                            ])
                            ->withInput();
                    }
                }

                // ----------------------------------------------------
                // Validar opciones de SELECT
                // ----------------------------------------------------

                if (
                    $valor !== null &&
                    $valor !== '' &&
                    is_array($atributo->opciones) &&
                    count($atributo->opciones) > 0
                ) {

                    $opciones = array_map(
                        'strval',
                        $atributo->opciones
                    );

                    if (
                        !in_array(
                            (string) $valor,
                            $opciones,
                            true
                        )
                    ) {
                        return back()
                            ->withErrors([
                                "atributos.{$nombreAtributo}" =>
                                    "El valor seleccionado para {$nombreAtributo} no es válido.",
                            ])
                            ->withInput();
                    }
                }
            }

            // ========================================================
            // 4. PROCESAR VARIANTES
            // ========================================================

            $variantes =
                $validated['variantes'] ?? [];

            $variantesLimpias = [];

            foreach (
                $variantes as $indice => $variante
            ) {

                $atributosVariante =
                    $variante['atributos'] ?? [];

                // ----------------------------------------------------
                // Verificar que sea un array
                // ----------------------------------------------------

                if (
                    !is_array(
                        $atributosVariante
                    )
                ) {
                    continue;
                }

                // ----------------------------------------------------
                // Si no tiene atributos, ignorar
                // ----------------------------------------------------

                if (
                    count(
                        $atributosVariante
                    ) === 0
                ) {
                    continue;
                }

                // ====================================================
                // VALIDAR ATRIBUTOS DE LA VARIANTE
                // ====================================================

                foreach (
                    $categoria->atributos
                    as $atributo
                ) {

                    /*
                     * Solo nos interesan los atributos
                     * marcados como variante.
                     */
                    if (
                        !$atributo->es_variante
                    ) {
                        continue;
                    }

                    $nombreAtributo =
                        $atributo->nombre;

                    $valor =
                        $atributosVariante[
                            $nombreAtributo
                        ] ?? null;

                    // ----------------------------------------------
                    // Atributo de variante obligatorio
                    // ----------------------------------------------

                    if (
                        $atributo->requerido
                    ) {

                        if (
                            $valor === null ||
                            $valor === ''
                        ) {
                            return back()
                                ->withErrors([
                                    "variantes.{$indice}.atributos.{$nombreAtributo}" =>
                                        "El atributo {$nombreAtributo} es obligatorio en la variante.",
                                ])
                                ->withInput();
                        }
                    }

                    // ----------------------------------------------
                    // Validar SELECT
                    // ----------------------------------------------

                    if (
                        $valor !== null &&
                        $valor !== '' &&
                        is_array(
                            $atributo->opciones
                        ) &&
                        count(
                            $atributo->opciones
                        ) > 0
                    ) {

                        $opciones =
                            array_map(
                                'strval',
                                $atributo->opciones
                            );

                        if (
                            !in_array(
                                (string) $valor,
                                $opciones,
                                true
                            )
                        ) {
                            return back()
                                ->withErrors([
                                    "variantes.{$indice}.atributos.{$nombreAtributo}" =>
                                        "El valor seleccionado para {$nombreAtributo} no es válido.",
                                ])
                                ->withInput();
                        }
                    }
                }

                // ====================================================
                // STOCK DE LA VARIANTE
                // ====================================================

                /*
                 * Si el usuario deja vacío:
                 *
                 * stock_actual = ''
                 * stock_minimo = ''
                 *
                 * ambos se convierten en 0.
                 */

                $stockActual =
                    (int) (
                        $variante[
                            'stock_actual'
                        ] ?? 0
                    );

                $stockMinimo =
                    (int) (
                        $variante[
                            'stock_minimo'
                        ] ?? 0
                    );

                $variantesLimpias[] = [
                    'atributos' =>
                        $atributosVariante,

                    'stock_actual' =>
                        $stockActual,

                    'stock_minimo' =>
                        $stockMinimo,
                ];
            }

            // ========================================================
            // 5. CALCULAR STOCK TOTAL
            // ========================================================

            if (
                count(
                    $variantesLimpias
                ) > 0
            ) {

                $stockTotal =
                    collect(
                        $variantesLimpias
                    )->sum(
                        'stock_actual'
                    );

            } else {

                $stockTotal =
                    (int) (
                        $validated[
                            'stock_actual'
                        ] ?? 0
                    );
            }

            // ========================================================
            // 6. INICIAR TRANSACCIÓN
            // ========================================================

            DB::beginTransaction();

            // ========================================================
            // 7. CREAR PRODUCTO
            // ========================================================

            $producto = Producto::create([
                'codigo_barra' =>
                    $validated[
                        'codigo_barra'
                    ] ?? null,

                'nombre' =>
                    $validated['nombre'],

                'precio_compra' =>
                    $validated[
                        'precio_compra'
                    ],

                'precio_venta' =>
                    $validated[
                        'precio_venta'
                    ],

                'stock_actual' =>
                    $stockTotal,

                'stock_minimo' =>
                    $validated[
                        'stock_minimo'
                    ] ?? 0,

                'atributos' =>
                    $atributos,

                'categoria_id' =>
                    $validated[
                        'categoria_id'
                    ],

                'marca_id' =>
                    $validated[
                        'marca_id'
                    ],
            ]);

            // ========================================================
            // 8. CREAR VARIANTES
            // ========================================================

            foreach (
                $variantesLimpias
                as $variante
            ) {

                ProductoVariante::create([
                    'producto_id' =>
                        $producto->id_producto,

                    'atributos' =>
                        $variante[
                            'atributos'
                        ],

                    'stock_actual' =>
                        $variante[
                            'stock_actual'
                        ],

                    'stock_minimo' =>
                        $variante[
                            'stock_minimo'
                        ],
                ]);
            }

            // ========================================================
            // 9. GUARDAR IMÁGENES
            // ========================================================

            $imagenes =
                $request->file(
                    'imagenes',
                    []
                );

            if (
                !empty($imagenes)
            ) {

                foreach (
                    $imagenes as $index => $imagen
                ) {

                    $extension =
                        strtolower(
                            $imagen
                                ->getClientOriginalExtension()
                        );

                    $nombreArchivo =
                        'imagen-' .
                        ($index + 1) .
                        '.' .
                        $extension;

                    $path =
                        $producto->id_producto .
                        '/' .
                        $nombreArchivo;

                    // ------------------------------------------------
                    // Subir a Supabase
                    // ------------------------------------------------

                    app('supabase')
                        ->storage
                        ->upload(
                            'productos',
                            $path,
                            $imagen->getRealPath(),
                            [
                                'cacheControl' =>
                                    '3600',
                                'upsert' =>
                                    true,
                            ]
                        );

                    // ------------------------------------------------
                    // URL pública
                    // ------------------------------------------------

                    $url =
                        app('supabase')
                            ->storage
                            ->publicUrl(
                                'productos',
                                $path
                            );

                    // ------------------------------------------------
                    // Guardar URL en PostgreSQL
                    // ------------------------------------------------

                    ProductoImagen::create([
                        'producto_id' =>
                            $producto->id_producto,

                        'url' =>
                            $url,

                        'orden' =>
                            $index + 1,

                        'principal' =>
                            $index === 0,
                    ]);
                }
            }

            // ========================================================
            // 10. CONFIRMAR TRANSACCIÓN
            // ========================================================

            DB::commit();

            // ========================================================
            // 11. REDIRIGIR A PRODUCTOS
            // ========================================================

            return redirect()
                ->route(
                    'productos.index'
                )
                ->with(
                    'success',
                    'Producto registrado correctamente.'
                );

        } catch (Throwable $e) {

            // ========================================================
            // ERROR
            // ========================================================

            if (
                DB::transactionLevel() > 0
            ) {
                DB::rollBack();
            }

            Log::error(
                'ERROR AL REGISTRAR PRODUCTO',
                [
                    'mensaje' =>
                        $e->getMessage(),

                    'archivo' =>
                        $e->getFile(),

                    'linea' =>
                        $e->getLine(),

                    'trace' =>
                        $e->getTraceAsString(),
                ]
            );

            return back()
                ->withErrors([
                    'general' =>
                        'Error al guardar el producto: ' .
                        $e->getMessage(),
                ])
                ->withInput();
        }
    }

    /**
     * Mostrar detalle del producto.
     */
    public function show(
        Producto $producto
    ) {
        $producto->load([
            'categoria.atributos',
            'marca',
            'imagenes',
            'variantes',
        ]);

        return inertia(
            'Productos/Show',
            [
                'producto' =>
                    $producto,
            ]
        );
    }

    /**
     * Formulario de edición.
     */
    public function edit(
        Producto $producto
    ) {
        $producto->load([
            'categoria.atributos',
            'marca',
            'imagenes',
            'variantes',
        ]);

        $categorias =
            Categoria::with([
                'atributos' =>
                    function ($query) {
                        $query->orderBy(
                            'orden'
                        );
                    },
            ])
                ->orderBy('nombre')
                ->get();

        $marcas =
            Marca::orderBy(
                'nombre'
            )->get();

        return inertia(
            'Productos/Edit',
            [
                'producto' =>
                    $producto,

                'categorias' =>
                    $categorias,

                'marcas' =>
                    $marcas,
            ]
        );
    }

    /**
     * Actualizar producto.
     */
    public function update(
        Request $request,
        Producto $producto
    ) {
        $validator =
            Validator::make(
                $request->all(),
                [
                    'codigo_barra' => [
                        'nullable',
                        'string',
                        'max:100',
                        'unique:producto,codigo_barra,' .
                            $producto->id_producto .
                            ',id_producto',
                    ],

                    'nombre' => [
                        'required',
                        'string',
                        'max:150',
                    ],

                    'precio_compra' => [
                        'required',
                        'numeric',
                        'min:0',
                    ],

                    'precio_venta' => [
                        'required',
                        'numeric',
                        'min:0',
                    ],

                    'stock_actual' => [
                        'nullable',
                        'integer',
                        'min:0',
                    ],

                    'stock_minimo' => [
                        'nullable',
                        'integer',
                        'min:0',
                    ],

                    'categoria_id' => [
                        'required',
                        'integer',
                        'exists:categoria,id_categoria',
                    ],

                    'marca_id' => [
                        'required',
                        'integer',
                        'exists:marca,id_marca',
                    ],

                    'atributos' => [
                        'nullable',
                        'array',
                    ],

                    'variantes' => [
                        'nullable',
                        'array',
                    ],

                    'variantes.*.id_producto_variante' => [
                        'nullable',
                        'integer',
                    ],

                    'variantes.*.atributos' => [
                        'nullable',
                        'array',
                    ],

                    'variantes.*.stock_actual' => [
                        'nullable',
                        'integer',
                        'min:0',
                    ],

                    'variantes.*.stock_minimo' => [
                        'nullable',
                        'integer',
                        'min:0',
                    ],

                    'imagenes' => [
                        'nullable',
                        'array',
                        'max:10',
                    ],

                    'imagenes.*' => [
                        'file',
                        'mimes:jpeg,jpg,png,webp',
                        'max:5120',
                    ],

                    'imagenes_eliminar' => [
                        'nullable',
                        'array',
                    ],

                    'imagenes_eliminar.*' => [
                        'integer',
                    ],

                    'imagen_principal' => [
                        'nullable',
                        'integer',
                    ],
                ],
                [
                    'nombre.required' =>
                        'El nombre del producto es obligatorio.',

                    'precio_compra.required' =>
                        'El precio de compra es obligatorio.',

                    'precio_venta.required' =>
                        'El precio de venta es obligatorio.',

                    'categoria_id.required' =>
                        'Debes seleccionar una categoría.',

                    'marca_id.required' =>
                        'Debes seleccionar una marca.',

                    'codigo_barra.unique' =>
                        'El código de barra ya está registrado.',

                    'imagenes.*.mimes' =>
                        'Las imágenes deben ser JPG, PNG o WEBP.',

                    'imagenes.*.max' =>
                        'Cada imagen puede pesar como máximo 5 MB.',
                ]
            );

        if (
            $validator->fails()
        ) {
            return back()
                ->withErrors(
                    $validator
                )
                ->withInput();
        }

        try {

            // ========================================================
            // OBTENER CATEGORÍA
            // ========================================================

            $categoria =
                Categoria::with(
                    'atributos'
                )->findOrFail(
                    $request->categoria_id
                );

            $atributos =
                $request->input(
                    'atributos',
                    []
                );

            // ========================================================
            // VALIDAR ATRIBUTOS NORMALES
            // ========================================================

            foreach (
                $categoria->atributos
                as $atributo
            ) {

                /*
                 * Los atributos de variante
                 * se validan abajo.
                 */
                if (
                    $atributo->es_variante
                ) {
                    continue;
                }

                if (
                    !$atributo->requerido
                ) {
                    continue;
                }

                $nombreAtributo =
                    $atributo->nombre;

                $valor =
                    $atributos[
                        $nombreAtributo
                    ] ?? null;

                if (
                    $valor === null ||
                    $valor === '' ||
                    (
                        is_array($valor) &&
                        count($valor) === 0
                    )
                ) {
                    return back()
                        ->withErrors([
                            'atributos.' .
                                $nombreAtributo =>
                                "El atributo {$nombreAtributo} es obligatorio.",
                        ])
                        ->withInput();
                }
            }

            // ========================================================
            // PROCESAR VARIANTES
            // ========================================================

            $variantes =
                $request->input(
                    'variantes',
                    []
                );

            $variantesLimpias = [];

            foreach (
                $variantes as $indice => $variante
            ) {

                $atributosVariante =
                    $variante[
                        'atributos'
                    ] ?? [];

                if (
                    !is_array(
                        $atributosVariante
                    ) ||
                    count(
                        $atributosVariante
                    ) === 0
                ) {
                    continue;
                }

                // ----------------------------------------------------
                // Validar atributos de variante
                // ----------------------------------------------------

                foreach (
                    $categoria->atributos
                    as $atributo
                ) {

                    if (
                        !$atributo->es_variante
                    ) {
                        continue;
                    }

                    $nombreAtributo =
                        $atributo->nombre;

                    $valor =
                        $atributosVariante[
                            $nombreAtributo
                        ] ?? null;

                    if (
                        $atributo->requerido &&
                        (
                            $valor === null ||
                            $valor === ''
                        )
                    ) {
                        return back()
                            ->withErrors([
                                "variantes.{$indice}.atributos.{$nombreAtributo}" =>
                                    "El atributo {$nombreAtributo} es obligatorio en la variante.",
                            ])
                            ->withInput();
                    }

                    // ------------------------------------------------
                    // Validar opciones
                    // ------------------------------------------------

                    if (
                        $valor !== null &&
                        $valor !== '' &&
                        is_array(
                            $atributo->opciones
                        ) &&
                        count(
                            $atributo->opciones
                        ) > 0
                    ) {

                        $opciones =
                            array_map(
                                'strval',
                                $atributo->opciones
                            );

                        if (
                            !in_array(
                                (string) $valor,
                                $opciones,
                                true
                            )
                        ) {
                            return back()
                                ->withErrors([
                                    "variantes.{$indice}.atributos.{$nombreAtributo}" =>
                                        "El valor seleccionado para {$nombreAtributo} no es válido.",
                                ])
                                ->withInput();
                        }
                    }
                }

                $variantesLimpias[] = [
                    'id_producto_variante' =>
                        $variante[
                            'id_producto_variante'
                        ] ?? null,

                    'atributos' =>
                        $atributosVariante,

                    'stock_actual' =>
                        (int) (
                            $variante[
                                'stock_actual'
                            ] ?? 0
                        ),

                    'stock_minimo' =>
                        (int) (
                            $variante[
                                'stock_minimo'
                            ] ?? 0
                        ),
                ];
            }

            // ========================================================
            // STOCK TOTAL
            // ========================================================

            if (
                count(
                    $variantesLimpias
                ) > 0
            ) {
                $stockActual =
                    collect(
                        $variantesLimpias
                    )->sum(
                        'stock_actual'
                    );
            } else {
                $stockActual =
                    (int) (
                        $request->input(
                            'stock_actual'
                        ) ?? 0
                    );
            }

            $stockMinimo =
                (int) (
                    $request->input(
                        'stock_minimo'
                    ) ?? 0
                );

            // ========================================================
            // TRANSACCIÓN
            // ========================================================

            DB::beginTransaction();

            // ========================================================
            // ACTUALIZAR PRODUCTO
            // ========================================================

            $producto->update([
                'codigo_barra' =>
                    $request->input(
                        'codigo_barra'
                    ),

                'nombre' =>
                    $request->input(
                        'nombre'
                    ),

                'precio_compra' =>
                    $request->input(
                        'precio_compra'
                    ),

                'precio_venta' =>
                    $request->input(
                        'precio_venta'
                    ),

                'stock_actual' =>
                    $stockActual,

                'stock_minimo' =>
                    $stockMinimo,

                'atributos' =>
                    $atributos,

                'categoria_id' =>
                    $request->input(
                        'categoria_id'
                    ),

                'marca_id' =>
                    $request->input(
                        'marca_id'
                    ),
            ]);

            // ========================================================
            // VARIANTES RECIBIDAS
            // ========================================================

            $idsVariantesRecibidas =
                collect(
                    $variantesLimpias
                )
                    ->pluck(
                        'id_producto_variante'
                    )
                    ->filter()
                    ->map(
                        fn ($id) =>
                            (int) $id
                    )
                    ->values()
                    ->all();

            // ========================================================
            // ACTUALIZAR / CREAR VARIANTES
            // ========================================================

            foreach (
                $variantesLimpias
                as $variante
            ) {

                if (
                    !empty(
                        $variante[
                            'id_producto_variante'
                        ]
                    )
                ) {

                    $registro =
                        ProductoVariante::where(
                            'id_producto_variante',
                            $variante[
                                'id_producto_variante'
                            ]
                        )
                            ->where(
                                'producto_id',
                                $producto->id_producto
                            )
                            ->first();

                    if ($registro) {

                        $registro->update([
                            'atributos' =>
                                $variante[
                                    'atributos'
                                ],

                            'stock_actual' =>
                                $variante[
                                    'stock_actual'
                                ],

                            'stock_minimo' =>
                                $variante[
                                    'stock_minimo'
                                ],
                        ]);
                    }

                } else {

                    ProductoVariante::create([
                        'producto_id' =>
                            $producto->id_producto,

                        'atributos' =>
                            $variante[
                                'atributos'
                            ],

                        'stock_actual' =>
                            $variante[
                                'stock_actual'
                            ],

                        'stock_minimo' =>
                            $variante[
                                'stock_minimo'
                            ],
                    ]);
                }
            }

            /*
             * NO eliminamos automáticamente variantes antiguas.
             *
             * Esto protege el historial de ventas y compras,
             * ya que las FK tienen ON DELETE RESTRICT.
             */

            // ========================================================
            // ELIMINAR IMÁGENES
            // ========================================================

            $imagenesEliminar =
                $request->input(
                    'imagenes_eliminar',
                    []
                );

            if (
                is_array(
                    $imagenesEliminar
                )
            ) {

                foreach (
                    $imagenesEliminar
                    as $idImagen
                ) {

                    $imagen =
                        ProductoImagen::where(
                            'id_producto_imagen',
                            $idImagen
                        )
                            ->where(
                                'producto_id',
                                $producto->id_producto
                            )
                            ->first();

                    if (!$imagen) {
                        continue;
                    }

                    try {

                        $path =
                            $this->obtenerPathStorage(
                                $imagen->url
                            );

                        if ($path) {

                            app('supabase')
                                ->storage
                                ->remove(
                                    'productos',
                                    [$path]
                                );
                        }

                    } catch (
                        Throwable $e
                    ) {

                        Log::warning(
                            'No se pudo eliminar imagen de Supabase',
                            [
                                'imagen_id' =>
                                    $imagen
                                        ->id_producto_imagen,

                                'error' =>
                                    $e->getMessage(),
                            ]
                        );
                    }

                    $imagen->delete();
                }
            }

            // ========================================================
            // SUBIR NUEVAS IMÁGENES
            // ========================================================

            $imagenesExistentes =
                $producto->imagenes()
                    ->orderBy('orden')
                    ->get();

            $ultimoOrden =
                $imagenesExistentes
                    ->max('orden') ?? 0;

            $imagenesNuevas =
                $request->file(
                    'imagenes',
                    []
                );

            foreach (
                $imagenesNuevas
                as $index => $imagen
            ) {

                $extension =
                    strtolower(
                        $imagen
                            ->getClientOriginalExtension()
                    );

                $orden =
                    $ultimoOrden +
                    $index +
                    1;

                $nombreArchivo =
                    'imagen-' .
                    $orden .
                    '-' .
                    time() .
                    '.' .
                    $extension;

                $path =
                    $producto->id_producto .
                    '/' .
                    $nombreArchivo;

                app('supabase')
                    ->storage
                    ->upload(
                        'productos',
                        $path,
                        $imagen->getRealPath(),
                        [
                            'cacheControl' =>
                                '3600',

                            'upsert' =>
                                true,
                        ]
                    );

                $url =
                    app('supabase')
                        ->storage
                        ->publicUrl(
                            'productos',
                            $path
                        );

                ProductoImagen::create([
                    'producto_id' =>
                        $producto->id_producto,

                    'url' =>
                        $url,

                    'orden' =>
                        $orden,

                    'principal' =>
                        false,
                ]);
            }

            // ========================================================
            // IMAGEN PRINCIPAL
            // ========================================================

            $imagenPrincipal =
                $request->input(
                    'imagen_principal'
                );

            if (
                $imagenPrincipal
            ) {

                ProductoImagen::where(
                    'producto_id',
                    $producto->id_producto
                )->update([
                    'principal' =>
                        false,
                ]);

                ProductoImagen::where(
                    'producto_id',
                    $producto->id_producto
                )
                    ->where(
                        'id_producto_imagen',
                        $imagenPrincipal
                    )
                    ->update([
                        'principal' =>
                            true,
                    ]);

            } else {

                $hayPrincipal =
                    ProductoImagen::where(
                        'producto_id',
                        $producto->id_producto
                    )
                        ->where(
                            'principal',
                            true
                        )
                        ->exists();

                if (
                    !$hayPrincipal
                ) {

                    $primeraImagen =
                        ProductoImagen::where(
                            'producto_id',
                            $producto->id_producto
                        )
                            ->orderBy(
                                'orden'
                            )
                            ->first();

                    if (
                        $primeraImagen
                    ) {

                        $primeraImagen
                            ->update([
                                'principal' =>
                                    true,
                            ]);
                    }
                }
            }

            // ========================================================
            // COMMIT
            // ========================================================

            DB::commit();

            return redirect()
                ->route(
                    'productos.show',
                    $producto->id_producto
                )
                ->with(
                    'success',
                    'Producto actualizado correctamente.'
                );

        } catch (
            Throwable $e
        ) {

            if (
                DB::transactionLevel() > 0
            ) {
                DB::rollBack();
            }

            Log::error(
                'Error al actualizar producto',
                [
                    'producto_id' =>
                        $producto->id_producto,

                    'mensaje' =>
                        $e->getMessage(),

                    'archivo' =>
                        $e->getFile(),

                    'linea' =>
                        $e->getLine(),
                ]
            );

            return back()
                ->withErrors([
                    'error' =>
                        'No se pudo actualizar el producto: ' .
                        $e->getMessage(),
                ])
                ->withInput();
        }
    }

    /**
     * Eliminar producto.
     */
    public function destroy(
        Producto $producto
    ) {
        try {

            DB::beginTransaction();

            // --------------------------------------------------------
            // Eliminar imágenes de Supabase
            // --------------------------------------------------------

            foreach (
                $producto->imagenes
                as $imagen
            ) {

                try {

                    $path =
                        $this->obtenerPathStorage(
                            $imagen->url
                        );

                    if ($path) {

                        app('supabase')
                            ->storage
                            ->remove(
                                'productos',
                                [$path]
                            );
                    }

                } catch (
                    Throwable $e
                ) {

                    Log::warning(
                        'No se pudo eliminar imagen de Supabase',
                        [
                            'imagen_id' =>
                                $imagen
                                    ->id_producto_imagen,

                            'error' =>
                                $e->getMessage(),
                        ]
                    );
                }
            }

            // --------------------------------------------------------
            // Eliminar producto
            // --------------------------------------------------------

            /*
             * producto_imagen y producto_variante
             * tienen ON DELETE CASCADE.
             */
            $producto->delete();

            DB::commit();

            return redirect()
                ->route(
                    'productos.index'
                )
                ->with(
                    'success',
                    'Producto eliminado correctamente.'
                );

        } catch (
            Throwable $e
        ) {

            if (
                DB::transactionLevel() > 0
            ) {
                DB::rollBack();
            }

            Log::error(
                'Error al eliminar producto',
                [
                    'producto_id' =>
                        $producto->id_producto,

                    'mensaje' =>
                        $e->getMessage(),
                ]
            );

            return back()
                ->withErrors([
                    'error' =>
                        'No se pudo eliminar el producto. ' .
                        $e->getMessage(),
                ]);
        }
    }

    /**
     * Obtener path de Storage a partir de una URL pública.
     */
    private function obtenerPathStorage(
        ?string $url
    ): ?string {
        if (!$url) {
            return null;
        }

        /*
         * Ejemplo:
         *
         * https://xxxxx.supabase.co/storage/v1/object/public/productos/1/imagen-1.webp
         *
         * Resultado:
         *
         * 1/imagen-1.webp
         */

        $marcador =
            '/storage/v1/object/public/productos/';

        $posicion =
            strpos(
                $url,
                $marcador
            );

        if (
            $posicion === false
        ) {
            return null;
        }

        return substr(
            $url,
            $posicion +
                strlen($marcador)
        );
    }
}