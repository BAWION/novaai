import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Lightbulb } from 'lucide-react';

interface ExplainDemoTemplateProps {
  title: string;
  content: string;
  type: 'explain' | 'demo';
}

/**
 * Упрощенный шаблон для секций Explain и Demo с минимальным интерфейсом
 */
const ExplainDemoTemplate: React.FC<ExplainDemoTemplateProps> = ({
  title,
  content,
  type
}) => {
  const isExplain = type === 'explain';
  const icon = isExplain ? <Brain size={22} className="text-blue-400" /> : <Lightbulb size={22} className="text-amber-400" />;
  const titleColor = isExplain ? "text-blue-400" : "text-amber-400";

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

export default ExplainDemoTemplate;