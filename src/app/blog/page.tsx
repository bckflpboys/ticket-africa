'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlogCard from '@/components/blog/BlogCard';
import { useSearchParams } from 'next/navigation';

// Mock data - replace with actual API call
const mockPosts = [
  {
    id: '1',
    title: 'Top 10 Music Festivals Coming to Africa in 2025',
    excerpt: 'Discover the most anticipated music festivals that will rock the African continent this year, featuring both local and international artists.',
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=60',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60'
    },
    category: 'Music',
    publishedAt: '2025-02-15',
    readTime: '5 min'
  },
  {
    id: '2',
    title: 'The Rise of Tech Conferences in West Africa',
    excerpt: 'How West Africa is becoming a major hub for technology conferences and what this means for the region\'s tech ecosystem.',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60',
    author: {
      name: 'David Okonkwo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60'
    },
    category: 'Technology',
    publishedAt: '2025-02-14',
    readTime: '4 min'
  },
  {
    id: '3',
    title: 'Cultural Festivals: Preserving African Heritage',
    excerpt: 'An in-depth look at how cultural festivals are playing a crucial role in preserving and celebrating African heritage.',
    coverImage: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&auto=format&fit=crop&q=60',
    author: {
      name: 'Amara Kente',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&auto=format&fit=crop&q=60'
    },
    category: 'Culture',
    publishedAt: '2025-02-13',
    readTime: '6 min'
  },
  {
    id: '4',
    title: 'The Business of Event Planning in Africa',
    excerpt: 'A comprehensive guide to understanding the event planning industry in Africa and its growth potential.',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60'
    },
    category: 'Business',
    publishedAt: '2025-02-12',
    readTime: '7 min'
  },
  {
    id: '5',
    title: 'Sustainable Event Management',
    excerpt: 'Learn how event organizers across Africa are adopting eco-friendly practices to reduce environmental impact.',
    coverImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=60',
    author: {
      name: 'David Okonkwo',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60'
    },
    category: 'Sustainability',
    publishedAt: '2025-02-11',
    readTime: '5 min'
  }
];

const categories = ['All', 'Music', 'Technology', 'Culture', 'Business', 'Sustainability'];

export default function BlogPage() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter posts by category
  const filteredPosts = selectedCategory === 'All'
    ? mockPosts
    : mockPosts.filter(post => post.category === selectedCategory);

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-base-200 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl max-w-3xl mx-auto text-base-content/80">
              Stay updated with the latest news, insights, and stories from the African events industry.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-base-100">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                  className={`btn ${
                    selectedCategory === category
                      ? 'btn-primary'
                      : 'btn-ghost'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="join">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      className={`join-item btn ${
                        currentPage === number ? 'btn-active' : ''
                      }`}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
