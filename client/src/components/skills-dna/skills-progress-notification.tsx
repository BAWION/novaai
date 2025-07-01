import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, TrendingUp, Star, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SkillUpdate {
  skillName: string;
  previousProgress: number;
  newProgress: number;
  progressGain: number;
  currentLevel: string;
}

interface SkillsProgressNotificationProps {
  isVisible: boolean;
  skillUpdates: SkillUpdate[];
  onClose: () => void;
  averageProgress?: number;
  totalSkills?: number;
}

export const SkillsProgressNotification: React.FC<SkillsProgressNotificationProps> = ({
  isVisible,
  skillUpdates,
  onClose,
  averageProgress = 0,
  totalSkills = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isVisible || skillUpdates.length === 0) return;

    if (skillUpdates.length === 1) {
      // Для одного навыка показываем уведомление 4 секунды
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }

    // Для множественных навыков показываем по очереди
    const timer = setTimeout(() => {
      if (currentIndex < skillUpdates.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onClose();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isVisible, currentIndex, skillUpdates.length, onClose]);

  useEffect(() => {
    if (isVisible) {
      setCurrentIndex(0);
    }
  }, [isVisible]);

  if (!isVisible || skillUpdates.length === 0) return null;

  const currentSkill = skillUpdates[currentIndex];
  const isMultipleSkills = skillUpdates.length > 1;

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'awareness': return <Star className="w-4 h-4 text-blue-400" />;
      case 'knowledge': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'application': return <Award className="w-4 h-4 text-yellow-400" />;
      case 'mastery': return <Award className="w-4 h-4 text-orange-400" />;
      case 'expertise': return <Award className="w-4 h-4 text-purple-400" />;
      default: return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'awareness': return 'text-blue-400';
      case 'knowledge': return 'text-green-400';
      case 'application': return 'text-yellow-400';
      case 'mastery': return 'text-orange-400';
      case 'expertise': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <Card className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex-shrink-0"
              >
                <CheckCircle className="w-6 h-6 text-green-400" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm font-semibold text-white mb-1"
                >
                  Skills DNA обновлен!
                </motion.h3>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2">
                    {getLevelIcon(currentSkill.currentLevel)}
                    <span className="text-white text-sm font-medium">
                      {currentSkill.skillName}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-300">Прогресс</span>
                      <span className="text-green-400 font-medium">
                        +{currentSkill.progressGain}%
                      </span>
                    </div>
                    
                    <div className="relative">
                      <Progress 
                        value={currentSkill.newProgress} 
                        className="h-2 bg-gray-700"
                      />
                      <motion.div
                        initial={{ width: `${currentSkill.previousProgress}%` }}
                        animate={{ width: `${currentSkill.newProgress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {currentSkill.previousProgress}% → {currentSkill.newProgress}%
                      </span>
                      <span className={`${getLevelColor(currentSkill.currentLevel)} capitalize`}>
                        {currentSkill.currentLevel}
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                {isMultipleSkills && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center justify-between mt-3 pt-2 border-t border-gray-600"
                  >
                    <span className="text-xs text-gray-400">
                      {currentIndex + 1} из {skillUpdates.length} навыков
                    </span>
                    <div className="flex gap-1">
                      {skillUpdates.map((_, index) => (
                        <div
                          key={index}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            index === currentIndex ? 'bg-purple-400' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                
                {totalSkills > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-300"
                  >
                    Общий прогресс: {averageProgress}% • {totalSkills} навыков
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default SkillsProgressNotification;