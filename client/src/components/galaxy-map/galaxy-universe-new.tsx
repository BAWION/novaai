import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Rocket, ArrowLeft, ZoomIn, ZoomOut, Telescope } from 'lucide-react';

// Типы данных
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

type ViewState = 'universe' | 'galaxy' | 'planet';

interface ViewConfig {
  state: ViewState;
  selectedGalaxy?: string;
  selectedPlanet?: Planet;
  zoom: number;
  centerX: number;
  centerY: number;
}

// Конфигурация галактик
const INITIAL_GALAXIES: Galaxy[] = [
  {
    id: 'ml',
    name: 'Галактика Машинного Обучения',
    domain: 'Machine Learning',
    color: '#6E3AFF',
    position: { x: -300, y: -200 },
    size: 120,
    discovered: true,
    courses: [],
    rotation: 0
  },
  {
    id: 'nlp',
    name: 'Галактика Языковых Технологий',
    domain: 'Natural Language Processing',
    color: '#2EBAE1',
    position: { x: 300, y: -150 },
    size: 100,
    discovered: true,
    courses: [],
    rotation: 45
  },
  {
    id: 'cv',
    name: 'Галактика Компьютерного Зрения',
    domain: 'Computer Vision',
    color: '#FF6B35',
    position: { x: -200, y: 250 },
    size: 110,
    discovered: false,
    courses: [],
    rotation: 90
  },
  {
    id: 'ethics',
    name: 'Галактика Этики ИИ',
    domain: 'AI Ethics',
    color: '#9D4EDD',
    position: { x: 250, y: 200 },
    size: 90,
    discovered: true,
    courses: [],
    rotation: 135
  },
  {
    id: 'robotics',
    name: 'Галактика Робототехники',
    domain: 'Robotics',
    color: '#F72585',
    position: { x: 0, y: -350 },
    size: 95,
    discovered: false,
    courses: [],
    rotation: 180
  }
];

// Функция для генерации красивых названий планет
const generatePlanetName = (course: Course, index: number): string => {
  const prefixes = ['Планета', 'Мир', 'Звезда', 'Сфера', 'Обитель'];
  const suffixes = ['Знаний', 'Мудрости', 'Открытий', 'Навыков', 'Понимания'];
  
  const firstWord = course.title.split(' ')[0];
  const prefix = prefixes[index % prefixes.length];
  
  return `${prefix} ${firstWord}`;
};

