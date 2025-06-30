import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ZoomIn, ZoomOut, Telescope } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Course {
  id: number;
  title: string;
  category?: string;
  level?: 'basic' | 'intermediate' | 'advanced';
  modules?: number;
  progress?: number;
  icon?: string;
  description?: string;
}

interface Galaxy {
  id: string;
  name: string;
  domain: string;
  color: string;
  position: { x: number; y: number };
  size: number;
  discovered: boolean;
  courses: Course[];
  rotation: number;
}

interface Planet {
  id: number;
  course: Course;
  galaxy: string;
  position: { x: number; y: number };
  size: number;
  visited: boolean;
  completed: boolean;
  name: string;
}

type ViewState = 'universe' | 'galaxy' | 'system';

interface ViewConfig {
  state: ViewState;
  selectedGalaxy?: string;
  selectedSystem?: string;
  selectedPlanet?: Planet;
  zoom: number;
  centerX: number;
  centerY: number;
}

const generatePlanetName = (course: Course, index: number): string => {
  const prefixes = ['Альфа', 'Бета', 'Гамма', 'Дельта', 'Эпсилон', 'Зета', 'Эта', 'Тета'];
  const suffixes = ['Прима', 'Секунда', 'Терция', 'Кварта', 'Квинта'];
  
  const cleanTitle = course.title
    .replace(/^(Основы|Введение в|Курс по)\s*/i, '')
    .replace(/\s+(101|Basics|Basic)$/i, '')
    .trim();
  
  const shortName = cleanTitle.length > 15 ? cleanTitle.substring(0, 15) + '...' : cleanTitle;
  const prefix = prefixes[index % prefixes.length];
  const suffix = suffixes[index % suffixes.length];
  
  return `${prefix} ${shortName} ${suffix}`;
};

