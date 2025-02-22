'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileTab from '@/components/profile/ProfileTab';
import OrdersTab from '@/components/profile/OrdersTab';
import MyEventsTab from '@/components/profile/MyEventsTab';
import SettingsTab from '@/components/profile/SettingsTab';
import Navbar from '@/components/layout/Navbar';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'profile';
  const { data: session } = useSession();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-base-100">
        {/* Profile Header */}
        <div className="bg-primary/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-6">
              <div className="avatar">
                <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img 
                    src={session?.user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2080&auto=format&fit=crop"} 
                    alt="Profile" 
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-base-content">{session?.user?.name || "User Name"}</h1>
                <p className="text-base-content/70">{session?.user?.email || "user@example.com"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="card bg-base-100 shadow-xl mt-[-32px] border-2 border-base-300">
            {/* Organizer Centre Link */}
            <div className="p-4 bg-primary/5 border-b-2 border-base-300">
              <a 
                href="/organizer"
                className="btn btn-primary"
              >
                Go to Organizer Centre
              </a>
            </div>
            {/* Tabs */}
            <div className="tabs tabs-bordered border-b-2 border-base-300">
              <a 
                className={`tab tab-lg flex-1 ${defaultTab === 'profile' ? 'tab-active' : ''}`}
                href="/profile"
              >
                Profile
              </a>
              <a 
                className={`tab tab-lg flex-1 ${defaultTab === 'orders' ? 'tab-active' : ''}`}
                href="/profile?tab=orders"
              >
                Orders
              </a>
              <a 
                className={`tab tab-lg flex-1 ${defaultTab === 'myevents' ? 'tab-active' : ''}`}
                href="/profile?tab=myevents"
              >
                My Events
              </a>
              <a 
                className={`tab tab-lg flex-1 ${defaultTab === 'settings' ? 'tab-active' : ''}`}
                href="/profile?tab=settings"
              >
                Settings
              </a>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {defaultTab === 'profile' && <ProfileTab />}
              {defaultTab === 'orders' && <OrdersTab />}
              {defaultTab === 'myevents' && <MyEventsTab />}
              {defaultTab === 'settings' && <SettingsTab />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
