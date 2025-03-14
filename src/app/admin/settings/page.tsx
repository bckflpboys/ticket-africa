'use client';

import { useState } from 'react';
import { FiSave } from 'react-icons/fi';

interface Settings {
  siteName: string;
  contactEmail: string;
  phoneNumber: string;
  serviceFeePercentage: number;
  currency: string;
  timezone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'Ticket Africa',
    contactEmail: 'support@ticketafrica.com',
    phoneNumber: '+27 123 456 789',
    serviceFeePercentage: 5,
    currency: 'ZAR',
    timezone: 'Africa/Johannesburg',
    emailNotifications: true,
    smsNotifications: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement settings update
    console.log('Settings updated:', settings);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="bg-base-100 rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">General Settings</h2>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Site Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Contact Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input
                type="tel"
                className="input input-bordered"
                value={settings.phoneNumber}
                onChange={(e) => setSettings({...settings, phoneNumber: e.target.value})}
              />
            </div>
          </div>

          {/* Payment Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Settings</h2>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Service Fee Percentage</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={settings.serviceFeePercentage}
                onChange={(e) => setSettings({...settings, serviceFeePercentage: Number(e.target.value)})}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Currency</span>
              </label>
              <select 
                className="select select-bordered"
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
              >
                <option value="ZAR">South African Rand (ZAR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Timezone</span>
              </label>
              <select 
                className="select select-bordered"
                value={settings.timezone}
                onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              >
                <option value="Africa/Johannesburg">Africa/Johannesburg</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Notification Settings</h2>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Email Notifications</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">SMS Notifications</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={settings.smsNotifications}
                  onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                />
              </label>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="btn btn-primary">
              <FiSave className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
