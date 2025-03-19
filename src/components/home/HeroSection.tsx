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
  price: number;
  images: string[];
  category: string;
  tag: string;
  isBanner: boolean;
  description: string;
  ticketTypes: { name: string; price: { $numberInt: string } }[];
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
        const response = await fetch('/api/admin/events');
        const data = await response.json();
        setEvents(data.filter((event: Event) => event.isBanner));
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
            <Link href={`/events/${events[currentSlide]?._id.toString()}`}>
              <h2 className="text-3xl font-bold mb-4 hover:text-primary transition-colors">
                {events[currentSlide]?.title}
              </h2>
            </Link>
            <div className="flex items-center justify-center gap-6 text-lg font-bold">
              <p>{events[currentSlide]?.date ? new Date(events[currentSlide].date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Date not available'}</p>
              <p>{events[currentSlide]?.location ? JSON.parse(events[currentSlide].location).venue.city : 'Location not available'}</p>
              <p className="text-primary">R{events[currentSlide]?.ticketTypes[0]?.price?.$numberInt || '200'}</p>
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