function GalaxyUniverse() {
  const [, navigate] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Состояние навигации
  const [viewConfig, setViewConfig] = useState<ViewConfig>({
    state: 'universe',
    zoom: 1,
    centerX: 0,
    centerY: 0
  });
  
  const [galaxies, setGalaxies] = useState<Galaxy[]>(INITIAL_GALAXIES);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [newDiscovery, setNewDiscovery] = useState<{ type: 'galaxy' | 'planet'; name: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Загружаем курсы
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Распределяем курсы по галактикам и создаем планеты
  useEffect(() => {
    if (Array.isArray(courses) && courses.length > 0) {
      const updatedGalaxies = [...galaxies];
      const newPlanets: Planet[] = [];

      courses.forEach((course: Course) => {
        // Определяем галактику для курса
        let galaxyId = 'ml';
        
        if (course.category === 'ethics') galaxyId = 'ethics';
        else if (course.category === 'law') galaxyId = 'ethics';
        else if (course.title.toLowerCase().includes('nlp') || 
                 course.title.toLowerCase().includes('язык') ||
                 course.title.toLowerCase().includes('text')) galaxyId = 'nlp';
        else if (course.title.toLowerCase().includes('vision') ||
                 course.title.toLowerCase().includes('image')) galaxyId = 'cv';
        else if (course.title.toLowerCase().includes('robot')) galaxyId = 'robotics';

        const galaxy = updatedGalaxies.find(g => g.id === galaxyId);
        if (galaxy) {
          galaxy.courses.push(course);
          
          // Создаем планету для курса
          const angle = (galaxy.courses.length - 1) * (360 / Math.max(galaxy.courses.length, 6));
          const distance = 60 + (galaxy.courses.length - 1) * 15;
          const planetX = galaxy.position.x + Math.cos(angle * Math.PI / 180) * distance;
          const planetY = galaxy.position.y + Math.sin(angle * Math.PI / 180) * distance;

          newPlanets.push({
            id: course.id,
            course,
            galaxy: galaxyId,
            position: { x: planetX, y: planetY },
            size: 20 + (course.modules || 1) * 2,
            visited: (course.progress || 0) > 0,
            completed: (course.progress || 0) >= 100,
            name: generatePlanetName(course, galaxy.courses.length - 1)
          });
        }
      });

      setGalaxies(updatedGalaxies);
      setPlanets(newPlanets);
    }
  }, [courses]);

  // Навигационные функции
  const handleGalaxyClick = (galaxyId: string) => {
    const galaxy = galaxies.find(g => g.id === galaxyId);
    if (galaxy && galaxy.discovered) {
      setViewConfig({
        state: 'galaxy',
        selectedGalaxy: galaxyId,
        zoom: 3,
        centerX: galaxy.position.x,
        centerY: galaxy.position.y
      });
    }
  };

  const handlePlanetClick = (planet: Planet) => {
    setViewConfig({
      state: 'planet',
      selectedGalaxy: planet.galaxy,
      selectedPlanet: planet,
      zoom: 6,
      centerX: planet.position.x,
      centerY: planet.position.y
    });
    
    setTimeout(() => {
      navigate(`/courses/${planet.course.id}`);
    }, 1000);
  };

  const handleBackToUniverse = () => {
    setViewConfig({
      state: 'universe',
      zoom: 1,
      centerX: 0,
      centerY: 0
    });
  };

  const handleBackToGalaxy = () => {
    if (viewConfig.selectedGalaxy) {
      const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
      if (galaxy) {
        setViewConfig({
          state: 'galaxy',
          selectedGalaxy: galaxy.id,
          zoom: 3,
          centerX: galaxy.position.x,
          centerY: galaxy.position.y
        });
      }
    }
  };

  // Функции масштабирования
  const handleZoomIn = () => {
    setViewConfig(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.5, 10)
    }));
  };

  const handleZoomOut = () => {
    setViewConfig(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.5, 0.5)
    }));
  };

  // Симуляция открытия новых галактик
  const simulateDiscovery = () => {
    const undiscoveredGalaxies = galaxies.filter(g => !g.discovered);
    if (undiscoveredGalaxies.length > 0) {
      const galaxy = undiscoveredGalaxies[0];
      setGalaxies(prev => prev.map(g => 
        g.id === galaxy.id ? { ...g, discovered: true } : g
      ));
      setNewDiscovery({ type: 'galaxy', name: galaxy.name });
      setTimeout(() => setNewDiscovery(null), 5000);
    }
  };

  // Обработка перетаскивания
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      setViewConfig(prev => ({
        ...prev,
        centerX: prev.centerX - deltaX / prev.zoom,
        centerY: prev.centerY - deltaY / prev.zoom
      }));
      
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gradient-to-b from-space-900 via-space-800 to-space-900 rounded-xl">
        <div className="text-white">Загрузка галактической карты...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] relative bg-gradient-to-b from-space-900 via-space-800 to-space-900 rounded-xl overflow-hidden">
      {/* Живое звездное небо с туманностями */}
      <div className="absolute inset-0">
        {/* Звезды */}
        {Array.from({ length: 150 }).map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() > 0.8 ? '2px' : '1px',
              height: Math.random() > 0.8 ? '2px' : '1px',
              backgroundColor: Math.random() > 0.7 ? '#93C5FD' : '#FFFFFF',
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
        
        {/* Туманности */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={`nebula-${i}`}
            className="absolute rounded-full opacity-20"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              width: `${100 + Math.random() * 200}px`,
              height: `${100 + Math.random() * 200}px`,
              background: `radial-gradient(circle, ${['#6366F1', '#8B5CF6', '#EC4899', '#06B6D4', '#10B981'][i]}30 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
        
        {/* Пролетающие метеоры */}
        <AnimatePresence>
          {newDiscovery && (
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full opacity-90"
              style={{
                left: '-10px',
                top: `${Math.random() * 50 + 20}%`,
              }}
              initial={{ x: -10, opacity: 0 }}
              animate={{ 
                x: window.innerWidth + 50, 
                opacity: [0, 1, 1, 0],
                boxShadow: ['0 0 5px #FFF', '0 0 15px #FFF', '0 0 5px #FFF']
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <div className="absolute -left-4 -top-0.5 w-8 h-0.5 bg-gradient-to-r from-transparent to-white opacity-60" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Основная область с зумом и панорамированием */}
      <motion.div
        ref={containerRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        animate={{
          scale: viewConfig.zoom,
          x: -viewConfig.centerX * viewConfig.zoom,
          y: -viewConfig.centerY * viewConfig.zoom,
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          transformOrigin: 'center center',
        }}
      >
        {/* Корабль Галаксион в центре */}
        <motion.div
          className="absolute z-40"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: -20,
            y: -20,
            rotate: viewConfig.state === 'universe' ? 0 : 360,
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.5)",
                  "0 0 30px rgba(147, 51, 234, 0.7)",
                  "0 0 20px rgba(59, 130, 246, 0.5)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Rocket className="w-6 h-6 text-white" />
            </motion.div>
            <motion.div
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-space-800/80 backdrop-blur-sm px-2 py-1 rounded border border-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xs font-orbitron text-white whitespace-nowrap">ГАЛАКСИОН</p>
              <p className="text-xs text-white/60 text-center">Корабль Знаний</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Галактики */}
        <AnimatePresence>
          {galaxies.map((galaxy) => (
            <motion.div
              key={galaxy.id}
              className="absolute cursor-pointer z-20"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: galaxy.position.x,
                y: galaxy.position.y,
                rotate: galaxy.rotation,
                scale: viewConfig.selectedGalaxy === galaxy.id ? 1.2 : 1,
              }}
              initial={{ scale: 0, opacity: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
              onClick={() => handleGalaxyClick(galaxy.id)}
            >
              {galaxy.discovered && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="relative"
                >
                  {/* Спиральная галактика */}
                  <div 
                    className="rounded-full relative"
                    style={{
                      width: galaxy.size,
                      height: galaxy.size,
                      background: `radial-gradient(circle, ${galaxy.color}40 0%, ${galaxy.color}20 40%, transparent 70%)`,
                      boxShadow: `0 0 30px ${galaxy.color}40`,
                    }}
                  >
                    {/* Центральное ядро */}
                    <div 
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        width: galaxy.size * 0.3,
                        height: galaxy.size * 0.3,
                        background: `radial-gradient(circle, ${galaxy.color} 0%, ${galaxy.color}80 70%)`,
                      }}
                    />
                    
                    {/* Спиральные рукава */}
                    {[0, 120, 240].map((rotation, index) => (
                      <div
                        key={index}
                        className="absolute top-1/2 left-1/2 origin-left"
                        style={{
                          width: galaxy.size * 0.4,
                          height: 2,
                          background: `linear-gradient(to right, ${galaxy.color}, transparent)`,
                          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Название галактики */}
                  <motion.div
                    className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1,
                      y: 0,
                    }}
                  >
                    <div className="bg-space-800/80 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                      <p className="text-xs font-orbitron text-white">{galaxy.name}</p>
                      <p className="text-xs text-white/60">{galaxy.courses.length} планет</p>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Планеты (курсы) с орбитальным движением */}
        <AnimatePresence>
          {planets.map((planet, index) => {
            const galaxy = galaxies.find(g => g.id === planet.galaxy);
            const showPlanet = viewConfig.state === 'universe' || 
                             (viewConfig.state === 'galaxy' && viewConfig.selectedGalaxy === planet.galaxy);
            
            if (!showPlanet || !galaxy?.discovered) return null;

            // Орбитальное движение
            const orbitRadius = Math.sqrt(
              Math.pow(planet.position.x - galaxy.position.x, 2) + 
              Math.pow(planet.position.y - galaxy.position.y, 2)
            );
            const baseAngle = Math.atan2(
              planet.position.y - galaxy.position.y, 
              planet.position.x - galaxy.position.x
            );
            
            return (
              <motion.div
                key={planet.id}
                className="absolute cursor-pointer z-30"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: galaxy.position.x + Math.cos(baseAngle + (Date.now() / 10000) * (1 + index * 0.3)) * orbitRadius,
                  y: galaxy.position.y + Math.sin(baseAngle + (Date.now() / 10000) * (1 + index * 0.3)) * orbitRadius,
                  scale: viewConfig.selectedPlanet?.id === planet.id ? 1.5 : 1,
                }}
                initial={{ 
                  scale: 0,
                  rotate: 0
                }}
                exit={{ scale: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
                onClick={() => handlePlanetClick(planet)}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="relative"
                >
                  {/* Орбитальная траектория (видна при наведении) */}
                  <motion.div
                    className="absolute border border-white/10 rounded-full pointer-events-none"
                    style={{
                      width: orbitRadius * 2,
                      height: orbitRadius * 2,
                      left: -orbitRadius + (planet.size / 2),
                      top: -orbitRadius + (planet.size / 2),
                      transform: `translate(${galaxy.position.x - planet.position.x}px, ${galaxy.position.y - planet.position.y}px)`,
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.3 }}
                  />

                  {/* Планета с материализацией */}
                  <motion.div
                    className="rounded-full border-2 relative overflow-hidden"
                    style={{
                      width: planet.size,
                      height: planet.size,
                      backgroundColor: planet.completed ? '#10B981' : planet.visited ? '#F59E0B' : '#3B82F6',
                      borderColor: planet.completed ? '#059669' : planet.visited ? '#D97706' : '#2563EB',
                      boxShadow: `0 0 15px ${planet.completed ? '#10B981' : planet.visited ? '#F59E0B' : '#3B82F6'}60`,
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20 + index * 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {/* Поверхность планеты */}
                    <div className="absolute inset-0 opacity-30">
                      <div 
                        className="w-full h-full rounded-full"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, transparent 0%, ${planet.completed ? '#10B981' : planet.visited ? '#F59E0B' : '#3B82F6'}40 100%)`
                        }}
                      />
                    </div>

                    {/* Золотая корона для завершенных курсов */}
                    {planet.completed && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: '2px solid #FFD700',
                          boxShadow: '0 0 10px #FFD700'
                        }}
                        animate={{
                          rotate: -360,
                        }}
                        transition={{
                          duration: 15,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      />
                    )}

                    {/* Пульсация для активных курсов */}
                    {planet.visited && !planet.completed && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          backgroundColor: '#F59E0B',
                        }}
                        animate={{
                          opacity: [0, 0.3, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.div>
                  
                  {/* Название планеты */}
                  <motion.div 
                    className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="bg-space-800/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20 text-center">
                      <p className="text-xs font-orbitron text-white">{planet.name}</p>
                      <p className="text-xs text-white/60">{planet.course.modules || 1} модулей</p>
                    </div>
                  </motion.div>

                  {/* Мини астероиды-уроки для детального вида */}
                  {viewConfig.state === 'galaxy' && viewConfig.selectedGalaxy === planet.galaxy && (
                    <>
                      {Array.from({ length: planet.course.modules || 1 }).map((_, moduleIndex) => (
                        <motion.div
                          key={`asteroid-${planet.id}-${moduleIndex}`}
                          className="absolute w-2 h-2 bg-gray-400 rounded-full"
                          style={{
                            left: planet.size + 15 + moduleIndex * 8,
                            top: planet.size / 2 - 1,
                          }}
                          animate={{
                            y: [0, -3, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: moduleIndex * 0.2
                          }}
                        />
                      ))}
                    </>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Навигационные кнопки */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {viewConfig.state !== 'universe' && (
          <button
            onClick={viewConfig.state === 'planet' ? handleBackToGalaxy : handleBackToUniverse}
            className="p-2 bg-space-800/80 hover:bg-space-700/80 backdrop-blur-sm border border-white/20 rounded-lg text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={handleZoomIn}
          className="p-2 bg-space-800/80 hover:bg-space-700/80 backdrop-blur-sm border border-white/20 rounded-lg text-white transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleZoomOut}
          className="p-2 bg-space-800/80 hover:bg-space-700/80 backdrop-blur-sm border border-white/20 rounded-lg text-white transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Приборная панель корабля Галаксион */}
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
            <p className="text-xs font-orbitron text-white">ГАЛАКСИОН - ПАНЕЛЬ УПРАВЛЕНИЯ</p>
          </div>

          {/* Индикаторы */}
          <div className="space-y-2 mb-3">
            {/* Топливо мотивации */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/70 w-16">Мотивация</div>
              <div className="flex-1 h-2 bg-space-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(85 + Math.random() * 15, 100)}%` }}
                  transition={{ duration: 2 }}
                />
              </div>
              <div className="text-xs text-white/60">85%</div>
            </div>

            {/* Уровень исследователя */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/70 w-16">Уровень</div>
              <div className="text-xs text-primary font-orbitron">КОСМИЧЕСКИЙ ИССЛЕДОВАТЕЛЬ</div>
            </div>

            {/* Открытые галактики */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/70 w-16">Галактики</div>
              <div className="text-xs text-white/80">
                {galaxies.filter(g => g.discovered).length}/{galaxies.length} открыто
              </div>
            </div>

            {/* Планеты с курсами */}
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/70 w-16">Планеты</div>
              <div className="text-xs text-white/80">
                {planets.length} обнаружено
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
              onClick={handleBackToUniverse}
              className="px-3 py-2 bg-space-700/50 hover:bg-space-600/50 border border-white/20 rounded-lg text-xs text-white/70 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Домой
            </motion.button>
          </div>

          {/* Мини-карта */}
          {viewConfig.state !== 'universe' && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-xs text-white/60 mb-2">Мини-карта</div>
              <div className="w-24 h-16 bg-space-900/50 rounded border border-white/10 relative overflow-hidden">
                {/* Упрощенное представление текущего вида */}
                <div className="absolute inset-1">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 rounded" />
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Toast уведомления об открытиях */}
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
              {/* Искры эффекта */}
              <div className="absolute inset-0 overflow-hidden rounded-xl">
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: 2,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
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

              {/* Дымный хвост */}
              <motion.div
                className="absolute -bottom-2 left-1/2 w-0.5 h-8 bg-gradient-to-b from-primary/50 to-transparent"
                animate={{
                  opacity: [0.8, 0],
                  scaleY: [1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 3,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Состояние текущего вида */}
      <div className="absolute top-4 left-4 z-50">
        <div className="bg-space-800/80 backdrop-blur-sm p-3 rounded-lg border border-white/20">
          <p className="text-xs font-orbitron text-white mb-2">
            {viewConfig.state === 'universe' && 'Обзор Вселенной'}
            {viewConfig.state === 'galaxy' && `Галактика: ${galaxies.find(g => g.id === viewConfig.selectedGalaxy)?.name}`}
            {viewConfig.state === 'planet' && `Планета: ${viewConfig.selectedPlanet?.name}`}
          </p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full border-2 border-blue-400 bg-blue-400/60" />
              <span className="text-white/70">Доступно</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full border-2 border-yellow-400 bg-yellow-400/60" />
              <span className="text-white/70">В процессе</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full border-2 border-green-400 bg-green-400/60" />
              <span className="text-white/70">Завершено</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalaxyUniverse;