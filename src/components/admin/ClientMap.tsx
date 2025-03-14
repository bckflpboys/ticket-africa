'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

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

interface ClientMapProps {
  geographicData: GeographicData[];
}

const ClientMap = ({ geographicData }: ClientMapProps) => {
  return (
    <div className="h-[400px] relative">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {geographicData.map((location, idx) => (
          location.locations.map((venue, venueIdx) => (
            <Marker 
              key={`${idx}-${venueIdx}`}
              position={venue.coordinates}
            >
              <Popup>
                <div>
                  <h3 className="font-semibold">{venue.name}</h3>
                  <p className="text-sm">{venue.address}</p>
                </div>
              </Popup>
            </Marker>
          ))
        ))}
      </MapContainer>
    </div>
  );
};

export default ClientMap;
