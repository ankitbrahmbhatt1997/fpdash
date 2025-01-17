export interface VehicleData {
  vehicle_id: string;
  registration_number: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  odometer: number;
  battery_soc: number;
  ignition_status: boolean;
  charging_status: number;
  distance_to_empty: number | null;
  vehicle_status: string;
  oem_provider: string;
}

export interface PaginationData {
  page: number;
  per_page: number;
  total_pages: number;
  total_records: number;
}

export interface VehicleDataResponse {
  data: VehicleData[];
  pagination: PaginationData;
} 