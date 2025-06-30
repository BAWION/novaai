import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Rocket, ArrowLeft, ZoomIn, ZoomOut, Telescope, Home, Navigation, Route } from 'lucide-react';
import { SmartRoadmapWidget } from '@/components/roadmap/smart-roadmap-widget';

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

// Конфигурация галактик (увеличенные расстояния)
const INITIAL_GALAXIES: Galaxy[] = [
  {
    id: 'ml',
    name: 'Галактика Машинного Обучения',
    domain: 'Machine Learning',
    color: '#6E3AFF',
    position: { x: -250, y: -180 },
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
    position: { x: 280, y: -150 },
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
    position: { x: -200, y: 220 },
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
    position: { x: 240, y: 200 },
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
  
  // Состояние режима дорожной карты
  const [roadmapMode, setRoadmapMode] = useState(false);
  
  const [galaxies, setGalaxies] = useState<Galaxy[]>(INITIAL_GALAXIES);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [newDiscovery, setNewDiscovery] = useState<{ type: 'galaxy' | 'planet'; name: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedSystemInfo, setSelectedSystemInfo] = useState<{
    systemId: string;
    courses: Course[];
    position: { x: number; y: number };
    galaxyName: string;
    systemIndex: number;
  } | null>(null);

  // Загружаем курсы
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Загружаем персональную дорожную карту
  const { data: roadmapData, isLoading: roadmapLoading, error: roadmapError } = useQuery({
    queryKey: ['/api/roadmap/personal'],
    enabled: roadmapMode, // Загружаем только когда режим активен
    retry: false,
  });

  // Создаем демо-данные дорожной карты для неавторизованных пользователей
  const demoRoadmapData = roadmapMode && roadmapError ? {
    connections: [
      { from: 2, to: 1, recommended: true }, // AI Literacy -> Python
      { from: 1, to: 7, recommended: true }, // Python -> ML Course  
      { from: 7, to: 6, recommended: false }, // ML -> Advanced course
    ],
    recommendedCourses: [2, 1, 7], // AI Literacy, Python, ML
    currentLevel: 'beginner',
    totalTime: '4-6 недель'
  } : null;

  // Используем реальные данные если есть, иначе демо
  const activeRoadmapData = roadmapData || demoRoadmapData;

  // Закрываем панель при смене уровня и обновляем позицию при перемещении карты
  useEffect(() => {
    if (viewConfig.state !== 'galaxy') {
      setSelectedSystemInfo(null);
    }
  }, [viewConfig.state]);

  useEffect(() => {
    if (selectedSystemInfo && viewConfig.state === 'galaxy') {
      const newPosition = calculatePanelPosition(selectedSystemInfo.systemIndex);
      setSelectedSystemInfo(prev => prev ? {
        ...prev,
        position: newPosition
      } : null);
    }
  }, [viewConfig.zoom, viewConfig.centerX, viewConfig.centerY]);

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
          
          // Создаем планету для курса (увеличенные расстояния)
          const angle = (galaxy.courses.length - 1) * (360 / Math.max(galaxy.courses.length, 6));
          const distance = 120 + (galaxy.courses.length - 1) * 30; // Удваиваем расстояния
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
        zoom: 1.5, // Уменьшаем начальный зум для galaxy view
        centerX: galaxy.position.x,
        centerY: galaxy.position.y
      });
      
      // Показываем уведомление о входе в галактику
      setNewDiscovery({ type: "galaxy", name: galaxy.name });
      setTimeout(() => setNewDiscovery(null), 3000);
    }
  };

  const calculatePanelPosition = (systemIndex: number) => {
    const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
    if (!galaxy) return { x: 0, y: 0 };
    
    const angle = (systemIndex * 72) * (Math.PI / 180);
    const radius = 150 + systemIndex * 50;
    
    // Позиция системы с учетом всех трансформаций карты
    const systemX = window.innerWidth / 2 + viewConfig.centerX + (galaxy.position.x + Math.cos(angle) * radius) * viewConfig.zoom;
    const systemY = window.innerHeight / 2 + viewConfig.centerY + (galaxy.position.y + Math.sin(angle) * radius) * viewConfig.zoom;
    
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    const panelWidth = 256;
    const panelHeight = 288;
    
    // Границы карты - панель должна оставаться в пределах видимого контейнера
    const mapBounds = {
      left: 40,
      right: containerWidth - 40,
      top: 40,
      bottom: containerHeight - 40
    };
    
    let panelX = systemX + 120;
    let panelY = systemY - 150;
    
    // Корректируем позицию по границам карты
    if (panelX + panelWidth > mapBounds.right) {
      panelX = systemX - panelWidth - 20;
    }
    if (panelX < mapBounds.left) {
      panelX = mapBounds.left;
    }
    
    if (panelY < mapBounds.top) {
      panelY = mapBounds.top;
    } else if (panelY + panelHeight > mapBounds.bottom) {
      panelY = mapBounds.bottom - panelHeight;
    }
    
    return { x: panelX, y: panelY };
  };

  const handleSystemClick = (systemId: string, systemPosition: { x: number; y: number }) => {
    const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
    if (galaxy && galaxy.courses.length > 0) {
      const systemIndex = parseInt(systemId.split('-')[1]) || 0;
      const panelPosition = calculatePanelPosition(systemIndex);
      
      setSelectedSystemInfo({
        systemId,
        courses: galaxy.courses,
        position: panelPosition,
        galaxyName: galaxy.name,
        systemIndex
      });
    }
  };

  const handleSystemDoubleClick = (systemId: string, systemPosition: { x: number; y: number }) => {
    // Закрываем информационную панель
    setSelectedSystemInfo(null);
    
    // Переход к деталям звездной системы (System view)
    setViewConfig({
      state: 'system',
      selectedGalaxy: viewConfig.selectedGalaxy,
      selectedSystem: systemId,
      zoom: 2.5,
      centerX: systemPosition.x,
      centerY: systemPosition.y
    });
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
            zoom: 1.5, // Более мягкий зум для возврата в galaxy view
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
            zoom: 1.5, // Более мягкий зум для скролл-ин в galaxy view
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
      zoom: Math.max(prev.zoom / 1.5, 0.2) // Увеличиваем диапазон зума для дальнего отдаления
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
      onWheel={(e) => {
        e.preventDefault();
        const delta = e.deltaY * 0.008; // Более медленное изменение зума
        const newZoom = Math.max(0.15, Math.min(20, viewConfig.zoom + delta));
        
        setViewConfig(prev => ({ ...prev, zoom: newZoom }));
        
        // Автоматический возврат на предыдущий уровень при глубоком зуме-ауте (увеличенные пороги)
        if (newZoom < 0.25 && viewConfig.state === 'system') {
          setTimeout(() => {
            const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
            if (galaxy) {
              setViewConfig({
                state: 'galaxy',
                selectedGalaxy: galaxy.id,
                selectedSystem: undefined,
                zoom: 1.2,
                centerX: galaxy.position.x,
                centerY: galaxy.position.y
              });
            }
          }, 1000); // Увеличенная задержка
        } else if (newZoom < 0.2 && viewConfig.state === 'galaxy') {
          setTimeout(() => {
            handleBackToUniverse();
          }, 1000);
        }
      }}
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
              >🌌 ВСЕЛЕННАЯ ИИ</motion.span>
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
              <p className="text-xs font-orbitron text-white whitespace-nowrap">Galaxion</p>
              <p className="text-xs text-white/60 text-center">Корабль Знаний</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Галактики - показываем только на Universe view */}
        <AnimatePresence>
          {viewConfig.state === 'universe' && galaxies.map((galaxy, galaxyIndex) => (
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
                  duration: 80 + galaxyIndex * 15, // Разная скорость вращения для каждой галактики
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
                {/* Спиральная галактика с вращением и пульсацией */}
                <motion.div 
                  className="rounded-full relative border-2"
                  style={{
                    width: galaxy.size,
                    height: galaxy.size,
                    background: `radial-gradient(circle, ${galaxy.color}80 0%, ${galaxy.color}60 40%, ${galaxy.color}20 70%)`,
                    borderColor: galaxy.color,
                  }}
                  animate={{
                    rotate: 360,
                    boxShadow: [
                      `0 0 30px ${galaxy.color}40, inset 0 0 15px ${galaxy.color}30`,
                      `0 0 50px ${galaxy.color}70, inset 0 0 25px ${galaxy.color}50`,
                      `0 0 30px ${galaxy.color}40, inset 0 0 15px ${galaxy.color}30`
                    ]
                  }}
                  transition={{
                    rotate: {
                      duration: 80 + galaxyIndex * 15, // Разная скорость вращения для каждой галактики
                      repeat: Infinity,
                      ease: "linear"
                    },
                    boxShadow: {
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
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
                  {[0, 120, 240].map((rotation, armIndex) => (
                    <div
                      key={armIndex}
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

                {/* Компактное название галактики - остается горизонтальным */}
                <motion.div
                  className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1,
                    scale: 1,
                    rotate: -360, // Противоположное вращение для сохранения горизонтальности
                  }}
                  transition={{
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.5 },
                    rotate: {
                      duration: 80 + galaxyIndex * 15, // Совпадает с вращением галактики
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div 
                    className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 shadow-lg"
                    style={{
                      transform: `rotate(${(() => {
                        // ml=0, nlp=1, cv=2, ethics=3, robotics=4
                        switch(galaxy.id) {
                          case 'robotics': return 180; // Робототехника - 180°
                          case 'ethics': return 180;   // ИИ Этика - 180°  
                          case 'cv': return 190;       // Компьютерное зрение - 190°
                          case 'ml': return -2;        // Машинное обучение - оставляем как было
                          case 'nlp': return 1;        // Языковые технологии - оставляем как было
                          default: return 0;
                        }
                      })()}deg)`
                    }}
                  >
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
            (Array.from({ length: 5 }).map((_, systemIndex) => {
              const angle = (systemIndex * 72) * (Math.PI / 180); // 5 систем по кругу
              const radius = 150 + systemIndex * 50; // Увеличенные расстояния между системами
              const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
              
              if (!galaxy) return null;
              
              return (
                <motion.div
                  key={`system-${systemIndex}`}
                  className="absolute cursor-pointer z-30"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  animate={{
                    x: galaxy.position.x + Math.cos(angle) * radius,
                    y: galaxy.position.y + Math.sin(angle) * radius,
                    scale: 1,
                    opacity: 1
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5, delay: systemIndex * 0.1 }}
                  onClick={() => handleSystemClick(`system-${systemIndex}`, {
                    x: galaxy.position.x + Math.cos(angle) * radius,
                    y: galaxy.position.y + Math.sin(angle) * radius
                  })}
                  onDoubleClick={() => handleSystemDoubleClick(`system-${systemIndex}`, {
                    x: galaxy.position.x + Math.cos(angle) * radius,
                    y: galaxy.position.y + Math.sin(angle) * radius
                  })}
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
            }))
          )}
        </AnimatePresence>

        {/* Орбитальная система планет-курсов */}
        <AnimatePresence>
          {viewConfig.state === 'system' && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Орбитальные траектории */}
              {planets.map((_, index) => {
                const orbitRadius = 220 + (index * 100);
                
                return (
                  <div
                    key={`orbit-ring-${index}`}
                    className="absolute border border-white/15 rounded-full pointer-events-none"
                    style={{
                      width: orbitRadius * 2,
                      height: orbitRadius * 2,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                );
              })}

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

              {/* Корабль Галаксион в центре */}
              <motion.div
                className="absolute z-30"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg transform rotate-45" />
                  <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded-sm transform rotate-45" />
                  <motion.div
                    className="absolute -inset-1 bg-cyan-400/20 rounded-lg"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              {/* Дорожная карта - светящиеся пути между планетами */}
              {roadmapMode && activeRoadmapData && (activeRoadmapData as any).connections && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-5" style={{ overflow: 'visible' }}>
                  {(activeRoadmapData as any).connections.map((connection: any, connectionIndex: number) => {
                    const fromPlanet = planets.find(p => p.course.id === connection.from);
                    const toPlanet = planets.find(p => p.course.id === connection.to);
                    
                    if (!fromPlanet || !toPlanet) return null;
                    
                    const isHighlighted = connection.recommended;
                    
                    // Рассчитываем позиции планет по тем же координатам что и в основном коде
                    const cardinalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
                    const fromIndex = planets.indexOf(fromPlanet);
                    const toIndex = planets.indexOf(toPlanet);
                    
                    const fromOrbitRadius = 220 + (fromIndex * 100);
                    const toOrbitRadius = 220 + (toIndex * 100);
                    
                    const fromAngle = (cardinalAngles[fromIndex % cardinalAngles.length]) * (Math.PI / 180);
                    const toAngle = (cardinalAngles[toIndex % cardinalAngles.length]) * (Math.PI / 180);
                    
                    const fromX = 400 + Math.cos(fromAngle) * fromOrbitRadius;
                    const fromY = 300 + Math.sin(fromAngle) * fromOrbitRadius;
                    const toX = 400 + Math.cos(toAngle) * toOrbitRadius;
                    const toY = 300 + Math.sin(toAngle) * toOrbitRadius;
                    
                    return (
                      <motion.line
                        key={`roadmap-${connection.from}-${connection.to}`}
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        stroke={isHighlighted ? "#8BE0F7" : "#B28DFF"}
                        strokeWidth={isHighlighted ? "4" : "2"}
                        strokeDasharray={isHighlighted ? "0" : "8,4"}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ 
                          pathLength: 1, 
                          opacity: isHighlighted ? 0.95 : 0.6,
                          strokeDashoffset: isHighlighted ? 0 : [0, -12]
                        }}
                        transition={{
                          pathLength: { duration: 2.5, delay: connectionIndex * 0.4 },
                          opacity: { duration: 1, delay: connectionIndex * 0.4 },
                          strokeDashoffset: isHighlighted ? {} : {
                            duration: 4,
                            repeat: Infinity,
                            ease: "linear"
                          }
                        }}
                        style={{
                          filter: isHighlighted 
                            ? 'drop-shadow(0 0 12px #8BE0F7) drop-shadow(0 0 24px rgba(139, 224, 247, 0.4))' 
                            : 'drop-shadow(0 0 6px #B28DFF)',
                        }}
                      />
                    );
                  })}
                </svg>
              )}

              {/* Планеты-курсы с орбитами */}
              {planets.map((planet, index) => {
                // Каждая планета на своей орбите с четким позиционированием
                const orbitRadius = 220 + (index * 100); // Увеличенное расстояние между орбитами
                
                // Четкие углы по осям для избежания скучивания
                const cardinalAngles = [
                  0,    // Справа (3 часа)
                  45,   // Северо-восток
                  90,   // Сверху (12 часов)
                  135,  // Северо-запад
                  180,  // Слева (9 часов)
                  225,  // Юго-запад
                  270,  // Снизу (6 часов)
                  315   // Юго-восток
                ];
                
                const planetAngle = (cardinalAngles[index % cardinalAngles.length]) * (Math.PI / 180);
                
                const x = Math.cos(planetAngle) * orbitRadius;
                const y = Math.sin(planetAngle) * orbitRadius;
                
                // Определяем размер планеты по объему курса (модули + уроки)
                const modules = planet.course.modules || 1;
                const estimatedLessons = modules * 2; // Примерно 2 урока на модуль
                
                // Увеличенные размеры планет для лучшей видимости: малый (24-32), средний (36-48), большой (52-64)
                let planetSize;
                if (estimatedLessons <= 4) {
                  planetSize = 24 + estimatedLessons * 2; // Малые планеты: 24-32px
                } else if (estimatedLessons <= 10) {
                  planetSize = 32 + (estimatedLessons - 4) * 2.5; // Средние планеты: 36-48px
                } else {
                  planetSize = Math.min(64, 48 + (estimatedLessons - 10) * 1.5); // Большие планеты: 52-64px
                }
                
                // Цвета планет в зависимости от прогресса и размера
                const getPlanetColor = () => {
                  const progress = planet.course.progress || 0;
                  if (progress >= 100) return 'from-green-400 to-emerald-600'; // Завершен
                  if (progress > 0) return 'from-blue-400 to-indigo-600'; // В процессе
                  
                  // Цвета по размеру курса
                  if (planetSize >= 52) {
                    // Большие планеты - яркие цвета
                    return ['from-red-400 to-orange-600', 'from-purple-400 to-indigo-600', 'from-blue-400 to-cyan-600'][index % 3];
                  } else if (planetSize >= 36) {
                    // Средние планеты - умеренные цвета
                    return ['from-yellow-400 to-amber-600', 'from-pink-400 to-rose-600', 'from-emerald-400 to-green-600'][index % 3];
                  } else {
                    // Малые планеты - приглушенные цвета
                    return ['from-slate-400 to-gray-600', 'from-stone-400 to-neutral-600', 'from-zinc-400 to-slate-600'][index % 3];
                  }
                };
                
                return (
                  <motion.div 
                    key={planet.id} 
                    className="absolute z-10"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    {/* Планета на фиксированной позиции */}
                    <motion.div
                      className={`rounded-full cursor-pointer relative bg-gradient-to-br ${getPlanetColor()}`}
                      style={{
                        width: planetSize,
                        height: planetSize,
                        boxShadow: roadmapMode && activeRoadmapData && (activeRoadmapData as any).recommendedCourses?.includes(planet.course.id)
                          ? `0 0 ${planetSize}px rgba(139, 224, 247, 0.8), 0 0 ${planetSize*1.5}px rgba(139, 224, 247, 0.4)`
                          : `0 0 ${planetSize/2}px rgba(59, 130, 246, 0.4)`,
                      }}
                      onClick={() => handlePlanetClick(planet)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{
                        y: [0, -3, 0], // Легкое покачивание
                      }}
                      transition={{
                        y: { duration: 4 + index, repeat: Infinity, ease: "easeInOut" },
                      }}
                    >
                      {/* Название планеты с размером курса */}
                      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
                        <div className="bg-space-800/90 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                          <p className="text-xs font-medium text-white">{planet.name}</p>
                          <p className="text-xs text-white/60">
                            {modules} {modules === 1 ? 'модуль' : modules < 5 ? 'модуля' : 'модулей'} • 
                            {planetSize >= 52 ? ' Большой' : planetSize >= 36 ? ' Средний' : ' Малый'} курс
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
                      {planetSize >= 52 && (
                        <>
                          <div 
                            className="absolute border border-white/30 rounded-full pointer-events-none"
                            style={{
                              width: planetSize + 16,
                              height: planetSize + 16,
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                          <div 
                            className="absolute border border-white/15 rounded-full pointer-events-none"
                            style={{
                              width: planetSize + 28,
                              height: planetSize + 28,
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                            }}
                          />
                        </>
                      )}

                      {/* Одно кольцо для средних планет */}
                      {planetSize >= 36 && planetSize < 52 && (
                        <div 
                          className="absolute border border-white/20 rounded-full pointer-events-none"
                          style={{
                            width: planetSize + 12,
                            height: planetSize + 12,
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
            
            {/* Кнопка режима дорожной карты */}
            <motion.button
              onClick={() => setRoadmapMode(!roadmapMode)}
              className={`px-3 py-2 border rounded-lg text-xs transition-colors ${
                roadmapMode 
                  ? 'bg-primary/30 hover:bg-primary/40 border-primary/50 text-white' 
                  : 'bg-space-700/50 hover:bg-space-600/50 border-white/20 text-white/70'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Route className="w-3 h-3 inline mr-1" />
              {roadmapMode ? 'Обычный режим' : 'Мой маршрут'}
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

      {/* Умная дорожная карта */}
      <AnimatePresence>
        {roadmapMode && (
          <motion.div
            className="absolute top-4 right-4 z-50 w-96"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.5 }}
          >
            <SmartRoadmapWidget />
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Встроенная панель со списком курсов системы */}
      <AnimatePresence>
        {selectedSystemInfo && (
          <motion.div
            className="fixed z-[90] pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              left: selectedSystemInfo.position.x,
              top: selectedSystemInfo.position.y,
            }}
          >
            <motion.div
              className="system-info-panel bg-gradient-to-br from-space-800/95 to-space-900/95 backdrop-blur-md p-3 rounded-lg border border-primary/30 shadow-2xl w-64 max-h-72 overflow-y-auto pointer-events-auto"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              onWheel={(e) => e.stopPropagation()}
            >
              {/* Заголовок панели */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-orbitron text-white font-bold">
                    Система {selectedSystemInfo.systemIndex + 1}
                  </h3>
                  <p className="text-primary text-xs">
                    {selectedSystemInfo.galaxyName}
                  </p>
                </div>
                <motion.button
                  onClick={() => setSelectedSystemInfo(null)}
                  className="w-6 h-6 bg-space-700/50 hover:bg-space-600/50 border border-white/20 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors text-xs"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Компактный список курсов */}
              <div className="space-y-2">
                {selectedSystemInfo.courses.map((course, index) => {
                  const progress = course.progress || 0;
                  const isCompleted = progress >= 100;
                  const isStarted = progress > 0;
                  
                  return (
                    <motion.div
                      key={course.id}
                      className="bg-space-700/30 hover:bg-space-700/50 border border-white/10 hover:border-primary/30 rounded-md p-2 cursor-pointer transition-all group"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        navigate(`/courses/${course.id}`);
                        setSelectedSystemInfo(null);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        {/* Мини-иконка планеты */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          isCompleted ? 'bg-gradient-to-br from-green-500 to-emerald-600' :
                          isStarted ? 'bg-gradient-to-br from-primary to-blue-600' :
                          'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}>
                          {generatePlanetName(course, index).split(' ')[0][0]}
                        </div>

                        {/* Информация о курсе */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-xs group-hover:text-primary transition-colors truncate">
                            {course.title}
                          </h4>
                          <p className="text-white/60 text-xs mt-0.5 truncate">
                            {generatePlanetName(course, index)}
                          </p>
                          
                          {/* Мини прогресс-бар */}
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex-1 h-1 bg-space-600 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full ${
                                  isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                  'bg-gradient-to-r from-primary to-blue-500'
                                }`}
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                              />
                            </div>
                            <span className="text-white/60 text-xs w-6 text-right">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Подсказка */}
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-white/40 text-xs text-center">
                  Двойной клик → планетарный вид
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GalaxyUniverse;