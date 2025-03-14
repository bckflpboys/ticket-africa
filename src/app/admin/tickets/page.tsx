'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiDownload } from 'react-icons/fi';

interface Ticket {
  _id: string;
  eventName: string;
  ticketType: string;
  holderName: string;
  purchaseDate: string;
  status: 'Valid' | 'Used' | 'Cancelled';
  price: number;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchTickets = async () => {
      try {
        // Mock data for now
        setTickets([
          {
            _id: '1',
            eventName: 'Summer Music Festival',
            ticketType: 'VIP',
            holderName: 'John Doe',
            purchaseDate: '2025-03-14',
            status: 'Valid',
            price: 1500
          },
          {
            _id: '2',
            eventName: 'Summer Music Festival',
            ticketType: 'General',
            holderName: 'Jane Smith',
            purchaseDate: '2025-03-14',
            status: 'Used',
            price: 800
          },
          {
            _id: '3',
            eventName: 'Tech Conference 2025',
            ticketType: 'Early Bird',
            holderName: 'Bob Johnson',
            purchaseDate: '2025-03-13',
            status: 'Valid',
            price: 1200
          }
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.holderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tickets</h1>
        <button className="btn btn-outline">
          <FiDownload className="w-5 h-5 mr-2" />
          Export
        </button>
      </div>

      <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-base-200">
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search tickets..."
                className="input input-bordered w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square">
                <FiSearch className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Event</th>
                <th>Ticket Type</th>
                <th>Holder</th>
                <th>Purchase Date</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td>{ticket.eventName}</td>
                  <td>{ticket.ticketType}</td>
                  <td>{ticket.holderName}</td>
                  <td>{formatDate(ticket.purchaseDate)}</td>
                  <td>{formatPrice(ticket.price)}</td>
                  <td>
                    <span className={`badge ${
                      ticket.status === 'Valid' ? 'badge-success' :
                      ticket.status === 'Used' ? 'badge-ghost' :
                      'badge-error'
                    }`}>
                      {ticket.status}
                    </span>
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
