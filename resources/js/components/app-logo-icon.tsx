import type { SVGAttributes } from 'react';

/**
 * TitanGym mark: a dumbbell drawn with the current fill color.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="14" width="4" height="12" rx="1.5" />
            <rect x="6" y="8" width="6" height="24" rx="2" />
            <rect x="12" y="17.5" width="16" height="5" rx="1" />
            <rect x="28" y="8" width="6" height="24" rx="2" />
            <rect x="35" y="14" width="4" height="12" rx="1.5" />
        </svg>
    );
}
