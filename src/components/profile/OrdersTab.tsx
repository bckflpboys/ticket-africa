'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function OrdersTab() {
  const orders = [
    {
      id: '1',
      eventName: 'Summer Music Festival',
      date: '2024-07-15',
      status: 'Confirmed',
      amount: 150.00,
      tickets: 2
    },
    {
      id: '2',
      eventName: 'Tech Conference 2024',
      date: '2024-08-20',
      status: 'Pending',
      amount: 299.99,
      tickets: 1
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-base-300 pb-4">
        <h2 className="text-2xl font-semibold">My Orders</h2>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order.id} 
              className="border-2 border-neutral/30 bg-base-200 rounded-lg p-4 hover:border-neutral/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{order.eventName}</h3>
                  <p className="text-base-content/70">Date: {order.date}</p>
                  <p className="text-base-content/70">Tickets: {order.tickets}</p>
                </div>
                <div className="space-y-2 text-right">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm
                    ${order.status === 'Confirmed' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}
                  >
                    {order.status}
                  </div>
                  <p className="font-semibold">R {order.amount.toFixed(2)}</p>
                  <Button variant="ghost" size="sm" className="btn-sm">View Details</Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
