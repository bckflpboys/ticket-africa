'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import LocationDetails from '@/components/event/LocationDetails';

// Categories from your Event model
const CATEGORIES = [
  'Technology',
  'Music',
  'Business',
  'Fashion',
  'Food & Drink',
  'Sports',
  'Arts & Theatre',
  'Education',
  'Entertainment',
  'Health'
] as const;

interface EventRestrictions {
  ageRestriction: {
    hasAgeLimit: boolean;
    minimumAge: number;
  };
  noWeapons: boolean;
  noProfessionalCameras: boolean;
  noPets: boolean;
  hasCustomRestrictions: boolean;
  customRestrictions: string[];
  coolerBox: {
    allowed: boolean;
    maxLiters: number;
    price: number;
  };
}

interface EventHighlight {
  title: string;
  description: string;
}

interface EventScheduleItem {
  time: string;
  period: 'AM' | 'PM';
  title: string;
  description: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  tags: string;
  highlights: EventHighlight[];
  schedule: EventScheduleItem[];
  restrictions: EventRestrictions;
}

interface TicketType {
  name: string;
  price: number;
  quantity: number;
}

// Helper function to convert 12-hour format to 24-hour format
const convertTo24Hour = (time: string, period: 'AM' | 'PM'): string => {
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);
  
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }
  
  return `${hour.toString().padStart(2, '0')}:${minutes}`;
};

// Helper function to convert 24-hour format to 12-hour format
const convertTo12Hour = (time: string): { time: string; period: 'AM' | 'PM' } => {
  const [hours, minutes] = time.split(':');
  let hour = parseInt(hours, 10);
  let period: 'AM' | 'PM' = hour >= 12 ? 'PM' : 'AM';
  
  if (hour > 12) {
    hour -= 12;
  } else if (hour === 0) {
    hour = 12;
  }
  
  return { 
    time: `${hour}:${minutes}`, 
    period 
  };
};

