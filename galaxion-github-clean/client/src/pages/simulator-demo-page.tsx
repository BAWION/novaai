import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { SimulatorContainer, SimulatorLesson, TaskType } from "@/components/simulator/simulator-container";
import { SimulatorToolbox } from "@/components/simulator/simulator-toolbox";
import { Book, Bot, Code, Play } from "lucide-react";

/**
 * Демонстрационная страница No-Code AI Симулятора
 * 
 * Позволяет тестировать различные типы интерактивных заданий:
 * 1. Обычные уроки с вопросами и вариантами ответов
 * 2. No-Code конструктор
 * 3. Шаблоны промптов
 */
export default function SimulatorDemoPage() {
  const [activeTab, setActiveTab] = useState("lesson");
  
  // Пример урока для симулятора
  const demoLesson: SimulatorLesson = {
    id: "nocode-intro-1",
    title: "Введение в No-Code разработку AI приложений",
    description: "Познакомьтесь с основами создания AI приложений без написания кода",
    tasks: [
      {
        id: "task1",
        type: TaskType.TEXT_INPUT,
        title: "Знакомство с No-Code подходом",
        description: "No-Code инструменты позволяют создавать приложения без традиционного программирования.",
        instruction: "Напишите, что такое No-Code разработка одним предложением:",
        correctAnswer: "создание приложений без программирования",
        hintText: "Это подход к разработке, который не требует навыков программирования."
      },
      {
        id: "task2",
        type: TaskType.CHOICE,
        title: "Преимущества No-Code разработки",
        description: "No-Code платформы предлагают множество преимуществ для разработки AI приложений.",
        instruction: "Выберите главное преимущество No-Code подхода:",
        options: [
          "Полная гибкость и контроль на уровне программирования",
          "Скорость разработки и доступность для непрограммистов",
          "Более высокая производительность приложений",
          "Меньшее потребление ресурсов"
        ],
        correctAnswer: "Скорость разработки и доступность для непрограммистов",
        hintText: "Подумайте о главной цели No-Code инструментов."
      },
      {
        id: "task3",
        type: TaskType.PROMPT_CREATION,
        title: "Составление эффективных промптов",
        description: "Хороший промпт - ключ к получению качественных результатов от AI моделей.",
        instruction: "Создайте промпт для генерации списка идей мобильных приложений с использованием AI:",
        correctAnswer: "Создай список из 5 инновационных идей для мобильных приложений, которые используют искусственный интеллект",
        hintText: "Укажите конкретное количество идей и тематику."
      }
    ],
    xpReward: 50,
    skillRewards: ["No-Code разработка", "Prompt Engineering", "AI Application Design"]
  };
  
  // Функция для обработки завершения урока
  const handleLessonComplete = (progress: any) => {
    console.log("Урок завершен с прогрессом:", progress);
    alert(`Урок успешно завершен! Заработано ${progress.score} XP.`);
  };
  
  return (
    <DashboardLayout
      title="No-Code AI: Симулятор"
      subtitle="Интерактивная среда для обучения No-Code разработке AI приложений"
    >
      <div className="mb-8">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="lesson" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Интерактивный урок</span>
            </TabsTrigger>
            <TabsTrigger value="nocode" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>No-Code конструктор</span>
            </TabsTrigger>
            <TabsTrigger value="prompts" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>Шаблоны промптов</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="lesson">
            <SimulatorContainer 
              lesson={demoLesson}
              onComplete={handleLessonComplete}
              onExit={() => console.log("Выход из урока")}
            />
          </TabsContent>
          
          <TabsContent value="nocode">
            <Glassmorphism className="p-6 rounded-xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">No-Code конструктор AI приложений</h2>
                <p className="text-white/80">
                  Создавайте AI приложения без программирования, используя визуальные компоненты.
                </p>
              </div>
              
              <div className="mb-6 p-4 bg-space-800/50 border border-space-700 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Задание</h3>
                <p className="text-white/80 mb-3">
                  Создайте простое приложение, которое будет содержать:
                </p>
                <ul className="list-disc list-inside space-y-1 text-white/80 mb-4">
                  <li>Текстовый элемент с описанием</li>
                  <li>Кнопку для запуска AI модели</li>
                  <li>Компонент вызова AI модели GPT-4o</li>
                  <li>Текстовый элемент для отображения результата</li>
                </ul>
                <Button className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Проверить решение
                </Button>
              </div>
              
              <SimulatorToolbox toolType="no-code-builder" />
            </Glassmorphism>
          </TabsContent>
          
          <TabsContent value="prompts">
            <Glassmorphism className="p-6 rounded-xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Конструктор шаблонов промптов</h2>
                <p className="text-white/80">
                  Создавайте эффективные шаблоны промптов с переменными для разных сценариев использования AI.
                </p>
              </div>
              
              <div className="mb-6 p-4 bg-space-800/50 border border-space-700 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Задание</h3>
                <p className="text-white/80 mb-3">
                  Создайте шаблон промпта для генерации контента блога со следующими переменными:
                </p>
                <ul className="list-disc list-inside space-y-1 text-white/80 mb-4">
                  <li>Тема блога</li>
                  <li>Целевая аудитория</li>
                  <li>Тон повествования</li>
                  <li>Длина статьи</li>
                </ul>
                <Button className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Проверить решение
                </Button>
              </div>
              
              <SimulatorToolbox toolType="prompt-template" />
            </Glassmorphism>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}