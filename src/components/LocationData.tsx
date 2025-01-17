import React from 'react';
import { useGeocoding } from '../hooks/useGeocoding';

interface LocationDataProps {
  lat: number;
  lng: number;
  onAddressFound: (address: string) => void;
}

export function LocationData({ lat, lng, onAddressFound }: LocationDataProps) {
  const { address } = useGeocoding(lat, lng);
  
  React.useEffect(() => {
    if (address) {
      onAddressFound(address);
    }
  }, [address, onAddressFound]);
  
  return null;
} 