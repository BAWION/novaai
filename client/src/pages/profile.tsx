import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/context/user-profile-context";
import { UserRole, UserInterest } from "@/lib/constants";
import { SkillsDnaProfile } from "@/components/skills-dna-profile";

// Вспомогательные функции для получения русских названий ролей и интересов
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
  nftLink?: string;
  imageUrl: string;
}

// Sample course completion data
interface CourseCompletion {
  id: string;
  courseId: string;
  courseName: string;
  completionDate: string;
  grade: string;
  certificateId?: string;
}

// Sample data - in a real app, this would come from an API
const SAMPLE_CERTIFICATES: Certificate[] = [
  {
    id: "cert-001",
    title: "Machine Learning Fundamentals",
    issueDate: "2025-03-15",
    courseId: "course-103",
    courseName: "ML Fundamentals",
    instructorName: "Dr. Анна Петрова",
    nftId: "0x123f681a...",
    nftLink: "https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/1",
    imageUrl: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "cert-002",
    title: "Python для Data Science",
    issueDate: "2025-02-05",
    courseId: "course-101",
    courseName: "Python for DS",
    instructorName: "Максим Иванов",
    nftId: "0x456a891b...",
    nftLink: "https://opensea.io/assets/0x495f947276749ce646f68ac8c248420045cb7b5e/2",
    imageUrl: "https://i.pravatar.cc/150?img=4"
  }
];

