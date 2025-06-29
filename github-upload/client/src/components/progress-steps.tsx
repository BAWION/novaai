import React from "react";
import { motion } from "framer-motion";
import { calculateProgress } from "@/lib/utils";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
}

export function ProgressSteps({
  currentStep,
  totalSteps,
  onStepChange,
}: ProgressStepsProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  const progress = calculateProgress(currentStep, totalSteps);

  return (
    <div className="w-full mb-8">
      <div className="relative flex justify-between">
        {steps.map((step) => (
          <button
            key={step}
            className="relative z-10"
            onClick={() => onStepChange(step)}
            disabled={step > currentStep}
          >
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step <= currentStep
                  ? "bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] text-white"
                  : "bg-space-800 text-white/40"
              }`}
              whileHover={step <= currentStep ? { scale: 1.1 } : {}}
              whileTap={step <= currentStep ? { scale: 0.95 } : {}}
            >
              {step < currentStep ? (
                <i className="fas fa-check"></i>
              ) : (
                <span>{step}</span>
              )}
            </motion.div>
            <span
              className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap ${
                step <= currentStep ? "text-white/80" : "text-white/40"
              }`}
            >
              Шаг {step}
            </span>
          </button>
        ))}

        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-space-800 -translate-y-1/2 z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
      </div>
    </div>
  );
}
