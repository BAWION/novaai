import React, { useEffect, useRef, useState } from 'react';
import { GalaxyScene, KnowledgeNode } from './GalaxyScene';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import { motion } from 'framer-motion';

// Пример данных о галактике знаний
const galaxyData: KnowledgeNode[] = [
  // Центр галактики - ИИ
  {
    id: 'ai-core',
    name: 'Искусственный Интеллект',
    type: 'star',
    color: '#6E3AFF',
    size: 10,
    position: [0, 0, 0],
    status: 'in-progress',
    description: 'Фундаментальная область, объединяющая все направления искусственного интеллекта.'
  },
  
  // Основные "планеты" в системе ИИ
  {
    id: 'ml',
    name: 'Машинное обучение',
    type: 'planet',
    color: '#2EBAE1',
    size: 6,
    position: [40, 0, 0],
    orbitRadius: 40,
    orbitSpeed: 0.1,
    parentId: 'ai-core',
    status: 'in-progress',
    courseId: 1,
    description: 'Основы машинного обучения, включая классические алгоритмы и методы.'
  },
  {
    id: 'dl',
    name: 'Глубокое обучение',
    type: 'planet',
    color: '#8B5CF6',
    size: 7,
    position: [-50, 0, 30],
    orbitRadius: 60,
    orbitSpeed: 0.08,
    parentId: 'ai-core',
    status: 'available',
    courseId: 2,
    description: 'Нейронные сети, глубокое обучение и современные архитектуры.'
  },
  {
    id: 'cs',
    name: 'Компьютерное зрение',
    type: 'planet',
    color: '#22C55E',
    size: 5,
    position: [0, 0, -45],
    orbitRadius: 45,
    orbitSpeed: 0.12,
    parentId: 'ai-core',
    status: 'available',
    courseId: 3,
    description: 'Анализ и понимание изображений и видео, распознавание объектов.'
  },
  {
    id: 'nlp',
    name: 'Обработка языка',
    type: 'planet',
    color: '#FF3A8C',
    size: 5.5,
    position: [10, 0, 70],
    orbitRadius: 70,
    orbitSpeed: 0.09,
    parentId: 'ai-core',
    status: 'locked',
    courseId: 4,
    description: 'Обработка естественного языка, анализ текста и голоса.'
  },
  
  // "Луны" и дополнительные объекты
  {
    id: 'supervised',
    name: 'Обучение с учителем',
    type: 'moon',
    color: '#64B5F6',
    size: 2.5,
    position: [50, 0, 5],
    orbitRadius: 12,
    orbitSpeed: 0.3,
    parentId: 'ml',
    status: 'completed',
    courseId: 5,
    description: 'Методы обучения на размеченных данных.'
  },
  {
    id: 'unsupervised',
    name: 'Обучение без учителя',
    type: 'moon',
    color: '#4DB6AC',
    size: 2,
    position: [45, 0, -10],
    orbitRadius: 10,
    orbitSpeed: 0.25,
    parentId: 'ml',
    status: 'in-progress',
    courseId: 6,
    description: 'Кластеризация, снижение размерности и поиск структуры в данных.'
  },
  {
    id: 'cnn',
    name: 'Сверточные сети',
    type: 'moon',
    color: '#9575CD',
    size: 3,
    position: [-60, 0, 35],
    orbitRadius: 14,
    orbitSpeed: 0.2,
    parentId: 'dl',
    status: 'available',
    courseId: 7,
    description: 'Архитектуры для работы с изображениями и сеточными данными.'
  },
  {
    id: 'transformers',
    name: 'Трансформеры',
    type: 'moon',
    color: '#F06292',
    size: 3.5,
    position: [-40, 0, 25],
    orbitRadius: 16,
    orbitSpeed: 0.15,
    parentId: 'dl',
    status: 'locked',
    courseId: 8,
    description: 'Современные архитектуры для понимания языка и генеративных моделей.'
  },
  
  // Дальние системы - появляющиеся области
  {
    id: 'quantum-ai',
    name: 'Квантовый ИИ',
    type: 'planet',
    color: '#26A69A',
    size: 4,
    position: [150, 0, 120],
    status: 'locked',
    description: 'Будущее ИИ на квантовых вычислениях.'
  },
  {
    id: 'neuro-ai',
    name: 'Нейроморфный ИИ',
    type: 'planet',
    color: '#FFA726',
    size: 4.5,
    position: [-180, 0, -100],
    status: 'locked',
    description: 'Архитектуры, имитирующие работу человеческого мозга.'
  },
  
  // Астероиды - мелкие специализированные темы
  {
    id: 'regularization',
    name: 'Регуляризация',
    type: 'asteroid',
    color: '#78909C',
    size: 1.2,
    position: [35, 2, 5],
    orbitRadius: 5,
    orbitSpeed: 0.5,
    parentId: 'ml',
    status: 'available',
    description: 'Методы борьбы с переобучением моделей.'
  },
  {
    id: 'gan',
    name: 'GAN',
    type: 'asteroid',
    color: '#9C27B0',
    size: 1.5,
    position: [-45, -1, 30],
    orbitRadius: 7,
    orbitSpeed: 0.4,
    parentId: 'dl',
    status: 'available',
    description: 'Генеративно-состязательные сети для создания контента.'
  },
  {
    id: 'federated',
    name: 'Федеративное обучение',
    type: 'asteroid',
    color: '#FF7043',
    size: 1.3,
    position: [170, 5, 90],
    orbitRadius: 30,
    orbitSpeed: 0.2,
    parentId: 'quantum-ai',
    status: 'locked',
    description: 'Распределенное обучение с сохранением приватности данных.'
  }
];

