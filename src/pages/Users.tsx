
import React from 'react';
import NavBar from '@/components/NavBar';

const UsersPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="animate-fadeIn">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Dashboard</span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs font-medium">User Management</span>
          </div>
          <h1 className="text-3xl font-bold">User Management</h1>
          
          <div className="mt-8 p-6 bg-white rounded-lg border border-border shadow-sm">
            <p className="text-muted-foreground">User management functionality will be implemented here.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
