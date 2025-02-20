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
