'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiCalendar, 
  FiUsers, 
  FiSettings, 
  FiBarChart2,
  FiTag,
  FiMenu,
  FiX
} from 'react-icons/fi';
import Navbar from '@/components/layout/Navbar';

const menuItems = [
  { name: 'Dashboard', icon: FiHome, path: '/admin' },
  { name: 'Events', icon: FiCalendar, path: '/admin/events' },
  { name: 'Tickets', icon: FiTag, path: '/admin/tickets' },
  { name: 'Users', icon: FiUsers, path: '/admin/users' },
  { name: 'Analytics', icon: FiBarChart2, path: '/admin/analytics' },
  { name: 'Settings', icon: FiSettings, path: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-base-200">
      {/* Main Navbar */}
      <Navbar />
      
      {/* Sidebar */}
      <aside className={`fixed top-[64px] left-0 z-40 h-[calc(100vh-64px)] transition-transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } bg-base-100 border-r border-base-300 w-64`}>
        <div className="flex items-center justify-between p-4">
          <Link href="/admin" className="text-xl font-bold">
            Admin Panel
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="px-3 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-content' 
                    : 'hover:bg-base-200'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`pt-[64px] ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Navigation */}
        <header className="bg-base-100 border-b border-base-300">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://ui-avatars.com/api/?name=Admin" alt="Admin" />
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li><a>Profile</a></li>
                  <li><a>Settings</a></li>
                  <li><a>Logout</a></li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
