import React from 'react';
import BlogCard from './BlogCard';
import Link from 'next/link';

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
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
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
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
    author: {
      name: 'Amara Kente',
      avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&auto=format&fit=crop&q=60'
    },
    category: 'Culture',
    publishedAt: '2025-02-13',
    readTime: '6 min'
  }
];

const BlogSection = () => {
  return (
    <section className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Latest from Our Blog</h2>
            <p className="text-base-content/70">
              Insights, news, and stories from the African events scene
            </p>
          </div>
          <Link 
            href="/blog" 
            className="btn btn-primary btn-outline"
          >
            View All Posts
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPosts.map((post) => (
            <BlogCard
              key={post.id}
              {...post}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
