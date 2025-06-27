import React, { ReactNode } from 'react';
import { useAuth } from '@/context/auth-context';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { Footer } from './footer';
import { BottomNavigation } from './bottom-navigation';
import PageHeader from './page-header';

interface PageLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  title?: string;
  description?: string;
}

export function PageLayout({ 
  children, 
  showHeader = false, 
  title, 
  description 
}: PageLayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        
        <div className="flex-1 flex flex-col min-h-screen">
          <Navbar />
          
          <main className="flex-1 container px-4 py-4 md:px-6 md:py-6">
            {showHeader && (
              <PageHeader
                title={title}
                description={description}
              />
            )}
            
            {children}
          </main>
          
          <Footer />
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}