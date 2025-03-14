'use client';

import { useState, useEffect } from 'react';
import { FiUsers, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalRevenue: number;
  ticketsSold: number;
}

interface RecentEvent {
  _id: string;
  title: string;
  date: string;
  ticketsSold: number;
  totalTickets: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalRevenue: 0,
    ticketsSold: 0
  });

  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/admin/stats');
        // const data = await response.json();
        // setStats(data);
        
        // Mock data for now
        setStats({
          totalUsers: 1250,
          totalEvents: 45,
          totalRevenue: 125000,
          ticketsSold: 3200
        });

        setRecentEvents([
          {
            _id: '1',
            title: 'Summer Music Festival',
            date: '2025-06-15',
            ticketsSold: 450,
            totalTickets: 500
          },
          {
            _id: '2',
            title: 'Tech Conference 2025',
            date: '2025-07-20',
            ticketsSold: 280,
            totalTickets: 300
          },
          {
            _id: '3',
            title: 'Food & Wine Expo',
            date: '2025-08-10',
            ticketsSold: 150,
            totalTickets: 200
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FiUsers className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{stats.totalUsers}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FiCalendar className="w-8 h-8" />
            </div>
            <div className="stat-title">Active Events</div>
            <div className="stat-value text-secondary">{stats.totalEvents}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <FiDollarSign className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value text-accent">{formatCurrency(stats.totalRevenue)}</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-success">
              <FiTrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">Tickets Sold</div>
            <div className="stat-value text-success">{stats.ticketsSold}</div>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Tickets Sold</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{formatDate(event.date)}</td>
                  <td>{event.ticketsSold} / {event.totalTickets}</td>
                  <td>
                    <progress 
                      className="progress progress-primary w-full" 
                      value={event.ticketsSold} 
                      max={event.totalTickets}
                    ></progress>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
