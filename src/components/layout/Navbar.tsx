import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 border-b border-base-200">
      <div className="container mx-auto">
        <div className="flex-1">
          <Link href="/" className="text-xl font-bold text-primary">
            Ticket Africa
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li><Link href="/events">Events</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
