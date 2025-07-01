import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Rocket, Home, Telescope, Navigation } from 'lucide-react';

// Types based on specification
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface Station {
  id: string;
  name: string;
  checkpointType: 'quiz' | 'project' | 'exam';
  status: 'locked' | 'open' | 'passed';
  position: Vector3;
}

interface Asteroid {
  id: string;
  name: string;
  lessonId: string;
  status: 'todo' | 'doing' | 'done';
  position: Vector3;
}

interface Planet {
  id: string;
  name: string;
  courseId: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  status: 'locked' | 'in_progress' | 'completed';
  size: number;
  position: Vector3;
  rotationSpeeds: Vector3;
  rings?: boolean;
  atmosphere?: boolean;
  asteroids: Asteroid[];
  stations: Station[];
}

interface StarSystem {
  id: string;
  name: string;
  position: Vector3;
  color: string;
  planets: Planet[];
}

interface Galaxy {
  id: string;
  name: string;
  aiDomain: 'ML' | 'NLP' | 'CV' | 'Robotics' | 'Ethics';
  color: string;
  spiralArms: number;
  rotationSpeed: number;
  starSystems: StarSystem[];
  discovered: boolean;
}

type NavigationState = 'universe' | 'galaxy' | 'system' | 'planet';

interface ViewConfig {
  state: NavigationState;
  selectedGalaxy?: string;
  selectedSystem?: string;
  selectedPlanet?: string;
  cameraDistance: number;
  focus: Vector3;
  breadcrumb: string[];
}

