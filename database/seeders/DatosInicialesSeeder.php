<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatosInicialesSeeder extends Seeder
{
    public function run(): void
    {
        /* ============================================================
         |  ROLES  (tabla: rol)
         * ============================================================ */
        DB::table('rol')->upsert(
            [
                ['role_id' => 1, 'descripcion' => 'Administrador'],
                ['role_id' => 2, 'descripcion' => 'Cajero'],
                ['role_id' => 3, 'descripcion' => 'Taller'],
            ],
            ['role_id'],
            ['descripcion']
        );

        /* ============================================================
         |  USERS  (tabla: users)
         * ============================================================ */
        DB::table('users')->upsert(
            [
                [
                    'name'       => 'Admin',
                    'password'   => Hash::make('admin123'),
                    'role_id'    => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name'       => 'Cajero',
                    'password'   => Hash::make('editor123'),
                    'role_id'    => 2,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'name'       => 'Taller',
                    'password'   => Hash::make('user123'),
                    'role_id'    => 3,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ],
            ['name'],
            ['password', 'role_id', 'updated_at']
        );

        /* ============================================================
         |  CONCEPTOS  (tabla: concepto)
         * ============================================================ */
        DB::table('concepto')->upsert(
            [
                // Conceptos típicos de EGRESOS
                ['nombre' => 'Materiales'],
                ['nombre' => 'Insumos / Repuestos'],
                ['nombre' => 'Herramientas'],
                ['nombre' => 'Combustible'],
                ['nombre' => 'Servicios (luz, agua, internet)'],
                ['nombre' => 'Gastos varios'],
                ['nombre' => 'Adelanto de personal'],

                // Conceptos típicos de INGRESOS
                ['nombre' => 'Venta de cristal'],
                ['nombre' => 'Colocación / Mano de obra'],
                ['nombre' => 'Servicio a domicilio'],
                ['nombre' => 'Otros ingresos'],
            ],
            ['nombre'],  // clave única lógica
            []           // no actualiza nada si existe
        );

        /* ============================================================
         |  MEDIOS DE PAGO  (tabla: medio_de_pago)
         * ============================================================ */
        DB::table('medio_de_pago')->upsert(
            [
                ['nombre' => 'Efectivo'],
                ['nombre' => 'Crédito'],
                ['nombre' => 'Débito'],
                ['nombre' => 'Transferencia'],
                ['nombre' => 'Cheque'],
            ],
            ['nombre'],
            []
        );

        /* ============================================================
         |  ESTADO  (tabla: estado)
         * ============================================================ */
        DB::table('estado')->upsert(
            [
                ['nombre' => 'Iniciado'],
                ['nombre' => 'Pendiente'],
                ['nombre' => 'Completada'],
                ['nombre' => 'Pagado'],
            ],
            ['nombre'],
            []
        );
    }
}
