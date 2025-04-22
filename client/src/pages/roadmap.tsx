import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useUserProfile } from "@/context/user-profile-context";

// Define types for our roadmap data
interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'available' | 'locked';
  children: string[];
}

interface RoadmapData {
  [key: string]: RoadmapNode;
}

export default function Roadmap() {
  const { userProfile } = useUserProfile();
  const [roadmapData, setRoadmapData] = useState<RoadmapData>({});
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // This would typically be fetched from the API based on the user's profile
  useEffect(() => {
    const track = userProfile?.recommendedTrack || 'zero-to-hero';
    
    // Generate mock roadmap data based on user's track
    const generateRoadmapData = () => {
      const data: RoadmapData = {};
      
      // Root node
      data['root'] = {
        id: 'root',
        title: 'Начало пути',
        description: 'Добро пожаловать в NovaAI University! Это начало вашего путешествия в мир искусственного интеллекта.',
        progress: 100,
        status: 'completed',
        children: ['python-basics', 'math-foundations']
      };
      
      // Basic track nodes
      data['python-basics'] = {
        id: 'python-basics',
        title: 'Основы Python',
        description: 'Изучение основ программирования на Python: переменные, типы данных, условия, циклы, функции.',
        progress: 85,
        status: 'in-progress',
        children: ['data-structures']
      };
      
      data['math-foundations'] = {
        id: 'math-foundations',
        title: 'Математические основы',
        description: 'Линейная алгебра, статистика и исчисление для машинного обучения.',
        progress: 40,
        status: 'in-progress',
        children: []
      };
      
      data['data-structures'] = {
        id: 'data-structures',
        title: 'Структуры данных',
        description: 'Изучение списков, словарей, множеств и других структур данных в Python.',
        progress: 0,
        status: 'available',
        children: ['numpy-pandas']
      };
      
      data['numpy-pandas'] = {
        id: 'numpy-pandas',
        title: 'NumPy и Pandas',
        description: 'Работа с массивами, матрицами и таблицами данных с использованием NumPy и Pandas.',
        progress: 0,
        status: 'locked',
        children: ['data-visualization']
      };
      
      data['data-visualization'] = {
        id: 'data-visualization',
        title: 'Визуализация данных',
        description: 'Использование Matplotlib, Seaborn и Plotly для визуализации данных.',
        progress: 0,
        status: 'locked',
        children: ['ml-intro']
      };
      
      data['ml-intro'] = {
        id: 'ml-intro',
        title: 'Введение в ML',
        description: 'Основные концепции и алгоритмы машинного обучения: регрессия, классификация, кластеризация.',
        progress: 0,
        status: 'locked',
        children: ['deep-learning']
      };
      
      data['deep-learning'] = {
        id: 'deep-learning',
        title: 'Глубокое обучение',
        description: 'Нейронные сети, функции активации, оптимизаторы. Работа с TensorFlow и PyTorch.',
        progress: 0,
        status: 'locked',
        children: []
      };
      
      // Additional nodes for each track
      if (track === 'research-ai') {
        data['ml-research'] = {
          id: 'ml-research',
          title: 'Исследования в ML',
          description: 'Методики проведения исследований в области машинного обучения, написание научных статей.',
          progress: 0,
          status: 'locked',
          children: []
        };
        
        data['deep-learning'].children.push('ml-research');
      } else if (track === 'applied-ds') {
        data['ml-deployment'] = {
          id: 'ml-deployment',
          title: 'MLOps и развертывание',
          description: 'Развертывание и поддержка ML-моделей в production-среде.',
          progress: 0,
          status: 'locked',
          children: []
        };
        
        data['deep-learning'].children.push('ml-deployment');
      }
      
      return data;
    };
    
    const data = generateRoadmapData();
    setRoadmapData(data);
    setSelectedNode('root');
  }, [userProfile]);

  // Function to get the status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'in-progress':
        return 'bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]';
      case 'available':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'locked':
      default:
        return 'bg-white/20';
    }
  };

  // Function to get the status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'fa-check-circle';
      case 'in-progress':
        return 'fa-circle-notch fa-spin';
      case 'available':
        return 'fa-play-circle';
      case 'locked':
      default:
        return 'fa-lock';
    }
  };

  // Function to navigate to the next available module
  const startNextModule = () => {
    // Find the first available module
    const availableNode = Object.values(roadmapData).find(
      node => node.status === 'available'
    );
    
    if (availableNode) {
      // In a real app, this would navigate to the course page
      console.log(`Starting module: ${availableNode.title}`);
      alert(`Начинаем модуль: ${availableNode.title}`);
    }
  };

  // Render nodes recursively with fixed layout
  const renderNodes = (nodeId: string, level = 0) => {
    const node = roadmapData[nodeId];
    if (!node) return null;
    
    const statusColor = getStatusColor(node.status);
    const statusIcon = getStatusIcon(node.status);
    
    // Use a fixed layout with pre-defined coordinates
    const nodeStyle = getRoadmapNodeStyle(nodeId, level);
    
    return (
      <React.Fragment key={node.id}>
        <motion.div 
          className={`absolute cursor-pointer ${selectedNode === nodeId ? 'z-20 scale-110' : 'z-10'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelectedNode(nodeId)}
          style={nodeStyle}
        >
          <div className={`w-16 h-16 rounded-full ${statusColor} flex items-center justify-center text-white shadow-lg`}>
            <i className={`fas ${statusIcon} text-xl`}></i>
          </div>
          <div className="mt-2 text-center">
            <p className="font-medium text-sm whitespace-nowrap">{node.title}</p>
            <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
              <div 
                className={`h-full rounded-full ${statusColor}`} 
                style={{ width: `${node.progress}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
        
        {/* Render connections */}
        {node.children.map(childId => {
          if (!roadmapData[childId]) return null;
          const connectionStyle = getConnectionStyle(nodeId, childId);
          const status = roadmapData[nodeId].status;
          const connectionClass = status === 'completed' ? 'absolute bg-gradient-to-b from-green-500 to-emerald-500' : 
                                  status === 'in-progress' ? 'absolute bg-gradient-to-b from-[#6E3AFF] to-[#2EBAE1]' : 
                                  'absolute bg-white/30';
          return (
            <div 
              key={`${nodeId}-${childId}`} 
              className={connectionClass}
              style={connectionStyle}
            ></div>
          );
        })}
        
        {/* Render children */}
        {node.children.map(childId => renderNodes(childId, level + 1))}
      </React.Fragment>
    );
  };
  
  // Function to get node position based on predefined layout
  const getRoadmapNodeStyle = (nodeId: string, level: number): React.CSSProperties => {
    // Define fixed positions for each node
    const nodePositions: {[key: string]: {top: string, left: string}} = {
      'root': { top: '50px', left: '50%' },
      'python-basics': { top: '180px', left: '30%' },
      'math-foundations': { top: '180px', left: '70%' },
      'data-structures': { top: '310px', left: '30%' },
      'numpy-pandas': { top: '440px', left: '30%' },
      'data-visualization': { top: '440px', left: '50%' },
      'ml-intro': { top: '310px', left: '70%' },
      'deep-learning': { top: '440px', left: '70%' },
      'ml-research': { top: '570px', left: '60%' },
      'ml-deployment': { top: '570px', left: '80%' }
    };
    
    const position = nodePositions[nodeId] || { top: `${level * 150}px`, left: '50%' };
    
    return {
      top: position.top,
      left: position.left,
      transform: 'translate(-50%, 0)'
    };
  };
  
  // Function to draw connections between nodes with better line layout
  const getConnectionStyle = (parentId: string, childId: string): React.CSSProperties => {
    const parentPos = getRoadmapNodeStyle(parentId, 0);
    const childPos = getRoadmapNodeStyle(childId, 0);
    
    // Parse positions to get numeric values
    const parentTop = parseInt(parentPos.top as string);
    const parentLeft = parseInt(parentPos.left as string);
    const childTop = parseInt(childPos.top as string);
    const childLeft = parseInt(childPos.left as string);
    
    // Calculate middle point for connecting two nodes vertically
    const verticalLineHeight = (childTop - parentTop - 70) + 'px';
    
    // Special connections for specific node pairs
    const connectionKey = `${parentId}-${childId}`;
    
    switch (connectionKey) {
      case 'root-python-basics':
        return {
          top: (parentTop + 70) + 'px',
          left: '40%',
          width: '2px',
          height: (childTop - parentTop - 70) + 'px',
        };
      
      case 'root-math-foundations':
        return {
          top: (parentTop + 70) + 'px',
          left: '60%',
          width: '2px',
          height: (childTop - parentTop - 70) + 'px',
        };
        
      case 'python-basics-data-structures':
        return {
          top: (parentTop + 70) + 'px',
          left: '30%',
          width: '2px',
          height: (childTop - parentTop - 70) + 'px',
        };
        
      case 'data-structures-numpy-pandas':
        return {
          top: (parentTop + 70) + 'px',
          left: '30%',
          width: '2px',
          height: (childTop - parentTop - 70) + 'px',
        };
        
      case 'math-foundations-ml-intro':
        return {
          top: (parentTop + 70) + 'px',
          left: '70%',
          width: '2px',
          height: (childTop - parentTop - 70) + 'px',
        };
        
      case 'ml-intro-deep-learning':
        return {
          top: (parentTop + 70) + 'px',
          left: '70%',
          width: '2px',
          height: (childTop - parentTop - 70) + 'px',
        };
    }
    
    // Default vertical connection
    if (Math.abs(childLeft - parentLeft) < 5) {
      return {
        top: (parentTop + 70) + 'px',
        left: 'calc(' + parentLeft + '% - 1px)',
        width: '2px',
        height: verticalLineHeight,
      };
    }
    
    // For other connections, create a horizontal line
    // First create the vertical segment from parent
    if (parentTop < childTop) {
      return {
        top: (parentTop + 70) + 'px',
        left: 'calc(' + parentLeft + '% - 1px)',
        width: '2px',
        height: (childTop - parentTop - 40) + 'px',
      };
    }
    
    // Default case: simple vertical line
    return {
      top: (parentTop + 70) + 'px',
      left: 'calc(' + parentLeft + '% - 1px)',
      width: '2px',
      height: (Math.abs(childTop - parentTop) - 70) + 'px',
    };
  };

  return (
    <DashboardLayout 
      title="Персональный Roadmap" 
      subtitle="Ваш путь обучения в NovaAI University"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Roadmap visualization */}
        <div className="w-full lg:w-8/12">
          <h2 className="font-orbitron text-xl font-semibold mb-4">
            Карта вашего пути
          </h2>
          
          <Glassmorphism className="rounded-xl p-6 min-h-[500px]">
            <div className="overflow-x-auto pb-6">
              <div className="min-w-[800px] min-h-[600px] pt-6 relative">
                {Object.keys(roadmapData).length > 0 && renderNodes('root')}
              </div>
            </div>
          </Glassmorphism>
        </div>
        
        {/* Selected module details */}
        <div className="w-full lg:w-4/12">
          {selectedNode && roadmapData[selectedNode] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key={selectedNode}
            >
              <h2 className="font-orbitron text-xl font-semibold mb-4">
                Детали модуля
              </h2>
              
              <Glassmorphism className="rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData[selectedNode].status)} flex items-center justify-center text-white`}>
                    <i className={`fas ${getStatusIcon(roadmapData[selectedNode].status)} text-xl`}></i>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg">{roadmapData[selectedNode].title}</h3>
                    <p className="text-white/60 text-sm">
                      {roadmapData[selectedNode].status === 'completed' && 'Завершено'}
                      {roadmapData[selectedNode].status === 'in-progress' && 'В процессе'}
                      {roadmapData[selectedNode].status === 'available' && 'Доступно'}
                      {roadmapData[selectedNode].status === 'locked' && 'Заблокировано'}
                    </p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-white/80 text-sm mb-2">Прогресс:</div>
                  <div className="w-full h-2 bg-white/10 rounded-full">
                    <div 
                      className={`h-full rounded-full ${getStatusColor(roadmapData[selectedNode].status)}`} 
                      style={{ width: `${roadmapData[selectedNode].progress}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-white/60 text-xs mt-1">
                    {roadmapData[selectedNode].progress}%
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-white/80 text-sm mb-2">Описание:</div>
                  <p className="text-white/70">
                    {roadmapData[selectedNode].description}
                  </p>
                </div>
                
                {/* Prerequisites would be shown here */}
                
                {roadmapData[selectedNode].status === 'available' && (
                  <button
                    onClick={startNextModule}
                    className="w-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-rocket mr-2"></i>
                    Начать модуль
                  </button>
                )}
                
                {roadmapData[selectedNode].status === 'in-progress' && (
                  <button
                    onClick={startNextModule}
                    className="w-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-play mr-2"></i>
                    Продолжить обучение
                  </button>
                )}
              </Glassmorphism>
            </motion.div>
          )}
          
          {/* Next steps */}
          <div className="mt-6">
            <Glassmorphism className="rounded-xl p-6">
              <h3 className="font-semibold mb-2">Рекомендации AI-наставника:</h3>
              <p className="text-white/70 text-sm mb-4">
                На основе вашего прогресса и интересов, рекомендую сосредоточиться на завершении модуля «Основы Python» перед тем, как переходить к более сложным темам.
              </p>
              <button
                onClick={startNextModule}
                className="w-full border border-white/20 hover:bg-white/10 text-white py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <i className="fas fa-lightbulb mr-2"></i>
                Подробный план обучения
              </button>
            </Glassmorphism>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}