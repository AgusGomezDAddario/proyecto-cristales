import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6">
                <h1 className="text-2xl font-bold">Panel de Administrador</h1>
                <p>Acá podés gestionar usuarios, roles y más.</p>

                {/* 👉 Botón para ir al ABM de usuarios */}
                <div className="mt-6">
                    <Link
                        href="/admin/users"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Lista de Usuarios
                    </Link>
                </div>
            </div>

            <Head title="Dashboard" />
        </AppLayout>
    );
}
