import React from 'react';

interface LocationDetailsProps {
  location: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

interface VenueLocation {
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  transport: {
    directions: string | undefined;
    landmarks: string | undefined;
    parking: string | undefined;
  };
  facilities: {
    wheelchair: boolean;
    atm: boolean;
    foodCourt: boolean;
    parking: boolean;
  };
  additionalInfo: string;
}

const defaultLocation: VenueLocation = {
  venue: {
    name: '',
    address: '',
    city: '',
    state: '',
    country: ''
  },
  transport: {
    directions: undefined,
    landmarks: undefined,
    parking: undefined
  },
  facilities: {
    wheelchair: false,
    atm: false,
    foodCourt: false,
    parking: false
  },
  additionalInfo: ''
};

export default function LocationDetails({ location, onChange }: LocationDetailsProps) {
  // Parse the location string to get structured data
  const locationData: VenueLocation = React.useMemo(() => {
    try {
      return JSON.parse(location) as VenueLocation;
    } catch {
      return defaultLocation;
    }
  }, [location]);

  // Update location data and trigger onChange
  const updateLocation = (updates: Partial<VenueLocation>) => {
    const newLocation = { ...locationData, ...updates };
    onChange({
      target: {
        name: 'location',
        value: JSON.stringify(newLocation)
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // Update nested location data
  const updateNestedLocation = (
    section: keyof Pick<VenueLocation, 'venue' | 'transport' | 'facilities'>,
    field: string,
    value: any
  ) => {
    const newData = { ...locationData };
    newData[section] = {
      ...(newData[section] as any),
      [field]: value
    };
    updateLocation(newData);
  };

  return (
    <div className="space-y-8">
      {/* Venue Details */}
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-xl font-bold text-primary">Venue Address</h3>
          </div>
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Venue Name</span>
                <span className="label-text-alt text-error">*Required</span>
              </label>
              <input
                type="text"
                value={locationData.venue.name}
                onChange={(e) => updateNestedLocation('venue', 'name', e.target.value)}
                className="input input-bordered w-full focus:input-primary transition-colors duration-200"
                placeholder="e.g., Lagos Beach Resort"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Street Address</span>
                <span className="label-text-alt text-error">*Required</span>
              </label>
              <input
                type="text"
                value={locationData.venue.address}
                onChange={(e) => updateNestedLocation('venue', 'address', e.target.value)}
                className="input input-bordered w-full focus:input-primary transition-colors duration-200"
                placeholder="e.g., 123 Victoria Island Way"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">City</span>
                  <span className="label-text-alt text-error">*Required</span>
                </label>
                <input
                  type="text"
                  value={locationData.venue.city}
                  onChange={(e) => updateNestedLocation('venue', 'city', e.target.value)}
                  className="input input-bordered w-full focus:input-primary transition-colors duration-200"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">State</span>
                  <span className="label-text-alt text-error">*Required</span>
                </label>
                <input
                  type="text"
                  value={locationData.venue.state}
                  onChange={(e) => updateNestedLocation('venue', 'state', e.target.value)}
                  className="input input-bordered w-full focus:input-primary transition-colors duration-200"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Country</span>
                  <span className="label-text-alt text-error">*Required</span>
                </label>
                <input
                  type="text"
                  value={locationData.venue.country}
                  onChange={(e) => updateNestedLocation('venue', 'country', e.target.value)}
                  className="input input-bordered w-full focus:input-primary transition-colors duration-200"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transportation */}
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <h3 className="text-xl font-bold text-primary">Getting There</h3>
          </div>
          <div className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Directions</span>
                <span className="label-text-alt text-gray-500">Optional</span>
              </label>
              <input
                type="text"
                value={locationData.transport.directions || ''}
                onChange={(e) => updateNestedLocation('transport', 'directions', e.target.value)}
                className="input input-bordered w-full focus:input-primary transition-colors duration-200"
                placeholder="e.g., 15 minutes from Murtala Muhammed Airport"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Landmarks</span>
                <span className="label-text-alt text-gray-500">Optional</span>
              </label>
              <input
                type="text"
                value={locationData.transport.landmarks || ''}
                onChange={(e) => updateNestedLocation('transport', 'landmarks', e.target.value)}
                className="input input-bordered w-full focus:input-primary transition-colors duration-200"
                placeholder="e.g., Near the yellow building, opposite Central Park"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Parking Information</span>
                <span className="label-text-alt text-gray-500">Optional</span>
              </label>
              <input
                type="text"
                value={locationData.transport.parking || ''}
                onChange={(e) => updateNestedLocation('transport', 'parking', e.target.value)}
                className="input input-bordered w-full focus:input-primary transition-colors duration-200"
                placeholder="e.g., Free parking available on premises"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Facilities */}
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-bold text-primary">Facilities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="label cursor-pointer justify-start gap-3 hover:bg-base-200 p-3 rounded-lg transition-colors duration-200">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={locationData.facilities.wheelchair}
                onChange={(e) => updateNestedLocation('facilities', 'wheelchair', e.target.checked)}
              />
              <span className="label-text">Wheelchair Accessible</span>
            </label>
            <label className="label cursor-pointer justify-start gap-3 hover:bg-base-200 p-3 rounded-lg transition-colors duration-200">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={locationData.facilities.atm}
                onChange={(e) => updateNestedLocation('facilities', 'atm', e.target.checked)}
              />
              <span className="label-text">ATM Available</span>
            </label>
            <label className="label cursor-pointer justify-start gap-3 hover:bg-base-200 p-3 rounded-lg transition-colors duration-200">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={locationData.facilities.foodCourt}
                onChange={(e) => updateNestedLocation('facilities', 'foodCourt', e.target.checked)}
              />
              <span className="label-text">Food Court</span>
            </label>
            <label className="label cursor-pointer justify-start gap-3 hover:bg-base-200 p-3 rounded-lg transition-colors duration-200">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={locationData.facilities.parking}
                onChange={(e) => updateNestedLocation('facilities', 'parking', e.target.checked)}
              />
              <span className="label-text">Parking Available</span>
            </label>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-primary">Additional Information</h3>
          </div>
          <div className="form-control">
            <textarea
              value={locationData.additionalInfo}
              onChange={(e) => updateLocation({ additionalInfo: e.target.value })}
              className="textarea textarea-bordered min-h-[100px] focus:textarea-primary transition-colors duration-200"
              placeholder="Add any other relevant venue information here..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
