import { API_CONFIG } from '../config/api';
import type { ApiResponse, ApiError } from '../types/api';

class ApiService {
    private baseURL: string;
    private headers: HeadersInit;

    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.headers = API_CONFIG.HEADERS;
    }

    private getAuthToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    private getHeaders(includeAuth = true): HeadersInit {
        const headers: Record<string, string> = { ...this.headers } as Record<string, string>;

        if (includeAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        if (!response.ok) {
            let errorData: any;

            if (isJson) {
                errorData = await response.json();
            } else {
                errorData = { message: response.statusText };
            }

            const error: ApiError = {
                message: errorData.message || 'An error occurred',
                errors: errorData.errors,
                status: response.status,
            };

            throw error;
        }

        if (isJson) {
            return await response.json();
        }

        return {
            success: true,
            data: null as T,
        };
    }

    async get<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(includeAuth),
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            throw this.formatError(error);
        }
    }

    async post<T>(
        endpoint: string,
        data?: any,
        includeAuth = true
    ): Promise<ApiResponse<T>> {
        try {
            const isFormData = data instanceof FormData;
            let headers: HeadersInit = this.getHeaders(includeAuth);

            // Si es FormData, eliminar Content-Type para que el navegador lo establezca automáticamente
            if (isFormData) {
                const headersObj = { ...headers as Record<string, string> };
                delete headersObj['Content-Type'];
                headers = headersObj;
            }

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            throw this.formatError(error);
        }
    }

    async put<T>(
        endpoint: string,
        data?: any,
        includeAuth = true
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(includeAuth),
                body: data ? JSON.stringify(data) : undefined,
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            throw this.formatError(error);
        }
    }

    async patch<T>(
        endpoint: string,
        data?: any,
        includeAuth = true
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PATCH',
                headers: this.getHeaders(includeAuth),
                body: data ? JSON.stringify(data) : undefined,
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            throw this.formatError(error);
        }
    }

    async delete<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(includeAuth),
            });

            return await this.handleResponse<T>(response);
        } catch (error) {
            throw this.formatError(error);
        }
    }

    private formatError(error: any): ApiError {
        if (error.message && error.status) {
            return error as ApiError;
        }

        return {
            message: error.message || 'An unexpected error occurred',
            status: 500,
        };
    }

    setAuthToken(token: string): void {
        localStorage.setItem('auth_token', token);
    }

    clearAuthToken(): void {
        localStorage.removeItem('auth_token');
    }
}

export const apiService = new ApiService();
export default apiService;
