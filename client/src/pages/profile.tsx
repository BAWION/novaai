import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/context/user-profile-context";
import { UserRole, UserInterest } from "@/lib/constants";
import SkillTracker from "@/components/skills/SkillTracker";
import { useLocation } from "wouter";

// Helper functions for role and interest titles
function getRoleTitle(role: UserRole): string {
  switch (role) {
    case "student": return "Студент";
    case "professional": return "Профессионал";
    case "teacher": return "Преподаватель";
    case "researcher": return "Исследователь";
    default: return "Специалист";
  }
}

function getInterestTitle(interest: UserInterest | string): string {
  switch (interest) {
    case "machine-learning": return "машинному обучению";
    case "computer-vision": return "компьютерному зрению";
    case "data-science": return "анализу данных";
    case "nlp": 
    case "natural-language-processing": return "обработке естественного языка";
    case "ethics":
    case "ai-ethics": return "этике ИИ";
    case "neural-networks":
    case "deep-learning": return "глубокому обучению";
    case "robotics": return "робототехнике";
    case "law": return "правовым аспектам ИИ";
    case "reinforcement-learning": return "обучению с подкреплением";
    default: return "технологиям ИИ";
  }
}

// Sample certificate data
interface Certificate {
  id: string;
  title: string;
  issueDate: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  nftId?: string;
}

const sampleCertificates: Certificate[] = [
  {
    id: "cert-001",
    title: "Основы машинного обучения",
    issueDate: "2025-03-15",
    courseId: "course-100",
    courseName: "ML для начинающих",
    instructorName: "Анна Смирнова",
    nftId: "nft-001"
  },
  {
    id: "cert-002",
    title: "Python для Data Science",
    issueDate: "2025-02-05",
    courseId: "course-101",
    courseName: "Python для Data Science",
    instructorName: "Дмитрий Иванов"
  }
];

// Sample course completion data
interface CourseCompletion {
  id: string;
  courseId: string;
  courseName: string;
  completionDate: string;
  grade: string;
  certificateId?: string;
}

const sampleCompletions: CourseCompletion[] = [
  {
    id: "comp-001",
    courseId: "course-100",
    courseName: "ML для начинающих",
    completionDate: "2025-03-15",
    grade: "92/100",
    certificateId: "cert-001"
  },
  {
    id: "comp-002",
    courseId: "course-101",
    courseName: "Python для Data Science",
    completionDate: "2025-02-05",
    grade: "95/100",
    certificateId: "cert-002"
  },
  {
    id: "comp-003",
    courseId: "course-102",
    courseName: "Математика для ML",
    completionDate: "2025-01-20",
    grade: "89/100"
  }
];

