import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export const PERMISSIONS = {
    dashboardView: 'dashboard.view',
    adminCatalogsManage: 'admin.catalogs.manage',
    ordersManage: 'orders.manage',
    usersManage: 'users.manage',
    financeDashboardView: 'finance.dashboard.view',
    financeMetricsView: 'finance.metrics.view',
    financeReportsView: 'finance.reports.view',
    financeMovementsView: 'finance.movements.view',
    financeAmountsView: 'finance.amounts.view',
} as const;

export function useAuthorization() {
    const page = usePage<SharedData>();
    const permissions = page.props.authorization?.permissions ?? page.props.auth.user?.permissions ?? [];

    return {
        permissions,
        has: (permission: string) => permissions.includes(permission),
    };
}
