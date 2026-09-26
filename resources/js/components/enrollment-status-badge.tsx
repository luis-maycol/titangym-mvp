import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Enrollment } from '@/types';

const styles: Record<Enrollment['status'], string> = {
    pending:
        'border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200',
    active: 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
    rejected:
        'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200',
};

export default function EnrollmentStatusBadge({
    enrollment,
}: {
    enrollment: Pick<Enrollment, 'status' | 'status_label' | 'is_expired'>;
}) {
    if (enrollment.is_expired) {
        return <Badge variant="outline">Vencida</Badge>;
    }

    return (
        <Badge variant="outline" className={cn(styles[enrollment.status])}>
            {enrollment.status_label}
        </Badge>
    );
}
