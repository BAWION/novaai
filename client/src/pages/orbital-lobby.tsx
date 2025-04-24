import React from "react";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { ParticlesBackground } from "@/components/particles-background";
import { OrbitalLayout } from "@/components/orbital-layout";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SkillMap } from "@/components/skill-map";
import { QuickActionCard } from "@/components/quick-action-card";
import { useUserProfile } from "@/context/user-profile-context";
import { quickActions } from "@/lib/constants";

export default function OrbitalLobby() {
  const { userProfile } = useUserProfile();

  return (
    <div className="min-h-screen w-full flex flex-col">
      <ParticlesBackground />

      <section className="container mx-auto px-4 py-10 mt-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
            Галактика знаний
          </h2>
          <p className="text-white/70 mt-2 max-w-2xl mx-auto">
            Исследуйте персонализированные образовательные ресурсы: техника, этика, законы и другие аспекты ИИ
          </p>
        </motion.div>

        {/* User profile summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Glassmorphism className="rounded-xl p-4 max-w-4xl mx-auto mb-10 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] p-0.5">
                <div className="bg-space-800 rounded-full w-full h-full flex items-center justify-center text-xl font-medium">
                  А
                </div>
              </div>
              <div className="ml-4">
                <h3 className="font-space font-medium">
                  {userProfile?.displayName || "Анна"}
                </h3>
                <p className="text-white/60 text-sm">
                  {userProfile?.role === "student" ? "Студент" : "Пользователь"} • {userProfile?.recommendedTrack === "zero-to-hero" ? "Zero-to-Hero" : "Custom Track"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <ProgressRing percent={45} size={60}>
                  <span className="text-sm font-medium">45%</span>
                </ProgressRing>
                <p className="text-xs text-white/70 mt-1">Прогресс</p>
              </div>

              <Glassmorphism className="px-4 py-2 rounded-lg">
                <div className="flex items-center">
                  <i className="fas fa-fire text-[#FF3A8C] mr-2"></i>
                  <span className="font-medium">3</span>
                  <span className="text-white/60 text-sm ml-1">дня подряд</span>
                </div>
              </Glassmorphism>
            </div>
          </Glassmorphism>
        </motion.div>

        {/* Orbital elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <OrbitalLayout />
        </motion.div>

        {/* Skill Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Glassmorphism className="max-w-5xl mx-auto rounded-xl p-6 md:p-8 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="font-orbitron text-2xl font-semibold">
                  Персональная карта навыков
                </h2>
                <p className="text-white/60 mt-1">
                  Zero-to-Hero → Applied DS • 8 недель, 5 ч/нед
                </p>
              </div>
              <button className="mt-4 md:mt-0 glassmorphism px-4 py-2 rounded-full text-[#B28DFF] hover:text-white border border-[#6E3AFF]/30 transition">
                <i className="fas fa-download mr-2"></i>Скачать PDF
              </button>
            </div>

            <SkillMap />
          </Glassmorphism>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-w-5xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {quickActions.map((action) => (
            <QuickActionCard
              key={action.id}
              title={action.title}
              description={action.description}
              icon={action.icon}
              color={action.color}
            />
          ))}
        </motion.div>
      </section>
    </div>
  );
}
