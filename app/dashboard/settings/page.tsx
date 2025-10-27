'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ProfileSettings, 
  PasswordSettings, 
  TermsSettings, 
  PrivacyPolicySettings, 
  AboutUsSettings 
} from '@/components/settings';
import { User, Lock, FileText, Shield, Info } from 'lucide-react';

type TabValue = 'profile' | 'password' | 'terms' | 'policy' | 'about';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>('profile');



  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your profile and application settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as TabValue)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center space-x-2">
              <Lock size={16} />
              <span>Password</span>
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center space-x-2">
              <FileText size={16} />
              <span>Terms</span>
            </TabsTrigger>
            <TabsTrigger value="policy" className="flex items-center space-x-2">
              <Shield size={16} />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2">
              <Info size={16} />
              <span>About Us</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <PasswordSettings />
          </TabsContent>

          {/* Terms Tab */}
          <TabsContent value="terms">
            <TermsSettings />
          </TabsContent>

          {/* Privacy Policy Tab */}
          <TabsContent value="policy">
            <PrivacyPolicySettings />
          </TabsContent>

          {/* About Us Tab */}
          <TabsContent value="about">
            <AboutUsSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}