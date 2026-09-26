import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, MapPin, MessageCircle, Target, Telescope } from 'lucide-react';
import CdnImage from '@/components/cdn-image';
import SectionHeading from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { values } from '@/lib/site-content';
import { contact } from '@/routes';
import { index as plansIndex } from '@/routes/plans';

export default function About() {
    const { gym, name } = usePage().props;

    return (
        <>
            <Head title="Nosotros">
                <meta
                    name="description"
                    content="Conoce la historia, misión y valores de TitanGym, tu gimnasio de barrio con entrenadores certificados."
                />
            </Head>

            <SectionHeading
                as="h1"
                eyebrow="Nosotros"
                title={`Somos ${name}`}
                description="Un gimnasio local hecho por entrenadores, para personas que quieren resultados reales."
            />

            <div className="grid items-center gap-8 md:grid-cols-2">
                <CdnImage
                    src="images/site/about.jpg"
                    alt={`Equipo de ${name}`}
                    width={800}
                    height={600}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="aspect-[4/3] w-full rounded-xl"
                />
                <div className="space-y-4 text-pretty text-muted-foreground">
                    <p>
                        Abrimos nuestras puertas con una idea simple: que
                        entrenar bien no debería ser complicado ni caro.
                        Empezamos con una sala pequeña y un grupo de vecinos que
                        querían ponerse en forma.
                    </p>
                    <p>
                        Hoy contamos con sala de musculación, zona funcional,
                        sala de clases grupales y un equipo de entrenadores que
                        te acompaña desde tu primera evaluación física.
                    </p>
                    <p>
                        Y ahora puedes matricularte desde tu celular: eliges tu
                        plan, pagas con Yape y listo.
                    </p>
                </div>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <Target className="size-6 text-titan-gold" />
                        <CardTitle>Misión</CardTitle>
                        <CardDescription className="text-pretty">
                            Ayudar a cada persona a mejorar su salud y su fuerza
                            con entrenamiento guiado, seguro y accesible.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Telescope className="size-6 text-titan-gold" />
                        <CardTitle>Visión</CardTitle>
                        <CardDescription className="text-pretty">
                            Ser el gimnasio de referencia de la ciudad por la
                            calidad de sus entrenadores y la comunidad que
                            construye.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <section className="mt-16">
                <SectionHeading title="Nuestros valores" />
                <div className="grid gap-4 md:grid-cols-3">
                    {values.map((value, index) => (
                        <Card key={value.title}>
                            <CardHeader>
                                <span className="text-3xl font-extrabold text-titan-gold/30">
                                    0{index + 1}
                                </span>
                                <CardTitle>{value.title}</CardTitle>
                                <CardDescription className="text-pretty">
                                    {value.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mt-16">
                <Card>
                    <CardContent className="grid gap-6 md:grid-cols-3">
                        <div className="space-y-1">
                            <p className="flex items-center gap-2 font-semibold">
                                <MapPin className="size-4 text-titan-gold" />
                                Dirección
                            </p>
                            <a
                                href={gym.maps_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-muted-foreground underline underline-offset-4"
                            >
                                {gym.address}
                            </a>
                        </div>
                        <div className="space-y-1">
                            <p className="flex items-center gap-2 font-semibold">
                                <Clock className="size-4 text-titan-gold" />
                                Horario
                            </p>
                            <ul className="text-sm text-muted-foreground">
                                {gym.hours.map((slot) => (
                                    <li key={slot.days}>
                                        {slot.days}: {slot.time}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col items-start gap-2">
                            <p className="flex items-center gap-2 font-semibold">
                                <MessageCircle className="size-4 text-titan-gold" />
                                ¿Tienes dudas?
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button size="sm" variant="outline" asChild>
                                    <Link href={contact()}>Contáctanos</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href={plansIndex()}>Ver planes</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </>
    );
}
