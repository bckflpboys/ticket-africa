import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface EventCardProps {
  _id?: string;
  id?: string;  // For backward compatibility with mock data
  title: string;
  date: string;
  location: string;
  images?: string[];
  imageUrl?: string;  // For backward compatibility with mock data
  price?: number;     // For backward compatibility with mock data
  category: string;
  ticketTypes?: Array<{
    name: string;
    price: number;
    quantity: number;
    quantitySold: number;
  }>;
}

const EventCard = ({ 
  _id, 
  id,  // For mock data
  title, 
  date, 
  location, 
  images, 
  imageUrl, // For mock data
  price,    // For mock data
  category, 
  ticketTypes 
}: EventCardProps) => {
  // Get the lowest ticket price, fallback to price prop for mock data
  const lowestPrice = ticketTypes?.length 
    ? Math.min(...ticketTypes.map(ticket => ticket.price))
    : price || 0;

  // Format the date nicely
  const formattedDate = new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Parse location if it's a JSON string
  const displayLocation = React.useMemo(() => {
    try {
      const locationData = JSON.parse(location);
      return `${locationData.venue.city}, ${locationData.venue.country}`;
    } catch {
      return location;
    }
  }, [location]);

  // Use appropriate ID and image source based on available data
  const eventId = _id || id;
  const imageSource = images?.[0] || imageUrl;

  return (
    <Link href={`/events/${eventId}`} className="block">
      <div className="relative overflow-hidden rounded-xl bg-white border-2 border-gray-300 hover:border-primary/70 shadow-sm hover:shadow-md transition-all">
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <Image
            src={imageSource || "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop";
            }}
          />
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-primary/90 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-white shadow-sm">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-3">
            {title}
          </h3>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {/* Date */}
            <div className="flex items-center gap-1.5 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{formattedDate}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-1.5 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-primary">
                R {lowestPrice.toLocaleString()}
              </span>
            </div>

            {/* Location - Full Width */}
            <div className="flex items-center gap-1.5 text-gray-600 col-span-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{displayLocation}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
