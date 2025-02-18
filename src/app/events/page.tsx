'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/search/SearchBar';
import EventCard from '@/components/events/EventCard';
import type { Event } from '@/lib/utils/eventUtils';

// Mock data - replace with actual API call
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Conference 2025',
    date: '2025-03-15',
    location: 'Lagos, Nigeria',
    price: 25000,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    category: 'Technology'
  },
  {
    id: '2',
    title: 'Afrobeats Festival',
    date: '2025-04-01',
    location: 'Abuja, Nigeria',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
    category: 'Music'
  },
  {
    id: '3',
    title: 'Business Summit',
    date: '2025-03-20',
    location: 'Port Harcourt, Nigeria',
    price: 30000,
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop&q=60',
    category: 'Business'
  },
  // Add more events here
];

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-base-200 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-8">Discover Events</h1>
            <SearchBar />
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-semibold mb-4">No events found</h3>
                <p className="text-base-content/70">
                  Try adjusting your search criteria or check back later for new events.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
