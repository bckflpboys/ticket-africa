'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface MapProps {
  geographicData: GeographicData[];
}

const Map = ({ geographicData }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Fix Leaflet default icon issue
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"
    });

    // Initialize map
    const center = geographicData[0]?.locations[0]?.coordinates || [0, 0];
    leafletMap.current = L.map(mapRef.current).setView(center, 2);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(leafletMap.current);

    // Add markers
    geographicData.forEach((region) => {
      region.locations.forEach((venue) => {
        const marker = L.marker(venue.coordinates).addTo(leafletMap.current!);
        marker.bindPopup(`
          <div>
            <h3 style="font-weight: 600">${venue.name}</h3>
            <p style="font-size: 0.875rem">${venue.address}</p>
            <p style="font-size: 0.875rem; margin-top: 0.25rem">
              Events: ${region.events}<br>
              Tickets: ${region.totalTickets}<br>
              Revenue: $${region.totalRevenue}
            </p>
          </div>
        `);
      });
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [geographicData]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

export default Map;
