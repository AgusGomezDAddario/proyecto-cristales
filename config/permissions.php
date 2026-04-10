<?php

return [
    'capabilities' => [
        'dashboard.view' => 'Acceso al panel operativo principal',
        'admin.catalogs.manage' => 'Acceso a catálogos y maestros administrativos',
        'orders.manage' => 'Gestión operativa de órdenes',
        'users.manage' => 'Gestión de usuarios',
        'finance.dashboard.view' => 'Visualización de indicadores financieros del dashboard',
        'finance.metrics.view' => 'Visualización de métricas financieras',
        'finance.reports.view' => 'Visualización de reportes económicos y cierres',
        'finance.movements.view' => 'Visualización de ingresos y egresos',
        'finance.amounts.view' => 'Visualización de montos y totales sensibles',
    ],

    'roles' => [
        'administrador' => [
            'dashboard.view',
            'admin.catalogs.manage',
            'orders.manage',
            'users.manage',
            'finance.dashboard.view',
            'finance.metrics.view',
            'finance.reports.view',
            'finance.movements.view',
            'finance.amounts.view',
        ],
        'admin' => [
            'dashboard.view',
            'admin.catalogs.manage',
            'orders.manage',
            'users.manage',
            'finance.dashboard.view',
            'finance.metrics.view',
            'finance.reports.view',
            'finance.movements.view',
            'finance.amounts.view',
        ],
        'cajero' => [
            'dashboard.view',
            'admin.catalogs.manage',
            'orders.manage',
        ],
        'taller' => [
            'dashboard.view',
            'orders.manage',
        ],
    ],
];
