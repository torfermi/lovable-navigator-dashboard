import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { cn } from '@/lib/utils';

export const Layout: React.FC = () => {
  const { isSidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />
        
        {/* Page content */}
        <main 
          className={cn(
            "flex-1 p-6 overflow-auto transition-all duration-300 ease-in-out",
            "bg-gradient-subtle"
          )}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};