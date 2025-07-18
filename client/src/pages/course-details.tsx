import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/dashboard-layout';
import Glassmorphism from '@/components/ui/glassmorphism';
import LevelBadge from '@/components/ui/level-badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function CourseDetails() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFavorited, setIsFavorited] = useState(false);

  // Загружаем данные курса по slug
  const { data: course, isLoading } = useQuery({
    queryKey: ['/api/courses', slug],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${slug}`);
      if (!response.ok) {
        throw new Error('Курс не найден');
      }
      return response.json();
    }
  });

  // Mutation для добавления в избранное
  const favoriteCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return apiRequest('POST', '/api/events', {
        eventType: 'bookmark',
        entityType: 'course',
        entityId: courseId,
        data: { action: 'add_to_favorites', timestamp: new Date().toISOString() }
      });
    },
    onSuccess: () => {
      setIsFavorited(true);
      toast({
        title: "Добавлено в избранное",
        description: "Курс успешно добавлен в ваш список избранных",
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить курс в избранное",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Загрузка курса..." subtitle="">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/60">Загружаем информацию о курсе...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout title="Курс не найден" subtitle="">
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-20">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3 className="text-xl font-semibold mb-2">Курс не найден</h3>
          <p className="text-white/60 mb-6">
            Запрашиваемый курс не существует или был удален
          </p>
          <Link href="/catalog">
            <button className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white py-2 px-6 rounded-lg">
              Вернуться к каталогу
            </button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Начальный';
      case 2: return 'Базовый';
      case 3: return 'Средний';
      case 4: return 'Продвинутый';
      case 5: return 'Экспертный';
      default: return 'Не указан';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'text-green-400';
      case 2: return 'text-blue-400';
      case 3: return 'text-yellow-400';
      case 4: return 'text-orange-400';
      case 5: return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const totalDuration = course.modules?.reduce((acc: number, module: any) => acc + (module.estimatedDuration || 0), 0) || 0;
  const totalLessons = course.modules?.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0) || 0;

  return (
    <DashboardLayout 
      title={course.title} 
      subtitle="Детали курса"
    >
      <div className="space-y-6">
        {/* Хлебные крошки */}
        <nav className="flex items-center space-x-2 text-sm text-white/60">
          <Link href="/catalog" className="hover:text-white transition-colors">
            Каталог курсов
          </Link>
          <span>/</span>
          <span className="text-white">{course.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Основная информация */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-2/3"
          >
            <Glassmorphism className="p-6 rounded-xl">
              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#6E3AFF] to-[#9E6AFF] flex items-center justify-center text-white">
                  <i className={`fas fa-${course.icon || 'book'} text-3xl`}></i>
                </div>
                <div className="flex-1">
                  <h1 className="font-orbitron text-3xl font-bold mb-2">
                    {course.title}
                  </h1>
                  <div className="flex flex-wrap gap-3">
                    <LevelBadge level={course.level || 'beginner'} />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                      {getDifficultyLabel(course.difficulty)}
                    </span>
                    <span className="px-3 py-1 bg-white/10 text-white/70 text-sm rounded-full">
                      {course.modules?.length || 0} модулей
                    </span>
                  </div>
                </div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {Math.floor(totalDuration / 60)}ч {totalDuration % 60}м
                  </div>
                  <div className="text-sm text-white/60">Продолжительность</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {course.modules?.length || 0}
                  </div>
                  <div className="text-sm text-white/60">Модулей</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {totalLessons}
                  </div>
                  <div className="text-sm text-white/60">Уроков</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    4.8
                  </div>
                  <div className="text-sm text-white/60">Рейтинг</div>
                </div>
              </div>

              {/* Описание */}
              <div className="mb-8">
                <h3 className="font-medium text-xl mb-4">О курсе</h3>
                <p className="text-white/70 leading-relaxed text-lg">
                  {course.description}
                </p>
              </div>

              {/* Что вы изучите */}
              <div className="mb-8">
                <h3 className="font-medium text-xl mb-4">Что вы изучите</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.modules?.slice(0, 6).map((module: any, index: number) => (
                    <div key={module.id} className="flex items-start">
                      <div className="text-green-400 mr-3 mt-1">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="text-white/80">{module.title}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setLocation(`/courses/${course.slug}`)}
                  className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-8 rounded-lg font-medium transition duration-300 flex items-center text-lg"
                >
                  <i className="fas fa-play-circle mr-3"></i>
                  Начать обучение
                </button>
                
                <button 
                  onClick={() => favoriteCourseMutation.mutate(course.id)}
                  disabled={favoriteCourseMutation.isPending || isFavorited}
                  className={`py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center ${
                    isFavorited 
                      ? 'bg-yellow-500/20 text-yellow-400 cursor-default' 
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <i className={`mr-2 ${isFavorited ? 'fas fa-bookmark' : 'far fa-bookmark'}`}></i>
                  {favoriteCourseMutation.isPending ? 'Добавляем...' : isFavorited ? 'В избранном' : 'В избранное'}
                </button>

                <button 
                  onClick={() => {
                    navigator.share?.({
                      title: course.title,
                      text: course.description,
                      url: window.location.href
                    });
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center"
                >
                  <i className="fas fa-share-alt mr-2"></i>
                  Поделиться
                </button>
              </div>
            </Glassmorphism>
          </motion.div>
          
          {/* Боковая панель */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/3"
          >
            <Glassmorphism className="p-6 rounded-xl mb-6">
              <h3 className="font-orbitron text-lg font-bold mb-6 text-center">
                Учебный план
              </h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {course.modules?.map((module: any, index: number) => (
                  <div key={module.id} className="border border-white/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {index + 1}. {module.title}
                      </h4>
                      <span className="text-xs text-white/50">
                        {module.lessons?.length || 0} урок{module.lessons?.length === 1 ? '' : module.lessons?.length < 5 ? 'а' : 'ов'}
                      </span>
                    </div>
                    <div className="text-sm text-white/70 mb-2 line-clamp-2">
                      {module.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50">
                        {Math.floor((module.estimatedDuration || 0) / 60)}ч {(module.estimatedDuration || 0) % 60}м
                      </span>
                      <i className={`fas ${index === 0 ? 'fa-play-circle text-primary' : 'fa-lock text-white/30'}`}></i>
                    </div>
                  </div>
                ))}
              </div>
            </Glassmorphism>

            {/* Требования */}
            <Glassmorphism className="p-6 rounded-xl mb-6">
              <h4 className="font-medium mb-4">Требования</h4>
              <ul className="text-sm text-white/70 space-y-2">
                <li className="flex items-start">
                  <i className="fas fa-check text-green-400 mr-2 mt-1 text-xs"></i>
                  Базовые навыки работы с компьютером
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-400 mr-2 mt-1 text-xs"></i>
                  Желание изучать новые технологии
                </li>
                <li className="flex items-start">
                  <i className="fas fa-check text-green-400 mr-2 mt-1 text-xs"></i>
                  Интернет-соединение для просмотра материалов
                </li>
              </ul>
            </Glassmorphism>

            {/* Инструктор */}
            <Glassmorphism className="p-6 rounded-xl">
              <h4 className="font-medium mb-4">Инструктор</h4>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center mr-4">
                  <i className="fas fa-user text-white"></i>
                </div>
                <div>
                  <div className="font-medium">Nova AI</div>
                  <div className="text-sm text-white/60">AI-эксперт и тьютор</div>
                </div>
              </div>
              <p className="text-sm text-white/70 mt-4">
                Персональный AI-помощник с экспертизой в области искусственного интеллекта и машинного обучения.
              </p>
            </Glassmorphism>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}