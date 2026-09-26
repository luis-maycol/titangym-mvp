import { Link, router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type FilterTab = {
    label: string;
    href: string;
    active: boolean;
    count?: number;
};

/**
 * Status tabs plus a search box that submits on Enter.
 */
export default function ListFilters({
    tabs,
    search,
    searchPlaceholder,
    buildSearchUrl,
}: {
    tabs: FilterTab[];
    search: string;
    searchPlaceholder: string;
    buildSearchUrl: (search: string) => string;
}) {
    const [value, setValue] = useState(search);

    return (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
                {tabs.map((tab) => (
                    <Link
                        key={tab.label}
                        href={tab.href}
                        preserveScroll
                        className={cn(
                            'inline-flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors',
                            tab.active
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'hover:bg-accent',
                        )}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className={cn(
                                    'rounded-full px-1.5 text-xs',
                                    tab.active
                                        ? 'bg-primary-foreground/20'
                                        : 'bg-muted',
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </Link>
                ))}
            </div>

            <form
                className="relative md:w-72"
                onSubmit={(event) => {
                    event.preventDefault();
                    router.get(
                        buildSearchUrl(value.trim()),
                        {},
                        { preserveState: true, preserveScroll: true },
                    );
                }}
            >
                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="pl-8"
                    aria-label="Buscar"
                />
            </form>
        </div>
    );
}