interface KnowledgeGalaxyProps {
  onNodeSelect?: (node: KnowledgeNode) => void;
}

export function KnowledgeGalaxy({ onNodeSelect }: KnowledgeGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<GalaxyScene | null>(null);
  
  const [hoveredNode, setHoveredNode] = useState<KnowledgeNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [galaxyReady, setGalaxyReady] = useState(false);
  
  // Инициализация галактики
  useEffect(() => {
    if (!containerRef.current || galaxyRef.current) return;
    
    const scene = new GalaxyScene(containerRef.current);
    galaxyRef.current = scene;
    
    scene.setKnowledgeNodes(galaxyData);
    
    scene.setHoverCallback((nodeId: string | null) => {
      if (!nodeId) {
        setHoveredNode(null);
        return;
      }
      
      const node = galaxyData.find(n => n.id === nodeId);
      if (node) {
        setHoveredNode(node);
      }
    });
    
    scene.setClickCallback((nodeId: string) => {
      const node = galaxyData.find(n => n.id === nodeId);
      if (node) {
        setSelectedNode(node);
        scene.zoomToNode(nodeId);
        if (onNodeSelect) {
          onNodeSelect(node);
        }
      }
    });
    
    setGalaxyReady(true);
    
    return () => {
      if (galaxyRef.current) {
        galaxyRef.current.dispose();
        galaxyRef.current = null;
      }
    };
  }, [onNodeSelect]);
  
  const handleResetView = () => {
    if (!galaxyRef.current) return;
    
    galaxyRef.current.resetView();
    setSelectedNode(null);
  };
  
  return (
    <div className="relative w-full h-full">
      {/* 3D галактика */}
      <div 
        ref={containerRef} 
        className="w-full h-full rounded-xl overflow-hidden"
        style={{ minHeight: '500px' }}
      />
      
      {/* Управление */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          className="bg-space-800/70 hover:bg-space-700/70 text-white p-2 rounded-lg transition shadow"
          onClick={handleResetView}
        >
          <i className="fas fa-home"></i>
        </button>
      </div>
      
      {/* Индикатор загрузки */}
      {!galaxyReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-950/80">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-white">Загрузка галактики знаний...</p>
          </div>
        </div>
      )}
      
      {/* Информация о наведении */}
      {hoveredNode && !selectedNode && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-6 left-6 max-w-sm"
        >
          <Glassmorphism className="p-4 rounded-lg">
            <h3 className="font-medium text-lg">
              {hoveredNode.name}
              {hoveredNode.status === 'locked' && (
                <i className="fas fa-lock ml-2 text-white/40 text-sm"></i>
              )}
            </h3>
            {hoveredNode.description && (
              <p className="text-white/70 text-sm mt-1">{hoveredNode.description}</p>
            )}
            <div className="mt-2 text-xs flex items-center text-white/50">
              <i className="fas fa-info-circle mr-1.5"></i>
              <span>Нажмите для подробностей</span>
            </div>
          </Glassmorphism>
        </motion.div>
      )}
      
      {/* Информация о выбранном узле */}
      {selectedNode && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-6 left-6 max-w-md"
        >
          <Glassmorphism className="p-5 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-xl">{selectedNode.name}</h3>
              <div 
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  selectedNode.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  selectedNode.status === 'in-progress' ? 'bg-blue-500/20 text-blue-400' :
                  selectedNode.status === 'available' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}
              >
                {selectedNode.status === 'completed' ? 'Завершено' :
                 selectedNode.status === 'in-progress' ? 'В процессе' :
                 selectedNode.status === 'available' ? 'Доступно' :
                 'Заблокировано'}
              </div>
            </div>
            
            {selectedNode.description && (
              <p className="text-white/80 mb-4">{selectedNode.description}</p>
            )}
            
            <div className="flex items-center mt-2 gap-2">
              {selectedNode.courseId && selectedNode.status !== 'locked' ? (
                <button className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-white py-2 px-4 rounded-lg transition">
                  {selectedNode.status === 'in-progress' 
                    ? 'Продолжить курс' 
                    : 'Начать курс'}
                </button>
              ) : (
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition">
                  Узнать больше
                </button>
              )}
              
              <button 
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                onClick={handleResetView}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </Glassmorphism>
        </motion.div>
      )}
    </div>
  );
}