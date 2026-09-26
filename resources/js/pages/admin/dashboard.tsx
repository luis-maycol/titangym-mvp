import { Head, Link } from '@inertiajs/react';
import {
    CalendarClock,
    ChevronRight,
    ClipboardCheck,
    Users,
    Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatDateTime, formatPen } from '@/lib/format';
import { dashboard } from '@/routes';
import { index as clientsIndex } from '@/routes/admin/clients';
import {
    index as enrollmentsIndex,
    show as enrollmentShow,
} from '@/routes/admin/enrollments';
import type { AdminEnrollment } from '@/types';

type Props = {
    stats: {
        awaiting_review: number;
        awaiting_payment: number;
        active_members: number;
        expiring_soon: number;
        total_clients: number;
        revenue_this_month: string;
    };
    revenueByPlan: { plan: string; total: number; revenue: string }[];
    awaitingReview: AdminEnrollment[];
    expiringWithinDays: number;
};

export default function AdminDashboard({
    stats,
    revenueByPlan,
    awaitingReview,
    expiringWithinDays,
}: Props) {
    const monthName = new Intl.DateTimeFormat('es-PE', {
        month: 'long',
    }).format(new Date());

    return (
        <>
            <Head title="Panel de administración" />
            <div className="space-y-4 p-4">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard
                        icon={ClipboardCheck}
                        label="Por validar"
                        value={stats.awaiting_review}
                        hint={`${stats.awaiting_payment} sin comprobante aún`}
                        href={enrollmentsIndex.url({
                            query: { status: 'pending' },
                        })}
                    />
                    <StatCard
                        icon={Users}
                        label="Miembros activos"
                        value={stats.active_members}
                        hint={`de ${stats.total_clients} clientes registrados`}
                        href={clientsIndex.url({
                            query: { membership: 'active' },
                        })}
                    />
                    <StatCard
                        icon={CalendarClock}
                        label="Por vencer"
                        value={stats.expiring_soon}
                        hint={`en los próximos ${expiringWithinDays} días`}
                        href={clientsIndex.url({
                            query: { membership: 'expiring' },
                        })}
                    />
                    <StatCard
                        icon={Wallet}
                        label={`Ingresos de ${monthName}`}
                        value={formatPen(stats.revenue_this_month)}
                        hint="pagos aprobados este mes"
                    />
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
                    <Card>
                        <CardHeader className="flex-row items-center justify-between">
                            <div className="space-y-1.5">
                                <CardTitle>Comprobantes por validar</CardTitle>
                                <CardDescription>
                                    Los más antiguos primero.
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={enrollmentsIndex()}>Ver todos</Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {awaitingReview.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    No hay comprobantes pendientes. 🎉
                                </p>
                            ) : (
                                <ul className="-mx-2 divide-y">
                                    {awaitingReview.map((enrollment) => (
                                        <li key={enrollment.id}>
                                            <Link
                                                href={enrollmentShow(
                                                    enrollment.id,
                                                )}
                                                className="flex items-center gap-3 rounded-md px-2 py-3 hover:bg-accent/50"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium">
                                                        {enrollment.client.name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {enrollment.plan.name} ·{' '}
                                                        {formatPen(
                                                            enrollment.amount,
                                                        )}{' '}
                                                        ·{' '}
                                                        {formatDateTime(
                                                            enrollment.receipt
                                                                ?.uploaded_at ??
                                                                null,
                                                        )}
                                                    </p>
                                                </div>
                                                <ChevronRight className="size-4 text-muted-foreground" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ingresos por plan</CardTitle>
                            <CardDescription>
                                Matrículas aprobadas en {monthName}.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {revenueByPlan.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    Aún no hay pagos aprobados este mes.
                                </p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="text-left text-muted-foreground">
                                        <tr>
                                            <th className="pb-2 font-medium">
                                                Plan
                                            </th>
                                            <th className="pb-2 text-right font-medium">
                                                Cant.
                                            </th>
                                            <th className="pb-2 text-right font-medium">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {revenueByPlan.map((row) => (
                                            <tr key={row.plan}>
                                                <td className="py-2">
                                                    {row.plan}
                                                </td>
                                                <td className="py-2 text-right tabular-nums">
                                                    {row.total}
                                                </td>
                                                <td className="py-2 text-right tabular-nums">
                                                    {formatPen(row.revenue)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    hint,
    href,
}: {
    icon: LucideIcon;
    label: string;
    value: string | number;
    hint: string;
    href?: string;
}) {
    const content = (
        <Card className="h-full gap-2 py-4 transition-colors">
            <CardHeader className="px-4">
                <CardDescription className="flex items-center gap-2">
                    <Icon className="size-4" />
                    {label}
                </CardDescription>
            </CardHeader>
            <CardContent className="px-4">
                <p className="text-2xl font-bold tabular-nums">{value}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
            </CardContent>
        </Card>
    );

    return href ? (
        <Link href={href} className="[&>div]:hover:bg-accent/40">
            {content}
        </Link>
    ) : (
        content
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Panel', href: dashboard() }],
};
