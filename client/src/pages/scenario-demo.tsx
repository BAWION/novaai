import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { CheckCircle, RotateCcw, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'wouter';

interface ScenarioOption {
  id: string;
  text: string;
  score: number;
  explanation: string;
  consequences: string[];
}

interface EthicsScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  stakeholders: string[];
  options: ScenarioOption[];
}

export default function ScenarioDemo() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const scenarios: EthicsScenario[] = [
    {
      id: 'autonomous-car',
      title: 'Дилемма автономного автомобиля',
      description: 'Автомобиль с ИИ должен сделать выбор в неизбежной аварии',
      context: 'Автономный автомобиль едет по дороге. Внезапно на дорогу выбегает группа детей. Автомобиль может: либо наехать на детей (возможно, убив их), либо свернуть в сторону и врезаться в стену (возможно, убив пассажира).',
      stakeholders: ['Пассажир автомобиля', 'Дети на дороге', 'Их семьи', 'Производитель ИИ', 'Общество'],
      options: [
        {
          id: 'hit-children',
          text: 'Продолжить движение прямо (сохранить жизнь пассажира)',
          score: 20,
          explanation: 'Приоритет жизни пассажира, но игнорирование большего количества жизней.',
          consequences: ['Смерть нескольких детей', 'Общественное возмущение', 'Правовые последствия для производителя']
        },
        {
          id: 'hit-wall',
          text: 'Свернуть и врезаться в стену (сохранить жизнь детей)',
          score: 70,
          explanation: 'Минимизация общего вреда и защита невинных.',
          consequences: ['Возможная смерть пассажира', 'Спасение нескольких детей', 'Этически более оправданное решение']
        },
        {
          id: 'random-choice',
          text: 'Случайный выбор (оставить решение на волю случая)',
          score: 30,
          explanation: 'Избежание программирования этического выбора, но уклонение от ответственности.',
          consequences: ['Непредсказуемый результат', 'Снижение доверия к ИИ', 'Этическая безответственность']
        },
        {
          id: 'minimize-harm',
          text: 'Попытаться минимизировать общий вред (комплексный алгоритм)',
          score: 90,
          explanation: 'Наилучший подход: учет всех факторов и минимизация общего вреда.',
          consequences: ['Максимальная этическая обоснованность', 'Сложность реализации', 'Высокое общественное доверие']
        }
      ]
    },
    {
      id: 'ai-hiring',
      title: 'ИИ в найме сотрудников',
      description: 'Система ИИ показывает предвзятость в отборе кандидатов',
      context: 'Ваша компания использует ИИ для скрининга резюме. Система показывает 15% улучшение качества найма, но аналитика выявила, что алгоритм систематически дискриминирует женщин и представителей меньшинств из-за исторических данных.',
      stakeholders: ['Кандидаты на работу', 'HR-отдел', 'Акционеры компании', 'Сотрудники', 'Общество'],
      options: [
        {
          id: 'ignore-bias',
          text: 'Продолжать использовать систему (приоритет эффективности)',
          score: 10,
          explanation: 'Игнорирование дискриминации ради прибыли неэтично.',
          consequences: ['Продолжение дискриминации', 'Правовые риски', 'Репутационный ущерб', 'Социальная несправедливость']
        },
        {
          id: 'remove-ai',
          text: 'Полностью отказаться от ИИ (вернуться к ручному отбору)',
          score: 40,
          explanation: 'Безопасно, но упускает потенциальные выгоды ответственного ИИ.',
          consequences: ['Устранение предвзятости ИИ', 'Потеря эффективности', 'Возврат к человеческой предвзятости']
        },
        {
          id: 'quick-fix',
          text: 'Применить быстрые исправления (квоты по полу/расе)',
          score: 50,
          explanation: 'Частичное решение, но не устраняет корневую проблему.',
          consequences: ['Временное улучшение', 'Возможна обратная дискриминация', 'Не решает системную проблему']
        },
        {
          id: 'comprehensive-audit',
          text: 'Провести полный аудит и переобучить модель',
          score: 95,
          explanation: 'Наилучший подход: устранение корневых причин предвзятости.',
          consequences: ['Справедливая система', 'Временные затраты', 'Долгосрочная эффективность', 'Этический лидерство']
        }
      ]
    },
    {
      id: 'data-privacy',
      title: 'Приватность данных vs Общественная польза',
      description: 'Использование личных данных для борьбы с пандемией',
      context: 'Во время пандемии правительство просит вашу компанию (владеющую популярным приложением) предоставить анонимизированные данные о перемещении пользователей для отслеживания распространения болезни и спасения жизней.',
      stakeholders: ['Пользователи приложения', 'Правительство', 'Медицинские власти', 'Общество', 'Компания'],
      options: [
        {
          id: 'refuse-completely',
          text: 'Полностью отказаться предоставлять данные',
          score: 30,
          explanation: 'Защита приватности, но игнорирование общественной пользы.',
          consequences: ['Максимальная приватность', 'Возможные дополнительные смерти', 'Правовое давление']
        },
        {
          id: 'provide-raw-data',
          text: 'Предоставить необработанные данные правительству',
          score: 20,
          explanation: 'Максимальная польза для здравоохранения, но серьезное нарушение приватности.',
          consequences: ['Высокая эффективность борьбы с пандемией', 'Нарушение приватности', 'Потеря доверия пользователей']
        },
        {
          id: 'anonymized-aggregate',
          text: 'Предоставить агрегированные анонимизированные данные',
          score: 80,
          explanation: 'Хороший баланс между пользой и приватностью.',
          consequences: ['Помощь в борьбе с пандемией', 'Сохранение анонимности', 'Приемлемый риск деанонимизации']
        },
        {
          id: 'user-consent-system',
          text: 'Создать систему добровольного согласия пользователей',
          score: 95,
          explanation: 'Идеальный подход: уважение автономии пользователей при помощи обществу.',
          consequences: ['Полное уважение согласия', 'Возможно меньший охват данных', 'Максимальная этичность', 'Укрепление доверия']
        }
      ]
    }
  ];

  const handleOptionSelect = (scenarioId: string, optionId: string) => {
    setUserChoices(prev => ({
      ...prev,
      [scenarioId]: optionId
    }));
  };

  const goToNextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
    } else {
      calculateFinalScore();
    }
  };

  const goToPreviousScenario = () => {
    if (currentScenario > 0) {
      setCurrentScenario(currentScenario - 1);
    }
  };

  const calculateFinalScore = () => {
    let score = 0;
    scenarios.forEach(scenario => {
      const choice = userChoices[scenario.id];
      if (choice) {
        const option = scenario.options.find(opt => opt.id === choice);
        if (option) {
          score += option.score;
        }
      }
    });
    setTotalScore(Math.round(score / scenarios.length));
    setCompleted(true);
  };

  const resetActivity = () => {
    setCurrentScenario(0);
    setUserChoices({});
    setCompleted(false);
    setTotalScore(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Этический эксперт';
    if (score >= 80) return 'Хорошее понимание';
    if (score >= 60) return 'Средний уровень';
    if (score >= 40) return 'Требуется изучение';
    return 'Начинающий';
  };

  const progress = Math.round(((Object.keys(userChoices).length) / scenarios.length) * 100);
  const scenario = scenarios[currentScenario];
  const selectedOption = userChoices[scenario?.id];

  if (completed) {
    return (
      <DashboardLayout title="Ethics Scenario Results" subtitle="Результаты анализа этических сценариев">
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

          {/* Общий результат */}
          <Card className="bg-gradient-to-r from-green-900 to-blue-900 border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                  <div>
                    <h2 className="text-3xl font-bold text-white">Анализ завершен!</h2>
                    <p className="text-green-200">Ваш этический рейтинг: {totalScore}/100</p>
                  </div>
                </div>
                <Badge className={`${getScoreColor(totalScore)} bg-gray-800 px-4 py-2 text-xl`}>
                  {getScoreLabel(totalScore)}
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Button 
                  onClick={resetActivity}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Пройти заново
                </Button>
                <Link href="/ai-ethics-v2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Продолжить курс
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Детальные результаты */}
          <div className="space-y-6">
            {scenarios.map((scenario, index) => {
              const choice = userChoices[scenario.id];
              const option = scenario.options.find(opt => opt.id === choice);
              
              return (
                <Card key={scenario.id} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white flex items-center">
                          <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                            {index + 1}
                          </span>
                          {scenario.title}
                        </CardTitle>
                        <p className="text-gray-400 mt-2">{scenario.description}</p>
                      </div>
                      {option && (
                        <Badge className={`${getScoreColor(option.score)} bg-gray-700 px-3 py-1`}>
                          {option.score}/100
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {option && (
                      <div className="space-y-4">
                        <div className="bg-gray-700/50 p-4 rounded-lg">
                          <h4 className="font-semibold text-white mb-2">Ваш выбор:</h4>
                          <p className="text-blue-300">{option.text}</p>
                        </div>
                        
                        <div className="bg-gray-700/30 p-4 rounded-lg">
                          <h4 className="font-semibold text-white mb-2">Объяснение:</h4>
                          <p className="text-gray-300">{option.explanation}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white mb-2">Последствия:</h4>
                          <ul className="space-y-1">
                            {option.consequences.map((consequence, i) => (
                              <li key={i} className="flex items-start space-x-2 text-gray-300">
                                <span className="text-blue-400 mt-1">•</span>
                                <span>{consequence}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="AI Ethics Scenario Analysis" subtitle="Анализ этических сценариев в ИИ">
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

        {/* Прогресс */}
        <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Сценарий {currentScenario + 1} из {scenarios.length}
                </h2>
                <p className="text-purple-200">Проанализируйте этическую дилемму и выберите лучшее решение</p>
              </div>
              <Button onClick={resetActivity} variant="outline" className="border-purple-400 text-purple-200">
                <RotateCcw className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-purple-200">
                <span>Завершено сценариев: {Object.keys(userChoices).length}/{scenarios.length}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Текущий сценарий */}
        {scenario && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3" />
                {scenario.title}
              </CardTitle>
              <p className="text-gray-400">{scenario.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Контекст */}
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-3">Ситуация:</h4>
                  <p className="text-gray-300">{scenario.context}</p>
                </div>

                {/* Заинтересованные стороны */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Заинтересованные стороны:</h4>
                  <div className="flex flex-wrap gap-2">
                    {scenario.stakeholders.map((stakeholder, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-900/30 text-blue-300 border-blue-700">
                        {stakeholder}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Варианты решения */}
                <div>
                  <h4 className="font-semibold text-white mb-4">Варианты решения:</h4>
                  <div className="space-y-3">
                    {scenario.options.map((option) => (
                      <div
                        key={option.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedOption === option.id
                            ? 'border-purple-500 bg-purple-900/20'
                            : 'border-gray-600 bg-gray-700/30 hover:border-purple-400 hover:bg-gray-700/50'
                        }`}
                        onClick={() => handleOptionSelect(scenario.id, option.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                            selectedOption === option.id
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-400'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-white font-medium">{option.text}</p>
                            {selectedOption === option.id && (
                              <div className="mt-3 pt-3 border-t border-gray-600 space-y-2">
                                <p className="text-gray-300 text-sm">{option.explanation}</p>
                                <div className="flex items-center space-x-2">
                                  <Badge className={`${getScoreColor(option.score)} bg-gray-700`}>
                                    Этический рейтинг: {option.score}/100
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Навигационные кнопки */}
        <div className="flex justify-between">
          <Button
            onClick={goToPreviousScenario}
            disabled={currentScenario === 0}
            variant="outline"
            className="border-gray-600 text-gray-400"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Предыдущий
          </Button>
          
          <Button
            onClick={goToNextScenario}
            disabled={!selectedOption}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {currentScenario === scenarios.length - 1 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Завершить анализ
              </>
            ) : (
              <>
                Следующий
                <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
