import { Form, Head, usePage } from '@inertiajs/react';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import InputError from '@/components/input-error';
import SectionHeading from '@/components/section-heading';
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
import { store } from '@/routes/contact';

export default function Contact() {
    const { gym } = usePage().props;

    return (
        <>
            <Head title="Contacto">
                <meta
                    name="description"
                    content="Escríbenos o visítanos en Ayacucho. Dirección, horario, mapa y formulario de contacto de TitanGym."
                />
            </Head>

            <SectionHeading
                as="h1"
                eyebrow="Contacto"
                title="¿Hablamos?"
                description="Resolvemos tus dudas sobre planes, horarios o clases. Respondemos en menos de 24 horas."
            />

            <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
                <Card>
                    <CardHeader>
                        <CardTitle>Envíanos un mensaje</CardTitle>
                        <CardDescription>
                            Te responderemos al correo que indiques.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...store.form()}
                            resetOnSuccess
                            disableWhileProcessing
                            options={{ preserveScroll: true }}
                            className="grid gap-4 sm:grid-cols-2"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            maxLength={100}
                                            autoComplete="name"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Correo electrónico
                                        </Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">
                                            Celular (opcional)
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            inputMode="numeric"
                                            maxLength={9}
                                            autoComplete="tel-national"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="message">Mensaje</Label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            minLength={10}
                                            maxLength={2000}
                                            rows={5}
                                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                                            placeholder="Cuéntanos en qué podemos ayudarte"
                                        />
                                        <InputError message={errors.message} />
                                    </div>

                                    <div
                                        aria-hidden="true"
                                        className="absolute -left-[9999px]"
                                    >
                                        <label htmlFor="website">
                                            No completar
                                        </label>
                                        <input
                                            id="website"
                                            name="website"
                                            tabIndex={-1}
                                            autoComplete="off"
                                        />
                                    </div>
                                    <InputError
                                        message={errors.website}
                                        className="sm:col-span-2"
                                    />

                                    <Button
                                        type="submit"
                                        className="sm:col-span-2 sm:w-fit"
                                        disabled={processing}
                                    >
                                        {processing ? <Spinner /> : <Send />}
                                        Enviar mensaje
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="space-y-4 text-sm">
                        <InfoRow icon={MapPin} title="Dirección">
                            <a
                                href={gym.maps_url}
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-4"
                            >
                                {gym.address}
                            </a>
                        </InfoRow>
                        <InfoRow icon={Phone} title="Teléfono">
                            <a href={`tel:${gym.phone.replace(/\s/g, '')}`}>
                                {gym.phone}
                            </a>
                        </InfoRow>
                        <InfoRow icon={Mail} title="Correo">
                            <a href={`mailto:${gym.email}`}>{gym.email}</a>
                        </InfoRow>
                        <InfoRow icon={Clock} title="Horario">
                            <ul>
                                {gym.hours.map((slot) => (
                                    <li key={slot.days}>
                                        {slot.days}: {slot.time}
                                    </li>
                                ))}
                            </ul>
                        </InfoRow>
                        <Button variant="outline" className="w-full" asChild>
                            <a
                                href={`https://wa.me/${gym.whatsapp}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <MessageCircle />
                                Escríbenos por WhatsApp
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <section className="mt-10">
                <h2 className="mb-3 text-lg font-semibold">Cómo llegar</h2>
                <div className="overflow-hidden rounded-xl border">
                    <iframe
                        title={`Mapa de ubicación: ${gym.address}`}
                        src={gym.maps_embed_url}
                        className="aspect-[4/3] w-full sm:aspect-[16/7]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                </div>
            </section>
        </>
    );
}

function InfoRow({
    icon: Icon,
    title,
    children,
}: {
    icon: typeof MapPin;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex gap-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-titan-gold" />
            <div>
                <p className="font-medium">{title}</p>
                <div className="text-muted-foreground">{children}</div>
            </div>
        </div>
    );
}
