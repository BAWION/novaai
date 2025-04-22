import React, { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { ParticlesBackground } from "@/components/particles-background";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Glassmorphism } from "@/components/ui/glassmorphism";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full flex flex-col bg-space-900">
      <ParticlesBackground />
      
      <Sidebar />

      <main className={`flex-1 transition-all duration-300 ${isMobile ? 'pl-0' : 'pl-[260px]'}`}>
        <div className="container mx-auto px-6 py-4 pt-16">
          {(title || subtitle) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              {title && (
                <h1 className="font-orbitron text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                  {title}
                </h1>
              )}
              {subtitle && <p className="text-white/70 text-md mt-1">{subtitle}</p>}
            </motion.div>
          )}

          <Glassmorphism className="rounded-xl p-4 md:p-6 w-full mb-6 overflow-x-auto">
            {children}
          </Glassmorphism>
        </div>
      </main>
    </div>
  );
}