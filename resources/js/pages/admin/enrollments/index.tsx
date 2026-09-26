import { Head, Link } from '@inertiajs/react';
import { ChevronRight, FileImage, UserPlus } from 'lucide-react';
import EnrollmentStatusBadge from '@/components/enrollment-status-badge';
import Heading from '@/components/heading';
import ListFilters from '@/components/list-filters';
import Pagination from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { formatDateTime, formatPen } from '@/lib/format';
import { create, index, show } from '@/routes/admin/enrollments';
import type { AdminEnrollment, EnrollmentStatus, Paginated } from '@/types';

type StatusFilter = EnrollmentStatus | 'all';

type Props = {
    enrollments: Paginated<AdminEnrollment>;
    filters: { status: StatusFilter; search: string };
    counts: Partial<Record<EnrollmentStatus, number>>;
};

const tabs: { value: StatusFilter; label: string }[] = [
    { value: 'pending', label: 'Pendientes' },
    { value: 'rejected', label: 'Rechazadas' },
    { value: 'active', label: 'Aprobadas' },
    { value: 'all', label: 'Todas' },
];

export default function AdminEnrollmentsIndex({
    enrollments,
    filters,
    counts,
}: Props) {
    const search = filters.search || undefined;

    return (
        <>
            <Head title="Matrículas" />
            <div className="space-y-4 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        title="Matrículas"
                        description="Valida los comprobantes de Yape. Las pendientes se muestran de la más antigua a la más reciente."
                    />
                    <Button asChild className="shrink-0">
                        <Link href={create()}>
                            <UserPlus />
                            Matrícula presencial
                        </Link>
                    </Button>
                </div>

                <ListFilters
                    tabs={tabs.map((tab) => ({
                        label: tab.label,
                        href: index.url({
                            query: { status: tab.value, search },
                        }),
                        active: filters.status === tab.value,
                        count:
                            tab.value === 'all'
                                ? undefined
                                : (counts[tab.value] ?? 0),
                    }))}
                    search={filters.search}
                    searchPlaceholder="Nombre, correo o DNI"
                    buildSearchUrl={(value) =>
                        index.url({
                            query: {
                                status: filters.status,
                                search: value || undefined,
                            },
                        })
                    }
                />

                {enrollments.data.length === 0 ? (
                    <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No hay matrículas en esta vista.
                    </p>
                ) : (
                    <ul className="divide-y rounded-lg border">
                        {enrollments.data.map((enrollment) => (
                            <li key={enrollment.id}>
                                <Link
                                    href={show(enrollment.id)}
                                    className="grid gap-1 p-4 transition-colors hover:bg-accent/50 md:grid-cols-[1fr_10rem_8rem_9rem_auto] md:items-center md:gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">
                                            {enrollment.client.name}
                                        </p>
                                        <p className="truncate text-sm text-muted-foreground">
                                            DNI {enrollment.client.dni ?? '—'} ·
                                            #{enrollment.id}
                                        </p>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium">
                                            {enrollment.plan.name}
                                        </span>{' '}
                                        · {formatPen(enrollment.amount)}
                                    </div>
                                    <div>
                                        <EnrollmentStatusBadge
                                            enrollment={enrollment}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                        {enrollment.receipt ? (
                                            <>
                                                <FileImage className="size-4" />
                                                {formatDateTime(
                                                    enrollment.receipt
                                                        .uploaded_at,
                                                )}
                                            </>
                                        ) : (
                                            'Sin comprobante'
                                        )}
                                    </div>
                                    <ChevronRight className="hidden size-4 text-muted-foreground md:block" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}

                <Pagination paginator={enrollments} />
            </div>
        </>
    );
}

AdminEnrollmentsIndex.layout = {
    breadcrumbs: [{ title: 'Matrículas', href: index() }],
};
