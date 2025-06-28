import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";

interface MicroSection {
  id: string;
  title: string;
  content: string;
  estimatedMinutes: number;
  type: 'text' | 'video' | 'interactive' | 'quiz';
  completed?: boolean;
}

interface MicroLessonNavigationProps {
  sections: MicroSection[];
  lessonTitle: string;
  onSectionComplete: (sectionId: string) => void;
  onLessonComplete: () => void;
}

export function MicroLessonNavigation({ 
  sections, 
  lessonTitle, 
  onSectionComplete, 
  onLessonComplete 
}: MicroLessonNavigationProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  const currentSection = sections[currentSectionIndex];
  const progress = (completedSections.size / sections.length) * 100;
  const totalMinutes = sections.reduce((sum, section) => sum + section.estimatedMinutes, 0);

  const handleSectionComplete = () => {
    const newCompleted = new Set(completedSections);
    newCompleted.add(currentSection.id);
    setCompletedSections(newCompleted);
    onSectionComplete(currentSection.id);

    // Если все секции завершены
    if (newCompleted.size === sections.length) {
      onLessonComplete();
    }
  };

  const goToNext = () => {
    if (currentSectionIndex < sections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const getSectionIcon = (type: MicroSection['type']) => {
    switch (type) {
      case 'video': return '🎥';
      case 'interactive': return '🔧';
      case 'quiz': return '❓';
      default: return '📖';
    }
  };

  return (
    <div className="space-y-4">
      {/* Заголовок урока и общий прогресс */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{lessonTitle}</CardTitle>
            <Badge variant="outline" className="bg-white/10">
              {Math.round(progress)}% завершено
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>~{totalMinutes} минут</span>
            <span>•</span>
            <span>{sections.length} разделов</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
      </Card>

      {/* Навигация по разделам */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Разделы урока</h3>
            <span className="text-sm text-muted-foreground">
              {currentSectionIndex + 1} из {sections.length}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {sections.map((section, index) => (
              <Button
                key={section.id}
                variant={index === currentSectionIndex ? "default" : "outline"}
                size="sm"
                className={`text-xs ${
                  completedSections.has(section.id) 
                    ? "bg-green-500/20 border-green-500/30 text-green-600" 
                    : ""
                }`}
                onClick={() => setCurrentSectionIndex(index)}
              >
                {getSectionIcon(section.type)} {section.title}
                {completedSections.has(section.id) && (
                  <CheckCircle className="h-3 w-3 ml-1" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Содержимое текущего раздела */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">{getSectionIcon(currentSection.type)}</span>
                {currentSection.title}
              </CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Clock className="h-4 w-4" />
                <span>~{currentSection.estimatedMinutes} мин</span>
                {completedSections.has(currentSection.id) && (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Завершено</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
          </div>

          {/* Навигация */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentSectionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Предыдущий
            </Button>

            <div className="flex gap-2">
              {!completedSections.has(currentSection.id) && (
                <Button
                  onClick={handleSectionComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Завершить раздел
                </Button>
              )}

              <Button
                onClick={goToNext}
                disabled={currentSectionIndex === sections.length - 1}
              >
                Следующий
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Завершение урока */}
      {completedSections.size === sections.length && (
        <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Урок завершен!</h3>
            <p className="text-muted-foreground mb-4">
              Вы успешно прошли все разделы урока. Ваш прогресс и Skills DNA обновлены.
            </p>
            <Button onClick={onLessonComplete} className="bg-green-600 hover:bg-green-700">
              Перейти к следующему уроку
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}