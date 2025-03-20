import React from 'react';

const EventDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section Skeleton */}
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8 bg-gray-200 animate-pulse" />

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Skeleton */}
            <div className="h-10 bg-gray-200 rounded-lg w-3/4 animate-pulse" />

            {/* Date and Location Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>

            {/* Additional Info Skeleton */}
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-20 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Ticket Section Skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border-2 border-gray-200 space-y-6">
              {/* Price Skeleton */}
              <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse" />

              {/* Ticket Types Skeleton */}
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                  </div>
                ))}
              </div>

              {/* CTA Button Skeleton */}
              <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetailsSkeleton;
