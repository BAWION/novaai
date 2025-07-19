import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Zap, FileText, Download } from 'lucide-react';

interface LightningEthicsEmbeddedProps {
  onComplete?: (results: any) => void;
}

interface FormData {
  projectType: string;
  dataSource: string;
  targetUsers: string;
  businessImpact: string;
  answers: Record<string, boolean>;
}

export const LightningEthicsEmbedded: React.FC<LightningEthicsEmbeddedProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    projectType: '',
    dataSource: '',
    targetUsers: '',
    businessImpact: '',
    answers: {}
  });

  const questions = [
    {
      category: "Предвзятость данных",
      items: [
        "Представлены ли все демографические группы в ваших данных?",
        "Проводили ли вы проверку на исторические предвзятости?",
        "Тестировали ли модель на справедливость к разным группам?"
      ]
    },
    {
      category: "Прозрачность",
      items: [
        "Можете ли вы объяснить решения модели пользователям?",
        "Доступна ли документация об алгоритме?",
        "Есть ли механизм обжалования решений?"
      ]
    },
    {
      category: "Конфиденциальность",
      items: [
        "Соблюдается ли GDPR/152-ФЗ при обработке данных?",
        "Минимизирован ли сбор персональных данных?",
        "Получено ли согласие пользователей на обработку?"
      ]
    },
    {
      category: "Надежность",
      items: [
        "Тестировалась ли модель на крайних случаях?",
        "Есть ли система мониторинга качества?",
        "Предусмотрен ли план отката при сбоях?"
      ]
    }
  ];

  const handleProjectDetailsSubmit = () => {
    if (formData.projectType && formData.dataSource && formData.targetUsers && formData.businessImpact) {
      setStep(2);
    }
  };

  const handleQuestionAnswer = (questionIndex: number, itemIndex: number, answer: boolean) => {
    setFormData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [`${questionIndex}-${itemIndex}`]: answer
      }
    }));
  };

  const runAssessment = async () => {
    setLoading(true);
    
    // Симуляция анализа
    setTimeout(() => {
      setResults({
        ethicsScore: 85,
        riskLevel: 'medium',
        recommendations: [
          'Добавить аудит на предвзятость',
          'Улучшить документацию алгоритма',
          'Внедрить мониторинг качества'
        ]
      });
      setStep(3);
      setLoading(false);
      onComplete?.({
        ethicsScore: 85,
        completed: true
      });
    }, 2000);
  };

  const renderProjectDetails = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <Zap className="w-6 h-6 text-orange-500 mr-2" />
          <h3 className="text-xl font-semibold">Lightning Ethics Lab</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          20 минут → готовый отчёт об этичности вашего ИИ-проекта
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Тип ИИ-проекта</label>
          <Select value={formData.projectType} onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите тип проекта" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ML модель">ML модель</SelectItem>
              <SelectItem value="NLP система">NLP система</SelectItem>
              <SelectItem value="Computer Vision">Computer Vision</SelectItem>
              <SelectItem value="Рекомендательная система">Рекомендательная система</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Источник данных</label>
          <Select value={formData.dataSource} onValueChange={(value) => setFormData(prev => ({ ...prev, dataSource: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите источник" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Внутренние данные">Внутренние данные</SelectItem>
              <SelectItem value="Публичные источники">Публичные источники</SelectItem>
              <SelectItem value="Пользовательские данные">Пользовательские данные</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Целевые пользователи</label>
          <Select value={formData.targetUsers} onValueChange={(value) => setFormData(prev => ({ ...prev, targetUsers: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите пользователей" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Сотрудники">Сотрудники</SelectItem>
              <SelectItem value="Клиенты">Клиенты</SelectItem>
              <SelectItem value="Партнёры">Партнёры</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Бизнес-влияние</label>
          <Select value={formData.businessImpact} onValueChange={(value) => setFormData(prev => ({ ...prev, businessImpact: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите уровень" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Низкое">Низкое</SelectItem>
              <SelectItem value="Среднее">Среднее</SelectItem>
              <SelectItem value="Высокое">Высокое</SelectItem>
              <SelectItem value="Критическое">Критическое</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleProjectDetailsSubmit}
        className="w-full"
        disabled={!formData.projectType || !formData.dataSource || !formData.targetUsers || !formData.businessImpact}
      >
        Перейти к оценке рисков →
      </Button>
    </div>
  );

  const renderQuestions = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">Оценка этических рисков</h3>
        <Progress value={Object.keys(formData.answers).length / 12 * 100} className="max-w-md mx-auto" />
      </div>

      {questions.map((questionGroup, groupIndex) => (
        <Card key={groupIndex}>
          <CardHeader>
            <CardTitle className="text-lg">{questionGroup.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {questionGroup.items.map((question, itemIndex) => (
              <div key={itemIndex} className="flex items-start justify-between gap-4">
                <p className="text-sm flex-1">{question}</p>
                <div className="flex gap-2">
                  <Button
                    variant={formData.answers[`${groupIndex}-${itemIndex}`] === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleQuestionAnswer(groupIndex, itemIndex, true)}
                  >
                    Да
                  </Button>
                  <Button
                    variant={formData.answers[`${groupIndex}-${itemIndex}`] === false ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => handleQuestionAnswer(groupIndex, itemIndex, false)}
                  >
                    Нет
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Button 
        onClick={runAssessment}
        className="w-full"
        disabled={loading || Object.keys(formData.answers).length < 12}
      >
        {loading ? 'Анализ...' : 'Запустить анализ этичности'}
      </Button>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Анализ завершен!</h3>
        <p className="text-sm text-muted-foreground">
          Оценка этичности: <Badge className="ml-2">{results?.ethicsScore}/100</Badge>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Рекомендации</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results?.recommendations?.map((rec: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button className="w-full" variant="outline">
        <Download className="w-4 h-4 mr-2" />
        Скачать отчет
      </Button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {step === 1 && renderProjectDetails()}
      {step === 2 && renderQuestions()}
      {step === 3 && renderResults()}
    </div>
  );
};
