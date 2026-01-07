<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Resumen del día - {{ $fecha }}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #111; }
        .header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:16px; }
        .title { font-size: 18px; font-weight: 700; }
        .meta { font-size: 12px; color:#444; }
        .grid { display:grid; grid-template-columns: 1fr 1fr 1fr; gap:12px; margin: 12px 0 18px; }
        .card { border:1px solid #ddd; padding:10px; border-radius:6px; }
        .card .label { font-size: 11px; color:#555; }
        .card .value { font-size: 16px; font-weight: 700; margin-top:4px; }

        table { width:100%; border-collapse: collapse; margin-top:8px; }
        th, td { border:1px solid #ddd; padding:8px; font-size:12px; }
        th { background:#f3f3f3; text-align:left; }
        td.num { text-align:right; }
        td.center { text-align:center; }

        @media print {
            .no-print { display:none; }
            body { margin: 0; }
        }
    </style>
</head>
<body>

<div class="no-print" style="margin-bottom:10px;">
    <button onclick="window.print()">Imprimir</button>
</div>

<div class="header">
    <div class="title">Resumen del día</div>
    <div class="meta">
        Fecha: <strong>{{ $fecha }}</strong><br>
        Caja: <strong>
            @if($cashbox['status'] === 'NOT_OPENED') Sin apertura
            @elseif($cashbox['status'] === 'OPEN') Abierta
            @else Cerrada
            @endif
        </strong>
    </div>
</div>

<div class="grid">
    <div class="card">
        <div class="label">Ingresos</div>
        <div class="value">$ {{ number_format($kpis['ingresos'], 2, ',', '.') }}</div>
    </div>
    <div class="card">
        <div class="label">Egresos</div>
        <div class="value">$ {{ number_format($kpis['egresos'], 2, ',', '.') }}</div>
    </div>
    <div class="card">
        <div class="label">Neto</div>
        <div class="value">$ {{ number_format($kpis['neto'], 2, ',', '.') }}</div>
    </div>
</div>

<h3 style="margin:0;">Ingresos por medio de pago</h3>
<table>
    <thead>
    <tr>
        <th>Medio</th>
        <th class="center">Cantidad</th>
        <th class="num">Total</th>
        <th class="num">%</th>
    </tr>
    </thead>
    <tbody>
    @foreach($ingresosPorMedio as $row)
        <tr>
            <td>{{ $row->medio }}</td>
            <td class="center">{{ $row->cantidad }}</td>
            <td class="num">$ {{ number_format($row->total, 2, ',', '.') }}</td>
            <td class="num">{{ number_format($row->porcentaje, 2, ',', '.') }}%</td>
        </tr>
    @endforeach
    </tbody>
</table>

<h3 style="margin-top:18px; margin-bottom:0;">Egresos por medio de pago</h3>
<table>
    <thead>
    <tr>
        <th>Medio</th>
        <th class="center">Cantidad</th>
        <th class="num">Total</th>
        <th class="num">%</th>
    </tr>
    </thead>
    <tbody>
    @foreach($egresosPorMedio as $row)
        <tr>
            <td>{{ $row->medio }}</td>
            <td class="center">{{ $row->cantidad }}</td>
            <td class="num">$ {{ number_format($row->total, 2, ',', '.') }}</td>
            <td class="num">{{ number_format($row->porcentaje, 2, ',', '.') }}%</td>
        </tr>
    @endforeach
    </tbody>
</table>

</body>
</html>
