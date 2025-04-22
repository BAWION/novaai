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
  type UserGoal
} from "@/lib/constants";
import { ParticlesBackground } from "@/components/particles-background";
import { useUserProfile } from "@/context/user-profile-context";

export default function Onboarding() {
  const [, navigate] = useLocation();
  const { updateUserProfile } = useUserProfile();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [progress, setProgress] = useState(20);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showComplete, setShowComplete] = useState(false);

  const totalQuestions = onboardingQuestions.length;

  useEffect(() => {
    setProgress(calculateProgress(currentQuestionIndex + 1, totalQuestions));
  }, [currentQuestionIndex, totalQuestions]);

  const handleOptionSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        // Show completion when all questions are answered
        setShowComplete(true);
      }
    }, 500);
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
    // Process and save the user's answers
    const profileData = {
      role: answers.role as UserRole,
      pythonLevel: parseInt(answers.python || "1") as SkillLevel,
      experience: answers.experience as AIExperience,
      interest: answers.interest as UserInterest,
      goal: answers.goal as UserGoal,
      recommendedTrack: 'zero-to-hero' // This would normally be calculated from the answers
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
                            isSelected={answers[currentQuestion.id] === option.value}
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
                      answers[currentQuestion.id] ? "opacity-100" : "opacity-50 pointer-events-none"
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
