'use client';

import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiCalendar, FiTag, FiDollarSign, FiUsers } from 'react-icons/fi';
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
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { showToast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast('Failed to load events', 'error');
      setLoading(false);
    }
  };

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
    const activeEvents = events.filter(e => e.status === 'Active').length;
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
          <button className="btn btn-primary">
            <FiPlus className="w-5 h-5 mr-2" />
            Create Event
          </button>
        </div>
        <p className="text-base-content/70">Manage and monitor events, tickets, and sales</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'Total Events',
            value: stats.totalEvents,
            icon: FiCalendar,
            color: 'bg-primary/10 text-primary border-primary/30',
            subtitle: `${stats.activeEvents} active`
          },
          {
            title: 'Categories',
            value: uniqueCategories.length,
            icon: FiTag,
            color: 'bg-secondary/10 text-secondary border-secondary/30',
            subtitle: 'Unique categories'
          },
          {
            title: 'Tickets Sold',
            value: stats.totalSold,
            icon: FiUsers,
            color: 'bg-accent/10 text-accent border-accent/30',
            subtitle: `${((stats.totalSold / stats.totalTickets) * 100).toFixed(1)}% of total`
          },
          {
            title: 'Revenue',
            value: `$${stats.revenue.toLocaleString()}`,
            icon: FiDollarSign,
            color: 'bg-info/10 text-info border-info/30',
            subtitle: 'Total earnings'
          }
        ].map((stat, index) => (
          <div key={index} className={`card bg-base-100 shadow-sm border-2 ${stat.color.split(' ')[2]}`}>
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
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
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
                <th className="border-r-2 border-base-200">Event Name</th>
                <th className="border-r-2 border-base-200">Date</th>
                <th className="border-r-2 border-base-200">Category</th>
                <th className="border-r-2 border-base-200">Status</th>
                <th className="border-r-2 border-base-200">Tickets Sold</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg font-semibold">No events found</span>
                      <span className="text-base-content/70">Try adjusting your search or filters</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        {event.images?.[0] ? (
                          <div className="avatar">
                            <div className="w-12 h-12 rounded-lg ring ring-primary ring-offset-base-100 ring-offset-2">
                              <img src={event.images[0]} alt={event.title} />
                            </div>
                          </div>
                        ) : (
                          <div className="avatar placeholder">
                            <div className="w-12 h-12 rounded-lg bg-neutral-focus text-neutral-content">
                              <span className="text-xl">{event.title.charAt(0)}</span>
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="font-bold">{event.title}</div>
                          <div className="text-sm text-base-content/70">{event.organizer}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{formatDate(event.date)}</td>
                    <td>
                      <span className="badge badge-outline badge-sm">{event.category}</span>
                    </td>
                    <td>
                      <span className={`badge badge-sm ${
                        event.status === 'Active' ? 'badge-success' :
                        event.status === 'Draft' ? 'badge-warning' :
                        event.status === 'Completed' ? 'badge-info' :
                        'badge-error'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm">
                          <span>{event.ticketsSold} / {event.totalTickets}</span>
                          <span className="text-base-content/70">
                            {((event.ticketsSold / event.totalTickets) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-base-200 rounded-full h-2 border-2 border-base-300">
                          <div 
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${(event.ticketsSold / event.totalTickets) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-sm btn-ghost btn-square"
                          onClick={() => window.location.href = `/admin/events/${event._id}/edit`}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="btn btn-sm btn-ghost btn-square text-error"
                          onClick={() => handleDelete(event._id)}
                        >
                          <FiTrash2 className="w-4 h-4" />
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
    </div>
  );
}
