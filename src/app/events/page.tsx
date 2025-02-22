'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchBar from '@/components/search/SearchBar';
import EventCard from '@/components/events/EventCard';
import type { SearchFilters } from '@/components/search/SearchBar';

// Mock categories for demonstration
const CATEGORIES = [
  'Technology',
  'Music',
  'Business',
  'Fashion',
  'Food & Drink',
  'Sports',
  'Arts',
  'Education',
  'Entertainment',
  'Health'
] as const;

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
  tags: string[];
}

function filterEvents(events: Event[], filters: SearchFilters): Event[] {
  return events.filter(event => {
    // Search term filter
    if (filters.searchTerm && !event.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category !== 'All Categories' && event.category !== filters.category) {
      return false;
    }

    // Location filters
    let locationMatch = true;
    try {
      const locationData = JSON.parse(event.location);
      if (filters.country !== 'All Countries' && locationData.venue.country !== filters.country) {
        locationMatch = false;
      }
      if (filters.city !== 'All Cities' && locationData.venue.city !== filters.city) {
        locationMatch = false;
      }
    } catch {
      // If location parsing fails, only match if no specific location is selected
      if (filters.country !== 'All Countries' || filters.city !== 'All Cities') {
        locationMatch = false;
      }
    }
    if (!locationMatch) return false;

    // Date filter
    if (filters.date) {
      const eventDate = new Date(event.date);
      const filterDate = new Date(filters.date);
      if (eventDate.toDateString() !== filterDate.toDateString()) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange !== 'Any Price') {
      const lowestPrice = Math.min(...event.ticketTypes.map(t => t.price));
      if (!matchPriceRange(lowestPrice, filters.priceRange)) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some(tag => 
        event.tags.some(eventTag => eventTag.toLowerCase().includes(tag.toLowerCase()))
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

function matchPriceRange(price: number, range: string): boolean {
  switch (range) {
    case 'Under R100':
      return price < 100;
    case 'R100 - R500':
      return price >= 100 && price <= 500;
    case 'R500 - R1000':
      return price > 500 && price <= 1000;
    case 'Over R1000':
      return price > 1000;
    default:
      return true;
  }
}

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Get initial filters from URL
  const initialFilters = {
    searchTerm: searchParams.get('q') || '',
    category: searchParams.get('category') || 'All Categories',
    country: searchParams.get('country') || 'All Countries',
    city: searchParams.get('city') || 'All Cities',
    date: searchParams.get('date') || '',
    priceRange: searchParams.get('price') || 'Any Price',
    tags: searchParams.getAll('tags') || []
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data);
        handleSearch(initialFilters, data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle search
  const handleSearch = (filters: SearchFilters, eventsList = events) => {
    const filtered = filterEvents(eventsList, filters);
    setFilteredEvents(filtered);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-base-200 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-8">Discover Events</h1>
            <SearchBar onSearch={(filters) => handleSearch(filters)} initialFilters={initialFilters} />
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event) => (
                  <EventCard key={event._id} {...event} />
                ))}
              </div>
            )}

            {!loading && filteredEvents.length === 0 && (
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
