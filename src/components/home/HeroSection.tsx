'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SearchBar from '../search/SearchBar';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  imageUrl: string;
  category: string;
  tag: string;
}

const featuredEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Summit 2025',
    date: '2025-03-15',
    location: 'Cape Town, South Africa',
    price: 450,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    category: 'Technology',
    tag: 'conference, tech, innovation'
  },
  {
    id: '2',
    title: 'Durban July Horse Race',
    date: '2025-07-01',
    location: 'Durban, South Africa',
    price: 350,
    imageUrl: 'https://images.unsplash.com/photo-1499889808931-317a0255c0e9?w=800&auto=format&fit=crop&q=60',
    category: 'Sports',
    tag: 'sports, racing, entertainment'
  },
  {
    id: '3',
    title: 'Africa Wine Festival',
    date: '2025-04-20',
    location: 'Stellenbosch, South Africa',
    price: 250,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=60',
    category: 'Food & Drink',
    tag: 'wine, food, tasting'
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[70vh] bg-base-200">
      {/* Background Slider */}
      <div className="absolute inset-0 w-full h-full">
        {featuredEvents.map((event, index) => (
          <div
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/50 z-10" />
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover"
              priority={index === 0}
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
            <Link href={`/events/${featuredEvents[currentSlide].id}`}>
              <h2 className="text-3xl font-bold mb-4 hover:text-primary transition-colors">
                {featuredEvents[currentSlide].title}
              </h2>
            </Link>
            <div className="flex items-center justify-center gap-6 text-lg">
              <p>{featuredEvents[currentSlide].date}</p>
              <p>{featuredEvents[currentSlide].location}</p>
              <p>R {featuredEvents[currentSlide].price}</p>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {featuredEvents.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-primary scale-125'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <SearchBar variant="dark" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
