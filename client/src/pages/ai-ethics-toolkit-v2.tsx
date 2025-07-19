import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { aiEthicsToolkitV2, InteractiveModule, getDifficultyColor, getActivityTypeIcon } from '@/data/ai-ethics-toolkit-v2';
import { BottomNavigation } from '@/components/layout/bottom-navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AIEthicsToolkitV2() {
  const [, navigate] = useLocation();
  const [selectedModule, setSelectedModule] = useState<InteractiveModule | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    // Симуляция загрузки прогресса пользователя
    const mockProgress = {
      'ethics-foundations': 85,
      'bias-detection': 60,
      'transparency-tools': 30,
      'privacy-security': 0,
      'compliance-assessment': 0
    };
    setUserProgress(mockProgress);
  }, []);

  const getTotalProgress = () => {
    const completed = Object.values(userProgress).reduce((sum, progress) => sum + progress, 0);
    return Math.round(completed / aiEthicsToolkitV2.length);
  };

  const getModuleStatus = (moduleId: string) => {
    const progress = userProgress[moduleId] || 0;
    if (progress === 0) return 'locked';
    if (progress < 100) return 'in_progress';
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'fa-check-circle';
      case 'in_progress': return 'fa-clock';
      default: return 'fa-lock';
    }
  };

  const startModule = (module: InteractiveModule) => {
    // В реальности здесь будет навигация к интерактивному модулю
    console.log('Starting module:', module.id);
    navigate(`/ai-ethics-toolkit-v2/module/${module.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 pt-safe">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/catalog')}
              className="text-white/70 hover:text-white"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Каталог
            </Button>
            <div className="flex items-center space-x-2">
              <i className="fas fa-brain text-purple-400"></i>
              <span className="text-sm text-white/70">Brilliant Style</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              AI Ethics Toolkit 2.0
            </h1>
            <p className="text-white/70 text-sm md:text-base">
              Интерактивный курс в стиле Brilliant.org - учись делая, а не читая!
            </p>
          </div>

          {/* Progress Overview */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Общий прогресс</span>
              <span className="text-white/70 text-sm">{getTotalProgress()}%</span>
            </div>
            <Progress value={getTotalProgress()} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-white/60">
              <span>5 интерактивных модулей</span>
              <span>~90 минут всего</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiEthicsToolkitV2.map((module, index) => {
            const status = getModuleStatus(module.id);
            const progress = userProgress[module.id] || 0;
            const isUnlocked = index === 0 || userProgress[aiEthicsToolkitV2[index - 1].id] >= 70;
            
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gray-800 border-gray-700 overflow-hidden transition-all duration-300 ${
                  isUnlocked ? 'hover:bg-gray-750 hover:border-purple-500/30 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}>
                  <div className={`h-2 bg-gradient-to-r ${module.color}`}></div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center`}>
                          <i className={`fas ${module.icon} text-white text-sm`}></i>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{module.title}</h3>
                          <p className="text-xs text-gray-400">{module.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(status)}`}>
                          <i className={`fas ${getStatusIcon(status)} mr-1`}></i>
                          {status === 'completed' ? 'Завершено' : 
                           status === 'in_progress' ? 'В процессе' : 'Заблокировано'}
                        </Badge>
                      </div>
                    </div>

                    {/* Module Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <div className="flex items-center space-x-4">
                        <span>
                          <i className="fas fa-clock mr-1"></i>
                          {module.duration} мин
                        </span>
                        <span>
                          <i className="fas fa-puzzle-piece mr-1"></i>
                          {module.activities.length} заданий
                        </span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${
                        module.difficulty === 'beginner' ? 'border-green-500 text-green-400' :
                        module.difficulty === 'intermediate' ? 'border-yellow-500 text-yellow-400' :
                        'border-red-500 text-red-400'
                      }`}>
                        {module.difficulty === 'beginner' ? 'Начальный' :
                         module.difficulty === 'intermediate' ? 'Средний' : 'Продвинутый'}
                      </Badge>
                    </div>

                    {/* Activities Preview */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {module.activities.slice(0, 3).map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center space-x-1 bg-gray-700/50 rounded-full px-2 py-1"
                          >
                            <i className={`fas ${getActivityTypeIcon(activity.type)} text-xs text-purple-400`}></i>
                            <span className="text-xs text-gray-300">{activity.title}</span>
                          </div>
                        ))}
                        {module.activities.length > 3 && (
                          <div className="flex items-center space-x-1 bg-gray-700/50 rounded-full px-2 py-1">
                            <span className="text-xs text-gray-400">+{module.activities.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {isUnlocked && (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">Прогресс</span>
                          <span className="text-xs text-gray-400">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-1" />
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      onClick={() => isUnlocked && startModule(module)}
                      disabled={!isUnlocked}
                      className={`w-full ${isUnlocked ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed'}`}
                      size="sm"
                    >
                      {status === 'completed' ? (
                        <>
                          <i className="fas fa-redo mr-2"></i>
                          Пересдать
                        </>
                      ) : status === 'in_progress' ? (
                        <>
                          <i className="fas fa-play mr-2"></i>
                          Продолжить
                        </>
                      ) : isUnlocked ? (
                        <>
                          <i className="fas fa-rocket mr-2"></i>
                          Начать
                        </>
                      ) : (
                        <>
                          <i className="fas fa-lock mr-2"></i>
                          Заблокировано
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Course Info */}
      <div className="px-4 pb-6">
        <Card className="bg-gray-800 border-gray-700">
          <div className="p-4">
            <h3 className="font-semibold text-white mb-3 flex items-center">
              <i className="fas fa-lightbulb text-yellow-400 mr-2"></i>
              Что нового в версии 2.0?
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <i className="fas fa-check text-green-400 mt-1"></i>
                <span>100% интерактивность - никаких видео или длинных текстов</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check text-green-400 mt-1"></i>
                <span>Brilliant-style визуализации и анимации</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check text-green-400 mt-1"></i>
                <span>Практические симуляции реальных ситуаций</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check text-green-400 mt-1"></i>
                <span>Микро-уроки по 15-20 минут максимум</span>
              </div>
              <div className="flex items-start space-x-2">
                <i className="fas fa-check text-green-400 mt-1"></i>
                <span>Мгновенная обратная связь и адаптивность</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Module Detail Modal */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedModule(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`h-3 bg-gradient-to-r ${selectedModule.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">{selectedModule.title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedModule(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
                
                <p className="text-gray-300 mb-6">{selectedModule.description}</p>
                
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">Интерактивные активности:</h3>
                  {selectedModule.activities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                      <i className={`fas ${getActivityTypeIcon(activity.type)} text-purple-400`}></i>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{activity.title}</div>
                        <div className="text-xs text-gray-400">{activity.description}</div>
                      </div>
                      <div className="text-xs text-gray-400">{activity.duration}м</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700">
                  <Button
                    onClick={() => startModule(selectedModule)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <i className="fas fa-play mr-2"></i>
                    Начать модуль
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNavigation />
    </div>
  );
}
