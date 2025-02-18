'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar bg-transparent backdrop-blur-sm border-b border-base-200/10 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex-1 flex justify-center gap-8 items-center">
          <Link href="/" className="text-xl font-bold text-primary">
            Ticket Africa
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link 
                  href="/events" 
                  className={isActive('/events') ? 'active' : ''}
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className={isActive('/blog') ? 'active' : ''}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className={isActive('/about') ? 'active' : ''}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className={isActive('/contact') ? 'active' : ''}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex-none md:hidden">
            <button
              className="btn btn-square btn-ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-transparent backdrop-blur-sm border-b border-base-200/10 transition-all duration-300 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="container mx-auto py-8">
            <ul className="flex flex-col items-center gap-6">
              <li>
                <Link 
                  href="/events" 
                  className={`text-lg ${isActive('/events') ? 'text-primary font-semibold' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className={`text-lg ${isActive('/blog') ? 'text-primary font-semibold' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className={`text-lg ${isActive('/about') ? 'text-primary font-semibold' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className={`text-lg ${isActive('/contact') ? 'text-primary font-semibold' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
