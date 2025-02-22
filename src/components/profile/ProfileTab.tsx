'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ProfileTab() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    location: '',
    bio: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-base-300 pb-4">
        <h2 className="text-2xl font-semibold">Personal Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="btn btn-ghost btn-sm"
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
              disabled={!isEditing}
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
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
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
              disabled={!isEditing}
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
              disabled={!isEditing}
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
            className="textarea textarea-bordered border-2 border-neutral/30 bg-base-200 h-24 w-full focus:outline-2 focus:outline-primary hover:border-neutral/50"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            disabled={!isEditing}
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end border-t-2 border-base-300 pt-4">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
