import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { NovaAssistant } from "@/components/nova-assistant";
import { OptionButton } from "@/components/option-button";
import { calculateProgress } from "@/lib/utils";
import { 
  onboardingQuestions,
  type UserRole,
  type SkillLevel,
  type AIExperience,
  type UserInterest,
  type UserGoal,
  type CourseTrack
} from "@/lib/constants";
import { ParticlesBackground } from "@/components/particles-background";
import { useUserProfile } from "@/context/user-profile-context";

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { updateUserProfile } = useUserProfile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(20);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [showComplete, setShowComplete] = useState(false);

  const totalQuestions = onboardingQuestions.length;

  useEffect(() => {
    setProgress(calculateProgress(currentQuestionIndex + 1, totalQuestions));
  }, [currentQuestionIndex, totalQuestions]);

  const handleOptionSelect = (questionId: string, value: string) => {
    const currentQuestion = onboardingQuestions[currentQuestionIndex];
    
    if (currentQuestion.multiSelect) {
      // Для вопросов с множественным выбором
      setSelectedOptions(prev => {
        const currentSelected = prev[questionId] || [];
        const updatedSelected = currentSelected.includes(value)
          ? currentSelected.filter(v => v !== value) // Если уже выбран, удаляем
          : [...currentSelected, value]; // Если не выбран, добавляем
          
        return { ...prev, [questionId]: updatedSelected };
      });
      
      // Обновляем ответы сразу после выбора новых значений
      setAnswers(prev => {
        // Получаем обновленный список выбранных опций
        const currentSelected = prev[questionId] || [];
        let updatedSelected: string[];
        
        if (Array.isArray(currentSelected)) {
          updatedSelected = currentSelected.includes(value)
            ? currentSelected.filter(v => v !== value) // Если уже выбран, удаляем
            : [...currentSelected, value]; // Если не выбран, добавляем
        } else {
          updatedSelected = [value]; // Если ответ не массив (первый выбор), создаем массив
        }
        
        return { ...prev, [questionId]: updatedSelected };
      });
    } else {
      // Для вопросов с одиночным выбором
      setAnswers(prev => ({ ...prev, [questionId]: value }));
      
      // Автоматический переход к следующему вопросу
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // Show completion when all questions are answered
          setShowComplete(true);
        }
      }, 500);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (Object.keys(answers).length === totalQuestions) {
      setShowComplete(true);
    }
  };

  const handleViewRoadmap = () => {
    // Обрабатываем ответы и определяем рекомендуемый трек обучения
    const calculateRecommendedTrack = () => {
      const pythonLevel = typeof answers.python === 'string' ? parseInt(answers.python || "0") : 0;
      const experience = answers.experience as string;
      
      if (pythonLevel <= 1 && experience === 'beginner') {
        return 'zero-to-hero' as CourseTrack; // Для полных новичков
      } else if (pythonLevel >= 3 && ['experienced', 'expert'].includes(experience)) {
        return 'research-ai' as CourseTrack; // Для опытных
      } else if (answers.interest === 'nlp' || answers.interest === 'natural-language-processing') {
        return 'nlp-expert' as CourseTrack; // Для интересующихся NLP
      } else {
        return 'applied-ds' as CourseTrack; // По умолчанию практический DS
      }
    };
    
    // Собираем метаданные диагностики для более точной персонализации
    const diagnosticData: Record<string, any> = {};
    Object.entries(answers).forEach(([key, value]) => {
      if (key !== 'role' && key !== 'python' && key !== 'experience' && 
          key !== 'interest' && key !== 'goal') {
        diagnosticData[key] = value;
      }
    });
    
    // Собираем профиль пользователя
    const profileData = {
      role: answers.role as string as UserRole,
      pythonLevel: typeof answers.python === 'string' ? parseInt(answers.python || "1") as SkillLevel : 1,
      experience: answers.experience as string as AIExperience,
      interest: answers.interest as string as UserInterest,
      goal: answers.goal as string as UserGoal,
      recommendedTrack: calculateRecommendedTrack(),
      completedOnboarding: true, 
      streakDays: 0,
      metadata: diagnosticData // Сохраняем все ответы на диагностические вопросы
    };
    
    updateUserProfile(profileData);
    navigate("/orbital-lobby");
  };

  const currentQuestion = onboardingQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen w-full flex flex-col">
      <ParticlesBackground />

      <section className="container mx-auto px-4 min-h-[80vh] py-8 mt-16">
        <Glassmorphism className="max-w-4xl mx-auto rounded-2xl p-6 md:p-8 relative" borderGradient>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 flex flex-col items-center">
              <NovaAssistant
                currentStep={currentQuestionIndex + 1}
                totalSteps={totalQuestions}
                progress={progress}
              />
            </div>

            <div className="md:w-2/3">
              <div className="mb-6">
                <h2 className="font-orbitron text-2xl md:text-3xl font-semibold">
                  Привет! Давайте познакомимся
                </h2>
                <p className="text-white/70 mt-2">
                  Задам несколько вопросов, чтобы построить персональный план обучения
                </p>
              </div>

              {/* Onboarding questions */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {!showComplete ? (
                    <motion.div
                      key={`question-${currentQuestionIndex}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="font-space font-medium text-lg mb-3">
                        {currentQuestion.question}
                      </h3>
                      {currentQuestion.multiSelect && (
                        <div className="text-sm text-white/70 mb-2">
                          <span className="inline-flex items-center">
                            <i className="fas fa-check-square mr-1"></i> 
                            Можно выбрать несколько вариантов
                          </span>
                        </div>
                      )}
                      <div className={
                        currentQuestion.id === 'python' 
                          ? "flex flex-wrap gap-3" 
                          : "grid grid-cols-1 sm:grid-cols-2 gap-3"
                      }>
                        {currentQuestion.options.map((option) => (
                          <OptionButton
                            key={option.id}
                            text={option.text}
                            icon={option.icon}
                            value={option.value}
                            isSelected={
                              currentQuestion.multiSelect
                                ? selectedOptions[currentQuestion.id]?.includes(option.value)
                                : answers[currentQuestion.id] === option.value
                            }
                            variant={currentQuestion.id === 'python' ? "compact" : "default"}
                            onClick={(value) => handleOptionSelect(currentQuestion.id, value)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="completion"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center mb-6"
                    >
                      <div className="inline-block p-3 rounded-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] mb-4">
                        <i className="fas fa-check text-2xl"></i>
                      </div>
                      <h3 className="font-space font-medium text-xl">
                        Отлично! Анализирую данные...
                      </h3>
                      <p className="text-white/70 mt-2">
                        Создаю персонализированную карту навыков
                      </p>

                      <div className="flex justify-center mt-6">
                        <button
                          onClick={handleViewRoadmap}
                          className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-6 rounded-lg font-medium transition duration-300"
                        >
                          Посмотреть мой путь обучения
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation buttons */}
              {!showComplete && (
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handlePrevQuestion}
                    className={`${
                      currentQuestionIndex > 0 ? "opacity-100" : "opacity-0 pointer-events-none"
                    } glassmorphism px-4 py-2 rounded-lg text-white/70 hover:text-white transition-all duration-300`}
                  >
                    <i className="fas fa-arrow-left mr-2"></i>Назад
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className={`${
                      currentQuestion.multiSelect 
                        ? selectedOptions[currentQuestion.id]?.length > 0 
                          ? "opacity-100" 
                          : "opacity-50 pointer-events-none"
                        : answers[currentQuestion.id] 
                          ? "opacity-100" 
                          : "opacity-50 pointer-events-none"
                    } bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg font-medium transition duration-300`}
                  >
                    Далее<i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        </Glassmorphism>
      </section>
    </div>
  );
}
