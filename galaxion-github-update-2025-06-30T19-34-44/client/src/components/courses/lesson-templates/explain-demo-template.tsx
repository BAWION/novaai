import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Lightbulb, Code, ExternalLink, Satellite } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ExplainDemoTemplateProps {
  explainTitle: string;
  explainContent: string;
  demoTitle: string;
  demoContent: string;
  codeSnippet?: string;
  externalLinks?: Array<{ url: string; title: string }>;
  keyPoints?: string[];
}

/**
 * Шаблон для секций Explain и Demo 
 * Explain - объяснение концепций
 * Demo - демонстрация применения
 */
const ExplainDemoTemplate: React.FC<ExplainDemoTemplateProps> = ({
  explainTitle,
  explainContent,
  demoTitle,
  demoContent,
  codeSnippet,
  externalLinks,
  keyPoints,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <Tabs defaultValue="explain" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="explain" className="flex items-center gap-2">
            <Brain size={18} /> Объяснение
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2">
            <Lightbulb size={18} /> Демонстрация
          </TabsTrigger>
        </TabsList>

        {/* Explain Tab Content */}
        <TabsContent value="explain" className="space-y-4">
          <Card className="border border-space-700 bg-space-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain size={22} className="text-blue-400" />
                <h2 className="text-xl font-semibold text-blue-400">{explainTitle}</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: explainContent }} />
              </div>

              {keyPoints && keyPoints.length > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-blue-300">
                    <Satellite size={18} />
                    <h3 className="text-lg font-medium">Ключевые моменты:</h3>
                  </div>
                  <div className="pl-2 border-l-2 border-blue-700/50 space-y-2">
                    {keyPoints.map((point, idx) => (
                      <motion.div 
                        key={idx} 
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <span className="text-blue-400 text-xl leading-tight">•</span>
                        <p className="text-white/90">{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demo Tab Content */}
        <TabsContent value="demo" className="space-y-4">
          <Card className="border border-space-700 bg-space-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Lightbulb size={22} className="text-amber-400" />
                <h2 className="text-xl font-semibold text-amber-400">{demoTitle}</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: demoContent }} />
              </div>

              {codeSnippet && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Code size={18} className="text-green-400" />
                    <h3 className="text-lg font-medium text-green-400">Пример кода:</h3>
                  </div>
                  <div className="bg-space-900 rounded-md p-4 overflow-x-auto text-sm">
                    <pre><code className="text-green-50">{codeSnippet}</code></pre>
                  </div>
                </div>
              )}

              {externalLinks && externalLinks.length > 0 && (
                <div className="mt-6">
                  <Separator className="mb-4" />
                  <div className="flex items-center gap-2 mb-3">
                    <ExternalLink size={16} className="text-blue-400" />
                    <h3 className="text-md font-medium">Дополнительные материалы:</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {externalLinks.map((link, idx) => (
                      <Badge key={idx} variant="outline" className="hover:bg-space-700 transition-colors">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                          {link.title}
                          <ExternalLink size={12} />
                        </a>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ExplainDemoTemplate;