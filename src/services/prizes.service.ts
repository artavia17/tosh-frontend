import { API_ENDPOINTS } from '../config/api';
import apiService from './api.service';
import type { PrizeStatsResponse } from '../types/api';

class PrizesService {
    async getPrizeStats(countryId: number): Promise<PrizeStatsResponse> {
        try {
            const response = await apiService.get<PrizeStatsResponse>(
                `${API_ENDPOINTS.PRIZE_STATS}?country_id=${countryId}`,
                false // No requiere autenticación
            );

            // La respuesta ya tiene el formato correcto: { status: 200, message, data }
            return response as unknown as PrizeStatsResponse;
        } catch (error: any) {
            console.error('Error fetching prize stats:', error);
            throw error;
        }
    }
}

export const prizesService = new PrizesService();
export default prizesService;
