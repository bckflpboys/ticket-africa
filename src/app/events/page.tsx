'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/search/SearchBar';
import EventCard from '@/components/events/EventCard';
import type { Event } from '@/lib/utils/eventUtils';
import type { SearchFilters } from '@/components/search/SearchBar';

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
  {
    id: '4',
    title: 'African Fashion Week',
    date: '2025-05-10',
    location: 'Lagos, Nigeria',
    price: 20000,
    imageUrl: 'https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=800&auto=format&fit=crop&q=60',
    category: 'Fashion'
  },
  {
    id: '5',
    title: 'Food & Wine Festival',
    date: '2025-06-15',
    location: 'Abuja, Nigeria',
    price: 10000,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=60',
    category: 'Food & Drink'
  }
];

function filterEvents(events: Event[], filters: SearchFilters): Event[] {
  return events.filter(event => {
    const searchTermMatch = !filters.searchTerm || 
      event.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const categoryMatch = filters.category === 'All Categories' || 
      event.category === filters.category;

    const locationMatch = filters.city === 'All Cities' || 
      event.location.includes(filters.city);

    const countryMatch = filters.country === 'All Countries' || 
      event.location.includes(filters.country);

    const dateMatch = !filters.date || 
      event.date === filters.date;

    const priceMatch = filters.priceRange === 'Any Price' || 
      matchPriceRange(event.price, filters.priceRange);

    return searchTermMatch && categoryMatch && locationMatch && 
           countryMatch && dateMatch && priceMatch;
  });
}

function matchPriceRange(price: number, range: string): boolean {
  switch (range) {
    case 'Free':
      return price === 0;
    case '₦1 - ₦5,000':
      return price > 0 && price <= 5000;
    case '₦5,001 - ₦20,000':
      return price > 5000 && price <= 20000;
    case '₦20,001 - ₦50,000':
      return price > 20000 && price <= 50000;
    case '₦50,000+':
      return price > 50000;
    default:
      return true;
  }
}

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);

  // Get initial filters from URL
  const initialFilters = {
    searchTerm: searchParams.get('q') || '',
    category: searchParams.get('category') || 'All Categories',
    country: searchParams.get('country') || 'All Countries',
    city: searchParams.get('city') || 'All Cities',
    date: searchParams.get('date') || '',
    priceRange: searchParams.get('price') || 'Any Price'
  };

  // Handle search
  const handleSearch = (filters: SearchFilters) => {
    const filtered = filterEvents(mockEvents, filters);
    setFilteredEvents(filtered);
  };

  // Initial filter on mount
  useEffect(() => {
    handleSearch(initialFilters);
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-base-200 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-8">Discover Events</h1>
            <SearchBar onSearch={handleSearch} initialFilters={initialFilters} />
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
