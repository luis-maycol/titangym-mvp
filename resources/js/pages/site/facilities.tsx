import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import CdnImage from '@/components/cdn-image';
import SectionHeading from '@/components/section-heading';
import { Button } from '@/components/ui/button';
import { amenities, facilities } from '@/lib/site-content';
import { index as plansIndex } from '@/routes/plans';

export default function Facilities() {
    return (
        <>
            <Head title="Instalaciones">
                <meta
                    name="description"
                    content="Sala de musculación, zona funcional, sala de spinning, cardio y vestidores con duchas en TitanGym."
                />
            </Head>

            <SectionHeading
                as="h1"
                eyebrow="Instalaciones"
                title="Conoce el gimnasio"
                description="Equipos en buen estado, espacios limpios y ventilados."
            />

            <ul className="mb-10 grid grid-cols-2 gap-3 md:grid-cols-4">
                {amenities.map((amenity) => (
                    <li
                        key={amenity.label}
                        className="flex items-center gap-2 rounded-lg border p-3 text-sm"
                    >
                        <amenity.icon className="size-5 shrink-0 text-titan-gold" />
                        {amenity.label}
                    </li>
                ))}
            </ul>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {facilities.map((facility) => (
                    <figure key={facility.name} className="space-y-3">
                        <CdnImage
                            src={facility.image}
                            alt={facility.name}
                            width={800}
                            height={600}
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="aspect-[4/3] w-full rounded-xl"
                            fallbackIcon={facility.icon}
                        />
                        <figcaption>
                            <p className="font-semibold">{facility.name}</p>
                            <p className="text-sm text-pretty text-muted-foreground">
                                {facility.description}
                            </p>
                        </figcaption>
                    </figure>
                ))}
            </div>

            <div className="mt-12 text-center">
                <Button size="lg" asChild>
                    <Link href={plansIndex()}>
                        Quiero entrenar aquí
                        <ArrowRight />
                    </Link>
                </Button>
            </div>
        </>
    );
}
