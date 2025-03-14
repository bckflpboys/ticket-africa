'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiCalendar, FiTag, FiRefreshCw, FiClock, FiMapPin } from 'react-icons/fi';
import { useToast } from '@/contexts/toast';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardData {
  revenue: {
    total: number;
    change: number;
  };
  users: {
    total: number;
    change: number;
  };
  events: {
    total: number;
    change: number;
  };
  tickets: {
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
  categoryPerformance: {
    category: string;
    totalEvents: number;
    totalTickets: number;
    totalRevenue: number;
  }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({
    revenue: { total: 0, change: 0 },
    users: { total: 0, change: 0 },
    events: { total: 0, change: 0 },
    tickets: { total: 0, change: 0 },
    recentSales: [],
    topEvents: [],
    categoryPerformance: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const dashboardData = await response.json();
      setData(dashboardData);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      showToast('Failed to load dashboard data', 'error');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
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

  const salesChartData = {
    labels: [...data.recentSales].reverse().map(sale => formatDate(sale.date)),
    datasets: [
      {
        label: 'Daily Sales',
        data: [...data.recentSales].reverse().map(sale => sale.amount),
        fill: true,
        borderColor: 'hsl(var(--p))',
        backgroundColor: 'hsl(var(--p) / 0.1)',
        tension: 0.4,
      }
    ]
  };

  const categoryChartData = {
    labels: data.categoryPerformance.map(cat => cat.category),
    datasets: [
      {
        label: 'Revenue',
        data: data.categoryPerformance.map(cat => cat.totalRevenue),
        backgroundColor: 'hsl(var(--p))',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `Revenue: ${formatCurrency(context.raw)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => {
            return typeof value === 'number' ? formatCurrency(value) : value;
          }
        }
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-base-content/70">Welcome back! Here's what's happening with your events.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={fetchDashboardData}
          disabled={refreshing}
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            title: 'Total Revenue',
            value: formatCurrency(data.revenue.total),
            change: data.revenue.change,
            icon: FiDollarSign,
            color: 'text-primary bg-primary/10 border-primary/30'
          },
          {
            title: 'Total Users',
            value: data.users.total.toLocaleString(),
            change: data.users.change,
            icon: FiUsers,
            color: 'text-secondary bg-secondary/10 border-secondary/30'
          },
          {
            title: 'Active Events',
            value: data.events.total.toLocaleString(),
            change: data.events.change,
            icon: FiCalendar,
            color: 'text-accent bg-accent/10 border-accent/30'
          },
          {
            title: 'Tickets Sold',
            value: data.tickets.total.toLocaleString(),
            change: data.tickets.change,
            icon: FiTag,
            color: 'text-info bg-info/10 border-info/30'
          }
        ].map((stat, index) => (
          <div key={index} className="card bg-base-100 shadow-sm border-2 border-base-300">
            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base-content/70 mb-1">{stat.title}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.change > 0 ? (
                      <>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success/10 text-success border border-success/30">
                          <FiTrendingUp size={12} />
                        </span>
                        <span className="text-success">+{stat.change}%</span>
                      </>
                    ) : (
                      <>
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-error/10 text-error border border-error/30">
                          <FiTrendingDown size={12} />
                        </span>
                        <span className="text-error">{stat.change}%</span>
                      </>
                    )}
                    <span className="text-base-content/50 text-sm">vs last month</span>
                  </div>
                </div>
                <div className={`rounded-lg p-3 border-2 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="card bg-base-100 shadow-sm border-2 border-base-300">
          <div className="card-body">
            <h3 className="card-title mb-6">Revenue Overview</h3>
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>

        {/* Category Performance */}
        <div className="card bg-base-100 shadow-sm border-2 border-base-300">
          <div className="card-body">
            <h3 className="card-title mb-6">Category Performance</h3>
            <Bar data={categoryChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Top Events Table */}
      <div className="card bg-base-100 shadow-sm border-2 border-base-300">
        <div className="card-body">
          <h3 className="card-title mb-6">Top Performing Events</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Tickets Sold</th>
                  <th>Revenue</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {data.topEvents.map((event, index) => (
                  <tr key={index}>
                    <td>{event.name}</td>
                    <td>{event.tickets.toLocaleString()}</td>
                    <td>{formatCurrency(event.revenue)}</td>
                    <td>
                      <div className="w-full bg-base-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${(event.revenue / Math.max(...data.topEvents.map(e => e.revenue))) * 100}%`
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
