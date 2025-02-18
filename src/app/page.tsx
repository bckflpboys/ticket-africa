import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturedEvents from '@/components/events/FeaturedEvents';
import BlogSection from '@/components/blog/BlogSection';
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
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedEvents events={mockEvents} />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
}
