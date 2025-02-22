'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MyEventsTab() {
  const events = [
    {
      id: '1',
      title: 'Tech Conference 2024',
      date: '2024-04-20',
      status: 'Published',
      ticketsSold: 45,
      totalTickets: 100
    },
    // Add more mock events as needed
  ];

  return (
    <Card className="p-6 border-2 border-neutral/30 bg-base-200 rounded-lg">
      <div className="flex justify-between items-center border-b-2 border-base-300 pb-4">
        <h2 className="text-2xl font-semibold">My Events</h2>
        <Link href="/events/create">
          <Button className="btn btn-primary btn-sm">Create New Event</Button>
        </Link>
      </div>
      
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div 
              key={event.id} 
              className="border-2 border-neutral/30 bg-base-200 rounded-lg p-4 hover:border-neutral/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-base-content/70">Date: {new Date(event.date).toLocaleDateString('en-ZA')}</p>
                </div>
                <div className="space-y-2 text-right">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm
                    ${event.status === 'Published' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}
                  >
                    {event.status}
                  </div>
                  <p className="text-base-content/70">Tickets Sold: {event.ticketsSold}/{event.totalTickets}</p>
                  <p className="font-semibold">Sold: {Math.round((event.ticketsSold / event.totalTickets) * 100)}%</p>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Edit Event</Button>
                    <Button variant="outline" size="sm">View Analytics</Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No events created yet</p>
            <Link href="/events/create" className="text-primary hover:underline">
              Create your first event
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
}