// Enhanced Galaxy Universe Component
export default function EnhancedGalaxyUniverse() {
  const [, setLocation] = useLocation();
  
  // Navigation state following specification
  const [viewConfig, setViewConfig] = useState<ViewConfig>({
    state: 'universe',
    cameraDistance: 900,
    focus: { x: 0, y: 0, z: 0 },
    breadcrumb: ['🌌 Вселенная']
  });

  // Mock data following specification structure
  const [galaxies] = useState<Galaxy[]>([
    {
      id: 'ml',
      name: 'Галактика Машинного Обучения',
      aiDomain: 'ML',
      color: '#9b5de5',
      spiralArms: 4,
      rotationSpeed: 0.01,
      discovered: true,
      starSystems: [
        {
          id: 'ml-core',
          name: 'ML Core',
          position: { x: 120, y: 40, z: -50 },
          color: '#ffc6ff',
          planets: [
            {
              id: 'pytorch',
              name: 'PyTorch Basics',
              courseId: 'course_101',
              difficulty: 'basic',
              status: 'in_progress',
              size: 1.2,
              position: { x: 10, y: 0, z: 0 },
              rotationSpeeds: { x: 0, y: 0.02, z: 0 },
              asteroids: [],
              stations: [
                {
                  id: 'quiz1',
                  name: 'Quiz 1',
                  checkpointType: 'quiz',
                  status: 'open',
                  position: { x: 2, y: 0.5, z: 0 }
                }
              ]
            }
          ]
        }
      ]
    },
    // Add other galaxies following same pattern...
  ]);

  const [newDiscovery, setNewDiscovery] = useState<any>(null);

  // Navigation functions following specification
  const navigateToGalaxy = (galaxyId: string) => {
    const galaxy = galaxies.find(g => g.id === galaxyId);
    if (!galaxy?.discovered) return;

    setViewConfig({
      state: 'galaxy',
      selectedGalaxy: galaxyId,
      cameraDistance: 450,
      focus: { x: 0, y: 0, z: 0 },
      breadcrumb: ['🌌 Вселенная', `🌀 ${galaxy.name}`]
    });
  };

  const navigateToSystem = (systemId: string) => {
    const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
    const system = galaxy?.starSystems.find(s => s.id === systemId);
    if (!system) return;

    setViewConfig(prev => ({
      ...prev,
      state: 'system',
      selectedSystem: systemId,
      cameraDistance: 150,
      breadcrumb: [...prev.breadcrumb, `⭐ ${system.name}`]
    }));
  };

  const navigateToPlanet = (planetId: string) => {
    const galaxy = galaxies.find(g => g.id === viewConfig.selectedGalaxy);
    const system = galaxy?.starSystems.find(s => s.id === viewConfig.selectedSystem);
    const planet = system?.planets.find(p => p.id === planetId);
    if (!planet) return;

    setViewConfig(prev => ({
      ...prev,
      state: 'planet',
      selectedPlanet: planetId,
      cameraDistance: 50,
      breadcrumb: [...prev.breadcrumb, `🪐 ${planet.name}`]
    }));
  };

  // Home button - instant return to Universe
  const returnToUniverse = () => {
    setViewConfig({
      state: 'universe',
      cameraDistance: 900,
      focus: { x: 0, y: 0, z: 0 },
      breadcrumb: ['🌌 Вселенная']
    });
  };

  // Scan/Discovery simulation
  const simulateDiscovery = () => {
    const undiscoveredGalaxies = galaxies.filter(g => !g.discovered);
    if (undiscoveredGalaxies.length > 0) {
      const discovered = undiscoveredGalaxies[0];
      discovered.discovered = true;
      
      setNewDiscovery({
        name: discovered.name,
        type: 'galaxy'
      });

      // Auto-hide after 5 seconds
      setTimeout(() => setNewDiscovery(null), 5000);
    }
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-space-900 via-space-800 to-space-900 overflow-hidden">
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
              {viewConfig.breadcrumb.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-white/50 mx-1">→</span>}
                  <motion.span 
                    className={index === 0 ? "text-primary cursor-pointer hover:text-primary/80 transition-colors" : "text-white"}
                    onClick={index === 0 ? returnToUniverse : undefined}
                    whileHover={index === 0 ? { scale: 1.05 } : {}}
                    whileTap={index === 0 ? { scale: 0.95 } : {}}
                  >
                    {item}
                  </motion.span>
                </React.Fragment>
              ))}
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
                {viewConfig.state === 'system' && 'Анализ планетарных орбит'}
                {viewConfig.state === 'planet' && 'Детальное сканирование поверхности'}
              </span>
            </div>
            
            {/* Camera Distance Info */}
            <div className="mt-1 text-xs text-white/50">
              Дистанция: {viewConfig.cameraDistance} световых лет
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Home Button */}
      <div className="absolute top-4 right-4 z-50">
        <motion.button
          onClick={returnToUniverse}
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

      {/* Galaxy Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            scale: viewConfig.state === 'universe' ? 1 : viewConfig.state === 'galaxy' ? 1.5 : 2,
          }}
          transition={{ duration: 1.2, ease: "easeInOutCubic" }}
        >
          {/* Galaxies */}
          <AnimatePresence>
            {galaxies.map((galaxy) => (
              <motion.div
                key={galaxy.id}
                className="absolute cursor-pointer"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  opacity: galaxy.discovered ? 1 : 0.3,
                  rotate: galaxy.rotationSpeed * Date.now() / 100,
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => navigateToGalaxy(galaxy.id)}
              >
                <div
                  className="w-32 h-32 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: galaxy.color + '20',
                    borderColor: galaxy.color,
                    boxShadow: `0 0 20px ${galaxy.color}40`,
                  }}
                >
                  <span className="text-white text-xs font-orbitron text-center">
                    {galaxy.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Galaxion Ship */}
          <motion.div
            className="absolute z-40"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: viewConfig.state === 'planet' ? 1.5 : 1,
            }}
          >
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                rotateZ: viewConfig.state === 'universe' ? [0, 5, -5, 0] : 0 
              }}
              transition={{ 
                rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
                rotateZ: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-full border-2 border-white/30 shadow-2xl flex items-center justify-center relative overflow-hidden">
                <Rocket className="w-6 h-6 text-white z-10" />
                
                {/* Energy Core */}
                <motion.div 
                  className="absolute inset-2 bg-white/20 rounded-full"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              
              {/* Energy Rings */}
              <motion.div 
                className="absolute inset-0 border-2 border-primary/40 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Ship Control Panel */}
      <div className="absolute bottom-4 left-4 z-50">
        <motion.div 
          className="bg-gradient-to-br from-space-800/90 to-space-900/90 backdrop-blur-sm p-4 rounded-xl border border-primary/30 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            <p className="text-xs font-orbitron text-white">ГАЛАКСИОН - КОНТРОЛЬ</p>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/70 w-16">Энергия</div>
              <div className="flex-1 h-2 bg-space-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 2 }}
                />
              </div>
              <div className="text-xs text-white/60">92%</div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-xs text-white/70 w-16">Галактики</div>
              <div className="text-xs text-white/80">
                {galaxies.filter(g => g.discovered).length}/{galaxies.length} открыто
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <motion.button
              onClick={simulateDiscovery}
              className="flex-1 px-3 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-xs text-white transition-colors flex items-center justify-center gap-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Telescope className="w-3 h-3" />
              Сканировать
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Discovery Notifications */}
      <AnimatePresence>
        {newDiscovery && (
          <motion.div
            className="absolute top-4 right-4 z-50 w-80"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}