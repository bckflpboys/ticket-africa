'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SettingsTab() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b-2 border-base-300 pb-4">
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>

      {/* Notifications Section */}
      <div className="border-2 border-neutral/30 bg-base-200 rounded-lg p-6 space-y-4 hover:border-neutral/50 transition-colors">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-base-content/70">Receive emails about your account activity</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-7 bg-base-300 border-2 border-neutral/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral/30 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-base-content/70">Receive emails about events and promotions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-base-300 border-2 border-neutral/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-neutral/30 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="border-2 border-neutral/30 bg-base-200 rounded-lg p-6 space-y-4 hover:border-neutral/50 transition-colors">
        <h3 className="text-lg font-semibold">Security</h3>
        <div className="space-y-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Current Password</span>
            </label>
            <Input
              type="password"
              className="input input-bordered border-2 border-neutral/30 bg-base-100 w-full focus:outline-2 focus:outline-primary hover:border-neutral/50"
              placeholder="Enter current password"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">New Password</span>
            </label>
            <Input
              type="password"
              className="input input-bordered border-2 border-neutral/30 bg-base-100 w-full focus:outline-2 focus:outline-primary hover:border-neutral/50"
              placeholder="Enter new password"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Confirm New Password</span>
            </label>
            <Input
              type="password"
              className="input input-bordered border-2 border-neutral/30 bg-base-100 w-full focus:outline-2 focus:outline-primary hover:border-neutral/50"
              placeholder="Confirm new password"
            />
          </div>
          <Button className="btn btn-primary">Update Password</Button>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="border-2 border-error/20 bg-error/5 rounded-lg p-6 space-y-4 hover:border-error/30 transition-colors">
        <h3 className="text-lg font-semibold text-error">Delete Account</h3>
        <p className="text-base-content/70">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button className="btn btn-error">Delete Account</Button>
      </div>
    </div>
  );
}
