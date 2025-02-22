'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function ProfileTab() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setFormData(data.user); // Always use data.user
      } catch (error) {
        console.error('Error fetching profile:', error);
        setMessage({ text: 'Error loading profile data', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      console.log('Sending data to API:', formData);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setFormData(data.user);
      setIsEditing(false);
      setMessage({ text: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Error updating profile', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          <span>{message.text}</span>
        </div>
      )}

      <div className="flex justify-between items-center border-b-2 border-base-300 pb-4">
        <h2 className="text-2xl font-semibold">Personal Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-ghost btn-sm"
          disabled={isLoading}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Full Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered border-2 border-neutral/30 bg-base-200 w-full focus:outline-2 focus:outline-primary hover:border-neutral/50"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing || isLoading}
              required
            />
          </div>

          {/* Email */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              className="input input-bordered border-2 border-neutral/30 bg-base-200 w-full focus:outline-2 focus:outline-primary hover:border-neutral/50"
              value={formData.email}
              disabled={true} // Email should not be editable
            />
          </div>

          {/* Phone */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Phone Number</span>
            </label>
            <input
              type="tel"
              className="input input-bordered border-2 border-neutral/30 bg-base-200 w-full focus:outline-2 focus:outline-primary hover:border-neutral/50"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing || isLoading}
              placeholder="+27"
            />
          </div>

          {/* Location */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Location</span>
            </label>
            <input
              type="text"
              className="input input-bordered border-2 border-neutral/30 bg-base-200 w-full focus:outline-2 focus:outline-primary hover:border-neutral/50"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              disabled={!isEditing || isLoading}
              placeholder="City, Country"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Bio</span>
          </label>
          <textarea
            className="textarea textarea-bordered border-2 border-neutral/30 bg-base-200 w-full h-32 focus:outline-2 focus:outline-primary hover:border-neutral/50"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing || isLoading}
            placeholder="Tell us about yourself..."
          />
        </div>

        {isEditing && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
