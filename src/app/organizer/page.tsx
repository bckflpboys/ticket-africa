'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { 
  CalendarDays, 
  BarChart3, 
  Settings, 
  Users, 
  Ticket, 
  PlusCircle,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function OrganizerPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect('/auth/signin');
  }

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-base-100">
          <div className="flex justify-center items-center h-[60vh]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-base-100">
        {/* Hero Section */}
        <div className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-base-content">Welcome to Organizer Centre</h1>
              <p className="text-base-content/70 mt-4 text-lg">
                Create and manage your events, track performance, and grow your audience all in one place.
              </p>
              <div className="mt-6 flex gap-4">
                <a href="/events/create" className="btn btn-primary">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create New Event
                </a>
                <a href="/organizer/events" className="btn btn-ghost">
                  View All Events
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="stat bg-base-100 rounded-box shadow-md border-2 border-base-300">
              <div className="stat-figure text-primary">
                <CalendarDays className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Events</div>
              <div className="stat-value">25</div>
              <div className="stat-desc">Active events this month</div>
            </div>
            <div className="stat bg-base-100 rounded-box shadow-md border-2 border-base-300">
              <div className="stat-figure text-primary">
                <Ticket className="w-8 h-8" />
              </div>
              <div className="stat-title">Tickets Sold</div>
              <div className="stat-value">578</div>
              <div className="stat-desc">↗︎ 245 (22%)</div>
            </div>
            <div className="stat bg-base-100 rounded-box shadow-md border-2 border-base-300">
              <div className="stat-figure text-primary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Attendees</div>
              <div className="stat-value">1,200</div>
              <div className="stat-desc">↗︎ 400 this month</div>
            </div>
            <div className="stat bg-base-100 rounded-box shadow-md border-2 border-base-300">
              <div className="stat-figure text-primary">
                <Clock className="w-8 h-8" />
              </div>
              <div className="stat-title">Upcoming Events</div>
              <div className="stat-value">12</div>
              <div className="stat-desc">Next 30 days</div>
            </div>
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Events Management Card */}
            <div className="card bg-base-100 shadow-xl border-2 border-base-300 hover:border-primary transition-colors">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <CalendarDays className="w-6 h-6 text-primary" />
                  <h2 className="card-title">Events Management</h2>
                </div>
                <p className="text-base-content/70">Create, edit, and manage your events. Track ticket sales and attendee information in real-time.</p>
                <div className="card-actions justify-end mt-4">
                  <a href="/events/create" className="btn btn-primary">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Event
                  </a>
                  <a href="/organizer/events" className="btn btn-ghost">
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="card bg-base-100 shadow-xl border-2 border-base-300 hover:border-primary transition-colors">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  <h2 className="card-title">Analytics</h2>
                </div>
                <p className="text-base-content/70">Get detailed insights about your events, ticket sales, and audience engagement metrics.</p>
                <div className="card-actions justify-end mt-4">
                  <a href="/organizer/analytics" className="btn btn-ghost">
                    View Analytics
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="card bg-base-100 shadow-xl border-2 border-base-300 hover:border-primary transition-colors">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-6 h-6 text-primary" />
                  <h2 className="card-title">Organizer Settings</h2>
                </div>
                <p className="text-base-content/70">Customize your organizer profile, notification preferences, and payment settings.</p>
                <div className="card-actions justify-end mt-4">
                  <a href="/organizer/settings" className="btn btn-ghost">
                    Settings
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
