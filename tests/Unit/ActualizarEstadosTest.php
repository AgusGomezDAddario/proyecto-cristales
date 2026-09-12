<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

uses(Tests\TestCase::class);

test('actualiza estados conservando ordenes e historial y permite repetir la migracion', function () {
    config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
    DB::purge('sqlite');
    Schema::create('estado', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
    });
    foreach (['orden_de_trabajo', 'orden_de_trabajo_historial_estados'] as $tabla) {
        Schema::create($tabla, function (Blueprint $table) {
            $table->id();
            $table->foreignId('estado_id')->constrained('estado');
        });
    }
    DB::table('estado')->insert([
        ['id' => 1, 'nombre' => 'Completada por taller'],
        ['id' => 2, 'nombre' => 'Finalizada'],
        ['id' => 3, 'nombre' => 'En taller'],
    ]);
    foreach (['orden_de_trabajo', 'orden_de_trabajo_historial_estados'] as $tabla) {
        DB::table($tabla)->insert([['estado_id' => 1], ['estado_id' => 2], ['estado_id' => 3]]);
    }

    $migration = require database_path('migrations/2026_09_12_000001_actualizar_estados_de_ordenes.php');
    $migration->up();
    $migration->up();

    expect(DB::table('estado')->where('id', 2)->value('nombre'))->toBe('Finalizada - Para Retirar');
    expect(DB::table('estado')->where('nombre', 'Retirada')->count())->toBe(1);
    expect(DB::table('estado')->where('nombre', 'Completada por taller')->exists())->toBeFalse();
    foreach (['orden_de_trabajo', 'orden_de_trabajo_historial_estados'] as $tabla) {
        expect(DB::table($tabla)->orderBy('id')->pluck('estado_id')->all())->toBe([2, 2, 3]);
    }
});
