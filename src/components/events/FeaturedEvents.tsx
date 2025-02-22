import React from 'react';
import EventCard from './EventCard';

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
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Featured Events</h2>
          <p className="text-gray-600">Discover the most popular events happening now</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
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
