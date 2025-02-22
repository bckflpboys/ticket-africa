'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/cart';
import { useToast } from '@/contexts/toast';

interface EventRestrictions {
  ageRestriction?: {
    hasAgeLimit: boolean;
    minimumAge: number;
  };
  noWeapons?: boolean;
  noProfessionalCameras?: boolean;
  noPets?: boolean;
  hasCustomRestrictions?: boolean;
  customRestrictions?: string[];
  coolerBox?: {
    allowed: boolean;
    maxLiters: number;
    price: number;
  };
}

interface EventLocation {
  address: string;
  city: string;
  country: string;
  mapUrl: string;
}

interface EventScheduleItem {
  time: string;
  title: string;
  description: string;
}

interface EventHighlight {
  title: string;
  description?: string;
}

interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  images: string[];
  highlights: EventHighlight[];
  restrictions: EventRestrictions;
  location: EventLocation;
  schedule: EventScheduleItem[];
}

interface TicketCounts {
  regular: number;
  vip: number;
  vvip: number;
}

interface TicketPrices {
  regular: number;
  vip: number;
  vvip: number;
  coolerBox: number;
}

export default function EventDetails() {
  const params = useParams();
  const id = params.id as string;
  const { addTicket, addCoolerBox } = useCart();
  const { showToast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [tickets, setTickets] = useState<TicketCounts>({
    regular: 0,
    vip: 0,
    vvip: 0
  });
  const [coolerBoxPass, setCoolerBoxPass] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const images = event?.images || [
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop"
  ];

  const ticketPrices: TicketPrices = {
    regular: 350,
    vip: 750,
    vvip: 1500,
    coolerBox: 100
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(price);
  };

  const updateTicketCount = (type: keyof TicketCounts, increment: boolean) => {
    setTickets(prev => ({
      ...prev,
      [type]: increment ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const toggleCoolerBoxPass = () => {
    const hasTickets = Object.values(tickets).some(quantity => quantity > 0);
    if (!hasTickets && !coolerBoxPass) {
      showToast('Please select at least one ticket before adding a Cooler Box Pass.', 'warning');
      return;
    }
    setCoolerBoxPass(prev => !prev);
  };

  const handleAddToCart = () => {
    // Check if at least one ticket is selected
    const hasTickets = Object.values(tickets).some(quantity => quantity > 0);
    
    if (!hasTickets && coolerBoxPass) {
      showToast('You cannot add a Cooler Box Pass without selecting at least one ticket.', 'error');
      setCoolerBoxPass(false);
      return;
    }

    // Add tickets to cart
    Object.entries(tickets).forEach(([type, quantity]) => {
      if (quantity > 0) {
        addTicket({
          eventId: id,
          eventName: event?.name || '',
          ticketType: type as keyof TicketCounts,
          quantity: quantity,
          price: ticketPrices[type as keyof TicketPrices],
          imageUrl: images[0]
        });
      }
    });

    // Add cooler box if selected
    if (coolerBoxPass) {
      addCoolerBox({
        eventId: id,
        eventName: event?.name || '',
        price: ticketPrices.coolerBox
      });
    }
    
    // Reset tickets and cooler box after adding to cart
    setTickets({
      regular: 0,
      vip: 0,
      vvip: 0
    });
    setCoolerBoxPass(false);
    
    showToast('Added to cart successfully!', 'success');
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-error">{error || 'Event not found'}</p>
            <Link href="/events" className="btn btn-primary mt-4">
              Back to Events
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-base-200/50">
          <div className="container mx-auto px-4 py-3">
            <div className="text-sm breadcrumbs">
              <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/events">Events</Link></li>
                <li>Event Details</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Section */}
            <div className="lg:col-span-2">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                {/* Previous Button */}
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next Button */}
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/40"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Image */}
                <Image
                  src={images[currentImage]}
                  alt="Event Image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  className="object-cover transition-all duration-500"
                  priority={currentImage === 0}
                  onError={(e) => {
                    // Fallback to a default image if loading fails
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Dots Navigation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImage === index 
                          ? 'bg-white w-4' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary">Music</span>
                    <span className="badge badge-ghost">Featured</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                  <p className="text-white/80">{event.description}</p>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2 mt-2">
                {event.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setCurrentImage(index)}
                    className={`relative aspect-[4/3] overflow-hidden rounded-md ${
                      currentImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Event Image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 20vw"
                      className="object-cover"
                      priority={index === 0}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop";
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Event Details Tabs */}
              <div className="mt-8">
                <div className="tabs tabs-boxed">
                  <button 
                    onClick={() => setActiveTab('overview')} 
                    className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
                  >
                    Overview
                  </button>
                  <button 
                    onClick={() => setActiveTab('schedule')} 
                    className={`tab ${activeTab === 'schedule' ? 'tab-active' : ''}`}
                  >
                    Schedule
                  </button>
                  <button 
                    onClick={() => setActiveTab('location')} 
                    className={`tab ${activeTab === 'location' ? 'tab-active' : ''}`}
                  >
                    Location
                  </button>
                </div>
                <div className="mt-4 p-4 bg-base-200 rounded-lg border-2 border-base-300">
                  {activeTab === 'overview' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Event Description</h3>
                      <p className="text-base-content/80 leading-relaxed">
                        {event.description}
                      </p>
                      
                      <div className="divider"></div>
                      
                      <h3 className="text-lg font-semibold mb-4">Event Highlights</h3>
                      <ul className="space-y-2">
                        {event.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <span className="font-medium">{highlight.title}</span>
                              {highlight.description && (
                                <p className="text-sm text-base-content/70">{highlight.description}</p>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>

                      <div className="divider"></div>

                      <h3 className="text-lg font-semibold mb-4">Event Rules & Restrictions</h3>
                      <div className="bg-base-300/50 rounded-lg p-4">
                        <ul className="space-y-3">
                          {/* Age Restriction */}
                          {event.restrictions?.ageRestriction?.hasAgeLimit && (
                            <li className="flex items-start gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-error" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <span className="font-medium">Age Restriction</span>
                                <p className="text-sm text-base-content/70">
                                  No persons under {event.restrictions?.ageRestriction?.minimumAge} years of age will be admitted
                                </p>
                              </div>
                            </li>
                          )}

                          {/* No Weapons */}
                          {event.restrictions?.noWeapons && (
                            <li className="flex items-start gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-error" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <span className="font-medium">No Weapons</span>
                                <p className="text-sm text-base-content/70">Weapons of any kind are strictly prohibited</p>
                              </div>
                            </li>
                          )}

                          {/* No Professional Cameras */}
                          {event.restrictions?.noProfessionalCameras && (
                            <li className="flex items-start gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-error" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <span className="font-medium">No Professional Cameras</span>
                                <p className="text-sm text-base-content/70">Professional photography equipment is not allowed</p>
                              </div>
                            </li>
                          )}

                          {/* No Pets */}
                          {event.restrictions?.noPets && (
                            <li className="flex items-start gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-error" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <span className="font-medium">No Pets</span>
                                <p className="text-sm text-base-content/70">Pets are not allowed at the venue (service animals excepted)</p>
                              </div>
                            </li>
                          )}

                          {/* Custom Restrictions */}
                          {event.restrictions?.hasCustomRestrictions && event.restrictions?.customRestrictions?.map((restriction, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-error" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <span className="font-medium">{restriction}</span>
                              </div>
                            </li>
                          ))}

                          {/* Cooler Box */}
                          {event.restrictions?.coolerBox?.allowed && (
                            <li className="flex items-start gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              <div>
                                <span className="font-medium">Cooler Box Pass Required</span>
                                <p className="text-sm text-base-content/70">
                                  Maximum {event.restrictions?.coolerBox?.maxLiters}L allowed. Additional fee of {formatPrice(event.restrictions?.coolerBox?.price || 0)} applies.
                                </p>
                              </div>
                            </li>
                          )}
                        </ul>
                        <div className="mt-4 p-3 bg-warning/10 rounded-lg">
                          <p className="text-sm text-warning-content">
                            <span className="font-medium">Note:</span> Violation of any of these rules may result in denial of entry or removal from the event without refund.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'schedule' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-4">Event Schedule</h3>
                      <div className="space-y-4">
                        {event.schedule.map((schedule, index) => (
                          <div key={index} className="flex items-start gap-4 p-4 bg-base-300/30 rounded-lg">
                            <div className="text-center px-3 py-2 bg-primary/10 rounded-lg">
                              <div className="text-xl font-bold text-primary">{schedule.time}</div>
                            </div>
                            <div>
                              <h4 className="font-medium">{schedule.title}</h4>
                              <p className="text-sm text-base-content/70">{schedule.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-info/10 rounded-lg mt-6">
                        <p className="text-sm text-info-content">
                          <span className="font-medium">Note:</span> Schedule is subject to change. Please arrive at least 30 minutes before your preferred performance.
                        </p>
                      </div>
                    </div>
                  )}
                  {activeTab === 'location' && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold mb-4">Event Location</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <div>
                              <h4 className="font-medium">Venue Address</h4>
                              <p className="text-sm text-base-content/70">{event.location.address}</p>
                              <p className="text-sm text-base-content/70">{event.location.city}</p>
                              <p className="text-sm text-base-content/70">{event.location.country}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <div>
                              <h4 className="font-medium">Getting There</h4>
                              <ul className="text-sm text-base-content/70 space-y-2 mt-2">
                                <li>• 15 minutes from Murtala Muhammed Airport</li>
                                <li>• 5 minutes from Victoria Island Bus Station</li>
                                <li>• Parking available on-site</li>
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <h4 className="font-medium">Additional Information</h4>
                              <ul className="text-sm text-base-content/70 space-y-2 mt-2">
                                <li>• Wheelchair accessible</li>
                                <li>• ATM machines available</li>
                                <li>• Food courts nearby</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="h-[300px] rounded-lg overflow-hidden">
                          <iframe 
                            src={event.location.mapUrl} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="card bg-base-100 shadow-xl border-2 border-base-300">
                  <div className="card-body">
                    <h2 className="card-title">Event Details</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-base-200 p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Date</p>
                          <p className="font-medium">{event.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-base-200 p-2 rounded-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-base-content/70">Location</p>
                          <p className="font-medium">{event.location.address}</p>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Select Tickets</span>
                          <span className="badge badge-success">Available</span>
                        </div>

                        {/* Regular Ticket */}
                        <div className="p-4 bg-base-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">Regular Ticket</h4>
                              <p className="text-sm text-base-content/70">General admission</p>
                              <p className="text-primary font-medium mt-1">{formatPrice(ticketPrices.regular)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateTicketCount('regular', false)}
                                className="btn btn-circle btn-sm btn-outline"
                                disabled={tickets.regular === 0}
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{tickets.regular}</span>
                              <button 
                                onClick={() => updateTicketCount('regular', true)}
                                className="btn btn-circle btn-sm btn-outline"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* VIP Ticket */}
                        <div className="p-4 bg-base-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">VIP Ticket</h4>
                                <span className="badge badge-primary badge-sm">POPULAR</span>
                              </div>
                              <p className="text-sm text-base-content/70">Premium seating & complimentary drinks</p>
                              <p className="text-primary font-medium mt-1">{formatPrice(ticketPrices.vip)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateTicketCount('vip', false)}
                                className="btn btn-circle btn-sm btn-outline"
                                disabled={tickets.vip === 0}
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{tickets.vip}</span>
                              <button 
                                onClick={() => updateTicketCount('vip', true)}
                                className="btn btn-circle btn-sm btn-outline"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* VVIP Ticket */}
                        <div className="p-4 bg-base-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">VVIP Ticket</h4>
                              <p className="text-sm text-base-content/70">Exclusive access & full service</p>
                              <p className="text-primary font-medium mt-1">{formatPrice(ticketPrices.vvip)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateTicketCount('vvip', false)}
                                className="btn btn-circle btn-sm btn-outline"
                                disabled={tickets.vvip === 0}
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{tickets.vvip}</span>
                              <button 
                                onClick={() => updateTicketCount('vvip', true)}
                                className="btn btn-circle btn-sm btn-outline"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Cooler Box Pass */}
                        <div className="p-4 bg-base-200 rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">Cooler Box Pass</h4>
                                <span className="badge badge-accent badge-sm">OPTIONAL</span>
                              </div>
                              <p className="text-sm text-base-content/70">Bring your own drinks (max 50L)</p>
                              <p className="text-primary font-medium mt-1">{formatPrice(ticketPrices.coolerBox)}</p>
                            </div>
                            <div>
                              <input 
                                type="checkbox" 
                                className="toggle toggle-primary" 
                                checked={coolerBoxPass}
                                onChange={toggleCoolerBoxPass}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="divider"></div>
                        <div className="space-y-4">
                          <h3 className="font-medium">Order Summary</h3>
                          {tickets.regular > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>Regular Ticket × {tickets.regular}</span>
                              <span>{formatPrice(tickets.regular * ticketPrices.regular)}</span>
                            </div>
                          )}
                          {tickets.vip > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>VIP Ticket × {tickets.vip}</span>
                              <span>{formatPrice(tickets.vip * ticketPrices.vip)}</span>
                            </div>
                          )}
                          {tickets.vvip > 0 && (
                            <div className="flex justify-between text-sm">
                              <span>VVIP Ticket × {tickets.vvip}</span>
                              <span>{formatPrice(tickets.vvip * ticketPrices.vvip)}</span>
                            </div>
                          )}
                          {coolerBoxPass && (
                            <div className="flex justify-between text-sm">
                              <span>Cooler Box Pass</span>
                              <span>{formatPrice(ticketPrices.coolerBox)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>{formatPrice(Object.entries(tickets).reduce((sum, [type, quantity]) => sum + (quantity * ticketPrices[type as keyof TicketPrices]), 0) + (coolerBoxPass ? ticketPrices.coolerBox : 0))}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Service Fee (5%)</span>
                            <span>{formatPrice((Object.entries(tickets).reduce((sum, [type, quantity]) => sum + (quantity * ticketPrices[type as keyof TicketPrices]), 0) + (coolerBoxPass ? ticketPrices.coolerBox : 0)) * 0.05)}</span>
                          </div>
                          <div className="flex justify-between font-medium pt-2 border-t border-base-300">
                            <span>Total</span>
                            <span>{formatPrice((Object.entries(tickets).reduce((sum, [type, quantity]) => sum + (quantity * ticketPrices[type as keyof TicketPrices]), 0) + (coolerBoxPass ? ticketPrices.coolerBox : 0)) * 1.05)}</span>
                          </div>
                        </div>

                        <button 
                          className="btn btn-primary w-full"
                          onClick={handleAddToCart}
                          disabled={Object.values(tickets).every(count => count === 0)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
