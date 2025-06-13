import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { SkillsDnaProfile } from "@/components/skills-dna-profile";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";

// Brain Activity Animation Component
const BrainActivityAnimation = () => {
  return (
    <div className="absolute top-4 right-4 w-32 h-32 opacity-20 pointer-events-none">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <radialGradient id="brainGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B28DFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8BE0F7" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        
        {/* Brain outline */}
        <motion.path
          d="M30 40 Q40 25 55 30 Q70 20 80 35 Q85 50 75 65 Q60 75 50 70 Q40 75 25 65 Q20 50 30 40"
          stroke="url(#brainGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Neural connections */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 8;
          const x1 = 50 + 15 * Math.cos(angle);
          const y1 = 50 + 15 * Math.sin(angle);
          const x2 = 50 + 25 * Math.cos(angle);
          const y2 = 50 + 25 * Math.sin(angle);
          
          return (
            <motion.line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#brainGradient)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          );
        })}
        
        {/* Central pulse */}
        <motion.circle
          cx="50"
          cy="50"
          r="3"
          fill="url(#brainGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

// DNA Animation Component
const DNAAnimation = () => {
  return (
    <div className="absolute inset-0 opacity-8 overflow-hidden pointer-events-none">
      <motion.div
        className="w-full h-full"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        {/* DNA Helix */}
        <svg viewBox="0 0 400 800" className="w-full h-full">
          <defs>
            <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B28DFF" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#8BE0F7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#B28DFF" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Left helix strand */}
          <motion.path
            d="M100 0 Q150 100 100 200 Q50 300 100 400 Q150 500 100 600 Q50 700 100 800"
            stroke="url(#dnaGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Right helix strand */}
          <motion.path
            d="M300 0 Q250 100 300 200 Q350 300 300 400 Q250 500 300 600 Q350 700 300 800"
            stroke="url(#dnaGradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Connecting base pairs - Data packets */}
          {Array.from({ length: 15 }).map((_, i) => {
            const y = i * 53;
            const leftX = 100 + 50 * Math.sin((i * Math.PI) / 3.5);
            const rightX = 300 - 50 * Math.sin((i * Math.PI) / 3.5);
            
            return (
              <motion.line
                key={i}
                x1={leftX}
                y1={y}
                x2={rightX}
                y2={y}
                stroke="url(#dnaGradient)"
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ 
                  duration: 3, 
                  delay: i * 0.15, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            );
          })}
          
          {/* Floating data points */}
          {Array.from({ length: 12 }).map((_, i) => {
            const x = 50 + (i % 4) * 100;
            const y = 100 + Math.floor(i / 4) * 200;
            
            return (
              <motion.circle
                key={`data-${i}`}
                cx={x}
                cy={y}
                r="2"
                fill="url(#dnaGradient)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.2, 0],
                  y: [y, y - 50, y]
                }}
                transition={{ 
                  duration: 2.5, 
                  delay: i * 0.3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
};

export default function SkillsDna() {
  const [location] = useLocation();
  const [isDeepdDiagnosis, setIsDeepdDiagnosis] = useState(false);
  const { user } = useAuth();
  
  // Handle URL parameters for Skills DNA section
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    const isDeep = params.get('deep') === 'true';
    
    if (section === 'skills-dna') {
      setIsDeepdDiagnosis(isDeep);
      console.log('[SkillsDnaPage] Switching to Skills DNA, deep diagnosis:', isDeep);
    }
  }, [location]);

  return (
    <DashboardLayout 
      title="Skills DNA" 
      subtitle="Ваш цифровой код компетенций в области ИИ"
    >
      <div className="relative">
        <DNAAnimation />
        <BrainActivityAnimation />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full"
        >
          <SkillsDnaProfile 
            userId={user?.id}
            isDeepdDiagnosis={isDeepdDiagnosis}
            showHeader={true}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}