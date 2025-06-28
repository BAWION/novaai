import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, Lightbulb, Calendar, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface GoalsInsightsProps {
  skillsData: any[];
  summaryData?: any;
}

export function GoalsInsights({ skillsData, summaryData }: GoalsInsightsProps) {
  // Анализ целей на основе текущего прогресса
  const analyzeGoals = () => {
    return skillsData.map(skill => {
      const currentProgress = skill.progress;
      const targetLevel = skill.targetLevel || 'mastery'; // Цель по умолчанию
      
      // Определение целевого процента для каждого уровня
      const levelTargets = {
        'awareness': 25,
        'knowledge': 50,
        'application': 75,
        'mastery': 90
      };
      
      const targetProgress = levelTargets[targetLevel as keyof typeof levelTargets] || 90;
      const progressToTarget = targetProgress - currentProgress;
      const progressPercentage = Math.min((currentProgress / targetProgress) * 100, 100);
      
      // Оценка времени до достижения цели (на основе истории)
      let estimatedDays = null;
      if (skill.assessmentHistory && skill.assessmentHistory.length >= 2) {
        const history = skill.assessmentHistory.sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        const daysBetween = (new Date(history[history.length - 1].date).getTime() - 
                            new Date(history[0].date).getTime()) / (1000 * 60 * 60 * 24);
        const progressGained = history[history.length - 1].progress - history[0].progress;
        
        if (progressGained > 0 && daysBetween > 0) {
          const progressPerDay = progressGained / daysBetween;
          estimatedDays = Math.ceil(progressToTarget / progressPerDay);
        }
      }
      
      return {
        ...skill,
        targetProgress,
        progressToTarget,
        progressPercentage,
        estimatedDays,
        status: progressToTarget <= 0 ? 'completed' : 
               progressToTarget <= 10 ? 'near' : 
               progressToTarget <= 30 ? 'good' : 'needs_work'
      };
    });
  };

  // Генерация персонализированных рекомендаций
  const generateInsights = () => {
    const insights = [];
    
    // Анализ сильных сторон
    const strongSkills = skillsData.filter(skill => skill.progress >= 70);
    if (strongSkills.length > 0) {
      insights.push({
        type: 'strength',
        icon: CheckCircle2,
        title: 'Ваши сильные стороны',
        description: `У вас отличные результаты в ${strongSkills.length} навыках. Используйте эти знания для изучения смежных областей.`,
        skills: strongSkills.slice(0, 3).map(s => s.name),
        color: 'green'
      });
    }
    
    // Анализ областей для развития
    const weakSkills = skillsData.filter(skill => skill.progress < 40);
    if (weakSkills.length > 0) {
      insights.push({
        type: 'improvement',
        icon: TrendingUp,
        title: 'Приоритетные области',
        description: `Фокус на ${weakSkills.length} ключевых навыках значительно улучшит ваш профиль.`,
        skills: weakSkills.slice(0, 3).map(s => s.name),
        color: 'blue'
      });
    }
    
    // Анализ баланса навыков
    const categories = Array.from(new Set(skillsData.map(skill => skill.category)));
    const unbalancedCategories = categories.filter(category => {
      const categorySkills = skillsData.filter(skill => skill.category === category);
      const avgProgress = categorySkills.reduce((sum, skill) => sum + skill.progress, 0) / categorySkills.length;
      return avgProgress < 40;
    });
    
    if (unbalancedCategories.length > 0) {
      insights.push({
        type: 'balance',
        icon: Target,
        title: 'Баланс компетенций',
        description: `Развитие навыков в ${unbalancedCategories.length} категориях создаст более сбалансированный профиль.`,
        skills: unbalancedCategories,
        color: 'purple'
      });
    }
    
    return insights;
  };

  const goalsAnalysis = analyzeGoals();
  const insights = generateInsights();
  
  // Группировка целей по статусу
  const goalsByStatus = {
    completed: goalsAnalysis.filter(g => g.status === 'completed'),
    near: goalsAnalysis.filter(g => g.status === 'near'),
    good: goalsAnalysis.filter(g => g.status === 'good'),
    needs_work: goalsAnalysis.filter(g => g.status === 'needs_work')
  };

  return (
    <div className="space-y-6">
      {/* Прогресс к целям */}
      <Card className="bg-space-800/70 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Прогресс к целям
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goalsAnalysis.map((goal) => (
              <div key={goal.name} className="bg-space-900/50 border border-white/10 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm mb-1">{goal.name}</h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        goal.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        goal.status === 'near' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        goal.status === 'good' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}
                    >
                      {goal.status === 'completed' ? 'Достигнута' :
                       goal.status === 'near' ? 'Почти достигнута' :
                       goal.status === 'good' ? 'Хороший прогресс' :
                       'Требует внимания'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-bold">{Math.round(goal.progressPercentage)}%</div>
                    <div className="text-white/60 text-xs">к цели</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress value={goal.progressPercentage} className="h-2" />
                  
                  <div className="flex justify-between text-xs text-white/60">
                    <span>Текущий: {goal.progress}%</span>
                    <span>Цель: {goal.targetProgress}%</span>
                  </div>
                  
                  {goal.estimatedDays && goal.progressToTarget > 0 && (
                    <div className="flex items-center text-xs text-white/60 mt-2">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>≈ {goal.estimatedDays} дней до цели</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Персонализированные инсайты */}
      <Card className="bg-space-800/70 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Lightbulb className="h-5 w-5 mr-2" />
            Персональные рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className="bg-space-900/50 border border-white/10 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className={`
                      p-2 rounded-lg mr-4 
                      ${insight.color === 'green' ? 'bg-green-500/20' :
                        insight.color === 'blue' ? 'bg-blue-500/20' :
                        insight.color === 'purple' ? 'bg-purple-500/20' :
                        'bg-yellow-500/20'}
                    `}>
                      <IconComponent className={`h-5 w-5 ${
                        insight.color === 'green' ? 'text-green-400' :
                        insight.color === 'blue' ? 'text-blue-400' :
                        insight.color === 'purple' ? 'text-purple-400' :
                        'text-yellow-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-2">{insight.title}</h4>
                      <p className="text-white/70 text-sm mb-3">{insight.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs bg-white/5 border-white/20">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Сводка целей */}
      <Card className="bg-space-800/70 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Сводка по целям
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-green-400 text-2xl font-bold">{goalsByStatus.completed.length}</div>
              <div className="text-green-300 text-sm">Достигнуто</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="text-yellow-400 text-2xl font-bold">{goalsByStatus.near.length}</div>
              <div className="text-yellow-300 text-sm">Близко к цели</div>
            </div>
            
            <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-blue-400 text-2xl font-bold">{goalsByStatus.good.length}</div>
              <div className="text-blue-300 text-sm">В процессе</div>
            </div>
            
            <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="text-red-400 text-2xl font-bold">{goalsByStatus.needs_work.length}</div>
              <div className="text-red-300 text-sm">Нужно внимание</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}