function GalaxyUniverse() {
  const [viewConfig, setViewConfig] = useState<ViewConfig>({
    state: 'system', // Начинаем с вида солнечной системы
    zoom: 1.5,
    centerX: 0,
    centerY: 0,
  });

  const [newDiscovery, setNewDiscovery] = useState<{ name: string; type: 'galaxy' | 'planet' } | null>(null);
  const [selectedSystemInfo, setSelectedSystemInfo] = useState<any>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Получаем курсы из API
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  // Создаем галактики на основе курсов
  const galaxies: Galaxy[] = [
    {
      id: 'ml',
      name: 'Машинное Обучение',
      domain: 'Machine Learning',
      color: 'from-blue-400 to-indigo-600',
      position: { x: -200, y: -150 },
      size: 80,
      discovered: true,
      courses: courses.filter(course => 
        course.category === 'ai' || 
        course.title.toLowerCase().includes('машинное') ||
        course.title.toLowerCase().includes('ml') ||
        course.title.toLowerCase().includes('алгоритм')
      ),
      rotation: 0
    },
    {
      id: 'nlp',
      name: 'Языковые Технологии',
      domain: 'Natural Language Processing',
      color: 'from-green-400 to-emerald-600',
      position: { x: 180, y: -120 },
      size: 75,
      discovered: true,
      courses: courses.filter(course => 
        course.title.toLowerCase().includes('язык') ||
        course.title.toLowerCase().includes('gpt') ||
        course.title.toLowerCase().includes('prompt') ||
        course.title.toLowerCase().includes('чат')
      ),
      rotation: 45
    },
    {
      id: 'vision',
      name: 'Компьютерное Зрение',
      domain: 'Computer Vision',
      color: 'from-purple-400 to-pink-600',
      position: { x: 250, y: 200 },
      size: 70,
      discovered: true,
      courses: courses.filter(course => 
        course.title.toLowerCase().includes('зрение') ||
        course.title.toLowerCase().includes('vision') ||
        course.title.toLowerCase().includes('изображ')
      ),
      rotation: 90
    },
    {
      id: 'ethics',
      name: 'ИИ Этика',
      domain: 'AI Ethics',
      color: 'from-red-400 to-orange-600',
      position: { x: -180, y: 180 },
      size: 65,
      discovered: true,
      courses: courses.filter(course => 
        course.title.toLowerCase().includes('этик') ||
        course.title.toLowerCase().includes('безопасн')
      ),
      rotation: 135
    },
    {
      id: 'robotics',
      name: 'Робототехника',
      domain: 'Robotics & Automation',
      color: 'from-yellow-400 to-amber-600',
      position: { x: -300, y: 0 },
      size: 85,
      discovered: true,
      courses: courses.filter(course => 
        course.title.toLowerCase().includes('робот') ||
        course.title.toLowerCase().includes('автоматизац') ||
        course.title.toLowerCase().includes('telegram') ||
        course.title.toLowerCase().includes('make.com')
      ),
      rotation: 180
    }
  ];

  // Создаем планеты из всех курсов
  const planets: Planet[] = courses.map((course, index) => ({
    id: course.id,
    course,
    galaxy: 'system',
    position: { x: 0, y: 0 },
    size: 40,
    visited: (course.progress || 0) > 0,
    completed: (course.progress || 0) >= 100,
    name: generatePlanetName(course, index)
  }));

  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(planet);
    // Открываем курс
    window.location.href = `/courses/${planet.course.id}`;
  };

  const simulateDiscovery = () => {
    const undiscoveredGalaxies = galaxies.filter(g => !g.discovered);
    if (undiscoveredGalaxies.length > 0) {
      const discovered = undiscoveredGalaxies[0];
      discovered.discovered = true;
      setNewDiscovery({ name: discovered.name, type: 'galaxy' });
      setTimeout(() => setNewDiscovery(null), 5000);
    }
  };

  const handleBackToUniverse = () => {
    setViewConfig({
      state: 'universe',
      zoom: 0.8,
      centerX: 0,
      centerY: 0,
    });
  };

  const handleZoomIn = () => {
    setViewConfig(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 10)
    }));
  };

  const handleZoomOut = () => {
    setViewConfig(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.2, 0.3)
    }));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-space-900 via-space-800 to-space-900 overflow-hidden relative">
      {/* Звездное небо */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 150 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Основной контейнер солнечной системы */}
      <motion.div
        ref={containerRef}
        className="absolute inset-0 z-10"
        style={{
          transform: `scale(${viewConfig.zoom}) translate(${viewConfig.centerX}px, ${viewConfig.centerY}px)`,
        }}
      >
        <AnimatePresence mode="wait">
          {viewConfig.state === 'system' && (
            <motion.div
              key="system-view"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              {/* Орбитальные траектории планет */}
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute border border-white/8 rounded-full pointer-events-none"
                  style={{
                    width: (70 + i * 35) * 2,
                    height: (70 + i * 35) * 2,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{ 
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ 
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}

              {/* Центральная звезда */}
              <motion.div
                className="absolute w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-400 rounded-full shadow-2xl z-20"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 60px rgba(251, 191, 36, 0.8), inset 0 0 30px rgba(251, 191, 36, 0.3)',
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  filter: [
                    'brightness(1) hue-rotate(0deg)',
                    'brightness(1.1) hue-rotate(5deg)',
                    'brightness(1) hue-rotate(0deg)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Планеты-курсы с орбитами */}
              {planets.map((planet, index) => {
                // Распределяем планеты по орбитам с учетом их размера
                const modules = planet.course.modules || 1;
                const estimatedLessons = modules * 2;
                
                // Большие курсы на дальних орбитах, малые ближе к солнцу
                let orbitIndex;
                if (estimatedLessons <= 4) {
                  orbitIndex = index % 2; // Малые планеты на ближних орбитах (0, 1)
                } else if (estimatedLessons <= 10) {
                  orbitIndex = 2 + (index % 2); // Средние планеты на средних орбитах (2, 3)
                } else {
                  orbitIndex = 4 + (index % 2); // Большие планеты на дальних орбитах (4, 5)
                }
                
                const radius = 70 + orbitIndex * 35; // Орбиты: 70, 105, 140, 175, 210, 245px
                
                // Равномерное угловое распределение
                const baseAngle = (index * 137.5 * Math.PI / 180) % (2 * Math.PI); // Золотой угол
                const speedFactor = 1.2 - orbitIndex * 0.15; // Ближние орбиты быстрее
                const angle = Date.now() * 0.0001 * speedFactor + baseAngle;
                
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                // Размеры планет: малый (20-28), средний (32-44), большой (48-60)
                let planetSize;
                if (estimatedLessons <= 4) {
                  planetSize = 20 + estimatedLessons * 2; // Малые планеты: 20-28px
                } else if (estimatedLessons <= 10) {
                  planetSize = 28 + (estimatedLessons - 4) * 2; // Средние планеты: 32-44px
                } else {
                  planetSize = Math.min(60, 44 + (estimatedLessons - 10) * 1.5); // Большие планеты: 48-60px
                }
                
                // Цвета планет в зависимости от прогресса и размера
                const getPlanetColor = () => {
                  const progress = planet.course.progress || 0;
                  if (progress >= 100) return 'from-green-400 to-emerald-600'; // Завершен
                  if (progress > 0) return 'from-blue-400 to-indigo-600'; // В процессе
                  
                  // Цвета по размеру курса
                  if (planetSize >= 48) {
                    // Большие планеты - яркие цвета
                    return ['from-red-400 to-orange-600', 'from-purple-400 to-indigo-600', 'from-blue-400 to-cyan-600'][index % 3];
                  } else if (planetSize >= 32) {
                    // Средние планеты - умеренные цвета
                    return ['from-yellow-400 to-amber-600', 'from-pink-400 to-rose-600', 'from-emerald-400 to-green-600'][index % 3];
                  } else {
                    // Малые планеты - приглушенные цвета
                    return ['from-slate-400 to-gray-600', 'from-stone-400 to-neutral-600', 'from-zinc-400 to-slate-600'][index % 3];
                  }
                };
                
                return (
                  <motion.div key={planet.id} className="absolute z-10">
                    {/* Планета */}
                    <motion.div
                      className={`rounded-full cursor-pointer relative bg-gradient-to-br ${getPlanetColor()}`}
                      style={{
                        width: planetSize,
                        height: planetSize,
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                        boxShadow: `0 0 ${planetSize/2}px rgba(59, 130, 246, 0.4)`,
                      }}
                      onClick={() => handlePlanetClick(planet)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        y: [0, -1, 0],
                      }}
                      transition={{
                        y: { duration: 3 + index, repeat: Infinity, ease: "easeInOut" },
                      }}
                    >
                      {/* Название планеты с размером курса */}
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                        <div className="bg-space-800/90 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                          <p className="text-xs font-medium text-white">{planet.name}</p>
                          <p className="text-xs text-white/60">
                            {modules} {modules === 1 ? 'модуль' : modules < 5 ? 'модуля' : 'модулей'} • 
                            {planetSize >= 48 ? ' Большой' : planetSize >= 32 ? ' Средний' : ' Малый'} курс
                          </p>
                        </div>
                      </div>
                      
                      {/* Индикатор прогресса */}
                      {planet.course.progress && planet.course.progress > 0 && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full text-xs flex items-center justify-center text-white font-bold shadow-lg">
                          {planet.course.progress >= 100 ? '✓' : Math.round(planet.course.progress)}
                        </div>
                      )}

                      {/* Кольца для больших планет */}
                      {planetSize >= 48 && (
                        <>
                          <div 
                            className="absolute border border-white/30 rounded-full pointer-events-none"
                            style={{
                              width: planetSize + 12,
                              height: planetSize + 12,
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                          <div 
                            className="absolute border border-white/15 rounded-full pointer-events-none"
                            style={{
                              width: planetSize + 20,
                              height: planetSize + 20,
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        </>
                      )}

                      {/* Одно кольцо для средних планет */}
                      {planetSize >= 32 && planetSize < 48 && (
                        <div 
                          className="absolute border border-white/20 rounded-full pointer-events-none"
                          style={{
                            width: planetSize + 8,
                            height: planetSize + 8,
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Приборная панель */}
      <div className="absolute bottom-4 left-4 z-50">
        <motion.div 
          className="bg-gradient-to-br from-space-800/90 to-space-900/90 backdrop-blur-sm p-4 rounded-xl border border-primary/30 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          {/* Заголовок панели */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <p className="text-xs font-orbitron text-white">СОЛНЕЧНАЯ СИСТЕМА ЗНАНИЙ</p>
          </div>

          {/* Индикаторы */}
          <div className="space-y-2 mb-3">
            {/* Планеты с курсами */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/70 w-16">Планеты</div>
              <div className="text-xs text-white/80">
                {planets.length} обнаружено
              </div>
            </div>

            {/* Прогресс обучения */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/70 w-16">Прогресс</div>
              <div className="text-xs text-white/80">
                {planets.filter(p => p.completed).length}/{planets.length} завершено
              </div>
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="flex gap-2">
            <motion.button
              onClick={simulateDiscovery}
              className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-xs text-white transition-colors flex items-center justify-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Telescope className="w-3 h-3" />
              Сканировать
            </motion.button>
            
            <motion.button
              onClick={handleZoomIn}
              className="px-3 py-2 bg-space-700/50 hover:bg-space-600/50 border border-white/20 rounded-lg text-xs text-white/70 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ZoomIn className="w-3 h-3" />
            </motion.button>
            
            <motion.button
              onClick={handleZoomOut}
              className="px-3 py-2 bg-space-700/50 hover:bg-space-600/50 border border-white/20 rounded-lg text-xs text-white/70 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ZoomOut className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Toast уведомления */}
      <AnimatePresence>
        {newDiscovery && (
          <motion.div
            className="absolute top-4 right-4 z-50 w-80"
            initial={{ x: 300, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 300, opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            <div className="bg-gradient-to-br from-primary/90 to-purple-600/90 backdrop-blur-sm p-4 rounded-xl border border-primary/40 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Telescope className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                  <p className="text-white font-orbitron text-sm font-bold">НОВОЕ ОТКРЫТИЕ!</p>
                  <p className="text-white/80 text-xs">Сканирование завершено</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-3 mb-3">
                <p className="text-white font-medium">{newDiscovery.name}</p>
                <p className="text-white/70 text-xs mt-1">
                  {newDiscovery.type === 'galaxy' ? 'Новая галактика обнаружена' : 'Новая планета найдена'}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-white/60">
                  +100 XP исследователя
                </div>
                <motion.button
                  className="text-xs text-white/80 hover:text-white transition-colors"
                  onClick={() => setNewDiscovery(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Закрыть
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GalaxyUniverse;