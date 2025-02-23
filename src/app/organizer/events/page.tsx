'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import { 
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Search,
  PlusCircle,
  Filter,
  ArrowUpDown
} from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  endTime: string;
  images: string[];
  status: 'draft' | 'active' | 'cancelled';
  location: string; // This is a JSON string
  category: string;
  ticketTypes?: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    quantitySold: number;
  }[];
}

interface VenueInfo {
  venue: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  transport?: {
    directions: string;
    landmarks?: string;
    parking?: string;
  };
  facilities?: {
    wheelchair: boolean;
    atm: boolean;
    foodCourt: boolean;
    parking: boolean;
  };
  additionalInfo?: string;
}

export default function OrganizerEventsPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, draft, past
  const [sortBy, setSortBy] = useState('date'); // date, title, status
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setError(null);
      const response = await fetch('/api/organizer/events');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch events');
      }

      setEvents(data);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchEvents();
    }
  }, [session]);

  if (status === "unauthenticated") {
    redirect('/auth/signin');
  }

  if (isLoading) {
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

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-base-100">
          <div className="container mx-auto px-4 py-8">
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h3 className="font-bold">Error</h3>
                <div className="text-sm">{error}</div>
              </div>
              <button onClick={() => { setError(null); fetchEvents(); }} className="btn btn-sm">
                Try Again
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  const getVenueInfo = (locationString: string): VenueInfo | null => {
    try {
      const parsed = JSON.parse(locationString);
      return parsed;
    } catch (error) {
      // If parsing fails, treat the location string as a city name
      return {
        venue: {
          name: locationString,
          address: '',
          city: locationString,
          state: '',
          country: ''
        }
      };
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  const filteredEvents = events
    .filter(event => {
      const now = new Date();
      const endDate = new Date(event.endTime);
      
      // Debug log for active filter
      if (filter === 'active') {
        console.log('Event:', {
          id: event._id,
          title: event.title,
          status: event.status,
          endTime: event.endTime,
          isActive: event.status === 'active'
        });
      }
      
      // First apply status/time-based filters
      switch (filter) {
        case 'active':
          // Show all active events that haven't ended
          return event.status === 'active';
        case 'draft':
          return event.status === 'draft';
        case 'past':
          // Only check end date if it's a valid date
          return !isNaN(endDate.getTime()) && endDate < now;
        default:
          return true;
      }
    })
    .filter(event => {
      if (!searchQuery) return true;
      
      const searchLower = searchQuery.toLowerCase();
      const location = JSON.parse(event.location);
      
      // Search in event fields
      return (
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        (event.category && event.category.toLowerCase().includes(searchLower)) ||
        // Search in location
        location.venue.name.toLowerCase().includes(searchLower) ||
        location.venue.city.toLowerCase().includes(searchLower) ||
        location.venue.state.toLowerCase().includes(searchLower) ||
        location.venue.country.toLowerCase().includes(searchLower) ||
        // Search in ticket types
        event.ticketTypes?.some(ticket => 
          ticket.name.toLowerCase().includes(searchLower)
        )
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.date);
    const endDate = new Date(event.endTime);

    if (event.status === 'draft') return 'badge-warning';
    if (event.status === 'cancelled') return 'badge-error';
    if (endDate < now) return 'badge-neutral';
    if (event.status === 'active') return 'badge-success';
    return 'badge-primary';
  };

  const getTotalTicketsSold = (tickets: Event['ticketTypes']) => {
    if (!tickets || !Array.isArray(tickets)) return 0;
    return tickets.reduce((total, ticket) => total + (ticket.quantitySold || 0), 0);
  };

  const getTotalCapacity = (tickets: Event['ticketTypes']) => {
    if (!tickets || !Array.isArray(tickets)) return 0;
    return tickets.reduce((total, ticket) => total + ticket.quantity, 0);
  };

  const getTotalRevenue = (tickets: Event['ticketTypes']) => {
    if (!tickets || !Array.isArray(tickets)) return 0;
    return tickets.reduce((total, ticket) => {
      const soldRevenue = (ticket.quantitySold || 0) * ticket.price;
      const potentialRevenue = (ticket.quantity - (ticket.quantitySold || 0)) * ticket.price;
      return total + soldRevenue + potentialRevenue;
    }, 0);
  };

  const getCurrentRevenue = (tickets: Event['ticketTypes']) => {
    if (!tickets || !Array.isArray(tickets)) return 0;
    return tickets.reduce((total, ticket) => {
      return total + (ticket.quantitySold || 0) * ticket.price;
    }, 0);
  };

  const activateEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/organizer/events/${eventId}/activate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to activate event');
      }

      // Update the event status locally
      setEvents(events.map(event => 
        event._id === eventId 
          ? { ...event, status: 'active' } 
          : event
      ));
    } catch (error) {
      console.error('Error activating event:', error);
    }
  };

  const openDeleteModal = (eventId: string) => {
    setEventToDelete(eventId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEventToDelete(null);
    setDeleteModalOpen(false);
  };

  const deleteEvent = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/organizer/events/${eventToDelete}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Update the events list locally
      setEvents(events.filter(event => event._id !== eventToDelete));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-base-100">
        <div className="bg-primary/5 py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-base-content">My Events</h1>
                <p className="text-base-content/70 mt-2">Manage and track all your events</p>
              </div>
              <a href="/events/create" className="btn btn-primary">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New Event
              </a>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="select select-bordered"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Events</option>
                <option value="active">Active</option>
                <option value="draft">Drafts</option>
                <option value="past">Past</option>
              </select>
              <select 
                className="select select-bordered"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-base-content/50 mb-4">No events found</div>
              <a href="/events/create" className="btn btn-primary">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Event
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event._id} className="card bg-base-100 shadow-xl border-2 border-base-300">
                  <figure className="relative">
                    <img 
                      src={event.images[0] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop'} 
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <div className={`badge ${getEventStatus(event)} badge-lg`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </div>
                      {event.status === 'draft' && (
                        <div className="tooltip tooltip-left" data-tip="This event is private and must be activated to be displayed on the public">
                          <div className="badge badge-ghost badge-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </figure>
                  <div className="card-body flex flex-col h-full">
                    <div className="flex-grow">
                      <h2 className="card-title">{event.title}</h2>
                      <div className="flex items-center gap-2 text-base-content/70">
                        <MapPin className="w-4 h-4" />
                        {(() => {
                          const venueInfo = getVenueInfo(event.location);
                          return venueInfo ? (
                            <span>{venueInfo.venue.name}, {venueInfo.venue.city}</span>
                          ) : (
                            <span>Location not available</span>
                          );
                        })()}
                      </div>
                      <div className="flex items-center gap-2 text-base-content/70">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-base-content/70">
                        <Clock className="w-4 h-4" />
                        <span>{formatDateTime(event.endTime)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-base-content/70 mb-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {getTotalTicketsSold(event.ticketTypes)} / {event.ticketTypes?.reduce((total, ticket) => total + ticket.quantity, 0) || 0} tickets sold
                        </span>
                      </div>
                      
                      {/* Ticket Types */}
                      <div className="space-y-2 mt-2 border-t pt-2">
                        <div className="text-sm font-medium text-base-content/70">Ticket Types:</div>
                        {event.ticketTypes?.map((ticket) => (
                          <div key={ticket._id} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                              <span className="font-medium">{ticket.name}</span>
                              <span className="text-base-content/60"> · R{ticket.price}</span>
                            </div>
                            <div className="text-base-content/60">
                              {ticket.quantitySold} / {ticket.quantity}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Revenue Information */}
                      <div className="space-y-2 mt-2 border-t pt-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-base-content/70">Current Revenue:</div>
                          <div className="text-sm font-semibold text-success">
                            R {getCurrentRevenue(event.ticketTypes).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium text-base-content/70">Expected Revenue:</div>
                          <div className="text-sm font-semibold text-primary">
                            R {getTotalRevenue(event.ticketTypes).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons - Now at the bottom */}
                    <div className="card-actions justify-between mt-auto pt-4 border-t">
                      {event.status === 'draft' && (
                        <button 
                          onClick={() => activateEvent(event._id)}
                          className="btn btn-primary btn-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Activate
                        </button>
                      )}
                      <div className="flex gap-2">
                        <a href={`/events/${event._id}/edit`} className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => openDeleteModal(event._id)}
                          className="btn btn-ghost btn-sm text-error hover:bg-error hover:text-white"
                          disabled={isDeleting && eventToDelete === event._id}
                        >
                          {isDeleting && eventToDelete === event._id ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Event</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this event? This action cannot be undone and will remove all associated images and ticket information.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="btn btn-ghost"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={deleteEvent}
                className="btn btn-error"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Event'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
