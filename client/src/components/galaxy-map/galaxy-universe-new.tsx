import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Rocket, ArrowLeft, ZoomIn, ZoomOut, Telescope, Home, Navigation } from 'lucide-react';

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

// Конфигурация галактик
const INITIAL_GALAXIES: Galaxy[] = [
  {
    id: 'ml',
    name: 'Галактика Машинного Обучения',
    domain: 'Machine Learning',
    color: '#6E3AFF',
    position: { x: -150, y: -100 },
    size: 140,
    discovered: true,
    courses: [],
    rotation: 0
  },
  {
    id: 'nlp',
    name: 'Галактика Языковых Технологий',
    domain: 'Natural Language Processing',
    color: '#2EBAE1',
    position: { x: 150, y: -75 },
    size: 120,
    discovered: true,
    courses: [],
    rotation: 45
  },
  {
    id: 'cv',
    name: 'Галактика Компьютерного Зрения',
    domain: 'Computer Vision',
    color: '#FF6B35',
    position: { x: -100, y: 125 },
    size: 130,
    discovered: true,
    courses: [],
    rotation: 90
  },
  {
    id: 'ethics',
    name: 'Галактика Этики ИИ',
    domain: 'AI Ethics',
    color: '#9D4EDD',
    position: { x: 125, y: 100 },
    size: 110,
    discovered: true,
    courses: [],
    rotation: 135
  },
  {
    id: 'robotics',
    name: 'Галактика Робототехники',
    domain: 'Robotics',
    color: '#F72585',
    position: { x: 0, y: -175 },
    size: 115,
    discovered: true,
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

  // Навигационные функции - точно по спецификации
  const handleGalaxyDoubleClick = (galaxyId: string) => {
    const galaxy = galaxies.find(g => g.id === galaxyId);
    if (galaxy && galaxy.discovered) {
      // Камера "ныряет" внутрь выбранной галактики
      setViewConfig({
        state: 'galaxy',
        selectedGalaxy: galaxyId,
        zoom: 2,
        centerX: galaxy.position.x,
        centerY: galaxy.position.y
      });
      
      // Показываем уведомление о входе в галактику
      setNewDiscovery({ type: "galaxy", name: galaxy.name });
      setTimeout(() => setNewDiscovery(null), 3000);
    }
  };

  const handleSystemDoubleClick = (systemId: string) => {
    // Переход к деталям звездной системы (System view)
    setViewConfig(prev => ({
      ...prev,
      state: 'system',
      selectedSystem: systemId,
      zoom: 4,
    }));
  };

  const handlePlanetClick = (planet: Planet) => {
    // Щелчок по планете открывает карточку курса
    console.log('Открываем карточку курса:', planet.name);
    // Можно показать панель сбоку или оверлей
    navigate(`/courses/${planet.course.id}`);
  };

  const handleBackToUniverse = () => {
    setViewConfig({
      state: 'universe',
      selectedGalaxy: undefined,
      selectedSystem: undefined,
      selectedPlanet: undefined,
      zoom: 1,
      centerX: 0,
      centerY: 0
    });
  };

  // Скролл-навигация согласно спецификации
  const handleScrollNavigation = (event: React.WheelEvent) => {
    event.preventDefault();
    
    if (event.deltaY > 0) {
      // Скролл-аут - возвращаемся к предыдущему уровню
      if (viewConfig.state === 'system') {
        const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
        if (galaxy) {
          setViewConfig({
            state: 'galaxy',
            selectedGalaxy: galaxy.id,
            selectedSystem: undefined,
            zoom: 2,
            centerX: galaxy.position.x,
            centerY: galaxy.position.y
          });
        }
      } else if (viewConfig.state === 'galaxy') {
        handleBackToUniverse();
      }
    } else {
      // Скролл-ин - приближаемся (если возможно)
      if (viewConfig.state === 'universe' && viewConfig.selectedGalaxy) {
        const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
        if (galaxy) {
          setViewConfig({
            state: 'galaxy',
            selectedGalaxy: galaxy.id,
            zoom: 2,
            centerX: galaxy.position.x,
            centerY: galaxy.position.y
          });
        }
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
    <div 
      className="w-full h-[600px] relative bg-gradient-to-b from-space-900 via-space-800 to-space-900 rounded-xl overflow-hidden"
      onWheel={handleScrollNavigation}
    >
      {/* Advanced Breadcrumb Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <motion.div 
          className="bg-gradient-to-br from-space-800/95 to-space-900/95 backdrop-blur-sm p-4 rounded-xl border border-primary/30 shadow-2xl"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Navigation Path */}
          <div className="flex items-center gap-2 text-white mb-3">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="flex items-center gap-1 text-xs font-orbitron">
              <motion.span 
                className="text-primary cursor-pointer hover:text-primary/80 transition-colors flex items-center gap-1" 
                onClick={handleBackToUniverse}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🌌 ВСЕЛЕННАЯ
              </motion.span>
              {viewConfig.state !== 'universe' && (
                <>
                  <span className="text-white/50 mx-1">→</span>
                  <span className="text-white flex items-center gap-1">
                    🌀 {viewConfig.selectedGalaxy && galaxies.find(g => g.id === viewConfig.selectedGalaxy)?.name}
                  </span>
                </>
              )}
              {viewConfig.state === 'system' && viewConfig.selectedSystem && (
                <>
                  <span className="text-white/50 mx-1">→</span>
                  <span className="text-yellow-400 flex items-center gap-1">
                    ⭐ Система {viewConfig.selectedSystem}
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* Mission Status */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-xs text-white/70 flex items-center gap-2">
              <motion.div 
                className="w-1.5 h-1.5 bg-green-400 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span>
                {viewConfig.state === 'universe' && 'Межгалактическое сканирование активно'}
                {viewConfig.state === 'galaxy' && 'Исследование звездных систем'}
                {viewConfig.state === 'system' && 'Детальное сканирование планет'}
              </span>
            </div>
            
            {/* Camera Distance Info */}
            <div className="mt-1 text-xs text-white/50">
              Масштаб: {Math.round(viewConfig.zoom * 100)}% | Планет: {planets.length}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Home Button */}
      <div className="absolute top-4 right-4 z-50">
        <motion.button
          onClick={handleBackToUniverse}
          className="p-3 bg-gradient-to-br from-primary/25 to-purple-600/25 hover:from-primary/35 hover:to-purple-600/35 backdrop-blur-sm border border-primary/40 rounded-xl text-white transition-all duration-300 shadow-lg"
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 0 25px rgba(110, 58, 255, 0.5)",
            borderColor: "rgba(110, 58, 255, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span className="text-xs font-orbitron">ДОМОЙ</span>
          </div>
        </motion.button>
      </div>

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
                x: 800, 
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
        {/* Корабль Галаксион с улучшенной анимацией */}
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
              className="w-12 h-12 bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-full border-2 border-white/30 shadow-2xl flex items-center justify-center relative overflow-hidden"
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
              <Rocket className="w-6 h-6 text-white z-10" />
              
              {/* Энергетическое ядро */}
              <motion.div 
                className="absolute inset-2 bg-white/20 rounded-full"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
            
            {/* Энергетические кольца */}
            <motion.div 
              className="absolute inset-0 border-2 border-primary/40 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute inset-0 border border-blue-400/30 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />
            
            {/* Двигательные эффекты */}
            {viewConfig.state !== 'universe' && (
              <motion.div
                className="absolute -bottom-2 left-1/2 w-1 h-6 bg-gradient-to-t from-blue-400 to-transparent rounded-full"
                style={{ transform: 'translateX(-50%)' }}
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scaleY: [0.8, 1.2, 0.8]
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            )}
            
            <motion.div
              className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-space-800/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-xs font-orbitron text-white whitespace-nowrap">ГАЛАКСИОН</p>
              <p className="text-xs text-white/60 text-center">Корабль Знаний</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Галактики - показываем только на Universe view */}
        <AnimatePresence>
          {viewConfig.state === 'universe' && galaxies.map((galaxy) => (
            <motion.div
              key={galaxy.id}
              className="absolute cursor-pointer z-30"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: galaxy.position.x,
                y: galaxy.position.y,
                rotate: [galaxy.rotation, galaxy.rotation + 360],
                scale: viewConfig.selectedGalaxy === galaxy.id ? 1.2 : 1,
                opacity: 1,
              }}
              initial={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                rotate: {
                  duration: 20 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear"
                },
                scale: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
              onDoubleClick={() => handleGalaxyDoubleClick(galaxy.id)}
              onMouseEnter={() => {
                console.log(`${galaxy.name} — ${Math.round(Math.random() * 100)}% пройдено`);
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="relative"
              >
                {/* Спиральная галактика с пульсацией */}
                <motion.div 
                  className="rounded-full relative border-2"
                  style={{
                    width: galaxy.size,
                    height: galaxy.size,
                    background: `radial-gradient(circle, ${galaxy.color}80 0%, ${galaxy.color}60 40%, ${galaxy.color}20 70%)`,
                    borderColor: galaxy.color,
                  }}
                  animate={{
                    boxShadow: [
                      `0 0 30px ${galaxy.color}40, inset 0 0 15px ${galaxy.color}30`,
                      `0 0 50px ${galaxy.color}70, inset 0 0 25px ${galaxy.color}50`,
                      `0 0 30px ${galaxy.color}40, inset 0 0 15px ${galaxy.color}30`
                    ]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut"
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
                </motion.div>

                {/* Компактное название галактики */}
                <motion.div
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                    <p className="text-xs font-semibold text-white tracking-wide">{galaxy.domain}</p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <div 
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: galaxy.color }}
                      />
                      <p className="text-xs text-white/70">5 планет</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Звездные системы для Galaxy view */}
        <AnimatePresence>
          {viewConfig.state === 'galaxy' && viewConfig.selectedGalaxy && (
            // Генерируем звездные системы для выбранной галактики
            Array.from({ length: 5 }).map((_, systemIndex) => {
              const angle = (systemIndex * 72) * (Math.PI / 180); // 5 систем по кругу
              const radius = 80 + systemIndex * 30;
              const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
              
              return (
                <motion.div
                  key={`system-${systemIndex}`}
                  className="absolute cursor-pointer z-30"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: galaxy ? galaxy.position.x + Math.cos(angle) * radius : 0,
                    y: galaxy ? galaxy.position.y + Math.sin(angle) * radius : 0,
                    scale: 1,
                    opacity: 1
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: systemIndex * 0.1 }}
                  onDoubleClick={() => {
                    setViewConfig({
                      state: 'system',
                      selectedGalaxy: viewConfig.selectedGalaxy,
                      selectedSystem: `system-${systemIndex}`,
                      zoom: 4,
                      centerX: galaxy ? galaxy.position.x + Math.cos(angle) * radius : 0,
                      centerY: galaxy ? galaxy.position.y + Math.sin(angle) * radius : 0
                    });
                  }}
                >
                  {/* Центральная звезда системы */}
                  <motion.div
                    className="w-8 h-8 rounded-full relative"
                    style={{
                      background: `radial-gradient(circle, #FFD700 0%, #FFA500 70%, transparent 100%)`,
                      boxShadow: '0 0 20px #FFD700',
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    {/* Солнечные лучи */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation) => (
                      <div
                        key={rotation}
                        className="absolute w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"
                        style={{
                          left: '50%',
                          top: '50%',
                          transformOrigin: 'left center',
                          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Название системы */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-space-800/90 backdrop-blur-sm px-2 py-1 rounded border border-white/20 text-center">
                      <p className="text-xs font-orbitron text-white">Система {systemIndex + 1}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {/* Планеты (курсы) - показываем только на System view */}
        <AnimatePresence>
          {planets.map((planet, index) => {
            const galaxy = galaxies.find(g => g.id === planet.galaxy);
            // Планеты показываем только на System view
            const showPlanet = viewConfig.state === 'system' && viewConfig.selectedGalaxy === planet.galaxy;
            
            if (!showPlanet) return null;

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
          <div className="flex gap-2 mb-2">
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

          {/* Навигационные кнопки */}
          <div className="flex gap-2">
            {viewConfig.state !== 'universe' && (
              <motion.button
                onClick={viewConfig.state === 'system' ? () => {
                  const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
                  if (galaxy) {
                    setViewConfig({
                      state: 'galaxy',
                      selectedGalaxy: galaxy.id,
                      selectedSystem: undefined,
                      zoom: 2,
                      centerX: galaxy.position.x,
                      centerY: galaxy.position.y
                    });
                  }
                } : handleBackToUniverse}
                className="flex-1 px-3 py-2 bg-space-700/50 hover:bg-space-600/50 border border-white/20 rounded-lg text-xs text-white/70 transition-colors flex items-center justify-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-3 h-3" />
                Назад
              </motion.button>
            )}
            
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



      {/* Enhanced Discovery Notifications */}
      <AnimatePresence>
        {newDiscovery && (
          <motion.div
            className="absolute bottom-4 right-4 z-50 w-80"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
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
              
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white font-medium">{newDiscovery.name}</p>
                <p className="text-white/70 text-xs mt-1">
                  Новая галактика обнаружена и доступна для исследования
                </p>
              </div>
              
              {/* Дымные хвосты и спарки */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-br from-primary/60 to-purple-600/60 rounded-full"
                    style={{
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 0.8, 0],
                      x: [0, (Math.random() - 0.5) * 60],
                      y: [0, (Math.random() - 0.5) * 60],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GalaxyUniverse;