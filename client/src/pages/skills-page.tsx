import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SkillMap } from '@/components/progress/skill-map';
import { SkillGaps } from '@/components/progress/skill-gaps';
import { LearningTimeline } from '@/components/progress/learning-timeline';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/context/user-profile-context';
import { 
  BarChart3, 
  Brain, 
  Calendar, 
  Clock, 
  Compass, 
  GraduationCap, 
  LineChart, 
  Target 
} from 'lucide-react';

export default function SkillsPage() {
  const { userProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState('map');

  // Мок userId для запросов API
  const userId = 999; // Админ

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Навыки и прогресс</h1>
            <p className="text-white/60 max-w-2xl mt-2">
              Отслеживайте свой прогресс в обучении, анализируйте рост навыков и выявляйте области, требующие дополнительного внимания
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm">
              <GraduationCap size={16} className="mr-1" />
              Тест навыков
            </Button>
            <Button variant="outline" size="sm">
              <Calendar size={16} className="mr-1" />
              Отчет за период
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <Tabs defaultValue="map" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="h-12">
                  <TabsTrigger value="map" className="relative h-10 px-6">
                    <Brain size={16} className="mr-2" />
                    Карта навыков
                    {activeTab !== 'map' && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>}
                  </TabsTrigger>
                  <TabsTrigger value="gaps" className="relative h-10 px-6">
                    <Target size={16} className="mr-2" />
                    Пробелы
                    {activeTab !== 'gaps' && <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>}
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="relative h-10 px-6">
                    <Clock size={16} className="mr-2" />
                    Хронология
                  </TabsTrigger>
                </TabsList>
                <div>
                  <Button variant="ghost" size="sm">
                    <LineChart size={16} className="mr-1" />
                    Статистика
                  </Button>
                </div>
              </div>

              <TabsContent value="map" className="mt-6">
                <SkillMap 
                  userId={userId} 
                  showTitle={false}
                  onSkillSelect={(skillId) => console.log("Selected skill:", skillId)}
                />
              </TabsContent>
              
              <TabsContent value="gaps" className="mt-6">
                <SkillGaps 
                  userId={userId}
                  showTitle={false}
                  onGapSelect={(gapId, skillId) => console.log("Selected gap:", gapId, "for skill:", skillId)}
                  onCourseSelect={(courseId) => console.log("Selected course:", courseId)}
                />
              </TabsContent>
              
              <TabsContent value="timeline" className="mt-6">
                <LearningTimeline 
                  userId={userId}
                  showTitle={false}
                  limit={20}
                  onEventSelect={(eventId) => console.log("Selected event:", eventId)}
                  onEntitySelect={(type, id) => console.log("Selected entity:", type, id)}
                />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-space-900/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <BarChart3 size={18} className="mr-2 text-primary" />
                Статистика обучения
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Всего навыков:</span>
                    <span className="font-medium">18</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Освоенных навыков:</span>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Изучаемых навыков:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Выявленных пробелов:</span>
                    <span className="font-medium text-red-400">6</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Средний прогресс:</span>
                    <span className="font-medium">62%</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white/60">Последняя активность:</span>
                    <span className="font-medium">Сегодня</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Серия обучения:</span>
                    <span className="font-medium">{userProfile?.streakDays || 4} дня</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-space-900/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Compass size={18} className="mr-2 text-primary" />
                Рекомендации
              </h3>
              
              <div className="space-y-3">
                <div className="rounded-md bg-space-800 p-3">
                  <p className="text-sm font-medium mb-1">Заполните пробел в Python</p>
                  <p className="text-xs text-white/60">Ваш уровень в этом навыке отстает от целевого на 38%</p>
                </div>
                
                <div className="rounded-md bg-space-800 p-3">
                  <p className="text-sm font-medium mb-1">Попрактикуйтесь в SQL</p>
                  <p className="text-xs text-white/60">Навык не практиковался более 2 недель</p>
                </div>
                
                <div className="rounded-md bg-space-800 p-3">
                  <p className="text-sm font-medium mb-1">Пройдите тестирование навыков</p>
                  <p className="text-xs text-white/60">Обновите информацию о своём уровне для более точных рекомендаций</p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-4">
                Смотреть все рекомендации
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}