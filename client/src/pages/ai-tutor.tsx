import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AiChat } from '@/components/ai-tutor/ai-chat';
import { useIsMobile } from "@/hooks/use-mobile";

export default function AiTutorPage() {
  const isMobile = useIsMobile();

  return (
    <DashboardLayout title="ИИ-Тьютор" subtitle="Персональный помощник для изучения искусственного интеллекта">
      <div className="space-y-6">
        {isMobile ? (
          // Простая мобильная версия - только чат
          <div className="w-full">
            <AiChat />
          </div>
        ) : (
          // Десктопная версия с дополнительной информацией
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <AiChat />
            </div>

            {/* Features and Tips - только на десктопе */}
            <div className="space-y-6">
              {/* Краткие советы */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h3 className="font-semibold mb-3 text-white">Советы по использованию</h3>
                <div className="space-y-2 text-sm text-white/70">
                  <div>• Задавайте конкретные вопросы</div>
                  <div>• Просите примеры из реальной жизни</div>
                  <div>• Изучайте поэтапно от простого к сложному</div>
                  <div>• Переспрашивайте, если что-то непонятно</div>
                </div>
              </div>

              {/* Популярные темы */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h3 className="font-semibold mb-3 text-white">Популярные темы</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Машинное обучение",
                    "Нейронные сети", 
                    "Python для ИИ",
                    "Алгоритмы",
                    "Computer Vision",
                    "NLP"
                  ].map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/10 text-white/80 text-xs rounded-md border border-white/20"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}