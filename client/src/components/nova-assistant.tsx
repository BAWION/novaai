import React from "react";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";

interface NovaAssistantProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function NovaAssistant({ currentStep, totalSteps, progress }: NovaAssistantProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-32 h-32 rounded-full shadow-[0_0_15px_rgba(46,186,225,0.5)] bg-gradient-to-br from-[#2EBAE1]/50 to-[#6E3AFF]/50 p-1"
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          repeat: Infinity, 
          duration: 3, 
          ease: "easeInOut" 
        }}
      >
        <div className="rounded-full w-full h-full overflow-hidden bg-space-800 flex items-center justify-center">
          <svg 
            className="w-full h-full text-[#2EBAE1]"
            viewBox="0 0 200 200" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              fill="currentColor" 
              d="M100,30 C130,30 155,55 155,85 C155,115 130,140 100,140 C70,140 45,115 45,85 C45,55 70,30 100,30 Z" 
            />
            <circle cx="75" cy="75" r="8" fill="white" />
            <circle cx="125" cy="75" r="8" fill="white" />
            <path 
              d="M70,100 Q100,130 130,100" 
              fill="none" 
              stroke="white" 
              strokeWidth="4" 
              strokeLinecap="round" 
            />
            <path 
              d="M50,50 Q60,40 70,50" 
              fill="none" 
              stroke="white" 
              strokeWidth="3" 
              strokeLinecap="round" 
            />
            <path 
              d="M150,50 Q140,40 130,50" 
              fill="none" 
              stroke="white" 
              strokeWidth="3" 
              strokeLinecap="round" 
            />
            <path 
              d="M100,140 L100,170" 
              stroke="currentColor" 
              strokeWidth="30" 
              strokeLinecap="round" 
            />
            <path 
              d="M65,170 L135,170" 
              stroke="currentColor" 
              strokeWidth="10" 
              strokeLinecap="round" 
            />
          </svg>
        </div>
      </motion.div>

      <div className="mt-4 text-center">
        <h3 className="font-space font-medium text-xl">Nova</h3>
        <p className="text-white/60 text-sm">Ваш ИИ-наставник</p>
      </div>

      <Glassmorphism className="mt-6 rounded-xl p-4 w-full">
        <h4 className="font-medium mb-2">Прогресс знакомства</h4>
        <div className="flex justify-between text-sm text-white/60 mb-1">
          <span>
            Шаг <span id="current-step">{currentStep}</span> из {totalSteps}
          </span>
          <span id="progress-percent">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-space-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#2EBAE1] to-[#6E3AFF] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </Glassmorphism>
    </div>
  );
}
