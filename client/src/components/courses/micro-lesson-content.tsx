import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, BookOpen, CheckCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { InlineQuiz } from "./inline-quiz";
import { DifficultyLevelSwitcher } from "./difficulty-level-switcher";

interface MicroLessonSection {
  id: string;
  title: string;
  content: string;
  estimatedMinutes: number;
  type: 'content' | 'quiz' | 'exercise';
  quiz?: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

interface MicroLessonContentProps {
  lesson: {
    id: number;
    title: string;
    content: string;
    estimatedDuration: number;
  };
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  onDifficultyChange: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  onSectionComplete: (sectionId: string) => void;
  onQuizAnswer: (questionId: string, isCorrect: boolean) => void;
}

export function MicroLessonContent({ 
  lesson, 
  difficultyLevel, 
  onDifficultyChange,
  onSectionComplete,
  onQuizAnswer
}: MicroLessonContentProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // Разбиваем урок на микросекции
  const microSections: MicroLessonSection[] = [
    {
      id: `${lesson.id}-intro`,
      title: "Введение",
      content: getAdaptiveContent(lesson.content, 'intro', difficultyLevel),
      estimatedMinutes: 2,
      type: 'content'
    },
    {
      id: `${lesson.id}-main`,
      title: "Основной материал",
      content: getAdaptiveContent(lesson.content, 'main', difficultyLevel),
      estimatedMinutes: 4,
      type: 'content'
    },
    {
      id: `${lesson.id}-quiz`,
      title: "Проверка понимания",
      content: "",
      estimatedMinutes: 2,
      type: 'quiz',
      quiz: {
        id: `quiz-${lesson.id}`,
        question: getAdaptiveQuizQuestion(lesson.title, difficultyLevel),
        options: getAdaptiveQuizOptions(lesson.title, difficultyLevel),
        correctAnswer: 0,
        explanation: getAdaptiveQuizExplanation(lesson.title, difficultyLevel),
        difficulty: difficultyLevel
      }
    },
    {
      id: `${lesson.id}-summary`,
      title: "Заключение",
      content: getAdaptiveContent(lesson.content, 'summary', difficultyLevel),
      estimatedMinutes: 1,
      type: 'content'
    }
  ];

  const currentMicroSection = microSections[currentSection];
  const progress = ((currentSection + 1) / microSections.length) * 100;

  const handleSectionComplete = () => {
    const sectionId = currentMicroSection.id;
    setCompletedSections(prev => new Set([...Array.from(prev), sectionId]));
    onSectionComplete(sectionId);
  };

  const handleNextSection = () => {
    handleSectionComplete();
    if (currentSection < microSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with progress and difficulty switcher */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <BookOpen className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
            <p className="text-sm text-white/60">
              Микроурок {currentSection + 1} из {microSections.length}
            </p>
          </div>
        </div>
        
        <DifficultyLevelSwitcher
          currentLevel={difficultyLevel}
          onLevelChange={onDifficultyChange}
        />
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/60">
          <span>Прогресс урока</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current section */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              {completedSections.has(currentMicroSection.id) && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              {currentMicroSection.title}
            </CardTitle>
            <Badge variant="outline" className="border-white/20 text-white/70">
              <Clock className="w-3 h-3 mr-1" />
              {currentMicroSection.estimatedMinutes} мин
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentMicroSection.type === 'content' && (
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>
                {currentMicroSection.content}
              </ReactMarkdown>
            </div>
          )}

          {currentMicroSection.type === 'quiz' && currentMicroSection.quiz && (
            <InlineQuiz
              question={currentMicroSection.quiz}
              onAnswer={onQuizAnswer}
            />
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handlePrevSection}
              disabled={currentSection === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Предыдущий
            </Button>

            <div className="flex items-center gap-2">
              {microSections.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSection
                      ? 'bg-blue-400'
                      : index < currentSection
                      ? 'bg-green-400'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNextSection}
              disabled={currentSection === microSections.length - 1}
              className="flex items-center gap-2"
            >
              Следующий
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Utility functions for adaptive content
function getAdaptiveContent(originalContent: string, section: string, difficulty: string): string {
  const contentMap = {
    intro: {
      beginner: "Простое введение в тему с базовыми концепциями.",
      intermediate: "Стандартное введение с ключевыми понятиями.",
      advanced: "Техническое введение с углубленным анализом."
    },
    main: {
      beginner: originalContent.slice(0, Math.floor(originalContent.length * 0.6)),
      intermediate: originalContent,
      advanced: originalContent + "\n\n**Дополнительные технические детали и продвинутые концепции.**"
    },
    summary: {
      beginner: "Основные выводы в простой форме.",
      intermediate: "Ключевые моменты и практические применения.",
      advanced: "Глубокий анализ и связи с другими концепциями."
    }
  };

  return contentMap[section as keyof typeof contentMap]?.[difficulty as keyof typeof contentMap.intro] || originalContent;
}

function getAdaptiveQuizQuestion(lessonTitle: string, difficulty: string): string {
  const questions = {
    beginner: `Что является основной идеей темы "${lessonTitle}"?`,
    intermediate: `Как применить концепции из "${lessonTitle}" на практике?`,
    advanced: `Каковы продвинутые аспекты и ограничения "${lessonTitle}"?`
  };
  
  return questions[difficulty as keyof typeof questions] || questions.intermediate;
}

function getAdaptiveQuizOptions(lessonTitle: string, difficulty: string): string[] {
  return [
    "Правильный ответ (адаптирован под уровень)",
    "Неправильный вариант 1",
    "Неправильный вариант 2",
    "Неправильный вариант 3"
  ];
}

function getAdaptiveQuizExplanation(lessonTitle: string, difficulty: string): string {
  const explanations = {
    beginner: "Это базовое объяснение концепции простыми словами.",
    intermediate: "Это стандартное объяснение с практическими примерами.",
    advanced: "Это углубленное объяснение с техническими деталями и связями."
  };
  
  return explanations[difficulty as keyof typeof explanations] || explanations.intermediate;
}