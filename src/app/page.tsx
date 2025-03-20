'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedEvents from '@/components/events/FeaturedEvents';
import BlogSection from '@/components/blog/BlogSection';

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
  isFeatured: boolean; // Add this property to the Event interface
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Check if we have cached events and they're less than 5 minutes old
        const cachedData = localStorage.getItem('eventsData');
        const cachedTimestamp = localStorage.getItem('eventsTimestamp');
        const now = new Date().getTime();
        
        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp) < 5 * 60 * 1000)) {
          setEvents(JSON.parse(cachedData));
          setLoading(false);
          return;
        }

        // If no cache or cache is old, fetch new data
        const response = await fetch('/api/events');
        const data = await response.json();
        
        // Cache the new data
        localStorage.setItem('eventsData', JSON.stringify(data));
        localStorage.setItem('eventsTimestamp', now.toString());
        
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        
        // If fetch fails, try to use cached data regardless of age
        const cachedData = localStorage.getItem('eventsData');
        if (cachedData) {
          setEvents(JSON.parse(cachedData));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        <HeroSection />
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <FeaturedEvents events={events.filter(event => event.isFeatured)} />
        )}
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
