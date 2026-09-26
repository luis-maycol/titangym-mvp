import { Form, Head, Link, router } from '@inertiajs/react';
import { Check, Search, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import { cn } from '@/lib/utils';
import { create, index, store } from '@/routes/admin/enrollments';
import type { Plan } from '@/types';

type ClientMatch = {
    id: number;
    name: string;
    email: string;
    dni: string | null;
    current_ends_at: string | null;
};

type Props = {
    plans: Plan[];
    search: string;
    clients: ClientMatch[];
};

type ClientType = 'existing' | 'new';

export default function AdminEnrollmentCreate({
    plans,
    search,
    clients,
}: Props) {
    const [clientType, setClientType] = useState<ClientType>('existing');
    const [query, setQuery] = useState(search);
    const [selectedClient, setSelectedClient] = useState<ClientMatch | null>(
        null,
    );
    const [planId, setPlanId] = useState<number | null>(
        plans.find((plan) => plan.is_featured)?.id ?? plans[0]?.id ?? null,
    );
    const selectedPlan = plans.find((plan) => plan.id === planId);

    const searchClients = () => {
        router.get(
            create.url({ query: { search: query.trim() || undefined } }),
            {},
            { only: ['clients', 'search'], preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Nueva matrícula presencial" />
            <div className="mx-auto max-w-3xl space-y-4 p-4">
                <Heading
                    title="Nueva matrícula presencial"
                    description="Para clientes que pagan en recepción. La membresía queda activa de inmediato desde hoy."
                />

                <Form
                    {...store.form()}
                    disableWhileProcessing
                    className="grid gap-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <input
                                type="hidden"
                                name="client_type"
                                value={clientType}
                            />

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        1. Cliente
                                    </CardTitle>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        <ChoiceButton
                                            active={clientType === 'existing'}
                                            onClick={() =>
                                                setClientType('existing')
                                            }
                                            icon={<Users />}
                                        >
                                            Cliente registrado
                                        </ChoiceButton>
                                        <ChoiceButton
                                            active={clientType === 'new'}
                                            onClick={() => setClientType('new')}
                                            icon={<UserPlus />}
                                        >
                                            Cliente nuevo
                                        </ChoiceButton>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {clientType === 'existing' ? (
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <Input
                                                    type="search"
                                                    value={query}
                                                    onChange={(event) =>
                                                        setQuery(
                                                            event.target.value,
                                                        )
                                                    }
                                                    onKeyDown={(event) => {
                                                        if (
                                                            event.key ===
                                                            'Enter'
                                                        ) {
                                                            event.preventDefault();
                                                            searchClients();
                                                        }
                                                    }}
                                                    placeholder="Buscar por nombre, correo o DNI"
                                                    aria-label="Buscar cliente"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={searchClients}
                                                >
                                                    <Search />
                                                    Buscar
                                                </Button>
                                            </div>

                                            <input
                                                type="hidden"
                                                name="user_id"
                                                value={selectedClient?.id ?? ''}
                                            />

                                            {search !== '' &&
                                                clients.length === 0 && (
                                                    <p className="text-sm text-muted-foreground">
                                                        No hay clientes que
                                                        coincidan. Regístralo
                                                        como cliente nuevo.
                                                    </p>
                                                )}

                                            {clients.length > 0 && (
                                                <ul className="divide-y rounded-lg border">
                                                    {clients.map((client) => (
                                                        <li key={client.id}>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedClient(
                                                                        client,
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm hover:bg-accent/50',
                                                                    selectedClient?.id ===
                                                                        client.id &&
                                                                        'bg-accent',
                                                                )}
                                                            >
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate font-medium">
                                                                        {
                                                                            client.name
                                                                        }
                                                                    </p>
                                                                    <p className="truncate text-muted-foreground">
                                                                        DNI{' '}
                                                                        {client.dni ??
                                                                            '—'}{' '}
                                                                        ·{' '}
                                                                        {
                                                                            client.email
                                                                        }
                                                                    </p>
                                                                    {client.current_ends_at && (
                                                                        <p className="text-xs text-amber-700 dark:text-amber-300">
                                                                            Membresía
                                                                            activa
                                                                            hasta
                                                                            el{' '}
                                                                            {formatDate(
                                                                                client.current_ends_at,
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {selectedClient?.id ===
                                                                    client.id && (
                                                                    <Check className="size-4 text-primary" />
                                                                )}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {selectedClient && (
                                                <p className="text-sm">
                                                    Seleccionado:{' '}
                                                    <strong>
                                                        {selectedClient.name}
                                                    </strong>
                                                </p>
                                            )}
                                            <InputError
                                                message={errors.user_id}
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Field
                                                id="name"
                                                label="Nombres y apellidos"
                                                error={errors.name}
                                                className="sm:col-span-2"
                                            />
                                            <Field
                                                id="email"
                                                label="Correo electrónico"
                                                type="email"
                                                error={errors.email}
                                                className="sm:col-span-2"
                                            />
                                            <Field
                                                id="dni"
                                                label="DNI"
                                                inputMode="numeric"
                                                maxLength={8}
                                                error={errors.dni}
                                            />
                                            <Field
                                                id="phone"
                                                label="Celular"
                                                type="tel"
                                                inputMode="numeric"
                                                maxLength={9}
                                                error={errors.phone}
                                            />
                                            <p className="text-xs text-muted-foreground sm:col-span-2">
                                                Le enviaremos un correo para que
                                                cree su contraseña y pueda ver
                                                su membresía en línea.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        2. Plan pagado en recepción
                                    </CardTitle>
                                    <CardDescription>
                                        Cobra el monto exacto antes de
                                        registrar.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <input
                                        type="hidden"
                                        name="plan_id"
                                        value={planId ?? ''}
                                    />
                                    <div className="grid gap-2 sm:grid-cols-3">
                                        {plans.map((plan) => (
                                            <ChoiceButton
                                                key={plan.id}
                                                active={plan.id === planId}
                                                onClick={() =>
                                                    setPlanId(plan.id)
                                                }
                                            >
                                                <span className="flex flex-col items-start">
                                                    <span className="font-semibold">
                                                        {plan.name}
                                                    </span>
                                                    <span className="text-xs opacity-80">
                                                        {formatPen(plan.price)}{' '}
                                                        ·{' '}
                                                        {formatDuration(
                                                            plan.duration_months,
                                                        )}
                                                    </span>
                                                </span>
                                            </ChoiceButton>
                                        ))}
                                    </div>
                                    <InputError message={errors.plan_id} />
                                </CardContent>
                            </Card>

                            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                                <Button type="button" variant="ghost" asChild>
                                    <Link href={index()}>Cancelar</Link>
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !selectedPlan ||
                                        (clientType === 'existing' &&
                                            !selectedClient)
                                    }
                                >
                                    {processing && <Spinner />}
                                    Registrar y activar
                                    {selectedPlan &&
                                        ` · ${formatPen(selectedPlan.price)}`}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

function ChoiceButton({
    active,
    onClick,
    icon,
    children,
}: {
    active: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                'flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors [&_svg]:size-4',
                active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'hover:bg-accent',
            )}
        >
            {icon}
            {children}
        </button>
    );
}

function Field({
    id,
    label,
    error,
    className,
    ...props
}: React.ComponentProps<typeof Input> & {
    id: string;
    label: string;
    error?: string;
}) {
    return (
        <div className={cn('grid gap-2', className)}>
            <Label htmlFor={id}>{label}</Label>
            <Input id={id} name={id} required {...props} />
            <InputError message={error} />
        </div>
    );
}

AdminEnrollmentCreate.layout = {
    breadcrumbs: [{ title: 'Matrículas', href: index() }],
};
