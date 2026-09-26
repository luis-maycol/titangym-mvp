import { Form, Head, Link } from '@inertiajs/react';
import { CircleCheck, Clock, QrCode, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { formatDate, formatDuration, formatPen } from '@/lib/format';
import { dashboard } from '@/routes';
import { store } from '@/routes/enrollments/receipts';
import type { Enrollment, YapeAccount } from '@/types';

type Props = {
    enrollment: Enrollment;
    yape: YapeAccount;
    maxUploadKilobytes: number;
};

export default function EnrollmentShow({
    enrollment,
    yape,
    maxUploadKilobytes,
}: Props) {
    return (
        <>
            <Head title="Pago de matrícula" />

            <div className="mx-auto grid max-w-lg gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-2">
                            <CardDescription>
                                Matrícula #{enrollment.id}
                            </CardDescription>
                            <EnrollmentStatusBadge enrollment={enrollment} />
                        </div>
                        <CardTitle className="flex items-baseline justify-between gap-2 text-xl">
                            <span>Plan {enrollment.plan.name}</span>
                            <span>{formatPen(enrollment.amount)}</span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Duración:{' '}
                            {formatDuration(enrollment.plan.duration_months)}
                        </p>
                    </CardHeader>
                </Card>

                <StatusMessage enrollment={enrollment} />

                {enrollment.can_upload_receipt && (
                    <>
                        <YapeInstructions
                            yape={yape}
                            amount={enrollment.amount}
                        />
                        <ReceiptUploadForm
                            enrollment={enrollment}
                            maxUploadKilobytes={maxUploadKilobytes}
                        />
                    </>
                )}
            </div>
        </>
    );
}

function StatusMessage({ enrollment }: { enrollment: Enrollment }) {
    if (enrollment.status === 'active') {
        return (
            <Alert>
                <CircleCheck />
                <AlertTitle>¡Tu membresía está activa!</AlertTitle>
                <AlertDescription>
                    <p>
                        Vigente del {formatDate(enrollment.starts_at)} al{' '}
                        {formatDate(enrollment.ends_at)}.
                    </p>
                    <Link href={dashboard()} className="font-medium underline">
                        Ir a mi panel
                    </Link>
                </AlertDescription>
            </Alert>
        );
    }

    if (enrollment.status === 'rejected') {
        return (
            <Alert variant="destructive">
                <TriangleAlert />
                <AlertTitle>Tu comprobante fue rechazado</AlertTitle>
                <AlertDescription>
                    <p>
                        {enrollment.rejection_reason ??
                            'No pudimos validar tu pago.'}{' '}
                        Sube una nueva captura para que la revisemos otra vez.
                    </p>
                </AlertDescription>
            </Alert>
        );
    }

    if (enrollment.receipt) {
        return (
            <Alert>
                <Clock />
                <AlertTitle>Pago en revisión</AlertTitle>
                <AlertDescription>
                    <p>
                        Recibimos tu comprobante
                        {enrollment.receipt.operation_code &&
                            ` (operación ${enrollment.receipt.operation_code})`}
                        . Un administrador lo validará pronto y tu membresía se
                        activará automáticamente.
                    </p>
                </AlertDescription>
            </Alert>
        );
    }

    return null;
}

function YapeInstructions({
    yape,
    amount,
}: {
    yape: YapeAccount;
    amount: string;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>1. Paga con Yape</CardTitle>
                <CardDescription>
                    Escanea el código QR desde tu app Yape y paga exactamente{' '}
                    <strong className="text-foreground">
                        {formatPen(amount)}
                    </strong>
                    .
                </CardDescription>
            </CardHeader>
            <CardContent className="grid justify-items-center gap-4">
                {yape.qr_url ? (
                    <img
                        src={yape.qr_url}
                        alt="Código QR de Yape de TitanGym"
                        width={240}
                        height={240}
                        className="size-60 rounded-lg border bg-white object-contain p-2"
                    />
                ) : (
                    <div className="flex size-60 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-center text-sm text-muted-foreground">
                        <QrCode className="size-10" />
                        <span className="px-4">
                            QR no disponible. Yapea al número indicado abajo.
                        </span>
                    </div>
                )}
                <dl className="grid w-full grid-cols-2 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">Número Yape</dt>
                    <dd className="text-right font-medium">{yape.phone}</dd>
                    <dt className="text-muted-foreground">Titular</dt>
                    <dd className="text-right font-medium">{yape.holder}</dd>
                </dl>
            </CardContent>
        </Card>
    );
}

function ReceiptUploadForm({
    enrollment,
    maxUploadKilobytes,
}: {
    enrollment: Enrollment;
    maxUploadKilobytes: number;
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>2. Sube tu comprobante</CardTitle>
                <CardDescription>
                    Adjunta la captura de pantalla del pago (JPG, PNG o WEBP,
                    máximo {Math.round(maxUploadKilobytes / 1024)} MB).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form
                    {...store.form(enrollment.id)}
                    disableWhileProcessing
                    onSuccess={() => setPreviewUrl(null)}
                    className="grid gap-5"
                >
                    {({ processing, progress, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="receipt">Captura de Yape</Label>
                                <Input
                                    id="receipt"
                                    name="receipt"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    required
                                    onChange={(event) => {
                                        const file = event.target.files?.[0];
                                        setPreviewUrl(
                                            file
                                                ? URL.createObjectURL(file)
                                                : null,
                                        );
                                    }}
                                />
                                <InputError message={errors.receipt} />
                            </div>

                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Vista previa del comprobante"
                                    className="max-h-80 w-full rounded-lg border object-contain"
                                />
                            )}

                            <div className="grid gap-2">
                                <Label htmlFor="operation_code">
                                    Número de operación (opcional)
                                </Label>
                                <Input
                                    id="operation_code"
                                    name="operation_code"
                                    inputMode="numeric"
                                    maxLength={30}
                                    placeholder="Ej. 12345678"
                                />
                                <InputError message={errors.operation_code} />
                            </div>

                            {progress && (
                                <progress
                                    value={progress.percentage}
                                    max="100"
                                    className="w-full"
                                />
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Enviar comprobante
                            </Button>
                        </>
                    )}
                </Form>
            </CardContent>
        </Card>
    );
}
