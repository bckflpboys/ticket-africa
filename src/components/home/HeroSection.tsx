'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../search/SearchBar';

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  images: string[];
  category: string;
  isBanner: boolean;
  description: string;
  ticketTypes: {
    name: string;
    price: number;
    quantity: number;
    quantitySold: number;
    _id: string;
    id: string;
  }[];
}

const truncateDescription = (description: string, maxLength: number) => {
  if (!description) return '';
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + '...';
  }
  return description;
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        console.log('Event data:', data);
        const filteredEvents = data.filter((event: Event) => event.isBanner);
        console.log('Filtered events:', filteredEvents);
        console.log('First event ticket types:', filteredEvents[0]?.ticketTypes);
        console.log('First event ticket types detailed:', JSON.stringify(filteredEvents[0]?.ticketTypes, null, 2));
        console.log('First ticket price:', filteredEvents[0]?.ticketTypes[0]?.price);
        setEvents(filteredEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [events]);

  return (
    <section className="relative min-h-[70vh] bg-base-200">
      {/* Background Slider */}
      <div className="absolute inset-0 w-full h-full">
        {events.map((event, index) => (
          <div
            key={event._id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <Image
              src={event.images[0]}
              alt={event.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 py-16 min-h-[70vh] flex flex-col justify-center">
        <div className="max-w-5xl mx-auto w-full text-center text-white">
          <h1 className="text-5xl font-bold mb-8">Find Your Next Event</h1>
          <p className="text-xl mb-12">
            Discover and book tickets for the most exciting events happening across Africa.
          </p>

          {/* Current Event Details */}
          <div className="mb-12 transform transition-all duration-500">
            {events[currentSlide] && (
              <Link 
                href={`/events/${events[currentSlide].title
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '')}?id=${events[currentSlide]._id}`}
              >
                <h2 className="text-3xl font-bold mb-4 hover:text-primary transition-colors">
                  {events[currentSlide].title}
                </h2>
              </Link>
            )}
            <div className="flex items-center justify-center gap-6 text-lg font-bold">
              <p>{events[currentSlide]?.date ? new Date(events[currentSlide].date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Date not available'}</p>
              <p>{events[currentSlide]?.location ? JSON.parse(events[currentSlide].location).venue.city : 'Location not available'}</p>
              <p className="text-primary">
                {events[currentSlide]?.ticketTypes?.length > 0
                  ? `From R${events[currentSlide].ticketTypes[0].price}`
                  : 'Price not available'}
              </p>
            </div>
            <p className="text-lg mt-4">
              {truncateDescription(events[currentSlide]?.description, 100)}
            </p>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {events.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-primary' : 'bg-white'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
