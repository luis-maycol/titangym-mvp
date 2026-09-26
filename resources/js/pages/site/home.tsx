import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock, QrCode, ShieldCheck, Users } from 'lucide-react';
import type { CSSProperties } from 'react';
import CdnImage, { useCdnImageUrl } from '@/components/cdn-image';
import PlanGrid from '@/components/plan-grid';
import PromotionDialog from '@/components/promotion-dialog';
import SectionHeading from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    enrollmentSteps,
    facilities as facilityList,
    services as serviceList,
    trainers as trainerList,
} from '@/lib/site-content';
import { facilities, services, trainers } from '@/routes';
import { index as plansIndex } from '@/routes/plans';
import type { ActivePromotion, Plan } from '@/types';

export default function Home({
    plans,
    promotion,
}: {
    plans: Plan[];
    promotion: ActivePromotion | null;
}) {
    const cdnImageUrl = useCdnImageUrl();
    const lowestPrice = plans.reduce<number | null>(
        (lowest, plan) =>
            lowest === null
                ? Number(plan.price)
                : Math.min(lowest, Number(plan.price)),
        null,
    );

    return (
        <>
            <Head title="Gimnasio en Ayacucho">
                <meta
                    name="description"
                    content="TitanGym: musculación, entrenamiento funcional y clases grupales. Elige tu plan y matricúlate en línea pagando con Yape."
                />
            </Head>

            {promotion && (
                <PromotionDialog key={promotion.id} promotion={promotion} />
            )}

            {/*
             * Drop the photo at public/images/site/hero.jpg; until then only the
             * dark fallback shows. The URL goes through a CSS variable so it
             * resolves against the app/CDN origin, not the Vite dev server.
             */}
            <section
                className="relative overflow-hidden bg-zinc-950 bg-(image:--hero-image) bg-cover bg-center bg-no-repeat text-white"
                style={
                    {
                        '--hero-image': `url('${cdnImageUrl('images/site/hero.jpg', 1600)}')`,
                    } as CSSProperties
                }
            >
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/55"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(216_23_13/0.28),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgb(243_177_36/0.14),transparent_50%)]"
                />
                <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 py-20 sm:py-28 lg:py-36">
                    <p className="w-fit rounded-full border border-titan-gold/40 bg-titan-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-titan-gold uppercase">
                        Matrícula 100% en línea
                    </p>
                    <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                        Entrena más fuerte.{' '}
                        <span className="bg-linear-to-b from-titan-gold-light to-titan-gold-deep bg-clip-text text-transparent">
                            Empieza hoy.
                        </span>
                    </h1>
                    <p className="max-w-xl text-lg text-pretty text-zinc-300">
                        Musculación, entrenamiento funcional y clases grupales
                        con entrenadores certificados.
                        {lowestPrice !== null &&
                            ` Planes desde S/ ${lowestPrice.toFixed(0)} al mes.`}
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                            size="lg"
                            className="bg-titan-red text-white shadow-lg shadow-titan-red/30 hover:bg-titan-red hover:brightness-110"
                            asChild
                        >
                            <Link href={plansIndex()}>
                                Ver planes y matricularme
                                <ArrowRight />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-titan-gold/50 bg-transparent text-titan-gold hover:bg-titan-gold/10 hover:text-titan-gold-light"
                            asChild
                        >
                            <Link href={facilities()}>Conoce el gimnasio</Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="border-y border-titan-gold/15 bg-zinc-950">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 text-center lg:grid-cols-4">
                    {[
                        {
                            icon: Users,
                            value: `${plans.length}`,
                            label: 'planes a tu medida',
                        },
                        {
                            icon: Clock,
                            value: '17 h',
                            label: 'abierto de lunes a viernes',
                        },
                        {
                            icon: ShieldCheck,
                            value: `${trainerList.length}`,
                            label: 'entrenadores certificados',
                        },
                        {
                            icon: QrCode,
                            value: 'Yape',
                            label: 'paga desde tu celular',
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="space-y-1">
                            <stat.icon className="mx-auto size-6 text-titan-gold drop-shadow-[0_0_8px_rgb(243_177_36/0.35)]" />
                            <p className="text-2xl font-bold text-white">
                                {stat.value}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16">
                <SectionHeading
                    eyebrow="Servicios"
                    title="Todo lo que necesitas para entrenar"
                    description="Todos los servicios están incluidos en tu membresía."
                />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {serviceList.map((service) => (
                        <Card
                            key={service.slug}
                            className="gap-3 border-zinc-700/70 transition-colors hover:border-titan-gold/50"
                        >
                            <CardContent className="space-y-3">
                                <service.icon className="size-8 text-titan-gold" />
                                <h3 className="font-semibold">
                                    {service.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {service.summary}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <Button variant="link" className="text-titan-gold" asChild>
                        <Link href={services()}>
                            Ver servicios y horario de clases
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="bg-zinc-950 py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <SectionHeading
                        eyebrow="Planes"
                        title="Elige tu membresía"
                        description="Sin costos ocultos. Mientras más largo el plan, más ahorras."
                    />
                    <PlanGrid plans={plans} />
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16">
                <SectionHeading
                    eyebrow="Cómo funciona"
                    title="Matricúlate en 4 pasos"
                    description="Sin colas ni mensajes por WhatsApp."
                />
                <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {enrollmentSteps.map((step, index) => (
                        <li
                            key={step.title}
                            className="flex gap-4 rounded-xl border border-zinc-700/70 bg-zinc-800/50 p-5 lg:flex-col"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-titan-red font-bold text-white ring-2 ring-titan-gold/40">
                                {index + 1}
                            </span>
                            <div>
                                <h3 className="font-semibold">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section className="bg-zinc-950 py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <SectionHeading
                        eyebrow="Equipo"
                        title="Entrena con los mejores"
                    />
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                        {trainerList.map((trainer) => (
                            <div key={trainer.slug} className="space-y-2">
                                <CdnImage
                                    src={trainer.image}
                                    alt={trainer.name}
                                    width={400}
                                    height={500}
                                    sizes="(min-width: 1024px) 25vw, 50vw"
                                    className="aspect-[4/5] w-full rounded-xl"
                                    fallbackIcon={Users}
                                />
                                <div>
                                    <p className="font-semibold">
                                        {trainer.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {trainer.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <Button
                            variant="link"
                            className="text-titan-gold"
                            asChild
                        >
                            <Link href={trainers()}>
                                Conoce a los entrenadores
                                <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-4 py-16">
                <SectionHeading
                    eyebrow="Instalaciones"
                    title="Espacios pensados para entrenar"
                />
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                    {facilityList.slice(0, 3).map((facility, index) => (
                        <figure
                            key={facility.name}
                            className={
                                index === 0
                                    ? 'col-span-2 lg:col-span-1'
                                    : undefined
                            }
                        >
                            <CdnImage
                                src={facility.image}
                                alt={facility.name}
                                width={800}
                                height={600}
                                sizes="(min-width: 1024px) 33vw, 50vw"
                                className="aspect-[4/3] w-full rounded-xl"
                                fallbackIcon={facility.icon}
                            />
                            <figcaption className="mt-2 text-sm font-medium">
                                {facility.name}
                            </figcaption>
                        </figure>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <Button variant="link" className="text-titan-gold" asChild>
                        <Link href={facilities()}>
                            Ver todas las instalaciones
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="relative isolate overflow-hidden bg-linear-to-br from-titan-red-deep via-titan-red to-titan-red-deep text-white">
                <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-14 text-center">
                    <h2 className="text-2xl font-bold text-balance sm:text-3xl">
                        Tu primer entrenamiento está a 5 minutos
                    </h2>
                    <p className="max-w-xl text-white/85">
                        Elige tu plan, paga con Yape y te esperamos en el
                        gimnasio.
                    </p>
                    <Button
                        size="lg"
                        className="bg-titan-gold font-semibold text-zinc-950 hover:bg-titan-gold hover:brightness-110"
                        asChild
                    >
                        <Link href={plansIndex()}>
                            Matricularme ahora
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>
            </section>
        </>
    );
}

Home.layout = { fullWidth: true };
