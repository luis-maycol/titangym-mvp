import { Form, Head } from '@inertiajs/react';
import { Check, ExternalLink, X } from 'lucide-react';
import EnrollmentStatusBadge from '@/components/enrollment-status-badge';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    formatDate,
    formatDateTime,
    formatDuration,
    formatPen,
} from '@/lib/format';
import { approve, index, reject } from '@/routes/admin/enrollments';
import type { AdminEnrollment } from '@/types';

export default function AdminEnrollmentShow({
    enrollment,
}: {
    enrollment: AdminEnrollment;
}) {
    const receipt = enrollment.receipt;
    const olderReceipts = (enrollment.receipts ?? []).filter(
        (item) => item.id !== receipt?.id,
    );

    return (
        <>
            <Head title={`Matrícula #${enrollment.id}`} />
            <div className="grid gap-4 p-4 lg:grid-cols-[1fr_22rem]">
                <Card className="order-2 lg:order-1">
                    <CardHeader>
                        <CardTitle>Comprobante de Yape</CardTitle>
                        <CardDescription>
                            {receipt
                                ? `Subido el ${formatDateTime(receipt.uploaded_at)}${receipt.operation_code ? ` · Operación ${receipt.operation_code}` : ''}`
                                : enrollment.payment_method === 'cash'
                                  ? 'Pago presencial en recepción: no requiere comprobante.'
                                  : 'El cliente aún no sube su comprobante.'}
                        </CardDescription>
                    </CardHeader>
                    {receipt && (
                        <CardContent className="space-y-3">
                            <a
                                href={receipt.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                            >
                                <img
                                    src={receipt.url}
                                    alt={`Comprobante de ${enrollment.client.name}`}
                                    className="mx-auto max-h-[70vh] rounded-lg border bg-muted object-contain"
                                />
                            </a>
                            <Button variant="outline" size="sm" asChild>
                                <a
                                    href={receipt.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <ExternalLink />
                                    Abrir en tamaño completo
                                </a>
                            </Button>
                        </CardContent>
                    )}
                </Card>

                <div className="order-1 space-y-4 lg:order-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between gap-2">
                                <CardDescription>
                                    Matrícula #{enrollment.id}
                                </CardDescription>
                                <EnrollmentStatusBadge
                                    enrollment={enrollment}
                                />
                            </div>
                            <CardTitle className="text-xl">
                                {enrollment.client.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
                                <dt className="text-muted-foreground">DNI</dt>
                                <dd className="text-right">
                                    {enrollment.client.dni ?? '—'}
                                </dd>
                                <dt className="text-muted-foreground">
                                    Celular
                                </dt>
                                <dd className="text-right">
                                    {enrollment.client.phone ?? '—'}
                                </dd>
                                <dt className="text-muted-foreground">
                                    Correo
                                </dt>
                                <dd className="truncate text-right">
                                    {enrollment.client.email}
                                </dd>
                                <dt className="text-muted-foreground">Plan</dt>
                                <dd className="text-right">
                                    {enrollment.plan.name} (
                                    {formatDuration(
                                        enrollment.plan.duration_months,
                                    )}
                                    )
                                </dd>
                                <dt className="text-muted-foreground">Monto</dt>
                                <dd className="text-right text-base font-semibold">
                                    {formatPen(enrollment.amount)}
                                </dd>
                                <dt className="text-muted-foreground">Pago</dt>
                                <dd className="text-right">
                                    {enrollment.payment_method_label}
                                </dd>
                                {enrollment.status === 'active' && (
                                    <>
                                        <dt className="text-muted-foreground">
                                            Vigencia
                                        </dt>
                                        <dd className="text-right">
                                            {formatDate(enrollment.starts_at)} –{' '}
                                            {formatDate(enrollment.ends_at)}
                                        </dd>
                                    </>
                                )}
                                {enrollment.reviewer && (
                                    <>
                                        <dt className="text-muted-foreground">
                                            Revisado por
                                        </dt>
                                        <dd className="text-right">
                                            {enrollment.reviewer} ·{' '}
                                            {formatDateTime(
                                                enrollment.reviewed_at,
                                            )}
                                        </dd>
                                    </>
                                )}
                            </dl>
                        </CardContent>
                    </Card>

                    {enrollment.status === 'rejected' && (
                        <Alert variant="destructive">
                            <X />
                            <AlertTitle>Comprobante rechazado</AlertTitle>
                            <AlertDescription>
                                {enrollment.rejection_reason ?? 'Sin motivo.'}{' '}
                                Esperando que el cliente suba una nueva captura.
                            </AlertDescription>
                        </Alert>
                    )}

                    {enrollment.can_review && (
                        <ReviewActions enrollment={enrollment} />
                    )}

                    {olderReceipts.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Comprobantes anteriores
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1 text-sm">
                                    {olderReceipts.map((item) => (
                                        <li key={item.id}>
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="underline underline-offset-4"
                                            >
                                                {formatDateTime(
                                                    item.uploaded_at,
                                                )}
                                            </a>
                                            {item.operation_code &&
                                                ` · Op. ${item.operation_code}`}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

function ReviewActions({ enrollment }: { enrollment: AdminEnrollment }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Validar pago</CardTitle>
                <CardDescription>
                    Verifica que el monto y el titular coincidan en tu app de
                    Yape antes de aprobar.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>
                            <Check />
                            Aprobar
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>¿Aprobar el pago?</DialogTitle>
                        <DialogDescription>
                            La membresía {enrollment.plan.name} de{' '}
                            {enrollment.client.name} se activará desde hoy por{' '}
                            {formatDuration(enrollment.plan.duration_months)}.
                        </DialogDescription>
                        <Form {...approve.form(enrollment.id)}>
                            {({ processing }) => (
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                        >
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={processing}>
                                        {processing && <Spinner />}
                                        Sí, aprobar
                                    </Button>
                                </DialogFooter>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="destructive">
                            <X />
                            Rechazar
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Rechazar comprobante</DialogTitle>
                        <DialogDescription>
                            El cliente verá este motivo y podrá subir una nueva
                            captura desde su panel.
                        </DialogDescription>
                        <Form
                            {...reject.form(enrollment.id)}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="reason">Motivo</Label>
                                        <textarea
                                            id="reason"
                                            name="reason"
                                            required
                                            maxLength={255}
                                            rows={3}
                                            placeholder="Ej. El monto no coincide con el plan."
                                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                        />
                                        <InputError message={errors.reason} />
                                    </div>
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                            >
                                                Cancelar
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            Rechazar
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

AdminEnrollmentShow.layout = {
    breadcrumbs: [{ title: 'Matrículas', href: index() }],
};
