import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, AccountResponse } from '../types/api';

class AuthService {
    async signIn(data: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await apiService.post<any>(
                API_ENDPOINTS.LOGIN,
                data,
                false // No requiere autenticación
            );

            // La respuesta ya tiene el formato correcto: { status, message, data: { user, token } }
            return response as unknown as LoginResponse;
        } catch (error: any) {
            // Manejar error de usuario no encontrado
            if (error.status === 404) {
                throw error;
            }
            console.error('Error in login:', error);
            throw error;
        }
    }
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        try {
            const response = await apiService.post<any>(
                API_ENDPOINTS.REGISTER,
                data,
                false // No requiere autenticación
            );

            // La respuesta ya tiene el formato correcto: { status, message, data: { user, token } }
            return response as unknown as RegisterResponse;
        } catch (error: any) {
            // Manejar errores de validación
            if (error.status === 422 && error.errors) {
                throw error;
            }
            console.error('Error in registration:', error);
            throw error;
        }
    }

    async getAccount(): Promise<AccountResponse> {
        try {
            const response = await apiService.get<any>(
                API_ENDPOINTS.ACCOUNT,
                true // Requiere autenticación
            );

            // La respuesta ya tiene el formato correcto: { status, message, data }
            return response as unknown as AccountResponse;
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    }

    async checkAuth(): Promise<boolean> {
        try {
            await this.getAccount();
            return true;
        } catch (error: any) {
            if (error.status === 401) {
                this.logout();
                return false;
            }
            return false;
        }
    }

    login(token: string): void {
        apiService.setAuthToken(token);
    }

    logout(): void {
        apiService.clearAuthToken();
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('auth_token');
        return !!token;
    }
}

export const authService = new AuthService();
export default authService;
