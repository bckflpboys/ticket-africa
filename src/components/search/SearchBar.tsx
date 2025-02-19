'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface SearchFilters {
  searchTerm: string;
  category: string;
  country: string;
  city: string;
  date: string;
  priceRange: string;
  tags?: string[];
}

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
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

const popularTags = [
  'Music',
  'Technology',
  'Business',
  'Sports',
  'Arts & Theatre',
  'Food & Drink',
  'Community',
  'Concert',
  'Seminar',
  'Workshop',
  'Conference',
  'Meetup',
  'Gala',
  'Festival',
  'Fair',
  'Exhibition'
];

const SearchBar = ({ onSearch, initialFilters = {} }: SearchBarProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: initialFilters.searchTerm || '',
    category: initialFilters.category || 'All Categories',
    country: initialFilters.country || 'All Countries',
    city: initialFilters.city || 'All Cities',
    date: initialFilters.date || '',
    priceRange: initialFilters.priceRange || 'Any Price',
    tags: initialFilters.tags
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
    filters.tags?.forEach(tag => queryParams.append('tags', tag));

    // Update URL
    router.push(`/events?${queryParams.toString()}`);

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch({
        ...filters,
        searchTerm
      });
    }
  };

  const handleTagInput = (input: string) => {
    setTagInput(input);
    if (input.length >= 2) {
      // Filter popular tags based on input
      const suggestions = popularTags.filter(tag =>
        tag.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestedTags(suggestions);
    } else {
      setSuggestedTags([]);
    }
  };

  const addTag = (tag: string) => {
    if (!filters.tags?.includes(tag)) {
      setFilters(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag],
      }));
    }
    setTagInput('');
    setSuggestedTags([]);
  };

  const removeTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || [],
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search events..."
          className="input input-bordered flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <button
        className="btn btn-ghost btn-sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        {showAdvanced ? 'Hide' : 'Show'} Filters
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <select
            className="select select-bordered w-full"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option>All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered w-full"
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          >
            <option>All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered w-full"
            value={filters.city}
            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          >
            <option>All Cities</option>
            {cities[filters.country as keyof typeof cities]?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            )) || cities.Nigeria.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="input input-bordered w-full"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          />

          <select
            className="select select-bordered w-full"
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
          >
            <option>Any Price</option>
            {priceRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>

          {/* Tags Section */}
          <div className="col-span-full space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tags..."
                className="input input-bordered flex-1"
                value={tagInput}
                onChange={(e) => handleTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput) {
                    addTag(tagInput);
                  }
                }}
              />
              {tagInput && (
                <button
                  className="btn btn-secondary"
                  onClick={() => addTag(tagInput)}
                >
                  Add
                </button>
              )}
            </div>

            {/* Tag Suggestions */}
            {suggestedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-base-200 rounded-lg">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    className="btn btn-ghost btn-sm"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Tags */}
            {filters.tags && filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge badge-primary badge-lg gap-2"
                  >
                    {tag}
                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Popular Tags */}
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Popular Tags:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    className="btn btn-outline btn-xs"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
