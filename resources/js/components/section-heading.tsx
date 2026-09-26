import { cn } from '@/lib/utils';

/**
 * Centered title block used at the top of each public section.
 */
export default function SectionHeading({
    eyebrow,
    title,
    description,
    as: Tag = 'h2',
    className,
}: {
    eyebrow?: string;
    title: string;
    description?: string;
    as?: 'h1' | 'h2';
    className?: string;
}) {
    return (
        <div
            className={cn(
                'mx-auto mb-8 max-w-2xl space-y-2 text-center',
                className,
            )}
        >
            {eyebrow && (
                <p className="text-sm font-semibold tracking-wide text-titan-gold uppercase">
                    {eyebrow}
                </p>
            )}
            <Tag
                className={cn(
                    'font-bold tracking-tight text-balance',
                    Tag === 'h1'
                        ? 'text-3xl sm:text-4xl'
                        : 'text-2xl sm:text-3xl',
                )}
            >
                {title}
            </Tag>
            {description && (
                <p className="text-pretty text-muted-foreground">
                    {description}
                </p>
            )}
        </div>
    );
}
