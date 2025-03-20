import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import EventCardSkeleton from './EventCardSkeleton';
import Link from 'next/link';

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  images: string[];
  category: string;
  ticketTypes: Array<{
    name: string;
    price: number;
    quantity: number;
    quantitySold: number;
  }>;
}

const FeaturedEvents = ({ events }: { events: Event[] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center px-16">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Events</h2>
            </div>
            <Link 
              href="/events" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Events
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          <p className="text-gray-600 text-center mt-2">Discover the most popular events happening now</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => (
                <div key={index}>
                  <EventCardSkeleton />
                </div>
              ))
            : events.map((event) => (
                <div key={event._id}>
                  <EventCard {...event} />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
