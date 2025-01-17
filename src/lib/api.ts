import axios from 'axios';
import { VehicleDataResponse } from '@/types/vehicle';

const API_BASE_URL = 'https://ev-data-transformer-b24e8690fbba.herokuapp.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

interface FilterParams {
  oem_provider?: string;
  start_date?: string;
  end_date?: string;
  vehicle_id?: string;
}

export async function getVehicles(page: number = 1, filters: FilterParams = {}) {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null)
  );

  const params = new URLSearchParams({
    page: page.toString(),
    limit: '10',
    ...cleanFilters
  });

  console.log('Final API URL:', `/dashboard/data?${params.toString()}`);
  
  const response = await api.get<VehicleDataResponse>(`/dashboard/data?${params}`);
  return response.data;
} 