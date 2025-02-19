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
      <div className="container mx-auto flex justify-between items-center">
        {/* User Account */}
        <div className="dropdown dropdown-bottom">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop" />
            </div>
          </div>
          <ul tabIndex={0} className="dropdown-content menu menu-sm z-[999] p-2 shadow bg-base-100 rounded-box w-52 mt-2 border border-base-300">
            <li className="menu-title px-2 pt-1 pb-2 border-b border-base-200">
              <span className="text-sm font-semibold">John Doe</span>
              <span className="text-xs font-normal text-base-content/70">john@example.com</span>
            </li>
            <li><Link href="/profile" className="py-2">Profile</Link></li>
            <li><Link href="/orders" className="py-2">My Orders</Link></li>
            <li><Link href="/settings" className="py-2">Settings</Link></li>
            <li><a className="py-2">Logout</a></li>
          </ul>
        </div>

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
              <li className="dropdown dropdown-hover">
                <div tabIndex={0} role="button" className={`${isActive('/contact') || isActive('/about') ? 'active' : ''}`}>
                  Contact
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link href="/contact">Contact Us</Link>
                  </li>
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                </ul>
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

        {/* Shopping Cart */}
        <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="badge badge-sm indicator-item">0</span>
            </div>
          </div>
          <div tabIndex={0} className="dropdown-content z-[999] card card-compact w-52 p-2 shadow bg-base-100 mt-2 border border-base-300 rounded-box">
            <div className="card-body p-2">
              <div className="flex flex-col gap-1 border-b border-base-200 pb-2 mb-2">
                <span className="text-sm font-semibold">Shopping Cart</span>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-base-content/70">0 Items</span>
                  <span className="text-xs font-medium">Total: ₦0</span>
                </div>
              </div>
              <div className="card-actions">
                <Link href="/cart" className="btn btn-primary btn-sm w-full">View cart</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-base-100 border-b border-base-200 transition-all duration-300 ${
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
              <li className="dropdown dropdown-hover">
                <div tabIndex={0} role="button" className={`text-lg ${isActive('/contact') || isActive('/about') ? 'text-primary font-semibold' : ''}`}>
                  Contact
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <Link href="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>
                  </li>
                  <li>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
