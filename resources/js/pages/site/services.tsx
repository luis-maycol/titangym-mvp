import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Check } from 'lucide-react';
import CdnImage from '@/components/cdn-image';
import SectionHeading from '@/components/section-heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { classSchedule, services, weekDays } from '@/lib/site-content';
import { index as plansIndex } from '@/routes/plans';

export default function Services() {
    return (
        <>
            <Head title="Servicios y disciplinas">
                <meta
                    name="description"
                    content="Musculación, entrenamiento funcional, clases grupales y evaluación física incluidos en tu membresía de TitanGym."
                />
            </Head>

            <SectionHeading
                as="h1"
                eyebrow="Servicios"
                title="Disciplinas para cada objetivo"
                description="Todos los servicios están incluidos en cualquier plan. Sin pagos adicionales."
            />

            <div className="space-y-6">
                {services.map((service, index) => (
                    <Card
                        key={service.slug}
                        id={service.slug}
                        className="overflow-hidden py-0 md:flex-row"
                    >
                        <CdnImage
                            src={service.image}
                            alt={service.name}
                            width={800}
                            height={600}
                            sizes="(min-width: 768px) 40vw, 100vw"
                            className={
                                index % 2 === 1
                                    ? 'aspect-[4/3] w-full md:order-2 md:w-2/5'
                                    : 'aspect-[4/3] w-full md:w-2/5'
                            }
                            fallbackIcon={service.icon}
                        />
                        <div className="flex flex-1 flex-col gap-4 py-6">
                            <CardHeader>
                                <service.icon className="size-7 text-titan-gold" />
                                <CardTitle className="text-xl">
                                    {service.name}
                                </CardTitle>
                                <CardDescription className="text-pretty">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1.5 text-sm">
                                    {service.highlights.map((highlight) => (
                                        <li
                                            key={highlight}
                                            className="flex items-start gap-2"
                                        >
                                            <Check className="mt-0.5 size-4 shrink-0 text-titan-gold" />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </div>
                    </Card>
                ))}
            </div>

            <section className="mt-16">
                <SectionHeading
                    title="Horario de clases grupales"
                    description="Llega 5 minutos antes. No necesitas reservar: el aforo se respeta por orden de llegada."
                />
                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full min-w-[40rem] text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="px-3 py-2 text-left font-medium">
                                    Hora
                                </th>
                                {weekDays.map((day) => (
                                    <th
                                        key={day.key}
                                        className="px-3 py-2 text-center font-medium"
                                    >
                                        {day.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {classSchedule.map((slot) => (
                                <tr key={slot.time}>
                                    <th className="px-3 py-3 text-left font-medium whitespace-nowrap">
                                        {slot.time}
                                    </th>
                                    {weekDays.map((day) => (
                                        <td
                                            key={day.key}
                                            className="px-2 py-3 text-center"
                                        >
                                            {slot[day.key] ? (
                                                <Badge variant="secondary">
                                                    {slot[day.key]}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <p className="mt-2 text-xs text-muted-foreground md:hidden">
                    Desliza la tabla hacia la izquierda para ver toda la semana.
                </p>
            </section>

            <div className="mt-12 text-center">
                <Button size="lg" asChild>
                    <Link href={plansIndex()}>
                        Elegir mi plan
                        <ArrowRight />
                    </Link>
                </Button>
            </div>
        </>
    );
}
