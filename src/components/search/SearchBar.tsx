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
  variant?: 'light' | 'dark';
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
  'R1 - R500',
  'R501 - R2,000',
  'R2,001 - R5,000',
  'R5,000+'
];

const popularTags = [
  'music',
  'technology',
  'conference',
  'innovation',
  'festival',
  'concert',
  'live-music',
  'networking',
  'food',
  'tasting',
  'sports',
  'racing',
  'entertainment'
];

const SearchBar = ({ onSearch, initialFilters = {}, variant = 'light' }: SearchBarProps) => {
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
    <form onSubmit={handleSearch} className="w-full">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered flex-1 text-base-content bg-base-100"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>

        {/* Advanced Search Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`btn btn-ghost btn-sm ${variant === 'dark' ? 'text-white' : 'text-base-content'}`}
        >
          {showAdvanced ? 'Hide filters' : 'Show filters'}
        </button>

        {/* Advanced Search */}
        {showAdvanced && (
          <div className={`relative flex flex-col gap-4 p-6 rounded-lg shadow-lg bg-base-100 ${variant === 'dark' ? '' : 'text-base-content'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="select select-bordered w-full text-base-content bg-base-100"
              >
                <option>All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                className="select select-bordered w-full text-base-content bg-base-100"
              >
                <option>All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <select
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="select select-bordered w-full text-base-content bg-base-100"
              >
                <option>All Cities</option>
                {cities[filters.country as keyof typeof cities]?.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                )) || cities['South Africa'].map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                className="input input-bordered w-full text-base-content bg-base-100"
              />

              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="select select-bordered w-full text-base-content bg-base-100"
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
                    value={tagInput}
                    onChange={(e) => handleTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput) {
                        addTag(tagInput);
                      }
                    }}
                    className="input input-bordered flex-1 text-base-content bg-base-100"
                  />
                  {tagInput && (
                    <button
                      type="button"
                      onClick={() => addTag(tagInput)}
                      className="btn btn-secondary"
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
                        type="button"
                        onClick={() => addTag(tag)}
                        className="btn btn-ghost btn-sm"
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
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="btn btn-ghost btn-xs"
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
                        type="button"
                        onClick={() => addTag(tag)}
                        className="btn btn-outline btn-xs"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
