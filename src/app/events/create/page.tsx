'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CldUploadWidget } from 'next-cloudinary';

// Categories from your Event model
const CATEGORIES = [
  'Technology',
  'Music',
  'Business',
  'Fashion',
  'Food & Drink',
  'Sports',
  'Arts',
  'Education',
  'Entertainment',
  'Health'
] as const;

export default function CreateEvent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ticketTypes, setTicketTypes] = useState([
    { name: '', price: 0, quantity: 0 }
  ]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    tags: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTicketTypeChange = (index: number, field: string, value: string | number) => {
    const newTicketTypes = [...ticketTypes];
    newTicketTypes[index] = {
      ...newTicketTypes[index],
      [field]: value
    };
    setTicketTypes(newTicketTypes);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: '', price: 0, quantity: 0 }]);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!session?.user) {
        throw new Error('You must be logged in to create an event');
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(`${formData.date}T${formData.time}`).toISOString(),
          imageUrl,
          ticketTypes,
          tags: formData.tags.split(',').map(tag => tag.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const event = await response.json();
      router.push(`/events/${event.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error">
                <p>{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Event Title</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Description</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="textarea textarea-bordered w-full h-32"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">
                        <span className="label-text">Date</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="label">
                        <span className="label-text">Time</span>
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Location</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category and Tags */}
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Category & Tags</h2>
                <div className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text">Category</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="">Select a category</option>
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">Tags (comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="e.g., music, live, concert"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Event Image */}
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Event Image</h2>
                <div className="space-y-4">
                  {imageUrl && (
                    <div className="relative w-full h-48">
                      <img
                        src={imageUrl}
                        alt="Event"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <CldUploadWidget
                    uploadPreset="event_images"
                    onUpload={(result: any) => {
                      setImageUrl(result.info.secure_url);
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="btn btn-secondary w-full"
                      >
                        Upload Image
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            </div>

            {/* Ticket Types */}
            <div className="card bg-base-200">
              <div className="card-body">
                <h2 className="card-title">Ticket Types</h2>
                <div className="space-y-4">
                  {ticketTypes.map((ticket, index) => (
                    <div key={index} className="card bg-base-100">
                      <div className="card-body">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="label">
                              <span className="label-text">Ticket Name</span>
                            </label>
                            <input
                              type="text"
                              value={ticket.name}
                              onChange={(e) => handleTicketTypeChange(index, 'name', e.target.value)}
                              className="input input-bordered w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text">Price (R)</span>
                            </label>
                            <input
                              type="number"
                              value={ticket.price}
                              onChange={(e) => handleTicketTypeChange(index, 'price', parseFloat(e.target.value))}
                              className="input input-bordered w-full"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text">Quantity</span>
                            </label>
                            <input
                              type="number"
                              value={ticket.quantity}
                              onChange={(e) => handleTicketTypeChange(index, 'quantity', parseInt(e.target.value))}
                              className="input input-bordered w-full"
                              min="1"
                              required
                            />
                          </div>
                        </div>
                        {ticketTypes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTicketType(index)}
                            className="btn btn-error btn-sm mt-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addTicketType}
                    className="btn btn-secondary w-full"
                  >
                    Add Ticket Type
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
              >
                {isLoading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
