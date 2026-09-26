import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types';

export default function Pagination({
    paginator,
}: {
    paginator: Paginated<unknown>;
}) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <nav className="flex items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">
                {paginator.from}–{paginator.to} de {paginator.total}
            </span>
            <div className="flex gap-2">
                <PageButton href={paginator.prev_page_url} label="Anterior">
                    <ChevronLeft />
                </PageButton>
                <PageButton href={paginator.next_page_url} label="Siguiente">
                    <ChevronRight />
                </PageButton>
            </div>
        </nav>
    );
}

function PageButton({
    href,
    label,
    children,
}: {
    href: string | null;
    label: string;
    children: React.ReactNode;
}) {
    if (!href) {
        return (
            <Button variant="outline" size="icon" disabled aria-label={label}>
                {children}
            </Button>
        );
    }

    return (
        <Button variant="outline" size="icon" asChild>
            <Link href={href} preserveScroll aria-label={label}>
                {children}
            </Link>
        </Button>
    );
}