// Helper function to ensure time is in HH:MM format
const formatTimeToHHMM = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes}`;
};

export default function CreateEvent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: '', price: 0, quantity: 0 }
  ]);

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    category: '',
    tags: '',
    highlights: [
      { title: 'Live performances from top artists', description: '' },
      { title: 'Food and beverage vendors', description: '' },
      { title: 'Interactive activities and games', description: '' }
    ],
    schedule: [
      { time: '12:00', period: 'PM', title: 'Gates Open', description: 'Early arrival recommended to avoid queues' },
      { time: '2:00', period: 'PM', title: 'Opening Act', description: 'Local artists performance' },
      { time: '4:00', period: 'PM', title: 'Main Event', description: 'Headline performances begin' },
      { time: '10:00', period: 'PM', title: 'Event Ends', description: 'Closing ceremony and final performances' }
    ],
    restrictions: {
      ageRestriction: {
        hasAgeLimit: false,
        minimumAge: 16
      },
      noWeapons: true,
      noProfessionalCameras: false,
      noPets: true,
      hasCustomRestrictions: false,
      customRestrictions: [],
      coolerBox: {
        allowed: false,
        maxLiters: 50,
        price: 0
      }
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'startTime' || name === 'endTime') {
      // For time inputs, store in 24-hour format
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (name.startsWith('restrictions.')) {
      const [, restrictionField, subfield] = name.split('.') as [string, keyof EventRestrictions, string | undefined];
      
      setFormData((prev) => {
        const newRestrictions = { ...prev.restrictions };
        if (subfield) {
          if (restrictionField === 'ageRestriction') {
            newRestrictions.ageRestriction = {
              ...newRestrictions.ageRestriction,
              [subfield]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
            };
          } else if (restrictionField === 'coolerBox') {
            newRestrictions.coolerBox = {
              ...newRestrictions.coolerBox,
              [subfield]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                         subfield === 'maxLiters' || subfield === 'price' ? Number(value) : value
            };
          }
        } else {
          (newRestrictions[restrictionField] as any) = type === 'checkbox' 
            ? (e.target as HTMLInputElement).checked 
            : value;
        }
        return {
          ...prev,
          restrictions: newRestrictions
        };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleTicketTypeChange = (index: number, field: keyof TicketType, value: string | number) => {
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

  const addCustomRestriction = () => {
    setFormData((prev) => ({
      ...prev,
      restrictions: {
        ...prev.restrictions,
        customRestrictions: [...prev.restrictions.customRestrictions, '']
      }
    }));
  };

  const removeCustomRestriction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      restrictions: {
        ...prev.restrictions,
        customRestrictions: prev.restrictions.customRestrictions.filter((_, i) => i !== index)
      }
    }));
  };

  const updateCustomRestriction = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      restrictions: {
        ...prev.restrictions,
        customRestrictions: prev.restrictions.customRestrictions.map((item, i) => 
          i === index ? value : item
        )
      }
    }));
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, { title: '', description: '' }]
    }));
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const updateHighlight = (index: number, field: keyof EventHighlight, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((highlight, i) => 
        i === index ? { ...highlight, [field]: value } : highlight
      )
    }));
  };

  const addScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...prev.schedule, { time: '', period: 'PM', title: '', description: '' }]
    }));
  };

  const removeScheduleItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index)
    }));
  };

  const updateScheduleItem = (index: number, field: keyof EventScheduleItem, value: string) => {
    const newSchedule = [...formData.schedule];
    if (field === 'time') {
      // When time changes, we need to ensure it's in the correct format for the input
      const timeValue = value.replace(/^(\d):/, '0$1:'); // Ensure single-digit hours are padded
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: timeValue
      };
    } else {
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: value
      };
    }
    setFormData({ ...formData, schedule: newSchedule });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + selectedImages.length > 6) {
      setError('Maximum 6 images allowed');
      return;
    }

    // Filter for image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      setError('Only image files are allowed');
      return;
    }

    setSelectedImages(prev => [...prev, ...imageFiles]);

    // Create preview URLs for new images
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Upload images first
      const uploadedImageUrls: string[] = [];
      
      for (const image of selectedImages) {
        const formData = new FormData();
        formData.append('file', image);
        
        try {
          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload image: ${await uploadResponse.text()}`);
          }

          const { url } = await uploadResponse.json();
          uploadedImageUrls.push(url);
        } catch (uploadError) {
          console.error(`Upload failed for ${image.name}:`, uploadError);
          throw new Error('Failed to upload images. Please try again.');
        }
      }

      // Format schedule times to ensure HH:MM format
      const formattedSchedule = formData.schedule.map(item => ({
        ...item,
        time: formatTimeToHHMM(item.time)
      }));

      // Ensure boolean values are properly set
      const formattedRestrictions = {
        ...formData.restrictions,
        ageRestriction: {
          ...formData.restrictions.ageRestriction,
          hasAgeLimit: Boolean(formData.restrictions.ageRestriction.hasAgeLimit),
          minimumAge: Number(formData.restrictions.ageRestriction.minimumAge)
        },
        noWeapons: Boolean(formData.restrictions.noWeapons),
        noProfessionalCameras: Boolean(formData.restrictions.noProfessionalCameras),
        noPets: Boolean(formData.restrictions.noPets),
        hasCustomRestrictions: Boolean(formData.restrictions.hasCustomRestrictions),
        coolerBox: {
          ...formData.restrictions.coolerBox,
          allowed: Boolean(formData.restrictions.coolerBox.allowed),
          maxLiters: Number(formData.restrictions.coolerBox.maxLiters),
          price: Number(formData.restrictions.coolerBox.price)
        }
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          schedule: formattedSchedule,
          restrictions: formattedRestrictions,
          date: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
          endTime: new Date(`${formData.date}T${formData.endTime}`).toISOString(),
          images: uploadedImageUrls,
          ticketTypes,
          tags: formData.tags.split(',').map(tag => tag.trim()),
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to create event');
      }

      const event = await response.json();
      router.push(`/events/${event.id}`);
    } catch (err) {
      console.error('Event creation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Create New Event</h1>
              <p className="text-base-content/70 mt-2">Fill in the details below to create your event</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="alert alert-error shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{error}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-base-content/50">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="card-title text-xl">Basic Information</h2>
                </div>
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
                    <LocationDetails
                      location={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Category and Tags */}
            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-base-content/50">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a2 2 0 002-2H6a2 2 0 002-2H6z" />
                    </svg>
                  </div>
                  <h2 className="card-title text-xl">Category & Tags</h2>
                </div>
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
                      {CATEGORIES.map(category => (
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
                      placeholder="e.g., music, outdoor, family"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-base-content/50">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h2 className="card-title text-xl">Event Highlights</h2>
                </div>
                <div className="space-y-4">
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="card bg-base-100 border-2 border-base-content/50">
                      <div className="card-body">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="label">
                              <span className="label-text">Highlight Title</span>
                            </label>
                            <input
                              type="text"
                              value={highlight.title}
                              onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                              className="input input-bordered w-full"
                              required
                            />
                          </div>
                          <div>
                            <label className="label">
                              <span className="label-text">Highlight Description</span>
                            </label>
                            <textarea
                              value={highlight.description}
                              onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                              className="textarea textarea-bordered w-full h-32"
                              required
                            />
                          </div>
                        </div>
                        {formData.highlights.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHighlight(index)}
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
                    onClick={addHighlight}
                    className="btn btn-secondary w-full"
                  >
                    Add Highlight
                  </button>
                </div>
              </div>
            </div>

            {/* Event Schedule */}
            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-base-content/50">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="card-title text-xl">Event Schedule</h2>
                </div>

                <div className="space-y-6">
                  {/* Timeline Display */}
                  <div className="relative space-y-6">
                    {formData.schedule.map((scheduleItem, index) => (
                      <div key={index} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border-2 border-base-content/50">
                        <div className="card-body relative">
                          {/* Timeline Connector */}
                          {index < formData.schedule.length - 1 && (
                            <div className="absolute left-8 top-full w-0.5 h-6 bg-primary/20"></div>
                          )}
                          
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Time Section */}
                            <div className="flex-none w-full md:w-60">
                              <div className="bg-base-200 p-4 rounded-lg border-2 border-base-content/20">
                                <label className="label">
                                  <span className="label-text font-medium">Time</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="time"
                                    value={convertTo24Hour(scheduleItem.time, scheduleItem.period)}
                                    onChange={(e) => {
                                      const { time, period } = convertTo12Hour(e.target.value);
                                      const newSchedule = [...formData.schedule];
                                      newSchedule[index] = { ...scheduleItem, time, period };
                                      setFormData({ ...formData, schedule: newSchedule });
                                    }}
                                    className="input input-bordered w-36"
                                    required
                                  />
                                  <select
                                    value={scheduleItem.period}
                                    onChange={(e) => updateScheduleItem(index, 'period', e.target.value)}
                                    className="select select-bordered w-20"
                                    required
                                  >
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Details Section */}
                            <div className="flex-1 space-y-4">
                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text font-medium">Event Title</span>
                                </label>
                                <input
                                  type="text"
                                  value={scheduleItem.title}
                                  onChange={(e) => updateScheduleItem(index, 'title', e.target.value)}
                                  className="input input-bordered"
                                  placeholder="e.g., Opening Ceremony"
                                  required
                                />
                              </div>

                              <div className="form-control">
                                <label className="label">
                                  <span className="label-text font-medium">Description</span>
                                </label>
                                <textarea
                                  value={scheduleItem.description}
                                  onChange={(e) => updateScheduleItem(index, 'description', e.target.value)}
                                  className="textarea textarea-bordered h-24"
                                  placeholder="Describe what happens during this part of the event"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            {formData.schedule.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeScheduleItem(index)}
                                className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                            <div className="tooltip tooltip-left" data-tip={`Schedule Item ${index + 1}`}>
                              <div className="badge badge-primary">{index + 1}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Schedule Item Button */}
                  <button
                    type="button"
                    onClick={addScheduleItem}
                    className="btn btn-outline btn-primary w-full gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H6z" />
                    </svg>
                    Add Schedule Item
                  </button>
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-base-content/50">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="card-title text-xl">Event Images</h2>
                </div>

                <div className="space-y-6">
                  {/* Upload Area */}
                  <div className="bg-base-100 rounded-box p-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Upload Event Images</span>
                        <span className="label-text-alt text-base-content/70">
                          Maximum 6 images allowed
                        </span>
                      </label>
                      
                      <div className="mt-2">
                        <div className="flex justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-base-content/50 border-dashed rounded-lg cursor-pointer bg-base-100 hover:bg-base-200 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-primary mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H6z" />
                              </svg>
                              <p className="mb-2 text-sm text-base-content">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-base-content/70">PNG, JPG, GIF up to 10MB</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleImageChange}
                              className="hidden"
                              disabled={selectedImages.length >= 6}
                            />
                          </label>
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-sm text-base-content/70">
                            {selectedImages.length}/6 images uploaded
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Previews */}
                  {previewUrls.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-medium text-base">Uploaded Images</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={url} className="relative group">
                            <div className="aspect-[4/3] relative rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow border-2 border-base-content/50">
                              <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="btn btn-circle btn-sm btn-error"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-center text-base-content/70">
                              Image {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket Types */}
            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-base-content/50">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0-6h6m-6 0H6a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H6z" />
                    </svg>
                  </div>
                  <h2 className="card-title text-xl">Ticket Types</h2>
                </div>
                <div className="space-y-4">
                  {ticketTypes.map((ticket, index) => (
                    <div key={index} className="card bg-base-100 border-2 border-base-content/50">
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

            {/* Restrictions */}
            <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-base-content/50">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 4v2m0-6h6m-6 0H6a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H6z" />
                    </svg>
                  </div>
                  <h2 className="card-title text-xl">Event Rules & Restrictions</h2>
                </div>
                {/* Age Restriction */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Age Restriction</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="restrictions.ageRestriction.hasAgeLimit"
                      checked={formData.restrictions.ageRestriction.hasAgeLimit}
                      onChange={handleInputChange}
                      className="checkbox checkbox-primary"
                    />
                    <label className="label cursor-pointer">
                      <span className="label-text font-medium">Has Age Limit</span>
                    </label>
                  </div>
                  {formData.restrictions.ageRestriction.hasAgeLimit && (
                    <div className="ml-6">
                      <div className="form-control mt-4">
                        <label className="label">
                          <span className="label-text">Minimum Age</span>
                        </label>
                        <input
                          type="number"
                          name="restrictions.ageRestriction.minimumAge"
                          value={formData.restrictions.ageRestriction.minimumAge}
                          onChange={handleInputChange}
                          min="16"
                          max="100"
                          className="input input-bordered w-24"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Cooler Box Restrictions */}
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Cooler Box Pass</span>
                  </label>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      name="restrictions.coolerBox.allowed"
                      checked={formData.restrictions.coolerBox.allowed}
                      onChange={handleInputChange}
                      className="checkbox checkbox-primary"
                    />
                    <label className="label cursor-pointer">
                      <span className="label-text font-medium">Allow Cooler Box</span>
                    </label>
                  </div>
                  
                  {formData.restrictions.coolerBox.allowed && (
                    <div className="ml-6 space-y-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Entry Fee (R)</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">R</span>
                          <input
                            type="number"
                            name="restrictions.coolerBox.price"
                            value={formData.restrictions.coolerBox.price}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            className="input input-bordered w-full"
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Maximum Size (Liters)</span>
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            name="restrictions.coolerBox.maxLiters"
                            value={formData.restrictions.coolerBox.maxLiters}
                            onChange={handleInputChange}
                            min="1"
                            max="100"
                            className="input input-bordered w-full"
                          />
                          <span className="text-sm">L</span>
                        </div>
                        <label className="label">
                          <span className="label-text-alt text-gray-500">Maximum allowed: 100L</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Standard Restrictions */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">No Weapons</span>
                  </label>
                  <input
                    type="checkbox"
                    name="restrictions.noWeapons"
                    checked={formData.restrictions.noWeapons}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">No Professional Cameras</span>
                  </label>
                  <input
                    type="checkbox"
                    name="restrictions.noProfessionalCameras"
                    checked={formData.restrictions.noProfessionalCameras}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">No Pets</span>
                  </label>
                  <input
                    type="checkbox"
                    name="restrictions.noPets"
                    checked={formData.restrictions.noPets}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Custom Restrictions</span>
                  </label>
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      name="restrictions.hasCustomRestrictions"
                      checked={formData.restrictions.hasCustomRestrictions}
                      onChange={handleInputChange}
                      className="checkbox checkbox-primary"
                    />
                    <label className="label cursor-pointer">
                      <span className="label-text font-medium">Add Custom Restrictions</span>
                    </label>
                  </div>

                  {formData.restrictions.hasCustomRestrictions && (
                    <div className="ml-6 space-y-4">
                      {formData.restrictions.customRestrictions.map((restriction, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={restriction}
                            onChange={(e) => updateCustomRestriction(index, e.target.value)}
                            placeholder="Enter restriction"
                            className="input input-bordered w-full"
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomRestriction(index)}
                            className="btn btn-error btn-square btn-sm"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addCustomRestriction}
                        className="btn btn-outline btn-secondary btn-sm w-full"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Restriction
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-outline btn-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary btn-lg"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
