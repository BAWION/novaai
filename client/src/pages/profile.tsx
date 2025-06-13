import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { SkillsDnaProfile } from "@/components/skills-dna-profile";
import { useLocation } from "wouter";

export default function Profile() {
  const [location] = useLocation();
  const [isDeepdDiagnosis, setIsDeepdDiagnosis] = useState(false);
  
  // Handle URL parameters for Skills DNA section
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    const isDeep = params.get('deep') === 'true';
    
    if (section === 'skills-dna') {
      setIsDeepdDiagnosis(isDeep);
      console.log('[ProfilePage] Switching to Skills DNA, deep diagnosis:', isDeep);
    }
  }, [location]);

  return (
    <DashboardLayout 
      title="Skills DNA" 
      subtitle="Ваш профиль навыков и рекомендации по обучению"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <SkillsDnaProfile 
          isDeepdDiagnosis={isDeepdDiagnosis}
          showHeader={true}
        />
      </motion.div>
    </DashboardLayout>
  );
}