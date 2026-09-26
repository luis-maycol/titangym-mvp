import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

/**
 * Text logo for the public site until the transparent PNG is available:
 * a red dumbbell with a soft gold glow, "TITÁN" in white and "GYM" in gold.
 */
export default function BrandWordmark({
    size = 'md',
    className,
}: {
    size?: 'md' | 'lg';
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-2 leading-none font-extrabold tracking-wider uppercase italic',
                size === 'lg' ? 'text-2xl' : 'text-lg',
                className,
            )}
        >
            <AppLogoIcon
                aria-hidden="true"
                className={cn(
                    'shrink-0 fill-current text-titan-red drop-shadow-[0_0_6px_rgb(243_177_36/0.45)]',
                    size === 'lg' ? 'size-9' : 'size-7',
                )}
            />
            <span>
                <span className="text-white">Titán</span>
                <span className="bg-linear-to-b from-titan-gold-light to-titan-gold-deep bg-clip-text text-transparent">
                    Gym
                </span>
            </span>
        </span>
    );
}
