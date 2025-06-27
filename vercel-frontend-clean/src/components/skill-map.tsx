import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SkillNode } from "@/components/ui/skill-node";
import { skillNodes, skillConnections } from "@/lib/constants";
import { calculateAngle, calculateDistance } from "@/lib/utils";

interface SkillMapProps {
  className?: string;
}

export function SkillMap({ className }: SkillMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [connections, setConnections] = useState<JSX.Element[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const drawConnections = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      const newConnections = skillConnections.map((conn, index) => {
        const fromNode = container.querySelector(`[data-skill="${conn.from}"]`);
        const toNode = container.querySelector(`[data-skill="${conn.to}"]`);

        if (!fromNode || !toNode) return null;

        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();

        // Calculate center positions relative to container
        const fromX = fromRect.left - containerRect.left + fromRect.width / 2;
        const fromY = fromRect.top - containerRect.top + fromRect.height / 2;
        const toX = toRect.left - containerRect.left + toRect.width / 2;
        const toY = toRect.top - containerRect.top + toRect.height / 2;

        // Calculate distance and angle
        const distance = calculateDistance(fromX, fromY, toX, toY);
        const angle = calculateAngle(fromX, fromY, toX, toY);

        const isHighlighted = 
          hoveredNode === conn.from || 
          hoveredNode === conn.to;

        return (
          <div
            key={`conn-${index}`}
            className={`absolute h-0.5 bg-gradient-to-r from-[#2EBAE1]/70 to-[#6E3AFF]/70 transform origin-left transition-opacity duration-300 z-10`}
            style={{
              width: `${distance}px`,
              left: `${fromX}px`,
              top: `${fromY}px`,
              transform: `rotate(${angle}deg)`,
              opacity: isHighlighted ? 1 : 0.5
            }}
          />
        );
      });

      setConnections(newConnections.filter(Boolean) as JSX.Element[]);
    };

    drawConnections();
    window.addEventListener('resize', drawConnections);

    return () => {
      window.removeEventListener('resize', drawConnections);
    };
  }, [hoveredNode]);

  const handleNodeHover = (id: string) => {
    setHoveredNode(id);
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative h-[400px] bg-space-900/50 rounded-xl p-4 overflow-hidden ${className || ''}`}
    >
      {/* Render connections first so they're below the nodes */}
      {connections}
      
      {/* Render skill nodes */}
      {skillNodes.map((node) => (
        <SkillNode
          key={node.id}
          id={node.id}
          name={node.name}
          icon={node.icon}
          size={node.size}
          color={node.color}
          intensity={node.intensity}
          style={{
            top: `${node.position.y}%`,
            left: `${node.position.x}%`,
          }}
          highlighted={hoveredNode === node.id}
          onMouseEnter={() => handleNodeHover(node.id)}
          onMouseLeave={handleNodeLeave}
        />
      ))}
    </div>
  );
}