export default function Profile() {
  const { userProfile } = useUserProfile();
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [editMode, setEditMode] = useState(false);
  
  const [profileData, setProfileData] = useState({
    displayName: userProfile?.displayName || "Пользователь",
    bio: userProfile?.metadata?.demographic ? 
      `${getRoleTitle(userProfile.role)} с интересом к ${getInterestTitle(userProfile.interest)}` :
      "Data Scientist и ML-инженер с интересом к NLP и компьютерному зрению. Изучаю глубокое обучение и трансформеры.",
    goals: userProfile?.metadata?.specificNeeds?.specificGoals || 
      "Освоить продвинутые методы глубокого обучения и применить их в собственных проектах.",
    github: "github.com/user",
    linkedin: "linkedin.com/in/user",
    website: "user.dev"
  });

  // Helpers
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateOverallProgress = () => {
    return 68;
  };

  const handleProfileUpdate = () => {
    setEditMode(false);
  };

  return (
    <DashboardLayout 
      title="Профиль" 
      subtitle="Управление профилем, достижения и сертификаты"
    >
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="certificates">Сертификаты</TabsTrigger>
          <TabsTrigger value="courses">Курсы</TabsTrigger>
          <TabsTrigger value="achievements">Достижения</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile summary */}
            <div className="w-full lg:w-1/3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] p-1 mb-4">
                      <div className="w-full h-full rounded-full overflow-hidden">
                        <img 
                          src="https://i.pravatar.cc/150?img=5" 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {profileData.displayName}
                    </h3>
                    <p className="text-white/70 text-sm mb-4">
                      {profileData.bio}
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex space-x-3 mb-4">
                      <a href={`https://${profileData.github}`} target="_blank" rel="noopener noreferrer" 
                         className="text-white/60 hover:text-[#B28DFF] transition-colors">
                        <i className="fab fa-github text-lg"></i>
                      </a>
                      <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer"
                         className="text-white/60 hover:text-[#2EBAE1] transition-colors">
                        <i className="fab fa-linkedin text-lg"></i>
                      </a>
                      <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer"
                         className="text-white/60 hover:text-[#B28DFF] transition-colors">
                        <i className="fas fa-globe text-lg"></i>
                      </a>
                    </div>

                    <button
                      onClick={() => setEditMode(!editMode)}
                      className="w-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg font-medium transition duration-300"
                    >
                      Редактировать профиль
                    </button>
                  </div>
                </Glassmorphism>
              </motion.div>
            </div>

            {/* Stats and progress */}
            <div className="w-full lg:w-2/3 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Glassmorphism className="p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4">Общий прогресс</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-white/70 mb-2">
                        <span>Завершено курсов</span>
                        <span>{sampleCompletions.length}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${calculateOverallProgress()}%` }}
                        ></div>
                      </div>
                      <div className="text-right text-xs text-white/50 mt-1">
                        {calculateOverallProgress()}% завершено
                      </div>
                    </div>
                    <div className="ml-8">
                      <ProgressRing 
                        percent={calculateOverallProgress()} 
                        size={80} 
                        strokeWidth={6}
                        className="text-[#6E3AFF]"
                      />
                    </div>
                  </div>
                </Glassmorphism>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Glassmorphism className="p-6 rounded-xl">
                  <h4 className="text-lg font-semibold text-white mb-4">Цели обучения</h4>
                  <p className="text-white/70 text-sm">
                    {profileData.goals}
                  </p>
                </Glassmorphism>
              </motion.div>

              {/* Skills tracking */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white">Отслеживание навыков</h4>
                    <button className="text-[#B28DFF] hover:text-[#D2B8FF] text-sm">
                      Посмотреть все
                    </button>
                  </div>
                  <SkillTracker />
                </Glassmorphism>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Glassmorphism className="p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-6">Мои сертификаты</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sampleCertificates.map((cert) => (
                  <div key={cert.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-white">{cert.title}</h5>
                      {cert.nftId && (
                        <span className="text-xs bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white px-2 py-1 rounded">
                          NFT
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm mb-2">{cert.courseName}</p>
                    <p className="text-white/50 text-xs">
                      Выдан {formatDate(cert.issueDate)} • {cert.instructorName}
                    </p>
                  </div>
                ))}
              </div>
            </Glassmorphism>
          </motion.div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Glassmorphism className="p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-6">Завершенные курсы</h4>
              <div className="space-y-4">
                {sampleCompletions.map((completion) => (
                  <div key={completion.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-white">{completion.courseName}</h5>
                        <p className="text-white/50 text-sm">
                          Завершен {formatDate(completion.completionDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-[#2EBAE1] font-medium">{completion.grade}</div>
                        {completion.certificateId && (
                          <div className="text-white/50 text-xs">Сертификат получен</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Glassmorphism>
          </motion.div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Glassmorphism className="p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-white mb-6">Достижения</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Sample achievements */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h5 className="font-medium text-white mb-1">Первый курс</h5>
                  <p className="text-white/50 text-xs">Завершили первый курс</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">📚</div>
                  <h5 className="font-medium text-white mb-1">Книголюб</h5>
                  <p className="text-white/50 text-xs">Изучили 3+ курса</p>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <h5 className="font-medium text-white mb-1">Отличник</h5>
                  <p className="text-white/50 text-xs">Средняя оценка 90+</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🔥</div>
                  <h5 className="font-medium text-white mb-1">На взводе</h5>
                  <p className="text-white/50 text-xs">7 дней подряд</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">🎓</div>
                  <h5 className="font-medium text-white mb-1">Выпускник</h5>
                  <p className="text-white/50 text-xs">Получили сертификат</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-2">💎</div>
                  <h5 className="font-medium text-white mb-1">NFT коллектор</h5>
                  <p className="text-white/50 text-xs">Собрали NFT-сертификат</p>
                </div>
              </div>
            </Glassmorphism>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}