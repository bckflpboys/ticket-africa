'use client';

import React, { useState } from 'react';
import { useCart } from '@/contexts/cart';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Image from 'next/image';

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { tickets, coolerBoxes, getCartTotal, getCartCount } = useCart();
  const [loading, setLoading] = useState(false);

  // Redirect to sign in if not authenticated
  if (status === "unauthenticated") {
    redirect('/auth/signin');
  }

  // Redirect to home if cart is empty
  if (getCartCount() === 0) {
    redirect('/');
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const cart = [...tickets, ...coolerBoxes.map(box => ({ eventId: box.eventId, ticketType: 'Cooler Box', quantity: 1, price: box.price }))];
      const cartTotal = getCartTotal();
      const response = await fetch('/api/payments/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: session?.user?.email,
          amount: cartTotal,
          items: cart.map(item => ({
            eventId: item.eventId,
            ticketType: item.ticketType,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

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
      <main className="min-h-screen bg-base-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Summary */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card bg-base-100 shadow-lg border-2 border-base-300">
                  <div className="card-body">
                    <h2 className="card-title">Order Summary</h2>
                    <div className="divider my-2"></div>
                    
                    {/* Tickets */}
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-start gap-4 py-4 border-b border-base-200 last:border-0">
                        {ticket.imageUrl && (
                          <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={ticket.imageUrl}
                              alt={ticket.eventName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h4 className="font-medium">{ticket.eventName}</h4>
                          <p className="text-sm text-base-content/70 capitalize">
                            {ticket.ticketType} Ticket
                            {ticket.quantity > 1 && (
                              <span className="text-primary font-medium"> × {ticket.quantity}</span>
                            )}
                          </p>
                          <p className="text-sm font-medium mt-1">{formatPrice(ticket.price * ticket.quantity)}</p>
                        </div>
                      </div>
                    ))}

                    {/* Cooler Boxes */}
                    {coolerBoxes.map((coolerBox) => (
                      <div key={coolerBox.id} className="flex items-start gap-4 py-4 border-b border-base-200 last:border-0">
                        <div className="flex-grow">
                          <h4 className="font-medium">{coolerBox.eventName}</h4>
                          <p className="text-sm text-base-content/70">Cooler Box Pass</p>
                          <p className="text-sm font-medium mt-1">{formatPrice(coolerBox.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="lg:col-span-1">
                <div className="card bg-base-100 shadow-lg border-2 border-base-300">
                  <div className="card-body">
                    <h2 className="card-title">Payment Summary</h2>
                    <div className="divider my-2"></div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Subtotal</span>
                        <span>{formatPrice(getCartTotal() * 0.95)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-base-content/70">Service Fee (5%)</span>
                        <span>{formatPrice(getCartTotal() * 0.05)}</span>
                      </div>
                      <div className="divider my-2"></div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>{formatPrice(getCartTotal())}</span>
                      </div>
                    </div>

                    <div className="card-actions mt-6">
                      <button 
                        className={`btn btn-primary btn-block ${loading ? 'loading' : ''}`}
                        onClick={handlePayment}
                        disabled={loading}
                      >
                        {loading ? 'Processing...' : 'Pay Now'}
                      </button>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-base-content/70 text-center">
                        By clicking "Pay Now", you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
