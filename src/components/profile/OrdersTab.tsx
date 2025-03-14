'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';

interface Ticket {
  ticketType: string;
  quantity: number;
  price: number;
}

interface Event {
  _id: string;
  name: string;
  date: string;
  venue: string;
  image: string;
}

interface TicketOrder {
  orderId: string;
  orderDate: string;
  event: Event;
  tickets: Ticket[];
  total: number;
  paymentReference: string;
  paymentStatus: string;
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('Fetching orders...');
        const response = await fetch('/api/tickets');
        const data = await response.json();
        console.log('Received data:', data);
        if (data.tickets) {
          console.log('Setting orders:', data.tickets);
          setOrders(data.tickets);
        } else {
          console.log('No tickets found in response');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-base-300 pb-4">
        <h2 className="text-2xl font-semibold">My Orders</h2>
      </div>

      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order.orderId} 
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
              onClick={() => router.push(`/tickets/${order.orderId}`)}
            >
              <div className="card-body">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Event Image */}
                  <div className="relative w-full md:w-48 h-48 bg-gray-200 rounded-lg">
                    {order.event?.image ? (
                      <Image
                        src={order.event.image}
                        alt={order.event?.name || 'Event'}
                        fill
                        className="object-cover rounded-lg"
                        priority
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{order.event?.name || 'Event'}</h2>
                        <p className="text-base-content/70 mb-2">
                          {order.event?.date ? format(new Date(order.event.date), 'EEEE, MMMM d, yyyy') : 'Date not available'}
                        </p>
                        {order.event?.venue && (
                          <p className="text-base-content/70">{order.event.venue}</p>
                        )}
                      </div>
                      <div className="badge badge-success">{order.paymentStatus}</div>
                    </div>

                    {/* Tickets */}
                    <div className="space-y-2">
                      {order.tickets.map((ticket, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{ticket.quantity}x {ticket.ticketType}</span>
                          <span>R {ticket.price.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="divider my-2"></div>
                      <div className="flex justify-between items-center font-bold">
                        <span>Total</span>
                        <span>R {order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-base-content/70">
                      <p>Order #{order.orderId.slice(-8)}</p>
                      <p>Ordered on {format(new Date(order.orderDate), 'MMM d, yyyy h:mm a')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-base-content/70">No orders found</p>
            <button 
              className="btn btn-primary mt-4"
              onClick={() => router.push('/events')}
            >
              Browse Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
