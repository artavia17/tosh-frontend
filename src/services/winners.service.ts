import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';
import type { WinnersResponse } from '../types/api';

class WinnersService {
    async getWinners(countryId: number): Promise<WinnersResponse> {
        try {
            const response = await apiService.get<WinnersResponse>(
                `${API_ENDPOINTS.WINNERS}?country_id=${countryId}`,
                false // No requiere autenticación
            );

            // La respuesta ya tiene el formato correcto: { status: 200, message, data }
            return response as unknown as WinnersResponse;
        } catch (error: any) {
            console.error('Error fetching winners:', error);
            throw error;
        }
    }
}

export const winnersService = new WinnersService();
export default winnersService;
