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
        children: ['ml-intro']
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
        children: ['deep-learning']
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
        return 'bg-[#333333]';
    }
  };

  // Function to get the status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'fa-check';
      case 'in-progress':
        return 'fa-circle-notch fa-spin';
      case 'available':
        return 'fa-play';
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

  // Set the color of progress bar based on status
  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'in-progress': 
        return 'from-[#6E3AFF] to-[#2EBAE1]';
      case 'available':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-gray-600 to-gray-500';
    }
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
          
          <Glassmorphism className="rounded-xl p-6 min-h-[600px]">
            <div className="overflow-x-auto">
              <div className="min-w-[800px] h-[800px] relative">
                {/* Fixed roadmap layout */}
                {Object.keys(roadmapData).length > 0 && (
                  <div className="relative w-full h-full">
                    {/* Level 1: Root node */}
                    <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2 z-10">
                      <motion.div 
                        className={`cursor-pointer ${selectedNode === 'root' ? 'scale-110' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedNode('root')}
                      >
                        <div className={`w-16 h-16 rounded-full ${getStatusColor(roadmapData['root'].status)} flex items-center justify-center text-white shadow-lg`}>
                          <i className={`fas ${getStatusIcon(roadmapData['root'].status)} text-xl`}></i>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="font-medium text-sm whitespace-nowrap">{roadmapData['root'].title}</p>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['root'].status)}`} 
                              style={{ width: `${roadmapData['root'].progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Vertical lines from root */}
                    <div className="absolute top-[130px] left-[40%] w-0.5 h-[100px] bg-gradient-to-b from-green-500 to-emerald-500"></div>
                    <div className="absolute top-[130px] left-[60%] w-0.5 h-[100px] bg-gradient-to-b from-green-500 to-emerald-500"></div>

                    {/* Level 2: First branching */}
                    <div className="absolute top-[230px] left-[30%] z-10">
                      <motion.div 
                        className={`cursor-pointer ${selectedNode === 'python-basics' ? 'scale-110' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedNode('python-basics')}
                      >
                        <div className={`w-16 h-16 rounded-full ${getStatusColor(roadmapData['python-basics'].status)} flex items-center justify-center text-white shadow-lg`}>
                          <i className={`fas ${getStatusIcon(roadmapData['python-basics'].status)} text-xl`}></i>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="font-medium text-sm whitespace-nowrap">{roadmapData['python-basics'].title}</p>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['python-basics'].status)}`} 
                              style={{ width: `${roadmapData['python-basics'].progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute top-[230px] left-[70%] z-10">
                      <motion.div 
                        className={`cursor-pointer ${selectedNode === 'math-foundations' ? 'scale-110' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedNode('math-foundations')}
                      >
                        <div className={`w-16 h-16 rounded-full ${getStatusColor(roadmapData['math-foundations'].status)} flex items-center justify-center text-white shadow-lg`}>
                          <i className={`fas ${getStatusIcon(roadmapData['math-foundations'].status)} text-xl`}></i>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="font-medium text-sm whitespace-nowrap">{roadmapData['math-foundations'].title}</p>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['math-foundations'].status)}`} 
                              style={{ width: `${roadmapData['math-foundations'].progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Vertical lines to level 3 */}
                    <div className="absolute top-[310px] left-[30%] w-0.5 h-[100px] bg-gradient-to-b from-[#6E3AFF] to-[#2EBAE1]"></div>
                    <div className="absolute top-[310px] left-[70%] w-0.5 h-[100px] bg-gradient-to-b from-[#6E3AFF] to-[#2EBAE1]"></div>

                    {/* Level 3: Second branching */}
                    <div className="absolute top-[410px] left-[30%] z-10">
                      <motion.div 
                        className={`cursor-pointer ${selectedNode === 'data-structures' ? 'scale-110' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedNode('data-structures')}
                      >
                        <div className={`w-16 h-16 rounded-full ${getStatusColor(roadmapData['data-structures'].status)} flex items-center justify-center text-white shadow-lg`}>
                          <i className={`fas ${getStatusIcon(roadmapData['data-structures'].status)} text-xl`}></i>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="font-medium text-sm whitespace-nowrap">{roadmapData['data-structures'].title}</p>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['data-structures'].status)}`} 
                              style={{ width: `${roadmapData['data-structures'].progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute top-[410px] left-[70%] z-10">
                      <motion.div 
                        className={`cursor-pointer ${selectedNode === 'ml-intro' ? 'scale-110' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedNode('ml-intro')}
                      >
                        <div className={`w-16 h-16 rounded-full ${getStatusColor(roadmapData['ml-intro'].status)} flex items-center justify-center text-white shadow-lg`}>
                          <i className={`fas ${getStatusIcon(roadmapData['ml-intro'].status)} text-xl`}></i>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="font-medium text-sm whitespace-nowrap">{roadmapData['ml-intro'].title}</p>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['ml-intro'].status)}`} 
                              style={{ width: `${roadmapData['ml-intro'].progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Vertical lines to level 4 */}
                    <div className="absolute top-[490px] left-[30%] w-0.5 h-[100px] bg-white/30"></div>
                    <div className="absolute top-[490px] left-[70%] w-0.5 h-[100px] bg-white/30"></div>

                    {/* Level 4: Third branching */}
                    <div className="absolute top-[590px] left-[30%] z-10">
                      <motion.div 
                        className={`cursor-pointer ${selectedNode === 'numpy-pandas' ? 'scale-110' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedNode('numpy-pandas')}
                      >
                        <div className={`w-16 h-16 rounded-full ${getStatusColor(roadmapData['numpy-pandas'].status)} flex items-center justify-center text-white shadow-lg`}>
                          <i className={`fas ${getStatusIcon(roadmapData['numpy-pandas'].status)} text-xl`}></i>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="font-medium text-sm whitespace-nowrap">{roadmapData['numpy-pandas'].title}</p>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['numpy-pandas'].status)}`} 
                              style={{ width: `${roadmapData['numpy-pandas'].progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute top-[590px] left-[50%] z-10">
                      <motion.div 
                        className={`cursor-pointer ${selectedNode === 'data-visualization' ? 'scale-110' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedNode('data-visualization')}
                      >
                        <div className={`w-16 h-16 rounded-full ${getStatusColor(roadmapData['data-visualization'].status)} flex items-center justify-center text-white shadow-lg`}>
                          <i className={`fas ${getStatusIcon(roadmapData['data-visualization'].status)} text-xl`}></i>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="font-medium text-sm whitespace-nowrap">{roadmapData['data-visualization'].title}</p>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['data-visualization'].status)}`} 
                              style={{ width: `${roadmapData['data-visualization'].progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div className="absolute top-[590px] left-[70%] z-10">
                      <motion.div 
                        className={`cursor-pointer ${selectedNode === 'deep-learning' ? 'scale-110' : ''}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedNode('deep-learning')}
                      >
                        <div className={`w-16 h-16 rounded-full ${getStatusColor(roadmapData['deep-learning'].status)} flex items-center justify-center text-white shadow-lg`}>
                          <i className={`fas ${getStatusIcon(roadmapData['deep-learning'].status)} text-xl`}></i>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="font-medium text-sm whitespace-nowrap">{roadmapData['deep-learning'].title}</p>
                          <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['deep-learning'].status)}`} 
                              style={{ width: `${roadmapData['deep-learning'].progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
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
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData[selectedNode].status)}`} 
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