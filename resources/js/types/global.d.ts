import type { Auth } from '@/types/auth';
import type { GymContact } from '@/types/gym';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            gym: GymContact;
            cdn: { url: string; imageResizing: boolean };
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
