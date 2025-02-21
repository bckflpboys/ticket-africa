'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [ticketTypes, setTicketTypes] = useState([
    { name: '', price: 0, quantity: 0 }
  ]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
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

      let uploadedImageUrl = '';
      
      if (selectedImage) {
        try {
          const formData = new FormData();
          formData.append('file', selectedImage);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json();
            throw new Error(`Upload failed: ${errorData.error || 'Unknown error'}`);
          }

          const uploadResult = await uploadResponse.json();
          uploadedImageUrl = uploadResult.url;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          throw new Error('Failed to upload image. Please try again.');
        }
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
          endTime: new Date(`${formData.date}T${formData.endTime}`).toISOString(),
          imageUrl: uploadedImageUrl,
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

                  <div className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Date</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="input input-bordered"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Start Time</span>
                        </label>
                        <input
                          type="time"
                          name="startTime"
                          value={formData.startTime}
                          onChange={handleInputChange}
                          className="input input-bordered"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">End Time</span>
                        </label>
                        <input
                          type="time"
                          name="endTime"
                          value={formData.endTime}
                          onChange={handleInputChange}
                          className="input input-bordered"
                          required
                        />
                      </div>
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
                  {previewUrl && (
                    <div className="relative w-full h-48">
                      <Image
                        src={previewUrl}
                        alt="Event preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedImage(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPreviewUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="file-input file-input-bordered w-full"
                    />
                  </div>
                  {!previewUrl && (
                    <p className="text-sm text-base-content/70 text-center">
                      Select an image for your event. Recommended size: 1200x630px
                    </p>
                  )}
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
