import { Link, usePage } from '@inertiajs/react';
import { Clock, Mail, MapPin, Menu, MessageCircle, Phone } from 'lucide-react';
import type { ReactNode } from 'react';
import BrandWordmark from '@/components/brand-wordmark';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import {
    about,
    contact,
    dashboard,
    facilities,
    home,
    login,
    services,
    trainers,
} from '@/routes';
import { index as plansIndex } from '@/routes/plans';

const navItems = [
    { title: 'Inicio', href: home() },
    { title: 'Nosotros', href: about() },
    { title: 'Servicios', href: services() },
    { title: 'Entrenadores', href: trainers() },
    { title: 'Instalaciones', href: facilities() },
    { title: 'Planes', href: plansIndex() },
    { title: 'Contacto', href: contact() },
];

type Props = {
    children: ReactNode;
    /** Let the page draw edge-to-edge sections (e.g. the landing hero). */
    fullWidth?: boolean;
};

export default function PublicLayout({ children, fullWidth = false }: Props) {
    const { auth, name, gym } = usePage().props;
    const { isCurrentUrl } = useCurrentUrl();

    const accountButton = auth.user ? (
        <Button
            size="sm"
            className="bg-titan-red text-white hover:bg-titan-red hover:brightness-110"
            asChild
        >
            <Link href={dashboard()}>Mi panel</Link>
        </Button>
    ) : (
        <Button
            size="sm"
            variant="outline"
            className="border-titan-gold/50 bg-transparent text-titan-gold hover:bg-titan-gold/10 hover:text-titan-gold-light"
            asChild
        >
            <Link href={login()}>Ingresar</Link>
        </Button>
    );

    return (
        <div className="dark titan flex min-h-svh flex-col bg-background text-foreground">
            <header className="sticky top-0 z-40 border-b border-titan-gold/15 bg-zinc-950/90 backdrop-blur">
                <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
                    <Link href={home()} aria-label={`${name}, ir al inicio`}>
                        <BrandWordmark />
                    </Link>

                    <div className="hidden items-center gap-1 lg:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                prefetch
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-white/5 hover:text-white',
                                    isCurrentUrl(item.href) &&
                                        'font-semibold text-titan-gold hover:text-titan-gold',
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {accountButton}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="lg:hidden"
                                    aria-label="Abrir menú"
                                >
                                    <Menu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="dark titan w-72 bg-zinc-950 p-4 text-foreground"
                            >
                                <SheetTitle>
                                    <BrandWordmark />
                                </SheetTitle>
                                <SheetDescription className="sr-only">
                                    Navegación principal
                                </SheetDescription>
                                <div className="mt-2 flex flex-col gap-1">
                                    {navItems.map((item) => (
                                        <SheetClose key={item.title} asChild>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'rounded-md px-3 py-2.5 text-base hover:bg-accent',
                                                    isCurrentUrl(item.href) &&
                                                        'bg-accent font-semibold text-titan-gold',
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </nav>
            </header>

            <main
                className={cn(
                    'flex-1',
                    !fullWidth && 'mx-auto w-full max-w-5xl px-4 py-8 sm:py-12',
                )}
            >
                {children}
            </main>

            <a
                href={`https://wa.me/${gym.whatsapp}?text=${encodeURIComponent(`Hola ${name}, quiero información sobre los planes.`)}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Escríbenos por WhatsApp"
                className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-[#25D366]/40 focus-visible:outline-none sm:right-6 sm:bottom-6"
            >
                <WhatsAppIcon className="size-7" />
            </a>

            <footer className="border-t border-titan-gold/15 bg-zinc-950">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <BrandWordmark />
                        <p className="text-muted-foreground">
                            Musculación, entrenamiento funcional y clases
                            grupales. Matrícula 100% en línea.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <p className="font-semibold text-titan-gold">Explora</p>
                        <ul className="grid grid-cols-2 gap-1 text-muted-foreground sm:grid-cols-1">
                            {navItems.map((item) => (
                                <li key={item.title}>
                                    <Link
                                        href={item.href}
                                        className="hover:text-foreground"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p className="font-semibold text-titan-gold">
                            Contacto
                        </p>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>
                                <a
                                    href={gym.maps_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex gap-2 hover:text-foreground"
                                >
                                    <MapPin className="mt-0.5 size-4 shrink-0" />
                                    {gym.address}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${gym.phone.replace(/\s/g, '')}`}
                                    className="flex gap-2 hover:text-foreground"
                                >
                                    <Phone className="mt-0.5 size-4 shrink-0" />
                                    {gym.phone}
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`https://wa.me/${gym.whatsapp}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex gap-2 hover:text-foreground"
                                >
                                    <MessageCircle className="mt-0.5 size-4 shrink-0" />
                                    WhatsApp
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${gym.email}`}
                                    className="flex gap-2 hover:text-foreground"
                                >
                                    <Mail className="mt-0.5 size-4 shrink-0" />
                                    {gym.email}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <p className="flex items-center gap-2 font-semibold text-titan-gold">
                            <Clock className="size-4" />
                            Horario
                        </p>
                        <dl className="space-y-1 text-muted-foreground">
                            {gym.hours.map((slot) => (
                                <div key={slot.days}>
                                    <dt className="text-foreground">
                                        {slot.days}
                                    </dt>
                                    <dd>{slot.time}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
                <p className="border-t py-4 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} {name}. Precios en soles (S/).
                    Pagos con Yape.
                </p>
            </footer>
        </div>
    );
}

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className={className}
        >
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.25-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.29Z" />
        </svg>
    );
}
