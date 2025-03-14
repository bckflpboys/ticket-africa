'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

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
  description?: string;
}

interface TicketOrder {
  orderId: string;
  orderDate: string;
  event: Event;
  tickets: Ticket[];
  total: number;
  paymentReference: string;
}

export default function TicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets');
        const data = await response.json();
        if (data.tickets) {
          setTickets(data.tickets);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTickets();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your tickets</h1>
          <button className="btn btn-primary">Sign In</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Tickets</h1>
          
          {tickets.length === 0 ? (
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <h2 className="text-xl font-semibold">No tickets found</h2>
                <p className="text-base-content/70">You haven't purchased any tickets yet.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {tickets.map((order) => (
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
                        <h2 className="text-2xl font-bold mb-2">{order.event?.name || 'Event'}</h2>
                        <p className="text-base-content/70 mb-4">
                          {order.event?.date ? format(new Date(order.event.date), 'EEEE, MMMM d, yyyy') : 'Date not available'} 
                          {order.event?.venue ? ` at ${order.event.venue}` : ''}
                        </p>

                        {/* Tickets */}
                        <div className="space-y-2">
                          {order.tickets.map((ticket, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span>{ticket.quantity}x {ticket.ticketType}</span>
                              <span>R {ticket.price.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="divider"></div>
                          <div className="flex justify-between items-center font-bold">
                            <span>Total</span>
                            <span>R {order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
                        <QRCodeSVG
                          value={`${order.orderId}-${order.paymentReference}`}
                          size={128}
                          level="H"
                        />
                        <p className="text-xs text-center mt-2 text-base-content/70">
                          Order #{order.orderId.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
