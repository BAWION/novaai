import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Brain, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillsDnaProfile } from "@/components/skills-dna-profile";

interface SkillsDnaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: number;
}

/**
 * Модальное окно для отображения полного профиля Skills DNA
 */
export function SkillsDnaModal({
  open,
  onOpenChange,
  userId
}: SkillsDnaModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-space-900/95 backdrop-blur-md text-white border-space-700 sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 text-white/60 hover:text-white"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-xl font-bold flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
              Детальный анализ Skills DNA
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2">
          <SkillsDnaProfile 
            userId={userId} 
            showHeader={false}
            className="w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}