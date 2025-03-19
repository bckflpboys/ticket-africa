'use client';

import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiCalendar, FiTag, FiDollarSign, FiUsers, FiStar, FiTrendingUp } from 'react-icons/fi';
import { useToast } from '@/contexts/toast';

interface Event {
  _id: string;
  title: string;
  date: string;
  category: string;
  status: string;
  ticketsSold: number;
  totalTickets: number;
  ticketTypes: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  images: string[];
  organizer: string;
  isFeatured: boolean;
  isBanner: boolean;
  featuredStartDate?: string;
  featuredEndDate?: string;
  bannerStartDate?: string;
  bannerEndDate?: string;
  promotionHistory: Array<{
    type: 'featured' | 'banner';
    startDate: string;
    endDate: string;
  }>;
  wasFeatured: boolean;
  wasBanner: boolean;
  lastFeaturedDate?: string;
  lastBannerDate?: string;
  totalFeaturedDuration: number; // in days
  totalBannerDuration: number; // in days
  revenue: number;
}

interface StatCard {
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  icon: React.ElementType;
}

const PromotionModal = ({ event, onClose, onUpdate }: { event: Event; onClose: () => void; onUpdate: () => void }) => {
  const [isFeatured, setIsFeatured] = useState(event.isFeatured);
  const [isBanner, setIsBanner] = useState(event.isBanner);
  const [featuredStartDate, setFeaturedStartDate] = useState(
    event.featuredStartDate ? event.featuredStartDate.slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [featuredEndDate, setFeaturedEndDate] = useState(event.featuredEndDate?.slice(0, 16) || '');
  const [bannerStartDate, setBannerStartDate] = useState(
    event.bannerStartDate ? event.bannerStartDate.slice(0, 16) : new Date().toISOString().slice(0, 16)
  );
  const [bannerEndDate, setBannerEndDate] = useState(event.bannerEndDate?.slice(0, 16) || '');
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate featured promotion if enabled
    if (isFeatured && (!featuredStartDate || !featuredEndDate)) {
      showToast('Please fill in featured promotion dates', 'error');
      return;
    }
    if (isFeatured && new Date(featuredStartDate) >= new Date(featuredEndDate)) {
      showToast('Featured end date must be after start date', 'error');
      return;
    }

    // Validate banner promotion if enabled
    if (isBanner && (!bannerStartDate || !bannerEndDate)) {
      showToast('Please fill in banner promotion dates', 'error');
      return;
    }
    if (isBanner && new Date(bannerStartDate) >= new Date(bannerEndDate)) {
      showToast('Banner end date must be after start date', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${event._id}/promotion`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isFeatured,
          isBanner,
          featuredStartDate: isFeatured ? featuredStartDate : null,
          featuredEndDate: isFeatured ? featuredEndDate : null,
          bannerStartDate: isBanner ? bannerStartDate : null,
          bannerEndDate: isBanner ? bannerEndDate : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update promotion');
      }

      showToast('Promotion updated successfully', 'success');
      onClose();
      onUpdate();
    } catch (error) {
      console.error('Error updating promotion:', error);
      showToast('Failed to update promotion', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-base-100 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Set Promotion for {event.title}</h3>
        <form onSubmit={handleSubmit}>
          {/* Featured Event Section */}
          <div className="form-control mb-6 p-4 border border-base-300 rounded-lg">
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                className="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <span className="font-medium">Featured Event</span>
            </label>
            
            {isFeatured && (
              <div className="space-y-4 mt-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Featured Start Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={featuredStartDate}
                    onChange={(e) => setFeaturedStartDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Featured End Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={featuredEndDate}
                    onChange={(e) => setFeaturedEndDate(e.target.value)}
                    min={featuredStartDate}
                  />
                  {featuredStartDate && featuredEndDate && new Date(featuredStartDate) < new Date(featuredEndDate) && (
                    <label className="label">
                      <span className="label-text-alt">
                        Featured Duration: {Math.ceil((new Date(featuredEndDate).getTime() - new Date(featuredStartDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Banner Event Section */}
          <div className="form-control mb-6 p-4 border border-base-300 rounded-lg">
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                className="checkbox"
                checked={isBanner}
                onChange={(e) => setIsBanner(e.target.checked)}
              />
              <span className="font-medium">Banner Event</span>
            </label>
            
            {isBanner && (
              <div className="space-y-4 mt-2">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Banner Start Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={bannerStartDate}
                    onChange={(e) => setBannerStartDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Banner End Date & Time</span>
                  </label>
                  <input
                    type="datetime-local"
                    className="input input-bordered w-full"
                    value={bannerEndDate}
                    onChange={(e) => setBannerEndDate(e.target.value)}
                    min={bannerStartDate}
                  />
                  {bannerStartDate && bannerEndDate && new Date(bannerStartDate) < new Date(bannerEndDate) && (
                    <label className="label">
                      <span className="label-text-alt">
                        Banner Duration: {Math.ceil((new Date(bannerEndDate).getTime() - new Date(bannerStartDate).getTime()) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [checkingPromotions, setCheckingPromotions] = useState(false);
  const { showToast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast('Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      showToast('Event deleted successfully', 'success');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      showToast('Failed to delete event', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventStats = () => {
    const totalEvents = events.length;
    const activeEvents = events.filter(e => e.status === 'published').length;
    const totalTickets = events.reduce((sum, event) => sum + event.totalTickets, 0);
    const totalSold = events.reduce((sum, event) => sum + event.ticketsSold, 0);
    const revenue = events.reduce((sum, event) => {
      return sum + event.ticketTypes.reduce((typeSum, type) => {
        return typeSum + (type.price * Math.min(type.quantity, event.ticketsSold));
      }, 0);
    }, 0);

    return { totalEvents, activeEvents, totalTickets, totalSold, revenue };
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = Array.from(new Set(events.map(event => event.category)));
  const stats = getEventStats();

  const handlePromotionUpdate = async (eventId: string, promotionData: {
    isFeatured?: boolean;
    isBanner?: boolean;
    featuredStartDate?: string;
    featuredEndDate?: string;
    bannerStartDate?: string;
    bannerEndDate?: string;
  }) => {
    try {
      const response = await fetch(`/api/admin/events/${eventId}/promotion`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotionData),
      });

      if (!response.ok) {
        throw new Error('Failed to update promotion status');
      }

      showToast('Promotion status updated successfully', 'success');
      fetchEvents();
      setShowPromotionModal(false);
    } catch (error) {
      console.error('Error updating promotion:', error);
      showToast('Failed to update promotion status', 'error');
    }
  };

  const handleCheckPromotions = async () => {
    try {
      setCheckingPromotions(true);
      const response = await fetch('/api/admin/events/check-promotions', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to check promotions');
      }

      const data = await response.json();
      showToast(`Checked ${data.expiredCount} promotions`, 'success');
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error('Error checking promotions:', error);
      showToast('Failed to check promotions', 'error');
    } finally {
      setCheckingPromotions(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return 'badge-success';
      case 'draft':
        return 'badge-warning';
      case 'cancelled':
        return 'badge-error';
      case 'completed':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  };

  const getPromotionDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return 0;
    return Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
  };

  const getPromotionTimeLeft = (endDate: string) => {
    if (!endDate) return 0;
    return Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const getPromotionStatus = (event: Event) => {
    const statuses = [];
    if (event.isFeatured) {
      const daysLeft = getPromotionTimeLeft(event.featuredEndDate || '');
      statuses.push({
        type: 'featured',
        daysLeft,
        badge: 'badge-primary',
        text: `Featured (${daysLeft}d left)`
      });
    }
    if (event.isBanner) {
      const daysLeft = getPromotionTimeLeft(event.bannerEndDate || '');
      statuses.push({
        type: 'banner',
        daysLeft,
        badge: 'badge-secondary',
        text: `Banner (${daysLeft}d left)`
      });
    }
    return statuses;
  };

  const calculateRevenue = (event: Event) => {
    if (event.revenue !== undefined) return event.revenue;
    return event.ticketTypes.reduce((sum, type) => {
      return sum + (type.price * Math.min(type.quantity, event.ticketsSold));
    }, 0);
  };

  const formatRevenue = (event: Event) => {
    if (!event.revenue) return '0';
    return event.revenue.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 pb-6 border-b-2 border-base-300">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Event Management</h1>
          <div className="flex gap-2">
            <button
              className={`btn btn-secondary ${checkingPromotions ? 'loading' : ''}`}
              onClick={handleCheckPromotions}
              disabled={checkingPromotions}
            >
              {checkingPromotions ? 'Checking...' : 'Check Promotions'}
            </button>
            <button className="btn btn-primary">
              <FiPlus className="w-5 h-5 mr-2" />
              Create Event
            </button>
          </div>
        </div>
        <p className="text-base-content/70">Manage and monitor events, tickets, and sales</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          {
            title: 'Total Events',
            value: events.length,
            subtitle: 'Active events',
            color: 'border-primary text-primary',
            icon: FiCalendar
          },
          {
            title: 'Featured Events',
            value: events.filter(e => e.isFeatured).length,
            subtitle: 'Currently featured',
            color: 'border-secondary text-secondary',
            icon: FiStar
          },
          {
            title: 'Banner Events',
            value: events.filter(e => e.isBanner).length,
            subtitle: 'Currently in banner',
            color: 'border-accent text-accent',
            icon: FiTrendingUp
          }
        ].map((stat: StatCard, index) => (
          <div key={index} className={`card bg-base-100 shadow-sm border-2 ${stat.color}`}>
            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="stat-title text-base-content/70 mb-1">{stat.title}</div>
                  <div className="stat-value text-2xl font-bold">{stat.value}</div>
                  <div className="stat-desc text-base-content/70 mt-1">{stat.subtitle}</div>
                </div>
                <div className={`rounded-lg p-3 border-2 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-base-100 rounded-lg border-2 border-base-300 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-base-content/50" />
              </div>
              <input
                type="text"
                placeholder="Search events by title or organizer..."
                className="input input-bordered w-full pl-10 border-2 border-base-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
            <div className="join border-2 border-base-300 rounded-lg">
              <div className="join-item flex items-center bg-base-200 px-3 border-r-2 border-base-300">
                <FiFilter className="w-4 h-4" />
              </div>
              <select 
                className="select select-bordered join-item border-0"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="join border-2 border-base-300 rounded-lg">
              <div className="join-item flex items-center bg-base-200 px-3 border-r-2 border-base-300">
                <FiFilter className="w-4 h-4" />
              </div>
              <select 
                className="select select-bordered join-item border-0"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t-2 border-base-300">
            <div className="text-sm text-base-content/70">Active Filters:</div>
            {searchTerm && (
              <div className="badge badge-outline gap-2 border-2">
                <span>Search: {searchTerm}</span>
                <button 
                  className="hover:text-error"
                  onClick={() => setSearchTerm('')}
                >
                  ×
                </button>
              </div>
            )}
            {categoryFilter !== 'all' && (
              <div className="badge badge-outline gap-2 border-2">
                <span>Category: {categoryFilter}</span>
                <button 
                  className="hover:text-error"
                  onClick={() => setCategoryFilter('all')}
                >
                  ×
                </button>
              </div>
            )}
            {statusFilter !== 'all' && (
              <div className="badge badge-outline gap-2 border-2">
                <span>Status: {statusFilter}</span>
                <button 
                  className="hover:text-error"
                  onClick={() => setStatusFilter('all')}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="text-sm text-base-content/70 mt-4 pt-4 border-t-2 border-base-300">
          {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-base-100 rounded-lg border-2 border-base-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/50 border-b-2 border-base-300">
              <tr>
                <th className="border-r-2 border-base-200">Event Details</th>
                <th className="border-r-2 border-base-200">Category & Status</th>
                <th className="border-r-2 border-base-200">Promotion</th>
                <th className="border-r-2 border-base-200">Tickets</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FiCalendar className="w-12 h-12 text-base-content/30" />
                      <span className="text-lg font-semibold">No events found</span>
                      <span className="text-base-content/70">Try adjusting your search or filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event._id} className="hover:bg-base-200/50">
                    <td className="min-w-[300px]">
                      <div className="flex items-center gap-3">
                        {event.images?.[0] ? (
                          <div className="avatar">
                            <div className="w-16 h-16 rounded-lg ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                              <img src={event.images[0]} alt={event.title} className="object-cover" />
                            </div>
                          </div>
                        ) : (
                          <div className="avatar placeholder">
                            <div className="w-16 h-16 rounded-lg bg-primary text-primary-content ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                              <span className="text-2xl">{event.title.charAt(0)}</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-lg">{event.title}</div>
                          <div className="text-sm opacity-70">{event.organizer}</div>
                          <div className="text-sm opacity-70">{formatDate(event.date)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-2">
                        <span className="badge badge-outline badge-sm">{event.category}</span>
                        <span className={`badge badge-sm ${getStatusColor(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="min-w-[200px]">
                      <div className="flex flex-col gap-2">
                        {getPromotionStatus(event).map((status, index) => (
                          <div key={index} className="flex flex-col gap-1">
                            <span className={`badge badge-sm ${status.badge}`}>
                              {status.text}
                            </span>
                            <div className="text-xs opacity-70">
                              {status.type === 'featured' ? (
                                <>
                                  {event.featuredStartDate && event.featuredEndDate && (
                                    <div className="flex flex-col">
                                      <span>From: {formatDate(event.featuredStartDate)}</span>
                                      <span>Until: {formatDate(event.featuredEndDate)}</span>
                                      <span>Duration: {getPromotionDuration(event.featuredStartDate, event.featuredEndDate)}d</span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <>
                                  {event.bannerStartDate && event.bannerEndDate && (
                                    <div className="flex flex-col">
                                      <span>From: {formatDate(event.bannerStartDate)}</span>
                                      <span>Until: {formatDate(event.bannerEndDate)}</span>
                                      <span>Duration: {getPromotionDuration(event.bannerStartDate, event.bannerEndDate)}d</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                        {!event.isFeatured && event.wasFeatured && (
                          <div className="text-xs opacity-70 mt-1">
                            Was Featured ({Math.round(event.totalFeaturedDuration)}d total)
                            <br />
                            Last: {formatDate(event.lastFeaturedDate || '')}
                          </div>
                        )}
                        {!event.isBanner && event.wasBanner && (
                          <div className="text-xs opacity-70 mt-1">
                            Was Banner ({Math.round(event.totalBannerDuration)}d total)
                            <br />
                            Last: {formatDate(event.lastBannerDate || '')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="min-w-[150px]">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span>{event.ticketsSold} / {event.totalTickets}</span>
                          <span className="opacity-70">
                            {((event.ticketsSold / event.totalTickets) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-2.5 border border-base-300">
                          <div 
                            className="h-2.5 rounded-full bg-primary"
                            style={{ 
                              width: `${(event.ticketsSold / event.totalTickets) * 100}%`,
                              transition: 'width 0.3s ease-in-out'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-2">
                        <button 
                          className="btn btn-sm btn-primary w-full"
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowPromotionModal(true);
                          }}
                        >
                          <FiStar className="w-4 h-4 mr-2" />
                          Promote
                        </button>
                        <a
                          href={`/admin/events/${event._id}/edit`}
                          className="btn btn-sm btn-ghost w-full"
                        >
                          <FiEdit2 className="w-4 h-4 mr-2" />
                          Edit
                        </a>
                        <button 
                          className="btn btn-sm btn-ghost text-error w-full"
                          onClick={() => handleDelete(event._id)}
                        >
                          <FiTrash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showPromotionModal && selectedEvent && (
        <PromotionModal
          event={selectedEvent}
          onClose={() => setShowPromotionModal(false)}
          onUpdate={fetchEvents}
        />
      )}
    </div>
  );
}
