import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Telescope, Sparkles } from 'lucide-react';

interface QuickTryReflectTemplateProps {
  title: string;
  content: string;
  type: 'quickTry' | 'reflect';
}

/**
 * Упрощенный шаблон для секций Quick Try и Reflect с минимальным интерфейсом
 */
const QuickTryReflectTemplate: React.FC<QuickTryReflectTemplateProps> = ({
  title,
  content,
  type
}) => {
  const isQuickTry = type === 'quickTry';
  const icon = isQuickTry ? <Telescope size={22} className="text-indigo-400" /> : <Sparkles size={22} className="text-purple-400" />;
  const titleColor = isQuickTry ? "text-indigo-400" : "text-purple-400";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <Card className="border border-space-700 bg-space-800/60 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            {icon}
            <h2 className={`text-xl font-semibold ${titleColor}`}>{title}</h2>
          </div>

          <div className="prose prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickTryReflectTemplate;