import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import ListFilters from '@/components/list-filters';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { index } from '@/routes/admin/clients';
import { show } from '@/routes/admin/enrollments';
import type { Client, Paginated } from '@/types';

type MembershipFilter = 'active' | 'expiring' | 'inactive' | 'all';

type Props = {
    clients: Paginated<Client>;
    filters: { membership: MembershipFilter; search: string };
    expiringWithinDays: number;
};

export default function AdminClientsIndex({
    clients,
    filters,
    expiringWithinDays,
}: Props) {
    const search = filters.search || undefined;
    const tabs: { value: MembershipFilter; label: string }[] = [
        { value: 'active', label: 'Activos' },
        { value: 'expiring', label: `Vencen en ${expiringWithinDays} días` },
        { value: 'inactive', label: 'Sin membresía vigente' },
        { value: 'all', label: 'Todos' },
    ];

    return (
        <>
            <Head title="Clientes" />
            <div className="space-y-4 p-4">
                <Heading
                    title="Clientes"
                    description="Membresía y fecha de vencimiento de cada cliente."
                />

                <ListFilters
                    tabs={tabs.map((tab) => ({
                        label: tab.label,
                        href: index.url({
                            query: { membership: tab.value, search },
                        }),
                        active: filters.membership === tab.value,
                    }))}
                    search={filters.search}
                    searchPlaceholder="Nombre, correo o DNI"
                    buildSearchUrl={(value) =>
                        index.url({
                            query: {
                                membership: filters.membership,
                                search: value || undefined,
                            },
                        })
                    }
                />

                {clients.data.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No hay clientes en esta vista.
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full min-w-[40rem] text-sm">
                            <thead className="bg-muted/50 text-left text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-2 font-medium">
                                        Cliente
                                    </th>
                                    <th className="px-4 py-2 font-medium">
                                        Contacto
                                    </th>
                                    <th className="px-4 py-2 font-medium">
                                        Plan
                                    </th>
                                    <th className="px-4 py-2 font-medium">
                                        Vence
                                    </th>
                                    <th className="px-4 py-2 font-medium">
                                        Estado
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {clients.data.map((client) => (
                                    <tr key={client.id}>
                                        <td className="px-4 py-3">
                                            <p className="font-medium">
                                                {client.name}
                                            </p>
                                            <p className="text-muted-foreground">
                                                DNI {client.dni ?? '—'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p>{client.phone ?? '—'}</p>
                                            <p className="text-muted-foreground">
                                                {client.email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {client.membership ? (
                                                <Link
                                                    href={show(
                                                        client.membership
                                                            .enrollment_id,
                                                    )}
                                                    className="underline underline-offset-4"
                                                >
                                                    {client.membership.plan}
                                                </Link>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {formatDate(
                                                client.membership?.ends_at ??
                                                    null,
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <MembershipBadge
                                                client={client}
                                                expiringWithinDays={
                                                    expiringWithinDays
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <Pagination paginator={clients} />
            </div>
        </>
    );
}

function MembershipBadge({
    client,
    expiringWithinDays,
}: {
    client: Client;
    expiringWithinDays: number;
}) {
    const membership = client.membership;

    if (!membership) {
        return <Badge variant="outline">Sin membresía</Badge>;
    }

    if (membership.is_expired) {
        return <Badge variant="outline">Vencida</Badge>;
    }

    const expiringSoon = membership.days_left <= expiringWithinDays;

    return (
        <Badge
            variant="outline"
            className={cn(
                expiringSoon
                    ? 'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
            )}
        >
            {expiringSoon
                ? membership.days_left === 0
                    ? 'Vence hoy'
                    : `Vence en ${membership.days_left} d`
                : 'Activa'}
        </Badge>
    );
}

AdminClientsIndex.layout = {
    breadcrumbs: [{ title: 'Clientes', href: index() }],
};
