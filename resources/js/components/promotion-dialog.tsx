import { Link } from '@inertiajs/react';
import { useState } from 'react';
import CdnImage from '@/components/cdn-image';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { index as plansIndex } from '@/routes/plans';
import type { ActivePromotion } from '@/types';

const storageKey = (id: number) => `titangym:promo-dismissed:${id}`;

function wasDismissed(id: number): boolean {
    try {
        return window.sessionStorage.getItem(storageKey(id)) === '1';
    } catch {
        return false;
    }
}

function rememberDismissal(id: number): void {
    try {
        window.sessionStorage.setItem(storageKey(id), '1');
    } catch {
        // Storage can be unavailable (private mode); the popup just shows again.
    }
}

/**
 * Popup with the active promotional flyer, shown once per browser session.
 */
export default function PromotionDialog({
    promotion,
}: {
    promotion: ActivePromotion;
}) {
    const [open, setOpen] = useState(() => !wasDismissed(promotion.id));

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            rememberDismissal(promotion.id);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="dark titan max-h-[90svh] w-[calc(100%-2rem)] max-w-md gap-3 overflow-y-auto p-3 sm:p-4">
                <DialogTitle className="pr-8 text-base">
                    {promotion.title ?? '¡Promoción especial!'}
                </DialogTitle>
                <DialogDescription className="sr-only">
                    Flyer de la promoción vigente en TitanGym.
                </DialogDescription>
                <CdnImage
                    src={promotion.image}
                    alt={promotion.title ?? 'Promoción de TitanGym'}
                    width={800}
                    height={1000}
                    sizes="(min-width: 640px) 28rem, 100vw"
                    priority
                    className="h-auto w-full rounded-md object-contain"
                />
                <Button
                    asChild
                    className="w-full bg-titan-red text-white hover:bg-titan-red hover:brightness-110"
                >
                    <Link
                        href={plansIndex()}
                        onClick={() => handleOpenChange(false)}
                    >
                        Aprovechar promoción
                    </Link>
                </Button>
            </DialogContent>
        </Dialog>
    );
}
