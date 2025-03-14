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
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  transport: {
    directions: string;
  };
  facilities: {
    wheelchair: boolean;
    atm: boolean;
    foodCourt: boolean;
    parking: boolean;
  };
  additionalInfo: string;
}

interface EventScheduleItem {
  time: string;
  period: string;
  title: string;
  description: string;
  _id: string;
}

interface EventHighlight {
  title: string;
  description: string;
  _id: string;
}

interface TicketType {
  name: string;
  price: number;
  quantity: number;
  quantitySold: number;
  _id: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  endTime: string;
  location: string; // This is a JSON string that needs to be parsed
  images: string[];
  organizer: string;
  ticketTypes: TicketType[];
  status: string;
  category: string;
  tags: string[];
  coolerBoxPass: boolean;
  coolerBoxLiters: number;
  restrictions: EventRestrictions;
  highlights: EventHighlight[];
  schedule: EventScheduleItem[];
  createdAt: string;
  updatedAt: string;
}

interface EventStats {
  totalViews: number;
  uniqueVisitors: number;
}

interface TicketCounts {
  [key: string]: number;
}

interface TicketPrices {
  [key: string]: number;
}

export default function EventDetails() {
  const params = useParams();
  const id = params.id as string;
  const { addTicket, addMultipleTickets, addCoolerBox } = useCart();
  const { showToast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parsedLocation, setParsedLocation] = useState<EventLocation | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [tickets, setTickets] = useState<TicketCounts>({});
  const [ticketPrices, setTicketPrices] = useState<TicketPrices>({});
  const [coolerBoxPass, setCoolerBoxPass] = useState(false);
  const [stats, setStats] = useState<EventStats>({ totalViews: 0, uniqueVisitors: 0 });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        const data = await response.json();
        setEvent(data);
        // Parse the location JSON string
        if (data.location) {
          try {
            const locationData = JSON.parse(data.location);
            setParsedLocation(locationData);
          } catch (e) {
            console.error('Error parsing location data:', e);
          }
        }
      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  useEffect(() => {
    if (params.id) {
      // Track page view
      fetch('/api/events/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: params.id })
      });

      // Get current stats
      fetch(`/api/events/stats?eventId=${params.id}`)
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(error => console.error('Error fetching event stats:', error));
    }
  }, [params.id]);

  useEffect(() => {
    if (event?.ticketTypes) {
      // Initialize ticket counts
      const initialCounts: TicketCounts = {};
      const prices: TicketPrices = {};
      
      event.ticketTypes.forEach(ticket => {
        initialCounts[ticket.name] = 0;
        prices[ticket.name] = ticket.price;
      });
      
      setTickets(initialCounts);
      setTicketPrices(prices);
    }
  }, [event]);

  const images = event?.images || [
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop"
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-ZA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const updateTicketCount = (type: string, increment: boolean) => {
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

    // Prepare tickets to add
    const ticketsToAdd = Object.entries(tickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([type, quantity]) => ({
        eventId: id,
        eventName: event?.title || '',
        ticketType: type,
        quantity,
        price: ticketPrices[type],
        imageUrl: images[0]
      }));

    // Add all tickets in a single update
    addMultipleTickets(ticketsToAdd);

    // Add cooler box if selected
    if (coolerBoxPass) {
      addCoolerBox({
        eventId: id,
        eventName: event?.title || '',
        price: 100
      });
    }
    
    // Reset tickets and cooler box after adding to cart
    setTickets({});
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
                <li>{event.title}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Section */}
            <div className="lg:col-span-2">
              <div className="relative w-full aspect-[2/1] overflow-hidden rounded-t-box">
                <Image
                  src={images[currentImage]}
                  alt="Event banner"
                  fill
                  className="object-cover transition-all duration-300"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
                
                {/* Navigation Buttons */}
                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                  <button 
                    onClick={() => setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                    className="btn btn-circle btn-sm bg-black/50 hover:bg-black/70 border-0 text-white pointer-events-auto"
                    aria-label="Previous image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="btn btn-circle btn-sm bg-black/50 hover:bg-black/70 border-0 text-white pointer-events-auto"
                    aria-label="Next image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-primary">{event.category}</span>
                  </div>
                  <h1 className="text-3xl font-bold">{event.title}</h1>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(calc(100% / 6), 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                {event.images.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setCurrentImage(index)}
                    className={`relative aspect-[2/1] overflow-hidden rounded-md ${
                      currentImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`Event Image ${index + 1}`}
                      fill
                      sizes="16.67vw"
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

              {/* Event Stats */}
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{(stats?.totalViews || 0).toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{(stats?.uniqueVisitors || 0).toLocaleString()} unique visitors</span>
                </div>
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
                    <div className="space-y-8">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">About this event</h3>
                        <p className="text-base-content/80 whitespace-pre-wrap">{event.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {event.tags.map((tag, index) => (
                            <span key={index} className="badge badge-outline">{tag}</span>
                          ))}
                        </div>
                      </div>
                      
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
                              <p className="text-sm text-base-content/70">{highlight.description}</p>
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
                              <p className="text-sm text-base-content/70">{parsedLocation?.venue?.address}</p>
                              <p className="text-sm text-base-content/70">{parsedLocation?.venue?.city}</p>
                              <p className="text-sm text-base-content/70">{parsedLocation?.venue?.state}</p>
                              <p className="text-sm text-base-content/70">{parsedLocation?.venue?.country}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <div>
                              <h4 className="font-medium">Getting There</h4>
                              <p className="text-sm text-base-content/70 mt-2">{parsedLocation?.transport?.directions}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                              <h4 className="font-medium">Facilities</h4>
                              <ul className="text-sm text-base-content/70 space-y-2 mt-2">
                                {parsedLocation?.facilities?.wheelchair && (
                                  <li>• Wheelchair accessible</li>
                                )}
                                {parsedLocation?.facilities?.atm && (
                                  <li>• ATM machines available</li>
                                )}
                                {parsedLocation?.facilities?.foodCourt && (
                                  <li>• Food courts available</li>
                                )}
                                {parsedLocation?.facilities?.parking && (
                                  <li>• Parking available</li>
                                )}
                              </ul>
                              {parsedLocation?.additionalInfo && (
                                <p className="text-sm text-base-content/70 mt-2">{parsedLocation?.additionalInfo}</p>
                              )}
                            </div>
                          </div>
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
                          <p className="text-sm text-base-content/70">Date and Time</p>
                          <p className="font-medium">{formatDateTime(event.date)}</p>
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
                          <p className="font-medium">{parsedLocation?.venue?.address}</p>
                        </div>
                      </div>

                      <div className="divider"></div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Select Tickets</span>
                          <span className="badge badge-success">Available</span>
                        </div>

                        {/* Ticket Types */}
                        {event.ticketTypes.map((ticketType) => (
                          <div key={ticketType._id} className="p-4 bg-base-200 rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{ticketType.name}</h4>
                                <p className="text-sm text-base-content/70">
                                  {ticketType.quantity - ticketType.quantitySold} tickets remaining
                                </p>
                                <p className="text-primary font-medium mt-1">{formatPrice(ticketType.price)}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <button 
                                  onClick={() => updateTicketCount(ticketType.name, false)}
                                  className="btn btn-circle btn-sm btn-outline"
                                  disabled={tickets[ticketType.name] === 0}
                                >
                                  -
                                </button>
                                <span className="w-8 text-center">{tickets[ticketType.name] || 0}</span>
                                <button 
                                  onClick={() => updateTicketCount(ticketType.name, true)}
                                  className="btn btn-circle btn-sm btn-outline"
                                  disabled={tickets[ticketType.name] >= (ticketType.quantity - ticketType.quantitySold)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Cooler Box Pass */}
                        {event.coolerBoxPass && (
                          <div className="p-4 bg-base-200 rounded-lg space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">Cooler Box Pass</h4>
                                  <span className="badge badge-accent badge-sm">OPTIONAL</span>
                                </div>
                                <p className="text-sm text-base-content/70">Bring your own drinks (max {event.coolerBoxLiters}L)</p>
                                <p className="text-primary font-medium mt-1">{formatPrice(100)}</p>
                              </div>
                              <div>
                                <input 
                                  type="checkbox"
                                  className="toggle toggle-primary"
                                  checked={coolerBoxPass}
                                  onChange={(e) => setCoolerBoxPass(e.target.checked)}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="divider"></div>
                        <div className="space-y-4">
                          <h3 className="font-medium">Order Summary</h3>
                          {Object.entries(tickets).map(([type, quantity]) => quantity > 0 && (
                            <div key={type} className="flex justify-between text-sm">
                              <span>{type} × {quantity}</span>
                              <span>{formatPrice(quantity * ticketPrices[type])}</span>
                            </div>
                          ))}
                          <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>{formatPrice(Object.entries(tickets).reduce((sum, [type, quantity]) => sum + (quantity * ticketPrices[type]), 0) + (coolerBoxPass ? 100 : 0))}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Service Fee (5%)</span>
                            <span>{formatPrice((Object.entries(tickets).reduce((sum, [type, quantity]) => sum + (quantity * ticketPrices[type]), 0) + (coolerBoxPass ? 100 : 0)) * 0.05)}</span>
                          </div>
                          <div className="flex justify-between font-medium pt-2 border-t border-base-300">
                            <span>Total</span>
                            <span>{formatPrice((Object.entries(tickets).reduce((sum, [type, quantity]) => sum + (quantity * ticketPrices[type]), 0) + (coolerBoxPass ? 100 : 0)) * 1.05)}</span>
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
