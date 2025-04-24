import React, { ReactNode } from "react";
import { Sidebar, useSidebarContext } from "./sidebar";
import { BottomNavigation } from "./bottom-navigation";
import { ParticlesBackground } from "@/components/particles-background";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useLocation } from "wouter";
import { BusinessMenu } from "@/components/business/business-menu";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const { isOpen } = useSidebarContext();
  const [location] = useLocation();
  
  // Проверяем, находимся ли мы в бизнес-разделе
  const isBusinessSection = location.startsWith('/business');
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-space-900">
      {!isBusinessSection && <ParticlesBackground />}
      
      {!isMobile && <Sidebar />}
      <BottomNavigation />

      <main 
        className={`flex-1 transition-all will-change-transform duration-300 ease-out ${
          isMobile ? 'ml-0' : (isOpen ? 'ml-[256px]' : 'ml-[80px]')
        } ${isMobile ? 'pb-20' : ''} ${isMobile ? 'overflow-x-hidden w-full max-w-[100vw]' : ''}`}
        style={{ 
          transform: 'translateZ(0)', 
          backfaceVisibility: 'hidden',
          overflowX: 'hidden'
        }}
      >
        <div 
          className={`container mx-auto ${isMobile ? 'px-2' : 'px-6'} py-4 ${isMobile ? 'pt-20' : 'pt-16'} ${isMobile ? 'overflow-x-hidden w-full' : ''}`}
          style={{ willChange: 'contents', overflowX: 'hidden' }}
        >
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="mb-6"
              layoutId="pageTitle"
            >
              {title && (
                isBusinessSection ? (
                  <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {title}
                    </h1>
                    <BusinessMenu />
                  </div>
                ) : (
                  <h1 className="font-orbitron text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                    {title}
                  </h1>
                )
              )}
              {subtitle && <p className="text-white/70 text-md mt-1">{subtitle}</p>}
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}