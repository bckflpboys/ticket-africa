'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProfileTab from '@/components/profile/ProfileTab';
import OrdersTab from '@/components/profile/OrdersTab';
import SettingsTab from '@/components/profile/SettingsTab';
import Navbar from '@/components/layout/Navbar';
import { useSession } from 'next-auth/react';

type TabType = 'profile' | 'orders' | 'settings';

export default function ProfilePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const defaultTab = searchParams.get('tab') as TabType || 'profile';
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  const { data: session } = useSession();

  // Update URL without refresh when tab changes
  useEffect(() => {
    const newUrl = activeTab === 'profile' 
      ? '/profile'
      : `/profile?tab=${activeTab}`;
    
    window.history.pushState({}, '', newUrl);
  }, [activeTab]);

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
  };

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
              <button 
                onClick={() => handleTabClick('profile')}
                className={`tab tab-lg flex-1 ${activeTab === 'profile' ? 'tab-active' : ''}`}
              >
                Profile
              </button>
              <button 
                onClick={() => handleTabClick('orders')}
                className={`tab tab-lg flex-1 ${activeTab === 'orders' ? 'tab-active' : ''}`}
              >
                Orders
              </button>
              <button 
                onClick={() => handleTabClick('settings')}
                className={`tab tab-lg flex-1 ${activeTab === 'settings' ? 'tab-active' : ''}`}
              >
                Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'profile' && <ProfileTab />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
