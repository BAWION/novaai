import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LessonStructureUpdater from '@/components/admin/lesson-structure-updater';
import { Shield, Settings, FileStack } from 'lucide-react';

/**
 * Административная страница для управления структурой уроков
 */
const LessonStructurePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      
      <header className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-md">
            <Shield size={24} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Административная панель</h1>
        </div>
        <p className="text-muted-foreground">
          Управление структурой уроков и обновление микроструктуры с интерактивными элементами
        </p>
      </header>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-card border rounded-xl p-5 space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Settings size={18} className="text-primary" />
                  Управление
                </h2>
                <p className="text-sm text-muted-foreground">
                  Инструменты для управления структурой уроков и микроструктурой
                </p>
              </div>
              
              <Tabs defaultValue="lesson-structure" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="lesson-structure" className="w-full">
                    <FileStack size={16} className="mr-2" />
                    Структуры
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <Tabs defaultValue="lesson-structure" className="w-full">
            <TabsContent value="lesson-structure" className="space-y-6">
              <div className="bg-card/40 backdrop-blur-md border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">Управление структурой уроков</h2>
                <p className="mb-6 text-muted-foreground">
                  Этот интерфейс позволяет обновить структуру существующих уроков до новой микроструктуры
                  с интерактивными элементами. Обновление заменит текущую структуру урока на новую версию.
                </p>
                
                <LessonStructureUpdater />
              </div>
              
              <div className="bg-card/40 backdrop-blur-md border rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">Информация о микроструктуре</h2>
                <p className="mb-4 text-muted-foreground">
                  Новая микроструктура включает следующие секции и компоненты:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-card/60 border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Hook (Крючок)</h3>
                    <p className="text-sm">Вступительная секция для привлечения внимания студента</p>
                  </div>
                  
                  <div className="bg-card/60 border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Explain (Объяснение)</h3>
                    <p className="text-sm">Основной теоретический материал урока</p>
                  </div>
                  
                  <div className="bg-card/60 border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Demo (Демонстрация)</h3>
                    <p className="text-sm">Практические примеры и иллюстрации теоретического материала</p>
                  </div>
                  
                  <div className="bg-card/60 border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Quick Try (Практика)</h3>
                    <p className="text-sm">Интерактивные задания, квизы и практические упражнения</p>
                  </div>
                  
                  <div className="bg-card/60 border rounded-lg p-4">
                    <h3 className="font-medium mb-2">Reflect (Рефлексия)</h3>
                    <p className="text-sm">Подведение итогов, закрепление материала и вопросы для размышления</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LessonStructurePage;