'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface TicketType {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  quantitySold: number;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  endTime: string;
  location: string;
  images: string[];
  ticketTypes: TicketType[];
  coolerBoxPass: boolean;
  coolerBoxLiters: number;
  coolerBoxPrice: number;
}

interface TicketSelection {
  [key: string]: number;
}

export default function CheckoutPage({ params }: { params: { eventId: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTickets, setSelectedTickets] = useState<TicketSelection>({});
  const [wantsCoolerBox, setWantsCoolerBox] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.eventId]);

  useEffect(() => {
    if (event) {
      // Calculate subtotal based on selected tickets
      const ticketSubtotal = Object.entries(selectedTickets).reduce((acc, [ticketId, quantity]) => {
        const ticket = event.ticketTypes.find(t => t._id === ticketId);
        return acc + (ticket ? ticket.price * quantity : 0);
      }, 0);

      setSubtotal(ticketSubtotal);
      
      // Add cooler box price if selected
      const coolerBoxCost = wantsCoolerBox && event.coolerBoxPass ? event.coolerBoxPrice : 0;
      setTotal(ticketSubtotal + coolerBoxCost);
    }
  }, [selectedTickets, wantsCoolerBox, event]);

  const handleTicketChange = (ticketId: string, quantity: number) => {
    if (quantity < 0) return;
    
    const ticket = event?.ticketTypes.find(t => t._id === ticketId);
    if (!ticket) return;

    // Check if quantity is available
    const currentSold = ticket.quantitySold || 0;
    if (quantity > (ticket.quantity - currentSold)) {
      setError(`Only ${ticket.quantity - currentSold} tickets available`);
      return;
    }

    setSelectedTickets(prev => ({
      ...prev,
      [ticketId]: quantity
    }));
    setError('');
  };

  const handleCheckout = async () => {
    if (!session) {
      // Save checkout data to session storage
      sessionStorage.setItem('checkoutData', JSON.stringify({
        eventId: params.eventId,
        selectedTickets,
        wantsCoolerBox
      }));
      router.push('/auth/signin?callbackUrl=/checkout/' + params.eventId);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: params.eventId,
          tickets: selectedTickets,
          coolerBox: wantsCoolerBox,
          total
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      const { checkoutUrl } = await response.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError('Failed to process checkout');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error mb-4">Error</h1>
          <p>{error || 'Event not found'}</p>
          <button 
            className="btn btn-primary mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const hasSelectedTickets = Object.values(selectedTickets).some(quantity => quantity > 0);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Event Details */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <figure className="relative h-48">
                <Image
                  src={event.images[0] || '/placeholder.jpg'}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-2xl">{event.title}</h2>
                <p className="text-base-content/70">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Ticket Selection */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Select Tickets</h3>
                <div className="space-y-4">
                  {event.ticketTypes.map((ticket) => (
                    <div key={ticket._id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{ticket.name}</h4>
                        <p className="text-base-content/70">R{ticket.price}</p>
                        <p className="text-sm text-base-content/70">
                          {ticket.quantity - (ticket.quantitySold || 0)} remaining
                        </p>
                      </div>
                      <div className="join">
                        <button 
                          className="btn btn-sm join-item"
                          onClick={() => handleTicketChange(ticket._id, (selectedTickets[ticket._id] || 0) - 1)}
                        >
                          -
                        </button>
                        <input 
                          type="number"
                          className="join-item w-16 text-center"
                          value={selectedTickets[ticket._id] || 0}
                          readOnly
                        />
                        <button 
                          className="btn btn-sm join-item"
                          onClick={() => handleTicketChange(ticket._id, (selectedTickets[ticket._id] || 0) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cooler Box Option */}
            {event.coolerBoxPass && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Cooler Box Pass</h3>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">
                        Add Cooler Box Pass (up to {event.coolerBoxLiters}L)
                      </span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={wantsCoolerBox}
                        onChange={(e) => setWantsCoolerBox(e.target.checked)}
                      />
                    </label>
                    <p className="text-sm text-base-content/70">
                      Price: R{event.coolerBoxPrice}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Order Summary</h3>
                <div className="space-y-4">
                  {Object.entries(selectedTickets).map(([ticketId, quantity]) => {
                    if (quantity === 0) return null;
                    const ticket = event.ticketTypes.find(t => t._id === ticketId);
                    if (!ticket) return null;
                    return (
                      <div key={ticketId} className="flex justify-between">
                        <span>{ticket.name} x {quantity}</span>
                        <span>R{ticket.price * quantity}</span>
                      </div>
                    );
                  })}
                  
                  {wantsCoolerBox && event.coolerBoxPass && (
                    <div className="flex justify-between">
                      <span>Cooler Box Pass</span>
                      <span>R{event.coolerBoxPrice}</span>
                    </div>
                  )}

                  <div className="divider"></div>
                  
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>R{total}</span>
                  </div>

                  {error && (
                    <div className="alert alert-error">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    className="btn btn-primary w-full"
                    disabled={!hasSelectedTickets}
                    onClick={handleCheckout}
                  >
                    {status === 'loading' ? (
                      <span className="loading loading-spinner"></span>
                    ) : session ? (
                      'Proceed to Payment'
                    ) : (
                      'Sign in to Continue'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
