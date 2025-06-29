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
      {/* Звездное небо */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
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

        {/* Планеты (курсы) */}
        <AnimatePresence>
          {planets.map((planet) => {
            const galaxy = galaxies.find(g => g.id === planet.galaxy);
            const showPlanet = viewConfig.state === 'universe' || 
                             (viewConfig.state === 'galaxy' && viewConfig.selectedGalaxy === planet.galaxy);
            
            return showPlanet && galaxy?.discovered ? (
              <motion.div
                key={planet.id}
                className="absolute cursor-pointer z-30"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: planet.position.x,
                  y: planet.position.y,
                  scale: viewConfig.selectedPlanet?.id === planet.id ? 1.5 : 1,
                }}
                initial={{ scale: 0 }}
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
                  {/* Планета */}
                  <div
                    className="rounded-full border-2"
                    style={{
                      width: planet.size,
                      height: planet.size,
                      backgroundColor: planet.completed ? '#10B981' : planet.visited ? '#F59E0B' : '#3B82F6',
                      borderColor: planet.completed ? '#059669' : planet.visited ? '#D97706' : '#2563EB',
                      boxShadow: `0 0 15px ${planet.completed ? '#10B981' : planet.visited ? '#F59E0B' : '#3B82F6'}60`,
                    }}
                  />
                  
                  {/* Название планеты */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-space-800/80 backdrop-blur-sm px-2 py-1 rounded border border-white/20 text-center">
                      <p className="text-xs font-orbitron text-white">{planet.name}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : null;
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

      {/* Сканирование и статистика */}
      <div className="absolute bottom-4 left-4 z-50">
        <div className="bg-space-800/80 backdrop-blur-sm p-3 rounded-lg border border-white/20">
          <div className="flex items-center gap-3">
            <button
              onClick={simulateDiscovery}
              className="px-3 py-1 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded text-xs text-white transition-colors"
            >
              <Telescope className="w-4 h-4 inline mr-1" />
              Сканировать
            </button>
            <div className="text-xs text-white/70">
              {galaxies.filter(g => g.discovered).length}/{galaxies.length} галактик
            </div>
          </div>
        </div>
      </div>

      {/* Уведомления об открытиях */}
      <AnimatePresence>
        {newDiscovery && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <div className="bg-primary/90 backdrop-blur-sm p-4 rounded-lg border border-primary/30 text-center">
              <p className="text-white font-orbitron">Новое открытие!</p>
              <p className="text-white/80">{newDiscovery.name}</p>
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