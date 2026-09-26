import { Head } from '@inertiajs/react';
import PlanGrid from '@/components/plan-grid';
import SectionHeading from '@/components/section-heading';
import type { Plan } from '@/types';

export default function PlansIndex({ plans }: { plans: Plan[] }) {
    return (
        <>
            <Head title="Planes de membresía">
                <meta
                    name="description"
                    content="Planes mensual, trimestral y anual de TitanGym. Matricúlate en línea y paga con Yape."
                />
            </Head>

            <SectionHeading
                as="h1"
                title="Elige tu plan"
                description="Matricúlate en línea y paga con Yape en menos de 5 minutos."
            />

            <PlanGrid plans={plans} />
        </>
    );
}
