import { AiChat } from '@/components/ai-tutor/ai-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, BookOpen, MessageSquare, Lightbulb, Target } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export default function AiTutorPage() {
  return (
    <PageLayout>
      <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Bot className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">ИИ-Тьютор</h1>
          <Badge variant="secondary">Beta</Badge>
        </div>
        <p className="text-gray-600 max-w-3xl">
          Персональный помощник для изучения искусственного интеллекта. Задавайте вопросы, 
          получайте объяснения и углубляйте свои знания с помощью интерактивного общения.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <AiChat />
        </div>

        {/* Features and Tips */}
        <div className="space-y-6">
          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Возможности тьютора
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-4 w-4 text-blue-600 mt-1" />
                <div>
                  <div className="font-medium text-sm">Объяснения концепций</div>
                  <div className="text-xs text-gray-600">Простые объяснения сложных тем</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <BookOpen className="h-4 w-4 text-green-600 mt-1" />
                <div>
                  <div className="font-medium text-sm">Практические примеры</div>
                  <div className="text-xs text-gray-600">Реальные применения ИИ</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Lightbulb className="h-4 w-4 text-yellow-600 mt-1" />
                <div>
                  <div className="font-medium text-sm">Советы по изучению</div>
                  <div className="text-xs text-gray-600">Персональные рекомендации</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Target className="h-4 w-4 text-purple-600 mt-1" />
                <div>
                  <div className="font-medium text-sm">Помощь с заданиями</div>
                  <div className="text-xs text-gray-600">Решение практических задач</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Советы по использованию</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium mb-1">💡 Задавайте конкретные вопросы</div>
                <div className="text-gray-600">Вместо "Расскажи об ИИ" спросите "Как работает машинное обучение?"</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium mb-1">🔍 Используйте примеры</div>
                <div className="text-gray-600">Просите объяснить на конкретных примерах из жизни</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium mb-1">📚 Изучайте поэтапно</div>
                <div className="text-gray-600">Начинайте с основ, постепенно углубляясь в детали</div>
              </div>
              
              <div className="text-sm">
                <div className="font-medium mb-1">❓ Не стесняйтесь переспрашивать</div>
                <div className="text-gray-600">Если что-то непонятно, попросите объяснить проще</div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Topics */}
          <Card>
            <CardHeader>
              <CardTitle>Популярные темы</CardTitle>
              <CardDescription>О чем чаще всего спрашивают</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Нейронные сети</Badge>
                <Badge variant="outline" className="text-xs">Машинное обучение</Badge>
                <Badge variant="outline" className="text-xs">Алгоритмы</Badge>
                <Badge variant="outline" className="text-xs">Глубокое обучение</Badge>
                <Badge variant="outline" className="text-xs">Computer Vision</Badge>
                <Badge variant="outline" className="text-xs">NLP</Badge>
                <Badge variant="outline" className="text-xs">Python</Badge>
                <Badge variant="outline" className="text-xs">TensorFlow</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </PageLayout>
  );
}