import { usePage } from '@inertiajs/react';
import { ImageIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const srcSetWidths = [400, 800, 1200];

/**
 * Build the public URL of an image served by the CDN. With Cloudflare Image
 * Resizing enabled the image is requested resized and in a modern format.
 */
export function useCdnImageUrl(): (path: string, width?: number) => string {
    const { cdn } = usePage().props;

    return (path, width) => {
        const cleanPath = path.replace(/^\/+/, '');

        if (cdn.imageResizing && width) {
            return `${cdn.url}/cdn-cgi/image/width=${width},quality=80,format=auto/${cleanPath}`;
        }

        return `${cdn.url}/${cleanPath}`;
    };
}

type Props = {
    /** Path relative to public/, e.g. "images/site/trainers/carlos.jpg". */
    src: string;
    alt: string;
    width: number;
    height: number;
    sizes?: string;
    priority?: boolean;
    className?: string;
    fallbackIcon?: LucideIcon;
};

/**
 * Lazy, CDN-served image that degrades to a neutral placeholder while the real
 * photo has not been uploaded yet.
 */
export default function CdnImage({
    src,
    alt,
    width,
    height,
    sizes = '100vw',
    priority = false,
    className,
    fallbackIcon: FallbackIcon = ImageIcon,
}: Props) {
    const imageUrl = useCdnImageUrl();
    const { cdn } = usePage().props;
    const [failed, setFailed] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    // With SSR the request can fail before React attaches onError, so check
    // the element once it is mounted as well.
    useEffect(() => {
        const image = imageRef.current;

        if (image?.complete && image.naturalWidth === 0) {
            setFailed(true);
        }
    }, [src]);

    if (failed) {
        return (
            <div
                role="img"
                aria-label={alt}
                className={cn(
                    'flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/20 text-muted-foreground',
                    className,
                )}
            >
                <FallbackIcon className="size-10 opacity-60" />
            </div>
        );
    }

    return (
        <img
            ref={imageRef}
            src={imageUrl(src, width)}
            srcSet={
                cdn.imageResizing
                    ? srcSetWidths
                          .map((w) => `${imageUrl(src, w)} ${w}w`)
                          .join(', ')
                    : undefined
            }
            sizes={cdn.imageResizing ? sizes : undefined}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onError={() => setFailed(true)}
            className={cn('object-cover', className)}
        />
    );
}
