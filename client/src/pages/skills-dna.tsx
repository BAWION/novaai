import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Dna, TrendingUp, TrendingDown, BarChart3, Zap } from "lucide-react";

// DNA Helix Animation Component
const DnaHelix = () => {
  return (
    <div className="relative w-16 h-16 mx-auto mb-4">
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <defs>
            <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B28DFF" />
              <stop offset="50%" stopColor="#8BE0F7" />
              <stop offset="100%" stopColor="#B28DFF" />
            </linearGradient>
          </defs>
          <path
            d="M12 8 Q32 16 52 8 Q32 24 12 32 Q32 40 52 48 Q32 56 12 56"
            stroke="url(#dnaGradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M52 8 Q32 16 12 8 Q32 24 52 32 Q32 40 12 48 Q32 56 52 56"
            stroke="url(#dnaGradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          {/* DNA base pairs */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.line
              key={i}
              x1={16 + i * 8}
              y1={12 + i * 10}
              x2={48 - i * 8}
              y2={12 + i * 10}
              stroke="#8BE0F7"
              strokeWidth="1"
              opacity="0.7"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
};

// Brain Activity Animation Component
const BrainActivity = () => {
  return (
    <div className="relative w-12 h-12">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full"
      />
      <Brain className="w-12 h-12 text-blue-400 relative z-10" />
      {/* Neural activity sparks */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          style={{
            top: `${20 + i * 10}%`,
            left: `${30 + i * 15}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default function SkillsDna() {
  const { user } = useAuth();

  // Get Skills DNA data
  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: [`/api/diagnosis/summary/${user?.id}`],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await apiRequest('GET', `/api/diagnosis/summary/${user.id}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id
  });

  // Get detailed progress data
  const { data: progressData, isLoading: progressLoading } = useQuery({
    queryKey: [`/api/diagnosis/progress/${user?.id}`],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await apiRequest('GET', `/api/diagnosis/progress/${user.id}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user?.id
  });

  if (skillsLoading || progressLoading) {
    return (
      <DashboardLayout 
        title="Skills DNA" 
        subtitle="Анализ вашего цифрового кода компетенций"
      >
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <DnaHelix />
            <motion.p 
              className="text-white/70"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Анализируем ваш цифровой код навыков...
            </motion.p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!skillsData?.data || !progressData?.data) {
    return (
      <DashboardLayout 
        title="Skills DNA" 
        subtitle="Ваш профиль навыков и рекомендации по обучению"
      >
        <div className="text-center py-12">
          <DnaHelix />
          <h3 className="text-white font-medium mb-2">Данные Skills DNA не найдены</h3>
          <p className="text-white/70">Пройдите диагностику, чтобы получить ваш цифровой код компетенций</p>
        </div>
      </DashboardLayout>
    );
  }

  // Process skills data
  const categories = skillsData.data;
  const skillsDetails = progressData.data;

  // Calculate overall metrics
  const totalSkills = skillsDetails.length;
  const averageProgress = skillsDetails.reduce((acc: number, skill: any) => acc + skill.progress, 0) / totalSkills;
  const topSkills = skillsDetails.sort((a: any, b: any) => b.progress - a.progress).slice(0, 5);
  const improvementAreas = skillsDetails.sort((a: any, b: any) => a.progress - b.progress).slice(0, 3);

  return (
    <DashboardLayout 
      title="Skills DNA" 
      subtitle="Ваш цифровой код компетенций и навыков"
    >
      <div className="space-y-6">
        {/* Header with DNA Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-6"
        >
          <DnaHelix />
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF] mb-2">
            Ваш уникальный профиль навыков
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Расшифровка вашего цифрового кода компетенций на основе комплексного анализа {totalSkills} навыков
          </p>
        </motion.div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-space-800/70 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <BrainActivity />
              <h3 className="text-white font-semibold mb-2">Общий прогресс</h3>
              <div className="text-3xl font-bold text-blue-400 mb-2">{Math.round(averageProgress)}%</div>
              <Progress value={averageProgress} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-space-800/70 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Навыков проанализировано</h3>
              <div className="text-3xl font-bold text-purple-400">{totalSkills}</div>
            </CardContent>
          </Card>

          <Card className="bg-space-800/70 border-green-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Категорий навыков</h3>
              <div className="text-3xl font-bold text-green-400">{Object.keys(categories).length}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-space-800/70 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Dna className="h-5 w-5 mr-2" />
                Анализ по категориям навыков
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(categories).map(([category, data]: [string, any], index) => {
                const categoryNames = {
                  'ml': 'Машинное обучение',
                  'programming': 'Программирование',
                  'soft-skills': 'Мягкие навыки',
                  'domain-knowledge': 'Предметные знания',
                  'data': 'Работа с данными'
                };
                
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="bg-space-900/50 border border-purple-500/20 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-medium">
                        {categoryNames[category as keyof typeof categoryNames] || category}
                      </h4>
                      <Badge 
                        className={`${
                          data.avgProgress >= 70 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                          data.avgProgress >= 40 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                          'bg-red-500/20 text-red-300 border-red-500/30'
                        }`}
                      >
                        {data.maxLevel === 'mastery' ? 'Мастерство' : 
                         data.maxLevel === 'application' ? 'Применение' : 'Изучение'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/70 text-sm">Средний прогресс: {data.avgProgress}%</span>
                      <span className="text-white/70 text-sm">{data.count} навыков</span>
                    </div>
                    <Progress value={data.avgProgress} className="h-2" />
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Skills and Improvement Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-space-800/70 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Ваши сильные стороны
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topSkills.map((skill: any, index: number) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white font-medium">{skill.displayName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-green-400 font-bold">{skill.progress}%</span>
                      <div className="w-16">
                        <Progress value={skill.progress} className="h-1" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Improvement Areas */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-space-800/70 border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2 text-orange-400" />
                  Области для развития
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {improvementAreas.map((skill: any, index: number) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white font-medium">{skill.displayName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-400 font-bold">{skill.progress}%</span>
                      <div className="w-16">
                        <Progress value={skill.progress} className="h-1" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}