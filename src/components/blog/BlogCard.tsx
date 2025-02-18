'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/dateUtils';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  publishedAt: string;
  readTime: string;
}

const BlogCard = ({
  id,
  title,
  excerpt,
  coverImage,
  author,
  category,
  publishedAt,
  readTime,
}: BlogCardProps) => {
  return (
    <article className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow overflow-hidden">
      <figure className="relative h-48 w-full">
        <Image
          src={coverImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-4 right-4 badge badge-primary">{category}</div>
      </figure>
      
      <div className="card-body">
        <Link href={`/blog/${id}`} className="hover:opacity-80 transition-opacity">
          <h2 className="card-title text-xl font-bold mb-2">{title}</h2>
        </Link>
        
        <p className="text-base-content/80 mb-4">{excerpt}</p>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-8 h-8 rounded-full">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            </div>
            <span className="text-sm font-medium">{author.name}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-base-content/60">
            <span>{formatDate(publishedAt)}</span>
            <span>·</span>
            <span>{readTime} read</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
