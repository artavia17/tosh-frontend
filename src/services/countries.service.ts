import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';
import type { CountriesResponse } from '../types/api';

class CountriesService {
    async getCountries(): Promise<CountriesResponse> {
        try {
            const response = await apiService.get<any>(
                API_ENDPOINTS.COUNTRIES,
                false // No requiere autenticación
            );

            // Caso 1: La respuesta viene con el formato { data: { status, message, data: [...] } }
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                return response.data as CountriesResponse;
            }

            // Caso 2: La respuesta viene directamente como { status, message, data: [...] }
            if (response.data && Array.isArray(response.data)) {
                return {
                    status: 200,
                    message: 'Countries retrieved successfully',
                    data: response.data
                } as CountriesResponse;
            }

            // Caso 3: La respuesta es el objeto CountriesResponse directamente
            if ((response as any).status && response.data && Array.isArray(response.data)) {
                return response as unknown as CountriesResponse;
            }

            console.error('Unexpected response format:', response);
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('Error fetching countries:', error);
            throw error;
        }
    }
}

export const countriesService = new CountriesService();
export default countriesService;
