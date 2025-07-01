import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, PlayCircle } from "lucide-react";

interface ResumeBannerProps {
  courseTitle: string;
  lastLesson: string;
  progress: number;
  onContinue: () => void;
}

export function ResumeBanner({
  courseTitle,
  lastLesson,
  progress,
  onContinue,
}: ResumeBannerProps) {
  return (
    <Card className="bg-gradient-to-r from-primary/20 to-primary/5">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div className="space-y-2 mb-4 md:mb-0">
            <h3 className="text-lg font-medium">Продолжить обучение</h3>
            <p className="text-muted-foreground">
              Последний урок: <span className="font-medium">{lastLesson}</span>
            </p>
            <div className="flex flex-col space-y-1 max-w-md">
              <div className="flex justify-between text-sm">
                <span>Прогресс курса</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
          <Button onClick={onContinue} className="md:self-center">
            <PlayCircle className="mr-2 h-4 w-4" />
            Продолжить
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}