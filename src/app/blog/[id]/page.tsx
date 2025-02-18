'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { formatDate } from '@/lib/utils/dateUtils';

// Mock data - replace with actual API call
const mockPosts = [
  {
    id: '1',
    title: 'Top 10 Music Festivals Coming to Africa in 2025',
    content: `
      <p>The African music festival scene is set to explode in 2025, with a lineup of incredible events that showcase both local talent and international stars. Here's our curated list of the most anticipated festivals that you won't want to miss.</p>

      <h2>1. Afrobeats Fusion Festival - Lagos, Nigeria</h2>
      <p>Set against the vibrant backdrop of Lagos, this three-day festival brings together the biggest names in Afrobeats, featuring collaborative performances with international artists. The festival will include multiple stages, food villages, and interactive art installations.</p>

      <h2>2. Sahara Soul Festival - Marrakech, Morocco</h2>
      <p>A unique blend of traditional North African music with contemporary sounds, this festival takes place under the stars in the Moroccan desert. Attendees can enjoy camping experiences, desert excursions, and authentic local cuisine.</p>

      <h2>3. East African Music Summit - Nairobi, Kenya</h2>
      <p>More than just a music festival, this event includes industry panels, workshops, and showcases of emerging talent from across East Africa. The main stage will feature established artists while supporting stages spotlight up-and-coming performers.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=60',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60',
      bio: 'Sarah is a music journalist with over a decade of experience covering the African music scene.'
    },
    category: 'Music',
    publishedAt: '2025-02-15',
    readTime: '5 min'
  },
  // Add more blog posts here...
];

export default function BlogPost() {
  const params = useParams();
  const post = mockPosts.find(p => p.id === params.id);

  if (!post) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <h1 className="text-3xl font-bold text-center">Post not found</h1>
          <div className="text-center mt-4">
            <Link href="/blog" className="btn btn-primary">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-base-200">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="container mx-auto px-4 py-12 text-white">
              <div className="max-w-3xl">
                <div className="mb-4">
                  <span className="badge badge-primary">{post.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-10 h-10 rounded-full">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <span className="font-medium">{post.author.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span>·</span>
                    <span>{post.readTime} read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <article className="prose lg:prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-8">
                  {/* Author Bio */}
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h3 className="text-lg font-bold mb-4">About the Author</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-full">
                            <Image
                              src={post.author.avatar}
                              alt={post.author.name}
                              width={64}
                              height={64}
                              className="rounded-full"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{post.author.name}</h4>
                          <p className="text-sm text-base-content/70">{post.author.bio}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Share Buttons */}
                  <div className="card bg-base-200 mt-8">
                    <div className="card-body">
                      <h3 className="text-lg font-bold mb-4">Share this article</h3>
                      <div className="flex gap-4">
                        <button className="btn btn-circle btn-ghost">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                          </svg>
                        </button>
                        <button className="btn btn-circle btn-ghost">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                          </svg>
                        </button>
                        <button className="btn btn-circle btn-ghost">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
