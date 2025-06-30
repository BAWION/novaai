import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Star, Zap } from 'lucide-react';

interface HookTemplateProps {
  title: string;
  content: string;
  imageUrl?: string;
}

/**
 * Шаблон для секции Hook с космической визуализацией
 * Эта секция призвана заинтересовать пользователя и создать wow-эффект
 */
const HookTemplate: React.FC<HookTemplateProps> = ({ title, content, imageUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden"
    >
      {/* Фоновая космическая анимация */}
      <div className="absolute inset-0 bg-space-900 overflow-hidden">
        <div className="stars-container absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.7 + 0.3,
                scale: Math.random() * 1.5 + 0.5,
              }}
              animate={{
                opacity: Math.random() * 0.5 + 0.5,
                scale: Math.random() * 0.8 + 1.2,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
      </div>

      <Card className="border-0 bg-space-800/60 backdrop-blur-sm relative z-10">
        <CardContent className="p-6 space-y-4">
          {/* Заголовок с иконкой */}
          <div className="flex items-center space-x-3 mb-4 text-primary-400">
            <Rocket size={24} className="text-primary animate-pulse" />
            <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
              {title}
            </h2>
          </div>

          {/* Основной контент */}
          <div className="relative">
            {imageUrl && (
              <div className="rounded-lg overflow-hidden mb-4 relative">
                <motion.img
                  src={imageUrl}
                  alt="Hook visual"
                  className="w-full h-auto object-cover rounded-lg"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-900/70 to-transparent pointer-events-none" />
              </div>
            )}

            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>

          {/* Декоративные элементы */}
          <motion.div
            className="absolute top-4 right-4 text-blue-300/30"
            initial={{ opacity: 0.3, rotate: 0 }}
            animate={{ opacity: 0.7, rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <Star size={40} />
          </motion.div>
          
          <motion.div
            className="absolute bottom-4 left-4 text-indigo-400/20"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Zap size={30} />
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HookTemplate;