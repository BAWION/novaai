import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { CheckCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface ScenarioQuestion {
  id: string;
  title: string;
  description: string;
  scenario: string;
  minLabel: string;
  maxLabel: string;
  optimalRange: [number, number];
  currentValue: number;
}

export default function SliderDemo() {
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const [questions, setQuestions] = useState<ScenarioQuestion[]>([
    {
      id: 'privacy-vs-utility',
      title: 'Баланс приватности и полезности',
      description: 'Медицинское ИИ-приложение для диагностики',
      scenario: 'Ваше ИИ-приложение может улучшить точность диагностики на 15%, если будет собирать дополнительные персональные данные пациентов. Как сбалансировать приватность и пользу?',
      minLabel: 'Максимальная приватность',
      maxLabel: 'Максимальная полезность',
      optimalRange: [35, 65], // Баланс в центре
      currentValue: 50
    },
    {
      id: 'transparency-vs-complexity',
      title: 'Прозрачность vs Сложность',
      description: 'Объяснение решений ИИ для пользователей',
      scenario: 'Ваш алгоритм рекомендаций очень сложный, но точный. Насколько подробно объяснять его работу обычным пользователям?',
      minLabel: 'Простое объяснение',
      maxLabel: 'Техническая детализация',
      optimalRange: [25, 45], // Склоняется к простоте
      currentValue: 50
    },
    {
      id: 'automation-vs-human',
      title: 'Автоматизация vs Человеческий контроль',
      description: 'Система найма с ИИ-скринингом',
      scenario: 'ИИ может обрабатывать резюме быстрее и без предвзятости, но люди лучше оценивают креативность и потенциал. Какой уровень автоматизации оптимален?',
      minLabel: 'Полный контроль человека',
      maxLabel: 'Полная автоматизация ИИ',
      optimalRange: [40, 70], // Гибридный подход
      currentValue: 50
    },
    {
      id: 'fairness-vs-accuracy',
      title: 'Справедливость vs Точность',
      description: 'Алгоритм кредитного скоринга',
      scenario: 'Ваш алгоритм очень точен в предсказании дефолтов, но может неявно дискриминировать определенные группы. Как найти баланс?',
      minLabel: 'Максимальная справедливость',
      maxLabel: 'Максимальная точность',
      optimalRange: [25, 50], // Приоритет справедливости
      currentValue: 50
    }
  ]);

  const handleSliderChange = (questionId: string, value: number[]) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, currentValue: value[0] } : q
    ));
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach(q => {
      const [min, max] = q.optimalRange;
      if (q.currentValue >= min && q.currentValue <= max) {
        totalScore += 25; // 25 баллов за каждый правильный ответ
      } else {
        // Частичные баллы за близость к оптимальному диапазону
        const distance = Math.min(
          Math.abs(q.currentValue - min),
          Math.abs(q.currentValue - max)
        );
        const partialScore = Math.max(0, 25 - distance * 0.5);
        totalScore += partialScore;
      }
    });
    setScore(Math.round(totalScore));
    setCompleted(true);
  };

  const resetActivity = () => {
    setQuestions(prev => prev.map(q => ({ ...q, currentValue: 50 })));
    setCompleted(false);
    setScore(0);
  };

  const getSliderColor = (question: ScenarioQuestion) => {
    const [min, max] = question.optimalRange;
    if (question.currentValue >= min && question.currentValue <= max) {
      return 'bg-green-600';
    } else {
      const distance = Math.min(
        Math.abs(question.currentValue - min),
        Math.abs(question.currentValue - max)
      );
      return distance <= 10 ? 'bg-yellow-600' : 'bg-red-600';
    }
  };

  const progress = Math.round((questions.filter(q => q.currentValue !== 50).length / questions.length) * 100);

  return (
    <DashboardLayout title="Ethics Balance Slider Demo" subtitle="Демонстрация слайдеров этических дилемм">
      <div className="space-y-6">
        {/* Навигация */}
        <div className="mb-6">
          <Link href="/ai-ethics-v2">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к курсу
            </Button>
          </Link>
        </div>

        {/* Заголовок и прогресс */}
        <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-white">Этические дилеммы: найдите баланс</CardTitle>
                <p className="text-purple-200 mt-2">
                  Используйте слайдеры для поиска оптимального баланса в сложных этических ситуациях
                </p>
              </div>
              <Button onClick={resetActivity} variant="outline" className="border-purple-400 text-purple-200">
                <RotateCcw className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-purple-200">
                <span>Прогресс: {questions.filter(q => q.currentValue !== 50).length}/{questions.length}</span>
                <span>{progress}% завершено</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Результат */}
        {completed && (
          <Card className="bg-green-900 border-green-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Анализ завершен!</h3>
                    <p className="text-green-200">Ваш этический баланс: {score}/100 баллов</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                  {score >= 80 ? 'Отличный баланс!' : score >= 60 ? 'Хороший подход!' : 'Продолжайте практиковаться'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Вопросы со слайдерами */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white flex items-center">
                      <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                        {index + 1}
                      </span>
                      {question.title}
                    </CardTitle>
                    <p className="text-gray-400 mt-2">{question.description}</p>
                  </div>
                  <Badge className={`${getSliderColor(question)} text-white`}>
                    {question.currentValue}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm italic">"{question.scenario}"</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{question.minLabel}</span>
                      <span>{question.maxLabel}</span>
                    </div>
                    
                    <Slider
                      value={[question.currentValue]}
                      onValueChange={(value) => handleSliderChange(question.id, value)}
                      max={100}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    
                    <div className="text-center">
                      <span className="text-white font-medium">{question.currentValue}%</span>
                    </div>
                  </div>

                  {/* Индикатор оптимального диапазона */}
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Оптимальный диапазон: {question.optimalRange[0]}% - {question.optimalRange[1]}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Кнопка завершения */}
        <div className="text-center">
          <Button 
            onClick={calculateScore}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
            disabled={completed}
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Завершить анализ
          </Button>
        </div>

        {/* Инструкции */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold text-white mb-3">Как выполнить задание:</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">1.</span>
                <span className="text-gray-300">Прочитайте сценарий этической дилеммы</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">2.</span>
                <span className="text-gray-300">Найдите баланс с помощью слайдера</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">3.</span>
                <span className="text-gray-300">Стремитесь к зеленому оптимальному диапазону</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
