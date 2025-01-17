import { useState, useEffect } from 'react';

interface GeocodeResult {
  address: string;
  loading: boolean;
  error: string | null;
}

// Simple cache to store already fetched addresses
const addressCache = new Map<string, string>();

export function useGeocoding(lat: number, lng: number): GeocodeResult {
  const [result, setResult] = useState<GeocodeResult>({
    address: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const cacheKey = `${lat},${lng}`;
    
    // Check cache first
    if (addressCache.has(cacheKey)) {
      setResult({
        address: addressCache.get(cacheKey) || '',
        loading: false,
        error: null,
      });
      return;
    }

    const fetchAddress = async () => {
      try {
        // Add a small delay to respect Nominatim's usage policy
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
          {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9',
              // Add a User-Agent as requested by Nominatim's usage policy
              'User-Agent': 'FutMobi Dashboard (your@email.com)'
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.address) {
          const { 
            city, 
            town, 
            state, 
            suburb, 
            neighbourhood,
            road,
            county
          } = data.address;

          // Try different fields to get the most specific location
          const location = city || town || suburb || neighbourhood || county || '';
          const address = `${location}${location && state ? ', ' : ''}${state || ''}`;
          
          // Store in cache
          addressCache.set(cacheKey, address);
          
          setResult({
            address,
            loading: false,
            error: null,
          });
        } else {
          throw new Error('No address found');
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        setResult({
          address: '',
          loading: false,
          error: 'Could not load location'
        });
      }
    };

    fetchAddress();

    // Cleanup function
    return () => {
      // Could add cleanup logic here if needed
    };
  }, [lat, lng]);

  return result;
} 