import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Brain, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  HelpCircle,
  Lightbulb,
  Zap,
  Target,
  BarChart3
} from "lucide-react";
import { DifficultyLevelSwitcher } from "./difficulty-level-switcher";
import { InlineQuiz } from "./inline-quiz";
import { motion } from "framer-motion";

interface TutorAIFeaturesProps {
  className?: string;
}

export function TutorAIFeatures({ className = "" }: TutorAIFeaturesProps) {
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [currentMicroLesson, setCurrentMicroLesson] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState<Set<string>>(new Set());

  const microLessons = [
    {
      id: "intro-ai",
      title: "Что такое ИИ?",
      duration: 3,
      content: {
        beginner: "Искусственный интеллект (ИИ) - это технология, которая позволяет компьютерам думать и учиться как люди.",
        intermediate: "ИИ представляет собой область компьютерной науки, создающую системы способные выполнять задачи, требующие человеческого интеллекта.",
        advanced: "ИИ включает машинное обучение, нейронные сети, обработку естественного языка и компьютерное зрение для решения сложных когнитивных задач."
      }
    },
    {
      id: "ai-history",
      title: "История развития",
      duration: 4,
      content: {
        beginner: "ИИ начал развиваться в 1950-х годах, когда ученые впервые попытались создать думающие машины.",
        intermediate: "От теста Тьюринга 1950 года до современных нейронных сетей - путь длиной в 70 лет инноваций.",
        advanced: "Эволюция от символьного ИИ через экспертные системы к современным архитектурам глубокого обучения и трансформерам."
      }
    },
    {
      id: "ai-applications",
      title: "Применения ИИ",
      duration: 5,
      content: {
        beginner: "ИИ используется в поиске Google, рекомендациях YouTube, голосовых помощниках и автомобилях.",
        intermediate: "ИИ применяется в медицине, финансах, транспорте, образовании и развлечениях для автоматизации и оптимизации.",
        advanced: "От диагностики рака до автономного вождения - ИИ трансформирует отрасли через компьютерное зрение, NLP и предиктивную аналитику."
      }
    }
  ];

  const sampleQuiz = {
    id: "quiz-ai-basics",
    question: currentLevel === 'beginner' 
      ? "Что лучше всего описывает искусственный интеллект?"
      : currentLevel === 'intermediate'
      ? "Какая технология является основой современного ИИ?"
      : "Какой подход к ИИ доминирует в современных системах?",
    options: currentLevel === 'beginner'
      ? ["Компьютеры, которые думают как люди", "Очень быстрые калькуляторы", "Роботы из фильмов", "Программы для игр"]
      : currentLevel === 'intermediate'
      ? ["Машинное обучение", "Базы данных", "Облачные вычисления", "Квантовые компьютеры"]
      : ["Глубокое обучение с трансформерами", "Символьные экспертные системы", "Генетические алгоритмы", "Нечеткая логика"],
    correctAnswer: 0,
    explanation: currentLevel === 'beginner'
      ? "ИИ создает системы, которые могут решать задачи, обычно требующие человеческого мышления."
      : currentLevel === 'intermediate'
      ? "Машинное обучение позволяет системам учиться на данных без явного программирования."
      : "Современный ИИ основан на глубоких нейронных сетях, особенно архитектурах трансформеров.",
    difficulty: currentLevel
  };

  const currentLesson = microLessons[currentMicroLesson];
  const progress = ((currentMicroLesson + 1) / microLessons.length) * 100;

  const handleQuizAnswer = (questionId: string, isCorrect: boolean) => {
    setCompletedQuizzes(prev => new Set([...Array.from(prev), questionId]));
  };

  const nextLesson = () => {
    if (currentMicroLesson < microLessons.length - 1) {
      setCurrentMicroLesson(currentMicroLesson + 1);
    }
  };

  const prevLesson = () => {
    if (currentMicroLesson > 0) {
      setCurrentMicroLesson(currentMicroLesson - 1);
    }
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <Brain className="w-6 h-6 text-blue-400" />
            TutorAI-вдохновленное обучение в NovaAI University
          </CardTitle>
          <p className="text-white/70">
            Адаптивные микроуроки с ИИ-поддержкой и мгновенной обратной связью
          </p>
        </CardHeader>
      </Card>

      {/* Progress and Difficulty */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-white font-medium">Урок {currentMicroLesson + 1} из {microLessons.length}</p>
            <p className="text-sm text-white/60">{currentLesson.title}</p>
          </div>
        </div>
        
        <DifficultyLevelSwitcher
          currentLevel={currentLevel}
          onLevelChange={setCurrentLevel}
        />
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/60">
          <span>Прогресс курса</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Micro Lesson */}
      <motion.div
        key={currentMicroLesson}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                {currentLesson.title}
              </CardTitle>
              <Badge variant="outline" className="border-white/20 text-white/70">
                <Clock className="w-3 h-3 mr-1" />
                {currentLesson.duration} мин
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-white/90 text-lg leading-relaxed">
                {currentLesson.content[currentLevel]}
              </p>
            </div>

            {/* Adaptive Features Demo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-500/10 border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Микроформат</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Контент разбит на блоки 3-7 минут для лучшего усвоения
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-500/10 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Адаптивность</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Сложность материала меняется в зависимости от уровня
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-500/10 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium text-purple-400">Аналитика</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Прогресс интегрируется с Skills DNA
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={prevLesson}
                disabled={currentMicroLesson === 0}
                className="flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Предыдущий
              </Button>

              <div className="flex items-center gap-2">
                {microLessons.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentMicroLesson
                        ? 'bg-blue-400'
                        : index < currentMicroLesson
                        ? 'bg-green-400'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={nextLesson}
                disabled={currentMicroLesson === microLessons.length - 1}
                className="flex items-center gap-2"
              >
                Следующий
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inline Quiz */}
      <InlineQuiz
        question={sampleQuiz}
        onAnswer={handleQuizAnswer}
      />

      {/* Features Summary */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Реализованные TutorAI функции
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-white">✅ Уже есть:</h4>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• Микроуроки 3-7 минут</li>
                <li>• Переключатель сложности</li>
                <li>• ИИ-ассистент с контекстом</li>
                <li>• Встроенные квизы</li>
                <li>• Хлебные крошки навигации</li>
                <li>• Прогресс и аналитика</li>
                <li>• Skills DNA интеграция</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-white">🎯 Готово для продакшена:</h4>
              <ul className="text-sm text-white/70 space-y-1">
                <li>• Адаптивная подача материала</li>
                <li>• Реальные метрики в админке</li>
                <li>• Продвинутая аналитика</li>
                <li>• Полнофункциональная платформа</li>
                <li>• TutorAI-inspired UX</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}