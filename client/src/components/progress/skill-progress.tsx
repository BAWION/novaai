import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
}

interface UserSkill {
  id: number;
  userId: number;
  skillId: number;
  level: number;
  lastAssessedAt: string;
  source: string;
}

interface SkillProgressProps {
  userId?: number;
  showTitle?: boolean;
  limit?: number;
  category?: string;
}

export default function SkillProgress({
  userId,
  showTitle = true,
  limit = 5,
  category
}: SkillProgressProps) {
  // Получение списка навыков пользователя
  const { data: userSkills, isLoading: isLoadingUserSkills } = useQuery<UserSkill[]>({
    queryKey: ["/api/user/skills"],
    enabled: !!userId,
    placeholderData: []
  });
  
  // Получение списка всех навыков
  const { data: allSkills, isLoading: isLoadingSkills } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
    placeholderData: []
  });
  
  if (isLoadingUserSkills || isLoadingSkills) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Если навыки пользователя не найдены, показываем сообщение
  if (!userSkills?.length) {
    return (
      <Card>
        <CardHeader>
          {showTitle && <CardTitle>Ваши навыки</CardTitle>}
          <CardDescription>
            Вы еще не освоили ни одного навыка. Начните обучение, чтобы увидеть свой прогресс!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Фильтруем навыки по категории, если указана
  let filteredSkills = userSkills;
  if (category && allSkills?.length) {
    const skillsByCategory = allSkills.filter(skill => skill.category === category);
    const skillIdsByCategory = skillsByCategory.map(skill => skill.id);
    filteredSkills = userSkills.filter(userSkill => 
      skillIdsByCategory.includes(userSkill.skillId)
    );
  }
  
  // Сортируем по уровню (от высшего к низшему) и ограничиваем количество
  const sortedSkills = [...filteredSkills].sort((a, b) => b.level - a.level).slice(0, limit);
  
  // Находим соответствующую информацию о навыке
  const skillsWithInfo = sortedSkills.map(userSkill => {
    const skillInfo = allSkills?.find(skill => skill.id === userSkill.skillId) || {
      name: `Навык #${userSkill.skillId}`,
      category: "other",
      level: 1
    };
    
    return {
      ...userSkill,
      name: skillInfo.name,
      category: skillInfo.category,
      difficultyLevel: skillInfo.level
    };
  });
  
  return (
    <Card>
      <CardHeader className="pb-2">
        {showTitle && <CardTitle>Ваши навыки</CardTitle>}
        <CardDescription>
          Прогресс в освоении ключевых навыков
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skillsWithInfo.map(skill => (
            <div key={skill.skillId} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm flex items-center">
                  {skill.name}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {getLevelLabel(skill.difficultyLevel)}
                  </Badge>
                </div>
                <span className="text-sm text-muted-foreground">{skill.level}%</span>
              </div>
              <Progress value={skill.level} className="h-2" 
                        style={{backgroundColor: getProgressColor(skill.level)}} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Вспомогательные функции
function getLevelLabel(level: number): string {
  switch(level) {
    case 1: return "Начальный";
    case 2: return "Базовый";
    case 3: return "Средний";
    case 4: return "Продвинутый";
    case 5: return "Эксперт";
    default: return "Начальный";
  }
}

function getProgressColor(level: number): string {
  if (level < 20) return "#ef4444";
  if (level < 40) return "#f97316";
  if (level < 60) return "#eab308";
  if (level < 80) return "#3b82f6";
  return "#22c55e";
}