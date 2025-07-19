import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { CheckCircle, RotateCcw, ArrowLeft, Link2 } from 'lucide-react';
import { Link } from 'wouter';

interface MatchItem {
  id: string;
  text: string;
  type: 'principle' | 'example';
  matchId: string;
}

interface Match {
  id: string;
  principle: string;
  example: string;
  description: string;
}

export default function MatchingDemo() {
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedPrinciple, setSelectedPrinciple] = useState<string | null>(null);

  const correctMatches: Match[] = [
    {
      id: 'transparency',
      principle: 'Принцип прозрачности',
      example: 'LIME объяснение решений модели',
      description: 'Пользователи должны понимать, как ИИ принимает решения'
    },
    {
      id: 'fairness',
      principle: 'Принцип справедливости',
      example: 'Аудит на предвзятость алгоритма найма',
      description: 'ИИ не должен дискриминировать определенные группы'
    },
    {
      id: 'accountability',
      principle: 'Принцип подотчетности',
      example: 'Журнал решений автономного авто',
      description: 'Кто-то должен нести ответственность за решения ИИ'
    },
    {
      id: 'privacy',
      principle: 'Принцип приватности',
      example: 'Дифференциальная приватность в данных',
      description: 'Персональные данные должны быть защищены'
    },
    {
      id: 'beneficence',
      principle: 'Принцип благотворности',
      example: 'ИИ-диагностика для редких болезней',
      description: 'ИИ должен приносить пользу обществу'
    },
    {
      id: 'autonomy',
      principle: 'Принцип автономии человека',
      example: 'Отключение автопилота по желанию',
      description: 'Люди должны сохранять контроль над важными решениями'
    }
  ];

  const [principles] = useState<MatchItem[]>(
    correctMatches.map(m => ({
      id: `principle-${m.id}`,
      text: m.principle,
      type: 'principle' as const,
      matchId: m.id
    }))
  );

  const [examples, setExamples] = useState<MatchItem[]>(
    correctMatches.map(m => ({
      id: `example-${m.id}`,
      text: m.example,
      type: 'example' as const,
      matchId: m.id
    })).sort(() => Math.random() - 0.5) // Перемешиваем примеры
  );

  const handlePrincipleClick = (principleId: string) => {
    if (selectedPrinciple === principleId) {
      setSelectedPrinciple(null);
    } else {
      setSelectedPrinciple(principleId);
    }
  };

  const handleExampleClick = (exampleId: string) => {
    if (!selectedPrinciple) return;

    const newMatches = { ...matches };
    
    // Удаляем предыдущие связи для этого принципа и примера
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === exampleId || key === selectedPrinciple) {
        delete newMatches[key];
      }
    });

    // Создаем новую связь
    newMatches[selectedPrinciple] = exampleId;
    setMatches(newMatches);
    setSelectedPrinciple(null);
  };

  const removeMatch = (principleId: string) => {
    const newMatches = { ...matches };
    delete newMatches[principleId];
    setMatches(newMatches);
  };

  const checkAnswers = () => {
    let correctCount = 0;
    Object.entries(matches).forEach(([principleId, exampleId]) => {
      const principle = principles.find(p => p.id === principleId);
      const example = examples.find(e => e.id === exampleId);
      
      if (principle && example && principle.matchId === example.matchId) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / correctMatches.length) * 100);
    setScore(percentage);
    setCompleted(true);
  };

  const resetActivity = () => {
    setMatches({});
    setSelectedPrinciple(null);
    setCompleted(false);
    setScore(0);
  };

  const getMatchStatus = (principleId: string, exampleId: string) => {
    const principle = principles.find(p => p.id === principleId);
    const example = examples.find(e => e.id === exampleId);
    
    if (!principle || !example) return 'none';
    
    return principle.matchId === example.matchId ? 'correct' : 'incorrect';
  };

  const isExampleMatched = (exampleId: string) => {
    return Object.values(matches).includes(exampleId);
  };

  const progress = Math.round((Object.keys(matches).length / correctMatches.length) * 100);

  return (
    <DashboardLayout title="Ethics Matching Demo" subtitle="Соединение принципов этики ИИ с примерами">
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
                <CardTitle className="text-2xl text-white">Соединение пар: принципы и примеры</CardTitle>
                <p className="text-purple-200 mt-2">
                  Соедините принципы этики ИИ с соответствующими практическими примерами
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
                <span>Соединений: {Object.keys(matches).length}/{correctMatches.length}</span>
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
                    <h3 className="text-xl font-bold text-white">Задание завершено!</h3>
                    <p className="text-green-200">Правильных соответствий: {score}%</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                  {score >= 90 ? 'Превосходно!' : score >= 70 ? 'Отлично!' : score >= 50 ? 'Хорошо!' : 'Попробуйте еще раз'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Инструкции */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 mb-3">
              <Link2 className="h-5 w-5 text-purple-400" />
              <h4 className="text-lg font-semibold text-white">Как соединять пары:</h4>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">1.</span>
                <span className="text-gray-300">Кликните на принцип слева (выделится фиолетовым)</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">2.</span>
                <span className="text-gray-300">Кликните на соответствующий пример справа</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-400 font-bold">3.</span>
                <span className="text-gray-300">Зеленые связи - правильно, красные - исправьте</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Области соединения */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Принципы этики */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                Принципы этики ИИ
              </CardTitle>
              <p className="text-gray-400">Выберите принцип для соединения</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {principles.map((principle) => {
                  const isSelected = selectedPrinciple === principle.id;
                  const matchedExampleId = matches[principle.id];
                  const isMatched = !!matchedExampleId;
                  const status = isMatched ? getMatchStatus(principle.id, matchedExampleId) : 'none';
                  
                  return (
                    <div
                      key={principle.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-900/30' 
                          : status === 'correct'
                          ? 'border-green-500 bg-green-900/20'
                          : status === 'incorrect'
                          ? 'border-red-500 bg-red-900/20'
                          : 'border-gray-600 bg-gray-700/50 hover:border-purple-400 hover:bg-gray-700'
                      }`}
                      onClick={() => handlePrincipleClick(principle.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{principle.text}</span>
                        <div className="flex items-center space-x-2">
                          {status === 'correct' && <CheckCircle className="h-4 w-4 text-green-400" />}
                          {status === 'incorrect' && <div className="h-4 w-4 rounded-full bg-red-500"></div>}
                          {isMatched && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMatch(principle.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </div>
                      {isMatched && (
                        <div className="mt-2 text-sm text-gray-400">
                          <Link2 className="h-3 w-3 inline mr-1" />
                          Соединено с: "{examples.find(e => e.id === matchedExampleId)?.text}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Примеры применения */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                Практические примеры
              </CardTitle>
              <p className="text-gray-400">Примеры применения принципов</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {examples.map((example) => {
                  const isMatched = isExampleMatched(example.id);
                  const matchedPrincipleId = Object.keys(matches).find(k => matches[k] === example.id);
                  const status = matchedPrincipleId ? getMatchStatus(matchedPrincipleId, example.id) : 'none';
                  const isClickable = selectedPrinciple !== null && !isMatched;
                  
                  return (
                    <div
                      key={example.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isClickable
                          ? 'border-blue-400 bg-blue-900/20 cursor-pointer hover:bg-blue-900/30'
                          : status === 'correct'
                          ? 'border-green-500 bg-green-900/20'
                          : status === 'incorrect'
                          ? 'border-red-500 bg-red-900/20 cursor-pointer hover:bg-red-900/30'
                          : isMatched
                          ? 'border-gray-500 bg-gray-700/30'
                          : 'border-gray-600 bg-gray-700/50'
                      }`}
                      onClick={() => {
                        if (isClickable || status === 'incorrect') {
                          handleExampleClick(example.id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          isClickable ? 'text-blue-300' : 'text-white'
                        }`}>
                          {example.text}
                        </span>
                        <div className="flex items-center space-x-2">
                          {status === 'correct' && <CheckCircle className="h-4 w-4 text-green-400" />}
                          {status === 'incorrect' && <div className="h-4 w-4 rounded-full bg-red-500"></div>}
                          {isMatched && status !== 'none' && (
                            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                          )}
                        </div>
                      </div>
                      {isMatched && matchedPrincipleId && (
                        <div className="mt-2 text-sm text-gray-400">
                          <Link2 className="h-3 w-3 inline mr-1" />
                          Принцип: "{principles.find(p => p.id === matchedPrincipleId)?.text}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Кнопка проверки */}
        {Object.keys(matches).length === correctMatches.length && !completed && (
          <div className="text-center">
            <Button 
              onClick={checkAnswers}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Проверить ответы
            </Button>
          </div>
        )}

        {/* Объяснения после завершения */}
        {completed && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Объяснения соответствий</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {correctMatches.map((match) => {
                  const userMatch = matches[`principle-${match.id}`];
                  const isCorrect = userMatch === `example-${match.id}`;
                  
                  return (
                    <div
                      key={match.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        isCorrect ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {isCorrect ? 
                          <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" /> :
                          <div className="h-5 w-5 rounded-full bg-red-500 mt-0.5"></div>
                        }
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-1">{match.principle}</h4>
                          <p className="text-blue-300 mb-2">↔ {match.example}</p>
                          <p className="text-gray-400 text-sm">{match.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
