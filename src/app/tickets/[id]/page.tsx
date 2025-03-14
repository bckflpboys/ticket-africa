'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
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
  paymentStatus: string;
}

export default function TicketDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<TicketOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${params.id}`);
        const data = await response.json();
        if (data.ticket) {
          setTicket(data.ticket);
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchTicket();
    }
  }, [session, params.id]);

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your ticket</h1>
            <button className="btn btn-primary">Sign In</button>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </>
    );
  }

  if (!ticket) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ticket not found</h1>
            <button className="btn btn-primary" onClick={() => router.push('/tickets')}>
              Back to Tickets
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-200 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Ticket Details</h1>
            <button
              className="btn btn-outline"
              onClick={() => router.push('/tickets')}
            >
              Back to Tickets
            </button>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Event Image */}
              <div className="relative w-full h-64 bg-gray-200 rounded-lg mb-6">
                {ticket.event?.image ? (
                  <Image
                    src={ticket.event.image}
                    alt={ticket.event?.name || 'Event'}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{ticket.event?.name || 'Event'}</h2>
                  <p className="text-base-content/70 mb-4">
                    {ticket.event?.date ? format(new Date(ticket.event.date), 'EEEE, MMMM d, yyyy') : 'Date not available'}
                  </p>
                  {ticket.event?.venue && (
                    <p className="text-base-content/70 mb-6">{ticket.event.venue}</p>
                  )}

                  {ticket.event?.description && (
                    <p className="text-base-content/70 mb-6">{ticket.event.description}</p>
                  )}

                  {/* Order Details */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Order Details</h3>
                    <p className="text-sm text-base-content/70">
                      Order Date: {format(new Date(ticket.orderDate), 'MMM d, yyyy h:mm a')}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Order #: {ticket.orderId.slice(-8)}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Payment Reference: {ticket.paymentReference}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Status: <span className="badge badge-success">{ticket.paymentStatus}</span>
                    </p>
                  </div>
                </div>

                <div>
                  {/* Tickets */}
                  <div className="card bg-base-200 p-6 mb-6">
                    <h3 className="font-semibold mb-4">Tickets</h3>
                    <div className="space-y-2">
                      {ticket.tickets.map((t, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{t.quantity}x {t.ticketType}</span>
                          <span>R {t.price.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="divider"></div>
                      <div className="flex justify-between items-center font-bold">
                        <span>Total</span>
                        <span>R {ticket.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg">
                    <QRCodeSVG
                      value={`${ticket.orderId}-${ticket.paymentReference}`}
                      size={200}
                      level="H"
                    />
                    <p className="text-sm text-center mt-4 text-base-content/70">
                      Present this QR code at the event
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
