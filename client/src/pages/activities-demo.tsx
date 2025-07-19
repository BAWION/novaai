import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { 
  ArrowLeft, 
  Move3D, 
  Sliders, 
  Link2, 
  FileSearch,
  Clock,
  Users,
  Brain
} from 'lucide-react';
import { Link } from 'wouter';

interface Activity {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  difficulty: 'Легко' | 'Средне' | 'Сложно';
  skills: string[];
  route: string;
  color: string;
}

export default function ActivitiesDemo() {
  const activities: Activity[] = [
    {
      id: 'card-sort',
      title: 'Классификация этических концепций',
      description: 'Интерактивное упражнение по сортировке и классификации ключевых понятий этики ИИ с помощью drag-and-drop интерфейса.',
      icon: <Move3D className="h-6 w-6" />,
      duration: '10-15 мин',
      difficulty: 'Легко',
      skills: ['Категоризация', 'Основы этики', 'Критическое мышление'],
      route: '/card-sort-demo',
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'slider-balance',
      title: 'Этические дилеммы: поиск баланса',
      description: 'Используйте интерактивные слайдеры для поиска оптимального баланса в сложных этических ситуациях ИИ.',
      icon: <Sliders className="h-6 w-6" />,
      duration: '15-20 мин',
      difficulty: 'Средне',
      skills: ['Принятие решений', 'Балансировка интересов', 'Этические дилеммы'],
      route: '/slider-demo',
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'matching-pairs',
      title: 'Соединение принципов и примеров',
      description: 'Соедините абстрактные принципы этики ИИ с конкретными практическими примерами их применения.',
      icon: <Link2 className="h-6 w-6" />,
      duration: '12-18 мин',
      difficulty: 'Средне',
      skills: ['Связывание концепций', 'Практическое применение', 'Системное мышление'],
      route: '/matching-demo',
      color: 'from-purple-600 to-violet-600'
    },
    {
      id: 'scenario-analysis',
      title: 'Анализ этических сценариев',
      description: 'Проанализируйте реальные этические дилеммы ИИ и выберите наиболее обоснованные решения с учетом всех факторов.',
      icon: <FileSearch className="h-6 w-6" />,
      duration: '20-30 мин',
      difficulty: 'Сложно',
      skills: ['Анализ сценариев', 'Комплексная оценка', 'Этическое обоснование'],
      route: '/scenario-demo',
      color: 'from-orange-600 to-red-600'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Легко': return 'bg-green-600';
      case 'Средне': return 'bg-yellow-600';
      case 'Сложно': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getTotalDuration = () => {
    // Примерный расчет общего времени
    return '60-85 минут';
  };

  const getTotalSkills = () => {
    const allSkills = activities.flatMap(activity => activity.skills);
    return [...new Set(allSkills)].length;
  };

  return (
    <DashboardLayout title="Interactive Activities Hub" subtitle="Интерактивные активности курса этики ИИ">
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

        {/* Обзор курса */}
        <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center">
              <Brain className="h-8 w-8 mr-3" />
              Интерактивные активности: Этика ИИ 2.0
            </CardTitle>
            <p className="text-purple-200 mt-2">
              Изучайте этику искусственного интеллекта через практические упражнения в стиле Brilliant.org
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 rounded-lg p-4">
                <Clock className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                <h3 className="font-semibold text-white">Общее время</h3>
                <p className="text-purple-200">{getTotalDuration()}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Users className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                <h3 className="font-semibold text-white">Активности</h3>
                <p className="text-purple-200">{activities.length} интерактивных упражнения</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Brain className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                <h3 className="font-semibold text-white">Навыки</h3>
                <p className="text-purple-200">{getTotalSkills()} ключевых навыков</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Список активностей */}
        <div className="grid gap-6">
          {activities.map((activity, index) => (
            <Card key={activity.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${activity.color}`}>
                      <div className="text-white">
                        {activity.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <CardTitle className="text-xl text-white">{activity.title}</CardTitle>
                      </div>
                      <p className="text-gray-300 mb-3">{activity.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{activity.duration}</span>
                        </div>
                        
                        <Badge className={`${getDifficultyColor(activity.difficulty)} text-white`}>
                          {activity.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Link href={activity.route}>
                    <Button className="bg-purple-600 hover:bg-purple-700 px-6">
                      Начать
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Развиваемые навыки:</h4>
                  <div className="flex flex-wrap gap-2">
                    {activity.skills.map((skill, skillIndex) => (
                      <Badge 
                        key={skillIndex} 
                        variant="secondary" 
                        className="bg-gray-700 text-gray-300 border-gray-600"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Рекомендации по прохождению */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Рекомендации по прохождению</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">🎯 Оптимальная последовательность:</h4>
                <ol className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400 font-bold">1.</span>
                    <span>Начните с <strong>классификации концепций</strong> для понимания основ</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 font-bold">2.</span>
                    <span>Изучите <strong>принципы и примеры</strong> для связи теории с практикой</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-purple-400 font-bold">3.</span>
                    <span>Практикуйте <strong>поиск баланса</strong> в этических дилеммах</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-400 font-bold">4.</span>
                    <span>Завершите <strong>анализом сценариев</strong> для комплексного применения</span>
                  </li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">💡 Советы для успеха:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400">•</span>
                    <span>Не торопитесь — обдумывайте каждое решение</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400">•</span>
                    <span>Рассматривайте все заинтересованные стороны</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400">•</span>
                    <span>Изучайте объяснения после каждого задания</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-400">•</span>
                    <span>Повторяйте активности для закрепления</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Быстрый доступ */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Быстрый доступ</CardTitle>
            <p className="text-gray-400">Переходите к любой активности напрямую</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {activities.map((activity) => (
                <Link key={activity.id} href={activity.route}>
                  <Button 
                    variant="outline" 
                    className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-gray-600 hover:border-purple-400 hover:bg-purple-900/20"
                  >
                    <div className="text-purple-400">
                      {activity.icon}
                    </div>
                    <span className="text-xs text-center text-gray-300 leading-tight">
                      {activity.title.split(' ')[0]}
                    </span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
