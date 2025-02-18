import React from 'react';
import SearchBar from '../search/SearchBar';

const HeroSection = () => {
  return (
    <section className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-5xl w-full">
          <h1 className="text-5xl font-bold mb-8">Find Your Next Event</h1>
          <p className="text-xl mb-12">
            Discover and book tickets for the most exciting events happening across Africa.
            From concerts to conferences, we've got you covered.
          </p>
          <SearchBar />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
