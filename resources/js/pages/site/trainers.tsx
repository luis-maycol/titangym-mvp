import { Head } from '@inertiajs/react';
import { Award, User } from 'lucide-react';
import CdnImage from '@/components/cdn-image';
import SectionHeading from '@/components/section-heading';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { trainers } from '@/lib/site-content';

export default function Trainers() {
    return (
        <>
            <Head title="Entrenadores">
                <meta
                    name="description"
                    content="Conoce al equipo de entrenadores certificados de TitanGym y sus especialidades."
                />
            </Head>

            <SectionHeading
                as="h1"
                eyebrow="Equipo"
                title="Nuestros entrenadores"
                description="Profesionales certificados que te guían en la sala y en cada clase."
            />

            <div className="grid gap-6 sm:grid-cols-2">
                {trainers.map((trainer) => (
                    <Card key={trainer.slug} className="overflow-hidden pt-0">
                        <CdnImage
                            src={trainer.image}
                            alt={`${trainer.name}, ${trainer.role}`}
                            width={800}
                            height={600}
                            sizes="(min-width: 640px) 50vw, 100vw"
                            className="aspect-[4/3] w-full object-top"
                            fallbackIcon={User}
                        />
                        <CardHeader>
                            <CardTitle className="text-xl">
                                {trainer.name}
                            </CardTitle>
                            <CardDescription>{trainer.role}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <p className="text-pretty text-muted-foreground">
                                {trainer.bio}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {trainer.specialties.map((specialty) => (
                                    <Badge key={specialty} variant="secondary">
                                        {specialty}
                                    </Badge>
                                ))}
                            </div>
                            <ul className="space-y-1">
                                {trainer.certifications.map((certification) => (
                                    <li
                                        key={certification}
                                        className="flex items-start gap-2"
                                    >
                                        <Award className="mt-0.5 size-4 shrink-0 text-titan-gold" />
                                        {certification}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}
