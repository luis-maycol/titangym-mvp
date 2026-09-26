import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
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
import { formatDuration, formatPen } from '@/lib/format';
import { login } from '@/routes';
import { store } from '@/routes/enrollments';
import { index as plansIndex } from '@/routes/plans';
import type { Plan } from '@/types';

type Props = {
    plan: Plan;
    needsAccount: boolean;
    needsProfile: boolean;
};

export default function EnrollmentCreate({
    plan,
    needsAccount,
    needsProfile,
}: Props) {
    return (
        <>
            <Head title={`Matrícula · ${plan.name}`} />

            <div className="mx-auto grid max-w-lg gap-6">
                <Card>
                    <CardHeader>
                        <CardDescription>Plan seleccionado</CardDescription>
                        <CardTitle className="flex items-baseline justify-between gap-2 text-xl">
                            <span>{plan.name}</span>
                            <span>{formatPen(plan.price)}</span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Duración: {formatDuration(plan.duration_months)} ·{' '}
                            <TextLink href={plansIndex()}>
                                Cambiar plan
                            </TextLink>
                        </p>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {needsAccount
                                ? 'Crea tu cuenta'
                                : 'Confirma tu matrícula'}
                        </CardTitle>
                        <CardDescription>
                            {needsAccount
                                ? 'Con esta cuenta podrás ver el estado de tu membresía.'
                                : 'En el siguiente paso pagarás con Yape y subirás tu comprobante.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...store.form(plan.slug)}
                            resetOnError={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="grid gap-5"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {needsAccount && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">
                                                    Nombres y apellidos
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    required
                                                    autoFocus
                                                    autoComplete="name"
                                                />
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">
                                                    Correo electrónico
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoComplete="email"
                                                    placeholder="tucorreo@ejemplo.com"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {needsProfile && (
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="dni">DNI</Label>
                                                <Input
                                                    id="dni"
                                                    name="dni"
                                                    required
                                                    inputMode="numeric"
                                                    maxLength={8}
                                                    placeholder="12345678"
                                                />
                                                <InputError
                                                    message={errors.dni}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone">
                                                    Celular
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    name="phone"
                                                    required
                                                    inputMode="numeric"
                                                    maxLength={9}
                                                    autoComplete="tel-national"
                                                    placeholder="987654321"
                                                />
                                                <InputError
                                                    message={errors.phone}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {needsAccount && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="password">
                                                    Contraseña
                                                </Label>
                                                <PasswordInput
                                                    id="password"
                                                    name="password"
                                                    required
                                                    autoComplete="new-password"
                                                />
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="password_confirmation">
                                                    Confirmar contraseña
                                                </Label>
                                                <PasswordInput
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    required
                                                    autoComplete="new-password"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing && <Spinner />}
                                        Continuar al pago
                                    </Button>

                                    {needsAccount && (
                                        <p className="text-center text-sm text-muted-foreground">
                                            ¿Ya tienes cuenta?{' '}
                                            <TextLink href={login()}>
                                                Inicia sesión
                                            </TextLink>
                                        </p>
                                    )}
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
