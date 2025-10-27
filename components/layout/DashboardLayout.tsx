"use client";

import React from 'react';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Fixed */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200">
        <Sidebar />
      </div>

      {/* Main Content Scrollable */}
      <main className="flex-1 overflow-y-auto p-4">
        {children}
      </main>
    </div>
  );
}
