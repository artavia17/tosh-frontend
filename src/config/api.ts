export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
    TIMEOUT: 30000,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
} as const;

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/sign-in',
    REGISTER: '/auth/sign-up',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    ACCOUNT: '/protected/account',

    // User
    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',

    // Winners
    WINNERS: '/winners',
    WINNERS_BY_PERIOD: '/winners/period',

    // Awards
    AWARDS: '/awards',
    PRIZE_STATS: '/prize-stats',

    // Promotional Codes
    PROMOTIONAL_CODES: '/promotional-codes',
    VALIDATE_CODE: '/promotional-codes/validate',
    SUBMIT_CODE: '/protected/codes',

    // Countries
    COUNTRIES: '/countries',
} as const;
