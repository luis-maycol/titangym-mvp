import { Head, Link } from '@inertiajs/react';
import { CalendarCheck, Dumbbell } from 'lucide-react';
import EnrollmentStatusBadge from '@/components/enrollment-status-badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatDate, formatPen } from '@/lib/format';
import { dashboard } from '@/routes';
import { show } from '@/routes/enrollments';
import { index as plansIndex } from '@/routes/plans';
import type { Enrollment } from '@/types';

type Props = {
    currentEnrollment: Enrollment | null;
    latestEnrollment: Enrollment | null;
};

export default function Dashboard({
    currentEnrollment,
    latestEnrollment,
}: Props) {
    const openEnrollment =
        latestEnrollment && latestEnrollment.status !== 'active'
            ? latestEnrollment
            : null;

    return (
        <>
            <Head title="Mi panel" />
            <div className="grid gap-4 p-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardDescription className="flex items-center gap-2">
                            <CalendarCheck className="size-4" />
                            Mi membresía
                        </CardDescription>
                        {currentEnrollment ? (
                            <CardTitle className="flex items-center justify-between gap-2 text-xl">
                                Plan {currentEnrollment.plan.name}
                                <EnrollmentStatusBadge
                                    enrollment={currentEnrollment}
                                />
                            </CardTitle>
                        ) : (
                            <CardTitle className="text-xl">
                                Sin membresía activa
                            </CardTitle>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        {currentEnrollment ? (
                            <dl className="grid grid-cols-2 gap-y-1">
                                <dt className="text-muted-foreground">Desde</dt>
                                <dd className="text-right font-medium">
                                    {formatDate(currentEnrollment.starts_at)}
                                </dd>
                                <dt className="text-muted-foreground">Vence</dt>
                                <dd className="text-right font-medium">
                                    {formatDate(currentEnrollment.ends_at)}
                                </dd>
                            </dl>
                        ) : (
                            !openEnrollment && (
                                <>
                                    <p className="text-muted-foreground">
                                        Elige un plan y matricúlate en línea.
                                    </p>
                                    <Button asChild>
                                        <Link href={plansIndex()}>
                                            <Dumbbell />
                                            Ver planes
                                        </Link>
                                    </Button>
                                </>
                            )
                        )}
                    </CardContent>
                </Card>

                {openEnrollment && (
                    <Card>
                        <CardHeader>
                            <CardDescription>
                                Matrícula #{openEnrollment.id}
                            </CardDescription>
                            <CardTitle className="flex items-center justify-between gap-2 text-xl">
                                Plan {openEnrollment.plan.name}
                                <EnrollmentStatusBadge
                                    enrollment={openEnrollment}
                                />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <p className="text-muted-foreground">
                                {openEnrollment.status === 'rejected'
                                    ? (openEnrollment.rejection_reason ??
                                          'Tu comprobante fue rechazado.') +
                                      ' Sube una nueva captura.'
                                    : openEnrollment.receipt
                                      ? 'Tu comprobante está en revisión.'
                                      : `Falta pagar ${formatPen(openEnrollment.amount)} con Yape.`}
                            </p>
                            <Button
                                asChild
                                variant={
                                    openEnrollment.can_upload_receipt
                                        ? 'default'
                                        : 'outline'
                                }
                            >
                                <Link href={show(openEnrollment.id)}>
                                    {openEnrollment.can_upload_receipt
                                        ? 'Subir comprobante'
                                        : 'Ver matrícula'}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Mi panel',
            href: dashboard(),
        },
    ],
};
