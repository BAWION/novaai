import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface UserSkill {
  id: number;
  userId: number;
  skillId: number;
  skillName: string;
  level: number;
  verified: boolean;
  isActive: boolean;
  lastUpdated: string;
}

interface SkillProgressProps {
  userId?: number;
  limit?: number;
  showTitle?: boolean;
  showLevel?: boolean;
}

export default function SkillProgress({
  userId,
  limit = 5,
  showTitle = true,
  showLevel = true
}: SkillProgressProps) {
  // Запрос на получение навыков пользователя
  const { data: skills, isLoading } = useQuery<UserSkill[]>({
    queryKey: ["/api/skills/user"],
    enabled: !!userId,
    placeholderData: []
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!skills || skills.length === 0) {
    return (
      <Card>
        <CardHeader>
          {showTitle && <CardTitle>Ваши навыки</CardTitle>}
          <CardDescription>
            Ваши навыки будут отображаться здесь по мере прохождения курсов
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Сортировка навыков по уровню (от высокого к низкому) и ограничение количества
  const sortedSkills = [...skills]
    .sort((a, b) => b.level - a.level)
    .slice(0, limit);
  
  // Уровни опыта с описаниями
  const skillLevels = [
    { min: 0, max: 20, label: "Новичок", color: "text-blue-400" },
    { min: 21, max: 40, label: "Начинающий", color: "text-green-400" },
    { min: 41, max: 60, label: "Средний", color: "text-yellow-400" },
    { min: 61, max: 80, label: "Продвинутый", color: "text-orange-400" },
    { min: 81, max: 100, label: "Эксперт", color: "text-red-400" }
  ];
  
  // Определение уровня навыка по его значению
  const getSkillLevel = (level: number) => {
    return skillLevels.find(l => level >= l.min && level <= l.max) || skillLevels[0];
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        {showTitle && <CardTitle>Ваши навыки</CardTitle>}
        <CardDescription>
          Навыки, которые вы приобрели в процессе обучения
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedSkills.map(skill => {
            const skillLevel = getSkillLevel(skill.level);
            
            return (
              <div key={skill.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{skill.skillName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {showLevel && (
                      <span className={`text-xs ${skillLevel.color}`}>{skillLevel.label}</span>
                    )}
                    <span className="text-sm font-medium">{skill.level}%</span>
                  </div>
                </div>
                <Progress 
                  value={skill.level} 
                  className={`h-2 ${
                    skill.level > 80 ? "bg-red-200" : 
                    skill.level > 60 ? "bg-orange-200" : 
                    skill.level > 40 ? "bg-yellow-200" : 
                    skill.level > 20 ? "bg-green-200" : 
                    "bg-blue-200"
                  }`}
                />
                {skill.verified && (
                  <div className="flex justify-end mt-1">
                    <Badge variant="outline" className="text-xs py-0 px-2 h-5">
                      Подтверждено
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}