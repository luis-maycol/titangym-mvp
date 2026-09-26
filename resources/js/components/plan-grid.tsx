import { Link } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { formatDuration, formatPen } from '@/lib/format';
import { cn } from '@/lib/utils';
import { create } from '@/routes/enrollments';
import type { Plan } from '@/types';

export default function PlanGrid({ plans }: { plans: Plan[] }) {
    if (plans.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                Aún no hay planes disponibles.
            </p>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-3 md:gap-4">
            {plans.map((plan) => (
                <Card
                    key={plan.id}
                    className={cn(
                        'relative',
                        plan.is_featured &&
                            'border-titan-gold/70 shadow-lg shadow-titan-gold/10',
                    )}
                >
                    {plan.is_featured && (
                        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-titan-gold font-semibold text-zinc-950">
                            Más elegido
                        </Badge>
                    )}
                    <CardHeader>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {plan.description && (
                            <CardDescription>
                                {plan.description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                        <p>
                            <span className="text-3xl font-bold">
                                {formatPen(plan.price)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                {' '}
                                / {formatDuration(plan.duration_months)}
                            </span>
                        </p>
                        <ul className="space-y-2 text-sm">
                            {plan.benefits.map((benefit) => (
                                <li
                                    key={benefit}
                                    className="flex items-start gap-2"
                                >
                                    <Check className="mt-0.5 size-4 shrink-0 text-titan-gold" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className={cn(
                                'w-full',
                                plan.is_featured &&
                                    'bg-titan-red text-white hover:bg-titan-red hover:brightness-110',
                            )}
                            variant={plan.is_featured ? 'default' : 'outline'}
                            asChild
                        >
                            <Link href={create(plan.slug)}>Matricularme</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