const SAMPLE_COURSES: CourseCompletion[] = [
  {
    id: "comp-001",
    courseId: "course-103",
    courseName: "Machine Learning Fundamentals",
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
    // In a real app, this would be calculated from course completion data
    return 68;
  };

  const handleProfileUpdate = () => {
    // In a real app, this would send an API request
    setEditMode(false);
    // Here we would update the profile data on the server
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
                    
                    <h2 className="font-orbitron text-xl font-bold mb-1">
                      {profileData.displayName || 'Пользователь'}
                    </h2>
                    <div className="px-3 py-1 text-xs rounded-full bg-[#6E3AFF]/20 text-[#B28DFF] mb-4">
                      {userProfile?.role === 'student' ? 'Студент' : 
                       userProfile?.role === 'professional' ? 'Профессионал' :
                       userProfile?.role === 'teacher' ? 'Преподаватель' : 
                       'Исследователь'}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 w-full mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-orbitron">3</div>
                        <div className="text-white/60 text-xs">Курсы</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-orbitron">2</div>
                        <div className="text-white/60 text-xs">Сертификаты</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-orbitron">8</div>
                        <div className="text-white/60 text-xs">Бейджи</div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center mb-6">
                      {userProfile?.metadata?.technicalBackground?.programmingLanguages?.includes('python') && (
                        <span className="px-2 py-1 text-xs rounded-full bg-white/10">Python</span>
                      )}
                      {userProfile?.metadata?.interests?.primary === 'machine-learning' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-white/10">Machine Learning</span>
                      )}
                      {userProfile?.metadata?.interests?.primary === 'deep-learning' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-white/10">Deep Learning</span>
                      )}
                      {userProfile?.metadata?.interests?.subdomains?.includes('nlp') && (
                        <span className="px-2 py-1 text-xs rounded-full bg-white/10">NLP</span>
                      )}
                      {userProfile?.metadata?.interests?.subdomains?.includes('computer-vision') && (
                        <span className="px-2 py-1 text-xs rounded-full bg-white/10">Computer Vision</span>
                      )}
                      {userProfile?.metadata?.technicalBackground?.programmingLanguages?.includes('tensorflow') && (
                        <span className="px-2 py-1 text-xs rounded-full bg-white/10">TensorFlow</span>
                      )}
                      {userProfile?.metadata?.technicalBackground?.programmingLanguages?.includes('pytorch') && (
                        <span className="px-2 py-1 text-xs rounded-full bg-white/10">PyTorch</span>
                      )}
                      {!userProfile?.metadata && (
                        <>
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10">Python</span>
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10">TensorFlow</span>
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10">PyTorch</span>
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10">NLP</span>
                          <span className="px-2 py-1 text-xs rounded-full bg-white/10">Data Science</span>
                        </>
                      )}
                    </div>
                    
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg w-full transition duration-300"
                      >
                        <i className="fas fa-edit mr-2"></i> Редактировать профиль
                      </button>
                    ) : (
                      <div className="flex gap-2 w-full">
                        <button
                          onClick={() => setEditMode(false)}
                          className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg w-1/2 transition duration-300"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={handleProfileUpdate}
                          className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg w-1/2 transition duration-300"
                        >
                          Сохранить
                        </button>
                      </div>
                    )}
                  </div>
                </Glassmorphism>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4"
              >
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="font-medium mb-4">Социальные сети</h3>
                  {!editMode ? (
                    <div className="space-y-3">
                      {profileData.github && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                            <i className="fab fa-github"></i>
                          </div>
                          <a href={`https://${profileData.github}`} target="_blank" rel="noopener noreferrer" className="text-[#B28DFF] hover:text-[#D2B8FF]">
                            {profileData.github}
                          </a>
                        </div>
                      )}
                      {profileData.linkedin && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                            <i className="fab fa-linkedin-in"></i>
                          </div>
                          <a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-[#B28DFF] hover:text-[#D2B8FF]">
                            {profileData.linkedin}
                          </a>
                        </div>
                      )}
                      {profileData.website && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                            <i className="fas fa-globe"></i>
                          </div>
                          <a href={`https://${profileData.website}`} target="_blank" rel="noopener noreferrer" className="text-[#B28DFF] hover:text-[#D2B8FF]">
                            {profileData.website}
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                          <i className="fab fa-github"></i>
                        </div>
                        <input
                          type="text"
                          value={profileData.github}
                          onChange={(e) => setProfileData({ ...profileData, github: e.target.value })}
                          className="flex-1 bg-space-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                          placeholder="GitHub URL"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                          <i className="fab fa-linkedin-in"></i>
                        </div>
                        <input
                          type="text"
                          value={profileData.linkedin}
                          onChange={(e) => setProfileData({ ...profileData, linkedin: e.target.value })}
                          className="flex-1 bg-space-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                          placeholder="LinkedIn URL"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70">
                          <i className="fas fa-globe"></i>
                        </div>
                        <input
                          type="text"
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          className="flex-1 bg-space-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                          placeholder="Personal website"
                        />
                      </div>
                    </div>
                  )}
                </Glassmorphism>
              </motion.div>
            </div>
            
            {/* Main content */}
            <div className="w-full lg:w-2/3 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Обо мне</h3>
                    {editMode && (
                      <div className="text-xs text-white/50">
                        <i className="fas fa-info-circle mr-1"></i> Максимум 200 символов
                      </div>
                    )}
                  </div>
                  
                  {!editMode ? (
                    <p className="text-white/80 leading-relaxed">
                      {profileData.bio}
                    </p>
                  ) : (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full h-24 bg-space-800/50 border border-white/10 rounded-lg px-4 py-3 text-white/80 resize-none"
                      maxLength={200}
                      placeholder="Расскажите о себе..."
                    />
                  )}
                </Glassmorphism>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Glassmorphism className="p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Мои цели</h3>
                    {editMode && (
                      <div className="text-xs text-white/50">
                        <i className="fas fa-info-circle mr-1"></i> Чего вы хотите достичь?
                      </div>
                    )}
                  </div>
                  
                  {!editMode ? (
                    <p className="text-white/80 leading-relaxed">
                      {profileData.goals}
                    </p>
                  ) : (
                    <textarea
                      value={profileData.goals}
                      onChange={(e) => setProfileData({ ...profileData, goals: e.target.value })}
                      className="w-full h-24 bg-space-800/50 border border-white/10 rounded-lg px-4 py-3 text-white/80 resize-none"
                      placeholder="Ваши цели обучения..."
                    />
                  )}
                </Glassmorphism>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="font-medium mb-4">Общий прогресс</h3>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-40 h-40 relative">
                      <ProgressRing 
                        percent={calculateOverallProgress()} 
                        size={160} 
                        strokeWidth={8}
                        className="text-[#6E3AFF]"
                      >
                        <div className="text-center">
                          <div className="text-3xl font-orbitron">{calculateOverallProgress()}%</div>
                          <div className="text-xs text-white/60">завершено</div>
                        </div>
                      </ProgressRing>
                    </div>
                    
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <div>Python для Data Science</div>
                            <div className="text-white/60">100%</div>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <div>Математика для ML</div>
                            <div className="text-white/60">100%</div>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-full bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <div>Machine Learning Fundamentals</div>
                            <div className="text-white/60">85%</div>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-[#6E3AFF] rounded-full"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <div>Deep Learning с PyTorch</div>
                            <div className="text-white/60">25%</div>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-1/4 bg-[#2EBAE1] rounded-full"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1 text-sm">
                            <div>NLP и трансформеры</div>
                            <div className="text-white/60">0%</div>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-0 bg-white/30 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Glassmorphism>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Glassmorphism className="p-6 rounded-xl">
                  <h3 className="font-medium mb-4">Рекомендуемые следующие шаги</h3>
                  <div className="space-y-4">
                    <div className="flex bg-space-800/60 hover:bg-space-800/80 transition-colors rounded-lg p-4 cursor-pointer">
                      <div className="w-12 h-12 rounded-lg bg-[#6E3AFF]/20 flex items-center justify-center text-[#B28DFF] mr-4">
                        <i className="fas fa-tasks"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Завершите курс по Machine Learning</h4>
                        <p className="text-white/60 text-sm mt-1">
                          Осталось всего 15% до получения сертификата!
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex bg-space-800/60 hover:bg-space-800/80 transition-colors rounded-lg p-4 cursor-pointer">
                      <div className="w-12 h-12 rounded-lg bg-[#2EBAE1]/20 flex items-center justify-center text-[#8BE0F7] mr-4">
                        <i className="fas fa-medal"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Получите бейдж «Solver»</h4>
                        <p className="text-white/60 text-sm mt-1">
                          Решите еще 2 задачи ежедневных вызовов для получения бейджа.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex bg-space-800/60 hover:bg-space-800/80 transition-colors rounded-lg p-4 cursor-pointer">
                      <div className="w-12 h-12 rounded-lg bg-[#FF3A8C]/20 flex items-center justify-center text-[#FF8CC6] mr-4">
                        <i className="fas fa-network-wired"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Начните курс по Deep Learning</h4>
                        <p className="text-white/60 text-sm mt-1">
                          На основе ваших интересов рекомендуем углубиться в нейронные сети.
                        </p>
                      </div>
                    </div>
                  </div>
                </Glassmorphism>
              </motion.div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="certificates" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-xl font-semibold">
              Мои сертификаты
            </h2>
            <select className="bg-space-800/50 border-white/10 px-3 py-2 rounded-lg text-sm text-white/70">
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SAMPLE_CERTIFICATES.map((cert) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Glassmorphism className="p-0 rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-[#0A0E17]/90 to-[#0A0E17]/70 relative overflow-hidden">
                    <img 
                      src={cert.imageUrl} 
                      alt={cert.title} 
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0E17]"></div>
                    <div className="absolute top-4 left-4 right-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center text-xs mb-1">
                            <i className="fas fa-university mr-1 text-white/60"></i>
                            <span className="text-white/80">NovaAI University</span>
                          </div>
                          <h3 className="text-lg font-medium">{cert.title}</h3>
                        </div>
                        <div className="bg-[#6E3AFF]/20 p-2 rounded-full">
                          <i className="fas fa-award text-[#B28DFF]"></i>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <div className="text-xs text-white/70">
                        Выдан: {formatDate(cert.issueDate)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-sm text-white/70">Инструктор</div>
                        <div>{cert.instructorName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-white/70">Курс</div>
                        <div>{cert.courseName}</div>
                      </div>
                    </div>
                    
                    {cert.nftId && (
                      <div className="p-3 bg-space-800/60 rounded-lg mb-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <i className="fas fa-certificate text-yellow-400 mr-2"></i>
                            <span className="text-sm font-medium">NFT Сертификат</span>
                          </div>
                          <div className="text-xs text-white/60 truncate max-w-[120px]">
                            {cert.nftId}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition duration-300 text-sm">
                        Скачать PDF
                      </button>
                      {cert.nftLink && (
                        <a 
                          href={cert.nftLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg transition duration-300 text-sm text-center"
                        >
                          Просмотр NFT
                        </a>
                      )}
                    </div>
                  </div>
                </Glassmorphism>
              </motion.div>
            ))}
          </div>
          
          {SAMPLE_CERTIFICATES.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">
                <i className="fas fa-certificate"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">У вас пока нет сертификатов</h3>
              <p className="text-white/60 mb-4">
                Завершите курс, чтобы получить свой первый сертификат
              </p>
              <button className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-6 rounded-lg transition duration-300">
                Перейти к курсам
              </button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-xl font-semibold">
              Мои курсы
            </h2>
            <div className="flex gap-3">
              <select className="bg-space-800/50 border-white/10 px-3 py-2 rounded-lg text-sm text-white/70">
                <option value="all">Все курсы</option>
                <option value="completed">Завершенные</option>
                <option value="in-progress">В процессе</option>
              </select>
              <select className="bg-space-800/50 border-white/10 px-3 py-2 rounded-lg text-sm text-white/70">
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Glassmorphism className="rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-white/70 border-b border-white/10 bg-space-800/50">
                    <th className="py-4 px-6">Название курса</th>
                    <th className="py-4 px-6">Дата завершения</th>
                    <th className="py-4 px-6">Оценка</th>
                    <th className="py-4 px-6">Сертификат</th>
                    <th className="py-4 px-6">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_COURSES.map((course) => (
                    <motion.tr 
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium">{course.courseName}</div>
                        <div className="text-xs text-white/50">ID: {course.courseId}</div>
                      </td>
                      <td className="py-4 px-6">
                        {formatDate(course.completionDate)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono">{course.grade}</span>
                      </td>
                      <td className="py-4 px-6">
                        {course.certificateId ? (
                          <span className="text-green-400">
                            <i className="fas fa-check-circle mr-1"></i> Получен
                          </span>
                        ) : (
                          <span className="text-white/40">
                            <i className="fas fa-minus-circle mr-1"></i> Нет
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <button className="bg-white/10 hover:bg-white/20 text-white py-1 px-3 rounded-lg text-xs transition duration-300">
                            Детали
                          </button>
                          {course.certificateId && (
                            <button className="bg-[#6E3AFF]/20 hover:bg-[#6E3AFF]/30 text-[#B28DFF] py-1 px-3 rounded-lg text-xs transition duration-300">
                              Сертификат
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </Glassmorphism>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-orbitron text-xl font-semibold">
              Достижения и бейджи
            </h2>
            <select className="bg-space-800/50 border-white/10 px-3 py-2 rounded-lg text-sm text-white/70">
              <option value="all">Все категории</option>
              <option value="courses">Курсы</option>
              <option value="challenges">Вызовы</option>
              <option value="community">Сообщество</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Earned badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Glassmorphism className="p-6 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 mx-auto flex items-center justify-center mb-3">
                  <i className="fas fa-crown text-2xl text-white"></i>
                </div>
                <h3 className="text-center font-medium text-lg mb-1">Первопроходец</h3>
                <p className="text-center text-white/60 text-sm mb-3">
                  Завершите 3 курса из разных областей ИИ
                </p>
                <div className="text-center text-xs text-white/50">
                  Получен 15 апреля 2025
                </div>
              </Glassmorphism>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Glassmorphism className="p-6 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto flex items-center justify-center mb-3">
                  <i className="fas fa-brain text-2xl text-white"></i>
                </div>
                <h3 className="text-center font-medium text-lg mb-1">Мыслитель</h3>
                <p className="text-center text-white/60 text-sm mb-3">
                  Применяйте продвинутые концепции ML в проектах
                </p>
                <div className="text-center text-xs text-white/50">
                  Получен 28 марта 2025
                </div>
              </Glassmorphism>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Glassmorphism className="p-6 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 mx-auto flex items-center justify-center mb-3">
                  <i className="fas fa-code text-2xl text-white"></i>
                </div>
                <h3 className="text-center font-medium text-lg mb-1">Кодер</h3>
                <p className="text-center text-white/60 text-sm mb-3">
                  Напишите 10 успешных лабораторных работ
                </p>
                <div className="text-center text-xs text-white/50">
                  Получен 10 марта 2025
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* In-progress badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Glassmorphism className="p-6 rounded-xl border border-white/10 opacity-70">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-600/30 mx-auto flex items-center justify-center mb-3">
                  <i className="fas fa-flask text-2xl text-white/50"></i>
                </div>
                <h3 className="text-center font-medium text-lg mb-1">Исследователь</h3>
                <p className="text-center text-white/60 text-sm mb-3">
                  Проведите 5 экспериментов с моделями в LabHub
                </p>
                <div className="w-full bg-white/10 h-2 rounded-full mb-2">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full w-3/5"></div>
                </div>
                <div className="text-center text-xs text-white/50">
                  Прогресс: 3/5
                </div>
              </Glassmorphism>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Glassmorphism className="p-6 rounded-xl border border-white/10 opacity-70">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500/30 to-orange-600/30 mx-auto flex items-center justify-center mb-3">
                  <i className="fas fa-fire text-2xl text-white/50"></i>
                </div>
                <h3 className="text-center font-medium text-lg mb-1">Огненный Streak</h3>
                <p className="text-center text-white/60 text-sm mb-3">
                  Занимайтесь 30 дней подряд
                </p>
                <div className="w-full bg-white/10 h-2 rounded-full mb-2">
                  <div className="bg-gradient-to-r from-red-500 to-orange-600 h-full rounded-full w-2/5"></div>
                </div>
                <div className="text-center text-xs text-white/50">
                  Прогресс: 12/30
                </div>
              </Glassmorphism>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              <Glassmorphism className="p-6 rounded-xl border border-white/10 opacity-70">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/30 to-yellow-600/30 mx-auto flex items-center justify-center mb-3">
                  <i className="fas fa-puzzle-piece text-2xl text-white/50"></i>
                </div>
                <h3 className="text-center font-medium text-lg mb-1">Решатель</h3>
                <p className="text-center text-white/60 text-sm mb-3">
                  Решите 20 ежедневных вызовов
                </p>
                <div className="w-full bg-white/10 h-2 rounded-full mb-2">
                  <div className="bg-gradient-to-r from-amber-500 to-yellow-600 h-full rounded-full w-4/5"></div>
                </div>
                <div className="text-center text-xs text-white/50">
                  Прогресс: 18/20
                </div>
              </Glassmorphism>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}