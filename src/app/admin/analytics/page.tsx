'use client';

import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers, FiCalendar, FiTag, FiRefreshCw } from 'react-icons/fi';
import { useToast } from '@/contexts/toast';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
  ChartOptions
} from 'chart.js';
import { UserSignupsChart } from '@/components/admin/UserSignupsChart';
import EventLocationsMap from '@/components/admin/EventLocationsMap';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

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
  userSignups: {
    date: string;
    count: number;
  }[];
  categoryPerformance: {
    category: string;
    totalEvents: number;
    totalTickets: number;
    totalRevenue: number;
    averageTicketPrice: number;
  }[];
  geographicData: {
    city: string;
    state: string;
    country: string;
    events: number;
    totalTickets: number;
    totalRevenue: number;
    locations: {
      name: string;
      address: string;
      coordinates: [number, number];
    }[];
  }[];
  ticketTypeAnalysis: {
    name: string;
    priceRange: string;
    totalSold: number;
    revenue: number;
    averagePrice: number;
  }[];
  eventTimingData: {
    hour: number;
    dayOfWeek: number;
    month: number;
    bookings: number;
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
    topEvents: [],
    userSignups: [],
    categoryPerformance: [],
    geographicData: [],
    ticketTypeAnalysis: [],
    eventTimingData: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/admin/analytics');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const analyticsData = await response.json();
      console.log('Received analytics data:', analyticsData);
      console.log('Top Events data:', analyticsData.topEvents);
      setData(analyticsData);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      showToast('Failed to load analytics data', 'error');
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
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

  const chartOptions: ChartOptions<'line'> = {
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

  const ticketTypeChartData = {
    labels: data.ticketTypeAnalysis.map(t => t.name),
    datasets: [{
      data: data.ticketTypeAnalysis.map(t => t.totalSold),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  };

  const bookingPatternData = {
    labels: data.eventTimingData.map(t => `${t.hour}:00`),
    datasets: [{
      label: 'Bookings',
      data: data.eventTimingData.map(t => t.bookings),
      fill: true,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
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
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-base-content/70">Track your business performance and growth</p>
          </div>
          <button 
            className={`btn btn-ghost gap-2 ${refreshing ? 'loading' : ''}`}
            onClick={fetchAnalytics}
            disabled={refreshing}
          >
            <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: 'Total Revenue',
            value: formatCurrency(data.revenue.total),
            change: data.revenue.change,
            icon: FiDollarSign,
            color: 'border-primary/30 bg-primary/10 text-primary'
          },
          {
            title: 'Total Users',
            value: data.users.total,
            change: data.users.change,
            icon: FiUsers,
            color: 'border-secondary/30 bg-secondary/10 text-secondary'
          },
          {
            title: 'Tickets Sold',
            value: data.tickets.total,
            change: data.tickets.change,
            icon: FiTag,
            color: 'border-accent/30 bg-accent/10 text-accent'
          },
          {
            title: 'Active Events',
            value: data.events.total,
            change: data.events.change,
            icon: FiCalendar,
            color: 'border-info/30 bg-info/10 text-info'
          }
        ].map((stat, index) => (
          <div key={index} className={`card bg-base-100 shadow-sm border-2 ${stat.color.split(' ')[0]}`}>
            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="stat-title text-base-content/70 mb-1">{stat.title}</div>
                  <div className="stat-value text-2xl font-bold">{stat.value}</div>
                  <div className={`stat-desc flex items-center gap-1 mt-1 ${
                    stat.change >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {stat.change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                    <span>{Math.abs(stat.change).toFixed(1)}% from last month</span>
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

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
        {/* Revenue Chart - spans 4 columns */}
        <div className="col-span-full lg:col-span-4">
          <div className="card bg-base-100 shadow-sm border-2 border-base-300">
            <div className="card-body">
              <h2 className="card-title mb-6">Revenue Trend</h2>
              <div className="h-[300px]">
                <Line data={salesChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
        
        {/* User Signups Chart - spans 3 columns */}
        <div className="col-span-full lg:col-span-3">
          <UserSignupsChart data={data.userSignups} />
        </div>
      </div>

      {/* Geographic Analysis */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <div className="card bg-base-100 shadow-sm border-2 border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-6">Event Locations</h2>
            <div className="h-[400px] relative">
              {data.geographicData && data.geographicData.length > 0 ? (
                <EventLocationsMap geographicData={data.geographicData} />
              ) : (
                <div className="flex items-center justify-center h-full bg-base-200 rounded-lg">
                  <p className="text-base-content/70">No location data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border-2 border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-6">Top Cities by Revenue</h2>
            <div className="overflow-x-auto">
              {data.geographicData && data.geographicData.length > 0 ? (
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Events</th>
                      <th>Tickets</th>
                      <th>Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.geographicData.slice(0, 5).map((location, index) => (
                      <tr key={index}>
                        <td>{location.city}</td>
                        <td>{location.events}</td>
                        <td>{location.totalTickets}</td>
                        <td>{formatCurrency(location.totalRevenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center h-32 bg-base-200 rounded-lg">
                  <p className="text-base-content/70">No city data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Analysis */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <div className="card bg-base-100 shadow-sm border-2 border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-6">Ticket Type Distribution</h2>
            <div className="h-[300px]">
              {data.ticketTypeAnalysis && data.ticketTypeAnalysis.length > 0 ? (
                <Pie data={ticketTypeChartData} options={{ maintainAspectRatio: false }} />
              ) : (
                <div className="flex items-center justify-center h-full bg-base-200 rounded-lg">
                  <p className="text-base-content/70">No ticket type data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border-2 border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-6">Price Range Analysis</h2>
            <div className="space-y-4">
              {data.ticketTypeAnalysis && data.ticketTypeAnalysis.length > 0 ? (
                Object.entries(
                  data.ticketTypeAnalysis.reduce((acc, curr) => {
                    acc[curr.priceRange] = (acc[curr.priceRange] || 0) + curr.totalSold;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([range, count], index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{range}</span>
                      <span>{count} tickets</span>
                    </div>
                    <div className="w-full bg-base-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(count / data.ticketTypeAnalysis.reduce((sum, curr) => sum + curr.totalSold, 0)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-32 bg-base-200 rounded-lg">
                  <p className="text-base-content/70">No price range data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Timing Insights */}
      <div className="grid gap-4 md:grid-cols-2 mt-4">
        <div className="card bg-base-100 shadow-sm border-2 border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-6">Booking Patterns</h2>
            <div className="h-[300px]">
              <Line data={bookingPatternData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border-2 border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-6">Popular Booking Times</h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, day) => (
                <div key={day} className="space-y-2">
                  <div className="text-center font-medium">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]}
                  </div>
                  {Array.from({ length: 24 }, (_, hour) => {
                    const timeData = data.eventTimingData.find(
                      t => t.dayOfWeek === day + 1 && t.hour === hour
                    );
                    const intensity = timeData
                      ? Math.min((timeData.bookings / Math.max(...data.eventTimingData.map(t => t.bookings))) * 100, 100)
                      : 0;
                    return (
                      <div
                        key={hour}
                        className="w-full h-4 rounded"
                        style={{
                          backgroundColor: `rgba(75, 192, 192, ${intensity / 100})`
                        }}
                        title={`${hour}:00 - ${timeData?.bookings || 0} bookings`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Performance */}
      <div className="card bg-base-100 shadow-sm border-2 border-base-300 mt-4">
        <div className="card-body">
          <h2 className="card-title mb-6">Category Performance</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200/50 border-b-2 border-base-300">
                <tr>
                  <th className="border-r-2 border-base-200">Category</th>
                  <th className="border-r-2 border-base-200">Total Events</th>
                  <th className="border-r-2 border-base-200">Tickets Sold</th>
                  <th className="border-r-2 border-base-200">Revenue</th>
                  <th>Avg. Ticket Price</th>
                </tr>
              </thead>
              <tbody>
                {data.categoryPerformance && data.categoryPerformance.map((category, index) => (
                  <tr key={index}>
                    <td className="border-r-2 border-base-200 font-medium">{category.category}</td>
                    <td className="border-r-2 border-base-200">{category.totalEvents}</td>
                    <td className="border-r-2 border-base-200">{category.totalTickets}</td>
                    <td className="border-r-2 border-base-200">{formatCurrency(category.totalRevenue)}</td>
                    <td>{formatCurrency(category.averageTicketPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top Events Section */}
      <div className="card bg-base-100 shadow-sm border-2 border-base-300">
        <div className="card-body">
          <h2 className="card-title mb-6">Top Performing Events</h2>
          <div className="space-y-6">
            {data.topEvents && data.topEvents.length > 0 ? (
              data.topEvents.map((event, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-sm text-base-content/70">{event.tickets} tickets sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(event.revenue)}</p>
                      <p className="text-sm text-base-content/70">
                        {event.tickets > 0 ? formatCurrency(event.revenue / event.tickets) : formatCurrency(0)} avg.
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-base-200 rounded-full h-2 border-2 border-base-300">
                    <div 
                      className="h-2 rounded-full bg-primary"
                      style={{ 
                        width: `${data.topEvents[0]?.revenue > 0 ? (event.revenue / data.topEvents[0].revenue) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-base-content/70">
                No event data available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="card bg-base-100 shadow-sm border-2 border-base-300">
        <div className="card-body">
          <h2 className="card-title mb-6">Recent Sales</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200/50 border-b-2 border-base-300">
                <tr>
                  <th className="border-r-2 border-base-200">Date</th>
                  <th className="border-r-2 border-base-200">Revenue</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSales.map((sale, index) => {
                  const prevAmount = data.recentSales[index + 1]?.amount || sale.amount;
                  const change = ((sale.amount - prevAmount) / prevAmount) * 100;
                  
                  return (
                    <tr key={index}>
                      <td>{formatDate(sale.date)}</td>
                      <td>{formatCurrency(sale.amount)}</td>
                      <td>
                        <div className={`flex items-center gap-1 ${
                          change >= 0 ? 'text-success' : 'text-error'
                        }`}>
                          {change >= 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                          <span>{Math.abs(change).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
