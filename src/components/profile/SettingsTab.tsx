'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-base-content/70">Receive emails about your account activity</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-base-content/70">Receive emails about events and promotions</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="border-2 border-neutral/30 bg-base-200 rounded-lg p-6 space-y-4 hover:border-neutral/50 transition-colors">
        <h3 className="text-lg font-semibold">Security</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input type="password" />
          </div>

          <div className="pt-2">
            <Button>Update Password</Button>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="border-2 border-error/20 bg-error/5 rounded-lg p-6 space-y-4 hover:border-error/30 transition-colors">
        <h3 className="text-lg font-semibold text-error">Delete Account</h3>
        <p className="text-base-content/70">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="destructive">Delete Account</Button>
      </div>
    </div>
  );
}
