'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchFilters {
  city: string;
  country: string;
  category: string;
  date: string;
  priceRange: string;
}

const categories = [
  'All Categories',
  'Music',
  'Technology',
  'Business',
  'Sports',
  'Arts & Theatre',
  'Food & Drink',
  'Community'
];

const countries = [
  'All Countries',
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'Ethiopia',
  'Tanzania'
];

const cities = {
  Nigeria: ['All Cities', 'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano'],
  Ghana: ['All Cities', 'Accra', 'Kumasi', 'Tamale', 'Takoradi'],
  Kenya: ['All Cities', 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'],
  'South Africa': ['All Cities', 'Johannesburg', 'Cape Town', 'Durban', 'Pretoria'],
  Ethiopia: ['All Cities', 'Addis Ababa', 'Dire Dawa', 'Mek\'ele', 'Gondar'],
  Tanzania: ['All Cities', 'Dar es Salaam', 'Dodoma', 'Mwanza', 'Arusha']
};

const priceRanges = [
  'Any Price',
  'Free',
  '₦1 - ₦5,000',
  '₦5,001 - ₦20,000',
  '₦20,001 - ₦50,000',
  '₦50,000+'
];

const SearchBar = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    city: 'All Cities',
    country: 'All Countries',
    category: 'All Categories',
    date: '',
    priceRange: 'Any Price'
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    
    if (searchTerm) queryParams.append('q', searchTerm);
    if (filters.category !== 'All Categories') queryParams.append('category', filters.category);
    if (filters.country !== 'All Countries') queryParams.append('country', filters.country);
    if (filters.city !== 'All Cities') queryParams.append('city', filters.city);
    if (filters.date) queryParams.append('date', filters.date);
    if (filters.priceRange !== 'Any Price') queryParams.append('price', filters.priceRange);

    router.push(`/events?${queryParams.toString()}`);
  };

  const handleCountryChange = (country: string) => {
    setFilters(prev => ({
      ...prev,
      country,
      city: 'All Cities' // Reset city when country changes
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for events..."
              className="input input-bordered w-full pl-10"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-circle btn-ghost"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-base-200 rounded-lg">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="select select-bordered w-full"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.country}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="select select-bordered w-full"
            >
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="select select-bordered w-full"
            >
              {cities[filters.country as keyof typeof cities]?.map(city => (
                <option key={city} value={city}>{city}</option>
              )) || cities.Nigeria.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="input input-bordered w-full"
            />

            <select
              value={filters.priceRange}
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
              className="select select-bordered w-full"
            >
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
