import React, { useState } from 'react';
import { KnowledgeGalaxy } from './galaxy/KnowledgeGalaxy';
import { KnowledgeNode } from './galaxy/GalaxyScene';

interface GalaxyOrbitalLayoutProps {
  onNodeSelect?: (node: KnowledgeNode) => void;
}

export function GalaxyOrbitalLayout({ onNodeSelect }: GalaxyOrbitalLayoutProps) {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  
  const handleNodeSelect = (node: KnowledgeNode) => {
    setSelectedNode(node);
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };
  
  return (
    <div className="h-full min-h-[500px] flex flex-col">
      <div className="flex-1 overflow-hidden">
        <KnowledgeGalaxy onNodeSelect={handleNodeSelect} />
      </div>
      
      {selectedNode && (
        <div className="mt-4 p-4 bg-space-800/30 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">{selectedNode.name}</h3>
            {selectedNode.courseId && (
              <button 
                className="px-4 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-lg transition text-sm"
                onClick={() => {
                  // Здесь будет навигация к курсу
                  console.log(`Navigate to course ${selectedNode.courseId}`);
                }}
              >
                {selectedNode.status === 'in-progress' 
                  ? 'Продолжить изучение' 
                  : selectedNode.status === 'completed'
                  ? 'Повторить материал'
                  : 'Начать изучение'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}