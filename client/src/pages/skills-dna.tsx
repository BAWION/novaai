import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { SkillsDnaProfile } from "@/components/skills-dna-profile";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";

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
      <div className="w-full">
        <SkillsDnaProfile 
          userId={user?.id}
          isDeepdDiagnosis={isDeepdDiagnosis}
          showHeader={true}
        />
      </div>
    </DashboardLayout>
  );
}