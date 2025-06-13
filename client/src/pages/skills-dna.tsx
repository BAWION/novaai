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

// Nuclear Reactor Energy Core Animation Component
const NuclearReactorAnimation = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
      {/* Central Energy Core */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="relative w-40 h-40"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer reactor containment */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-600/30 to-purple-700/20 blur-lg"></div>
          
          {/* Inner energy sphere */}
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-r from-cyan-400/50 via-blue-500/70 to-purple-600/50"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              boxShadow: '0 0 60px rgba(59, 130, 246, 0.8), 0 0 120px rgba(34, 211, 238, 0.6)'
            }}
          />
          
          {/* Pulsing energy core */}
          <motion.div
            className="absolute inset-12 rounded-full bg-gradient-to-r from-white/90 via-cyan-300/95 to-blue-400/90"
            animate={{ 
              scale: [0.7, 1.2, 0.7],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              boxShadow: '0 0 80px rgba(255, 255, 255, 0.9), 0 0 120px rgba(59, 130, 246, 0.8), 0 0 160px rgba(147, 51, 234, 0.6)'
            }}
          />
        </motion.div>
      </div>
      
      {/* Energy Particle Field */}
      {Array.from({ length: 32 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 32;
        const radius = 300 + Math.random() * 200;
        const x = 50 + (radius * Math.cos(angle)) / 10;
        const y = 50 + (radius * Math.sin(angle)) / 10;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.9), 0 0 24px rgba(34, 211, 238, 0.7)'
            }}
            animate={{
              scale: [0, 2, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 200],
              y: [0, (Math.random() - 0.5) * 200]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              delay: i * 0.08,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        );
      })}
      
      {/* Energy Shock Waves */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400/40"
          style={{
            width: `${(i + 1) * 160}px`,
            height: `${(i + 1) * 160}px`,
            boxShadow: `0 0 30px rgba(59, 130, 246, 0.6)`
          }}
          animate={{
            scale: [1, 2],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 5,
            delay: i * 0.6,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
      
      {/* Orbiting Energy Orbs */}
      {Array.from({ length: 12 }).map((_, i) => {
        const orbitRadius = 200 + (i % 3) * 40;
        const orbitSpeed = 8 + i * 1.5;
        
        return (
          <motion.div
            key={`orb-${i}`}
            className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400"
            style={{
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.9), 0 0 40px rgba(59, 130, 246, 0.7)',
              transformOrigin: `${orbitRadius}px 0px`
            }}
            animate={{
              rotate: 360,
              scale: [0.5, 1.5, 0.5],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              rotate: {
                duration: orbitSpeed,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              },
              opacity: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        );
      })}
      
      {/* Energy Lightning Bolts */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const length = 150;
        const x1 = 50;
        const y1 = 50;
        const x2 = 50 + (length * Math.cos(angle)) / 10;
        const y2 = 50 + (length * Math.sin(angle)) / 10;
        
        return (
          <motion.div
            key={`lightning-${i}`}
            className="absolute"
            style={{
              left: `${x1}%`,
              top: `${y1}%`,
              width: '2px',
              height: `${Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2))}%`,
              background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(34, 211, 238, 0.6))',
              transformOrigin: 'top',
              transform: `rotate(${Math.atan2(y2-y1, x2-x1) * 180 / Math.PI + 90}deg)`,
              boxShadow: '0 0 8px rgba(59, 130, 246, 0.8)'
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0]
            }}
            transition={{
              duration: 0.3,
              delay: i * 0.2 + Math.random() * 2,
              repeat: Infinity,
              repeatDelay: 3 + Math.random() * 4
            }}
          />
        );
      })}
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
        <NuclearReactorAnimation />
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