'use client';

import dynamic from 'next/dynamic';

interface Location {
  name: string;
  address: string;
  coordinates: [number, number];
}

interface GeographicData {
  city: string;
  state: string;
  country: string;
  events: number;
  totalTickets: number;
  totalRevenue: number;
  locations: Location[];
}

interface EventLocationsMapProps {
  geographicData: GeographicData[];
}

// Dynamic import of Map component with no SSR
const MapComponent = dynamic(() => import('./Map'), {
  loading: () => (
    <div style={{ height: '400px', width: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#6b7280' }}>Loading map...</div>
    </div>
  ),
  ssr: false
});

const EventLocationsMap = ({ geographicData }: EventLocationsMapProps) => {
  if (!geographicData || geographicData.length === 0) {
    return (
      <div style={{ height: '400px', width: '100%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280' }}>No location data available</div>
      </div>
    );
  }

  return <MapComponent geographicData={geographicData} />;
};

export default EventLocationsMap;
