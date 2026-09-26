export type Plan = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    duration_months: number;
    price: string;
    benefits: string[];
    is_featured: boolean;
};

export type EnrollmentStatus = 'pending' | 'active' | 'rejected';

export type Enrollment = {
    id: number;
    status: EnrollmentStatus;
    status_label: string;
    is_expired: boolean;
    amount: string;
    starts_at: string | null;
    ends_at: string | null;
    rejection_reason: string | null;
    created_at: string | null;
    plan: {
        name: string;
        duration_months: number;
    };
    receipt?: {
        operation_code: string | null;
        uploaded_at: string | null;
    } | null;
    can_upload_receipt: boolean;
};

export type YapeAccount = {
    phone: string;
    holder: string;
    qr_url: string | null;
};

export type ReceiptSummary = {
    id: number;
    url: string;
    original_name: string;
    operation_code: string | null;
    uploaded_at: string | null;
};

export type AdminEnrollment = Omit<
    Enrollment,
    'receipt' | 'can_upload_receipt'
> & {
    reviewed_at: string | null;
    reviewer?: string | null;
    payment_method: 'yape' | 'cash';
    payment_method_label: string;
    client: {
        id: number;
        name: string;
        email: string;
        dni: string | null;
        phone: string | null;
    };
    receipt?: ReceiptSummary | null;
    receipts?: ReceiptSummary[];
    can_review: boolean;
};

export type Client = {
    id: number;
    name: string;
    email: string;
    dni: string | null;
    phone: string | null;
    registered_at: string | null;
    membership: {
        enrollment_id: number;
        plan: string;
        starts_at: string | null;
        ends_at: string | null;
        is_expired: boolean;
        days_left: number;
    } | null;
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

export type GymContact = {
    address: string;
    maps_url: string;
    maps_embed_url: string;
    phone: string;
    whatsapp: string;
    email: string;
    hours: { days: string; time: string }[];
};

export type ActivePromotion = {
    id: number;
    title: string | null;
    image: string;
};

export type AdminPromotion = {
    id: number;
    title: string | null;
    image_url: string;
    is_active: boolean;
    created_at: string | null;
};
