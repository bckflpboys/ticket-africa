'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers } from 'react-icons/fi';

interface AnalyticsData {
  revenue: {
    total: number;
    change: number;
  };
  users: {
    total: number;
    change: number;
  };
  tickets: {
    total: number;
    change: number;
  };
  events: {
    total: number;
    change: number;
  };
  recentSales: {
    date: string;
    amount: number;
  }[];
  topEvents: {
    name: string;
    tickets: number;
    revenue: number;
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    revenue: { total: 0, change: 0 },
    users: { total: 0, change: 0 },
    tickets: { total: 0, change: 0 },
    events: { total: 0, change: 0 },
    recentSales: [],
    topEvents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchAnalytics = async () => {
      try {
        // Mock data for now
        setData({
          revenue: {
            total: 250000,
            change: 15.8
          },
          users: {
            total: 1250,
            change: 8.3
          },
          tickets: {
            total: 3200,
            change: 12.5
          },
          events: {
            total: 45,
            change: -5.2
          },
          recentSales: [
            { date: '2025-03-14', amount: 12500 },
            { date: '2025-03-13', amount: 8900 },
            { date: '2025-03-12', amount: 15600 },
            { date: '2025-03-11', amount: 9800 },
            { date: '2025-03-10', amount: 11200 }
          ],
          topEvents: [
            { name: 'Summer Music Festival', tickets: 450, revenue: 85000 },
            { name: 'Tech Conference 2025', tickets: 280, revenue: 56000 },
            { name: 'Food & Wine Expo', tickets: 150, revenue: 22500 }
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchAnalytics();
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
      month: 'short',
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
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value text-primary">{formatCurrency(data.revenue.total)}</div>
            <div className={`stat-desc flex items-center gap-1 ${
              data.revenue.change >= 0 ? 'text-success' : 'text-error'
            }`}>
              {data.revenue.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              {Math.abs(data.revenue.change)}% from last month
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-secondary">{data.users.total}</div>
            <div className={`stat-desc flex items-center gap-1 ${
              data.users.change >= 0 ? 'text-success' : 'text-error'
            }`}>
              {data.users.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              {Math.abs(data.users.change)}% from last month
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Tickets Sold</div>
            <div className="stat-value text-accent">{data.tickets.total}</div>
            <div className={`stat-desc flex items-center gap-1 ${
              data.tickets.change >= 0 ? 'text-success' : 'text-error'
            }`}>
              {data.tickets.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              {Math.abs(data.tickets.change)}% from last month
            </div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Active Events</div>
            <div className="stat-value">{data.events.total}</div>
            <div className={`stat-desc flex items-center gap-1 ${
              data.events.change >= 0 ? 'text-success' : 'text-error'
            }`}>
              {data.events.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
              {Math.abs(data.events.change)}% from last month
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Sales</h2>
          <div className="space-y-4">
            {data.recentSales.map((sale, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{formatDate(sale.date)}</span>
                <span className="font-medium">{formatCurrency(sale.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Events */}
        <div className="bg-base-100 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Top Performing Events</h2>
          <div className="space-y-4">
            {data.topEvents.map((event, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{event.name}</span>
                  <span>{formatCurrency(event.revenue)}</span>
                </div>
                <div className="flex justify-between text-sm text-base-content/70">
                  <span>{event.tickets} tickets sold</span>
                  <span>{formatCurrency(event.revenue / event.tickets)} avg. price</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
