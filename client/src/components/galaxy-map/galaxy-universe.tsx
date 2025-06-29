import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Rocket, Zap, Star, Globe, Telescope } from 'lucide-react';

// Определение типов
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
}

// Конфигурация галактик
const GALAXIES: Galaxy[] = [
  {
    id: 'ml',
    name: 'Галактика Машинного Обучения',
    domain: 'Machine Learning',
    color: '#6E3AFF',
    position: { x: -200, y: -150 },
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
    position: { x: 200, y: -100 },
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
    position: { x: -100, y: 180 },
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
    position: { x: 150, y: 150 },
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
    position: { x: 0, y: -250 },
    size: 95,
    discovered: false,
    courses: [],
    rotation: 180
  }
];

export default function GalaxyUniverse() {
  const [, navigate] = useLocation();
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [showShip, setShowShip] = useState(true);
  const [galaxies, setGalaxies] = useState<Galaxy[]>(GALAXIES);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [newDiscovery, setNewDiscovery] = useState<{ type: 'galaxy' | 'planet'; name: string } | null>(null);

  // Загружаем курсы
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Распределяем курсы по галактикам и создаем планеты
  useEffect(() => {
    if (Array.isArray(courses) && courses.length > 0) {
      const updatedGalaxies = [...galaxies];
      const newPlanets: Planet[] = [];

      courses.forEach((course: Course, index: number) => {
        // Определяем галактику для курса
        let galaxyId = 'ml'; // по умолчанию
        
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
            completed: (course.progress || 0) >= 100
          });
        }
      });

      setGalaxies(updatedGalaxies);
      setPlanets(newPlanets);
    }
  }, [courses]);

  // Функция для открытия курса
  const handlePlanetClick = (planet: Planet) => {
    navigate(`/courses/${planet.course.id}`);
  };

  // Функция для фокуса на галактике
  const handleGalaxyClick = (galaxyId: string) => {
    setSelectedGalaxy(selectedGalaxy === galaxyId ? null : galaxyId);
  };

  // Симуляция открытия новых галактик/планет
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
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Галаксион - космический корабль */}
      <motion.div
        className="absolute z-30 cursor-pointer"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          y: [-5, 5, -5],
          rotate: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={() => setShowShip(!showShip)}
      >
        <div className="relative">
          {/* Корабль */}
          <div className="w-16 h-16 bg-gradient-to-br from-slate-300 to-slate-600 rounded-lg flex items-center justify-center shadow-2xl border border-slate-400">
            <Rocket className="w-8 h-8 text-blue-400" />
          </div>
          
          {/* Двигатель */}
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          >
            <div className="w-6 h-8 bg-gradient-to-t from-blue-400 via-cyan-300 to-transparent rounded-b-full opacity-80" />
          </motion.div>

          {/* Название корабля */}
          <motion.div
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: showShip ? 1 : 0 }}
          >
            <div className="bg-space-800/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-primary/30">
              <p className="text-sm font-orbitron font-bold text-primary">ГАЛАКСИОН</p>
              <p className="text-xs text-white/70">Корабль Знаний</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Галактики */}
      {galaxies.map((galaxy) => (
        <motion.div
          key={galaxy.id}
          className="absolute cursor-pointer"
          style={{
            left: '50%',
            top: '50%',
          }}
          animate={{
            x: galaxy.position.x,
            y: galaxy.position.y,
            rotate: galaxy.rotation,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut"
          }}
          onClick={() => handleGalaxyClick(galaxy.id)}
        >
          {/* Галактика */}
          <motion.div
            className={`relative ${galaxy.discovered ? 'opacity-100' : 'opacity-30'}`}
            animate={{
              rotate: [0, 360],
              scale: selectedGalaxy === galaxy.id ? 1.2 : 1,
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 0.3
              }
            }}
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
            {galaxy.discovered && (
              <motion.div
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: selectedGalaxy === galaxy.id ? 1 : 0.7,
                  y: selectedGalaxy === galaxy.id ? 0 : 10,
                }}
              >
                <div className="bg-space-800/80 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                  <p className="text-xs font-orbitron text-white">{galaxy.name}</p>
                  <p className="text-xs text-white/60">{galaxy.courses.length} планет</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      ))}

      {/* Планеты (курсы) */}
      <AnimatePresence>
        {planets.map((planet) => {
          const galaxy = galaxies.find(g => g.id === planet.galaxy);
          const showPlanet = !selectedGalaxy || selectedGalaxy === planet.galaxy;
          
          return showPlanet && galaxy?.discovered ? (
            <motion.div
              key={planet.id}
              className="absolute cursor-pointer z-20"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: planet.position.x,
                y: planet.position.y,
                scale: selectedGalaxy === planet.galaxy ? 1.2 : 1,
              }}
              initial={{ scale: 0 }}
              exit={{ scale: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
              onClick={() => handlePlanetClick(planet)}
            >
              {/* Планета */}
              <motion.div
                className="relative"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 10 + Math.random() * 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div
                  className={`rounded-full border-2 ${
                    planet.completed 
                      ? 'border-green-400 bg-gradient-to-br from-green-400/60 to-green-600/40' 
                      : planet.visited 
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/60 to-yellow-600/40'
                        : 'border-blue-400 bg-gradient-to-br from-blue-400/60 to-blue-600/40'
                  } shadow-lg`}
                  style={{
                    width: planet.size,
                    height: planet.size,
                  }}
                >
                  {/* Иконка курса */}
                  <div className="w-full h-full flex items-center justify-center">
                    <i className={`fas fa-${planet.course.icon || 'brain'} text-white text-xs`} />
                  </div>
                </div>

                {/* Кольца для продвинутых курсов */}
                {planet.course.level === 'advanced' && (
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-white/30 rounded-full"
                    style={{
                      width: planet.size * 1.5,
                      height: planet.size * 1.5,
                    }}
                  />
                )}

                {/* Информация о планете при выборе галактики */}
                {selectedGalaxy === planet.galaxy && (
                  <motion.div
                    className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-space-800/90 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                      <p className="text-xs font-medium text-white">{planet.course.title}</p>
                      <p className="text-xs text-white/60">{planet.course.modules} модулей</p>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          ) : null;
        })}
      </AnimatePresence>

      {/* Уведомления о новых открытиях */}
      <AnimatePresence>
        {newDiscovery && (
          <motion.div
            className="absolute top-4 right-4 z-40"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
          >
            <div className="bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-sm p-4 rounded-lg border border-primary/30 shadow-xl max-w-sm">
              <div className="flex items-center gap-3">
                <Telescope className="w-6 h-6 text-yellow-300" />
                <div>
                  <p className="font-orbitron font-bold text-sm text-white">
                    {newDiscovery.type === 'galaxy' ? 'Новая Галактика!' : 'Новая Планета!'}
                  </p>
                  <p className="text-xs text-white/80">
                    Обнаружено: {newDiscovery.name}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Панель управления */}
      <div className="absolute bottom-4 left-4 z-30">
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

      {/* Легенда */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-space-800/80 backdrop-blur-sm p-3 rounded-lg border border-white/20">
          <p className="text-xs font-orbitron text-white mb-2">Статус планет:</p>
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