export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
    success: boolean;
    data: T[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    country?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    expires_in?: number;
}

export interface LoginRequest {
    id_number: string;
}

export interface LoginResponse {
    status: number;
    message: string;
    data: {
        user: RegisteredUser;
        token: string;
    };
}

export interface RegisterRequest {
    name: string;
    email: string;
    country_id: number;
    id_type: string;
    id_number: string;
    phone_number: string;
    marketing_opt_in: boolean;
    whatsapp_opt_in: boolean;
    phone_opt_in: boolean;
    email_opt_in: boolean;
    sms_opt_in: boolean;
    data_treatment_accepted: boolean;
    terms_accepted: boolean;
}

export interface RegisteredUser {
    id: number;
    name: string;
    email: string;
    country_id: number;
    id_type: string;
    id_number: string;
    phone_number: string;
    marketing_opt_in: boolean;
    whatsapp_opt_in: boolean;
    phone_opt_in: boolean;
    email_opt_in: boolean;
    sms_opt_in: boolean;
    data_treatment_accepted: boolean;
    terms_accepted: boolean;
    created_at: string;
    updated_at: string;
}

export interface RegisterResponse {
    status: number;
    message: string;
    data: {
        user: RegisteredUser;
        token: string;
    };
}

export interface Code {
    id: number;
    invoice_url: string;
    created_at: string;
    updated_at: string;
}

export interface AccountResponse {
    status: number;
    message: string;
    data: {
        name: string;
        codes: Code[];
    };
}

export interface ValidationError {
    status: number;
    message: string;
    errors: Record<string, string[]>;
}

export interface Winner {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    country: {
        id: number;
        name: string;
        iso_code: string;
    };
    prize: string;
    notes: string | null;
}

export interface WinnerPeriod {
    start_date: string;
    end_date: string;
    winners: Winner[];
}

export interface WinnersResponse {
    status: number;
    message: string;
    data: WinnerPeriod[];
}

export interface Award {
    id: number;
    title: string;
    description: string;
    image_url?: string;
    quantity?: number;
}

export interface PrizeStats {
    prize: {
        id: number;
        name: string;
    };
    total: number;
    awarded: number;
    remaining: number;
}

export interface PrizeStatsResponse {
    status: number;
    message: string;
    data: {
        country: {
            id: number;
            name: string;
            iso_code: string;
        };
        summary: {
            total_prizes: number;
            total_awarded: number;
            total_remaining: number;
        };
        prizes: PrizeStats[];
    };
}

export interface PromotionalCode {
    id: number;
    code: string;
    status: 'valid' | 'invalid' | 'used' | 'expired';
    user_id?: number;
    created_at: string;
    used_at?: string;
}

export interface ValidateCodeRequest {
    code: string;
}

export interface SubmitCodeRequest {
    code: string;
}

export interface SubmitCodeResponse {
    status: number;
    message: string;
    data: {
        id: number;
        user_id: number;
        code: string;
        created_at: string;
        updated_at: string;
    };
}

export interface Country {
    id: number;
    name: string;
    iso_code: string;
    phone_code: string;
    id_format: string;
    phone_format: string;
    phone_min_length: number;
    phone_max_length: number;
    id_min_length: number;
    id_max_length: number;
    created_at: string;
    updated_at: string;
}

export interface CountriesResponse {
    status: number;
    message: string;
    data: Country[];
}

export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
    status?: number;
}
