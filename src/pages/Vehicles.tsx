import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { getVehicles } from '../lib/api';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Skeleton } from "../components/ui/skeleton";
import { useGeocoding } from '../hooks/useGeocoding';
import { FiltersType } from '../types/filters';
import { LocationData } from '../components/LocationData';
import { Filters } from '../components/Filters';
const getStatusColor = (status: string) => {
  switch (status) {
    case 'moving':
      return 'bg-blue-100 text-blue-800';
    case 'stopped':
      return 'bg-yellow-100 text-yellow-800';
    case 'charging':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getBatteryColor = (level: number) => {
  if (level <= 20) return 'bg-red-500';
  if (level <= 50) return 'bg-yellow-500';
  return 'bg-green-500';
};

// Add helper function for Google Maps link
const getGoogleMapsLink = (lat: number, lng: number) => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

// Add helper function for daily distance calculation
const formatDistance = (distance: number) => {
  return `${distance.toFixed(1)} km`;
};


export default function Vehicles() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FiltersType>({
    startDate: undefined,
    endDate: undefined,
    oem: undefined,
    vehicleId: undefined,
    city: undefined,
    area: undefined,
    applied: true,
  });
  const [locations, setLocations] = useState<Map<string, string>>(new Map());

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [filters]);


  const { data, isLoading, error } = useQuery({
    queryKey: ['vehicles', page, filters],
    queryFn: () => {
      const params: any = {
        oem_provider: filters.oem,
        start_date: filters.startDate ? startOfDay(filters.startDate).toISOString() : undefined,
        end_date: filters.endDate ? endOfDay(filters.endDate).toISOString() : undefined,
        vehicle_id: filters.vehicleId,
        limit: 10,
        page
      };
      
      console.log('Making API call with params:', params);
      return getVehicles(page, params);
    },
    enabled: filters.applied,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
    staleTime: 0,
    gcTime: 0,
  });


  // Add debug log for filters state changes
  React.useEffect(() => {
    console.log('Filters updated:', filters);
  }, [filters]);

  // Get unique OEM providers and cities from the data
  const oemProviders = React.useMemo(() => {
    if (!data?.data) return [];
		console.log("Dank",data.data);
    return Array.from(new Set(data.data.map(v => v.oem_provider)));
  }, [data]);

  const handleAddressFound = React.useCallback((key: string, address: string) => {
    setLocations(prev => {
      const newMap = new Map(prev);
      newMap.set(key, address.split(',')[0]);
      return newMap;
    });
  }, []);

  const cities = React.useMemo(() => {
    return Array.from(new Set(locations.values()));
  }, [locations]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive">Error loading vehicles data</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
      </div>

      <Filters 
        onFilterChange={setFilters}
        oemProviders={oemProviders}
        cities={cities}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp (IST)</TableHead>
              <TableHead>OEM</TableHead>
              <TableHead>Time Details</TableHead>
              <TableHead>Daily Distance</TableHead>
              <TableHead>KM/Battery %</TableHead>
              <TableHead>Battery Status</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(10).fill(0).map((_, index) => (
                <TableRow key={index}>
                  {Array(7).fill(0).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              data?.data.map((vehicle) => {
                const rowKey = `${vehicle.vehicle_id}-${vehicle.timestamp}`;
                return (
                  <React.Fragment key={rowKey}>
                    <LocationData
                      lat={vehicle.latitude}
                      lng={vehicle.longitude}
                      onAddressFound={(address) => 
                        handleAddressFound(`${vehicle.latitude},${vehicle.longitude}`, address)
                      }
                    />
                    <TableRow>
                      <TableCell>
                        {format(new Date(vehicle.timestamp), 'dd MMM yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {vehicle.oem_provider}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="flex flex-col">
                          <span>ID: {vehicle.vehicle_id}</span>
                          <span className="text-muted-foreground">
                            Reg: {vehicle.registration_number}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDistance(vehicle.odometer)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getBatteryColor(vehicle.battery_soc)}`}
                              style={{ width: `${vehicle.battery_soc}%` }}
                            />
                          </div>
                          <span className={`text-sm ${vehicle.battery_soc <= 20 ? 'text-red-600 font-medium' : ''}`}>
                            {vehicle.battery_soc}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vehicle.vehicle_status)}`}>
                            {vehicle.vehicle_status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {vehicle.speed.toFixed(1)} km/h
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            {locations.get(`${vehicle.latitude},${vehicle.longitude}`) || 'Loading...'}
                          </span>
                          <a 
                            href={getGoogleMapsLink(vehicle.latitude, vehicle.longitude)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Page {page} of {data?.pagination.total_pages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!data?.pagination.total_pages || page === data.pagination.total_pages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 