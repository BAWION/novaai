import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ProgressTimelineProps {
  skillsData: any[];
}

export function ProgressTimeline({ skillsData }: ProgressTimelineProps) {
  // Обработка данных истории оценок для временной линии
  const processTimelineData = () => {
    const timelineMap: { [key: string]: any } = {};
    
    skillsData.forEach(skill => {
      if (skill.assessmentHistory && skill.assessmentHistory.length > 0) {
        skill.assessmentHistory.forEach((assessment: any) => {
          const date = new Date(assessment.date).toLocaleDateString('ru-RU', {
            month: 'short',
            day: 'numeric'
          });
          
          if (!timelineMap[date]) {
            timelineMap[date] = { date };
          }
          
          timelineMap[date][skill.name] = assessment.progress;
        });
      }
    });
    
    return Object.values(timelineMap).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // Анализ трендов навыков
  const analyzeSkillTrends = () => {
    return skillsData.map(skill => {
      if (!skill.assessmentHistory || skill.assessmentHistory.length < 2) {
        return { ...skill, trend: 'stable', change: 0 };
      }
      
      const history = skill.assessmentHistory.sort((a: any, b: any) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const firstProgress = history[0].progress;
      const lastProgress = history[history.length - 1].progress;
      const change = lastProgress - firstProgress;
      
      let trend = 'stable';
      if (change > 5) trend = 'growing';
      else if (change < -5) trend = 'declining';
      
      return { ...skill, trend, change };
    });
  };

  const timelineData = processTimelineData();
  const skillTrends = analyzeSkillTrends();
  
  const colors = [
    '#B28DFF', '#8BE0F7', '#FF6B9D', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
  ];

  return (
    <div className="space-y-6">
      {/* Временная динамика прогресса */}
      <Card className="bg-space-800/70 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Динамика прогресса
          </CardTitle>
        </CardHeader>
        <CardContent>
          {timelineData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ffffff60"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#ffffff60"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#191c29",
                      border: "1px solid #414868",
                      borderRadius: "8px",
                      color: "#fff"
                    }}
                    formatter={(value: any, name: string) => [`${value}%`, name]}
                  />
                  <Legend />
                  {skillsData.slice(0, 5).map((skill, index) => (
                    <Line
                      key={skill.name}
                      type="monotone"
                      dataKey={skill.name}
                      stroke={colors[index]}
                      strokeWidth={2}
                      dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: colors[index], strokeWidth: 2, fill: "#191c29" }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Недостаточно данных для отображения динамики</p>
              <p className="text-sm mt-1">Пройдите несколько оценок для анализа прогресса</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Анализ трендов навыков */}
      <Card className="bg-space-800/70 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Анализ трендов навыков
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillTrends.map((skill) => (
              <div key={skill.name} className="bg-space-900/50 border border-white/10 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium text-sm">{skill.name}</h4>
                  <div className="flex items-center">
                    {skill.trend === 'growing' && (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    )}
                    {skill.trend === 'declining' && (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    {skill.trend === 'stable' && (
                      <Minus className="h-4 w-4 text-yellow-400" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-xs">Текущий уровень</span>
                    <span className="text-white text-sm font-medium">{skill.progress}%</span>
                  </div>
                  
                  <div className="w-full h-2 bg-white/10 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                  
                  {skill.change !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-white/60 text-xs">Изменение</span>
                      <span className={`text-xs font-medium ${
                        skill.change > 0 ? 'text-green-400' : 
                        skill.change < 0 ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {skill.change > 0 ? '+' : ''}{skill.change}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}