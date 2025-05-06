import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import LessonStructureUpdater from '@/components/admin/lesson-structure-updater';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import MicroLessonStructureNew from '@/components/courses/micro-lesson-structure-new';

/**
 * Админ-страница для управления структурой уроков
 */
const LessonStructurePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  
  // Простая проверка на админ-доступ
  const isAdmin = user?.role === 'admin' || user?.username === 'telegram_user';
  
  // Если пользователь не админ, перенаправляем на дашборд
  React.useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);
  
  // Демо-данные для предпросмотра структуры урока
  const demoStructure = {
    id: 999,
    lessonId: 999,
    hookTitle: "Искусственный интеллект: на границе возможного",
    hook: `<p>Представьте себе технологию, способную писать стихи, создавать искусство, решать сложнейшие научные проблемы и даже вести с вами увлекательную беседу. Еще десять лет назад это могло показаться научной фантастикой, но сегодня мы стоим на пороге новой эры — эры искусственного интеллекта.</p>
    
    <p>В 2023 году ChatGPT достиг отметки в <strong>100 миллионов</strong> активных пользователей всего за 2 месяца, став самым быстрорастущим приложением в истории. Это неудивительно — ведь современные системы ИИ используются в здравоохранении, образовании, бизнесе и многих других сферах, меняя наш подход к решению проблем.</p>
    
    <p>В этом курсе мы погрузимся в удивительный мир искусственного интеллекта и разберёмся, как именно эта технология работает и почему она так важна для нашего будущего.</p>`,
    hookImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop",
    
    explainTitle: "Что такое искусственный интеллект?",
    explain: `<p>Искусственный интеллект (ИИ) — это область компьютерной науки, нацеленная на создание систем, способных выполнять задачи, которые обычно требуют человеческого интеллекта.</p>`,
    
    keyPoints: [
      "Искусственный интеллект — это технология, позволяющая компьютерам выполнять задачи, требующие человеческого интеллекта",
      "Современные ИИ-системы основаны на алгоритмах машинного обучения, которые учатся на больших объемах данных",
      "На сегодняшний день существует только узкий ИИ, способный решать конкретные задачи"
    ],
    
    demoTitle: "Как работает машинное обучение на примере",
    demo: `<p>Чтобы лучше понять принцип работы машинного обучения, рассмотрим простой пример классификации изображений.</p>`,
    
    externalLinks: [
      { url: "#", title: "TensorFlow: Классификация изображений" },
      { url: "#", title: "Практический курс по deep learning" }
    ],
    
    quickTryTitle: "Создаем простой классификатор текста",
    quickTry: `<p>Давайте попробуем понять принцип работы классификации текста на простом примере.</p>`,
    
    quickTryTask: `<p>Попробуйте классифицировать следующие отзывы, используя простой подход подсчета положительных и отрицательных слов:</p>`,
    
    reflectTitle: "Размышления о будущем искусственного интеллекта",
    reflect: `<p>Теперь, когда мы познакомились с основами ИИ и принципами его работы, давайте поразмышляем о том, как эта технология может изменить нашу жизнь.</p>`,
    
    reflectQuestions: [
      "Как вы думаете, какие сферы человеческой деятельности больше всего изменятся под влиянием ИИ в ближайшие 5-10 лет?",
      "Какие навыки, на ваш взгляд, останутся уникально человеческими даже при развитом ИИ?"
    ]
  };
  
  // Демо прогресс
  const demoProgress = {
    userId: 10,
    lessonId: 999,
    hookCompleted: true,
    explainCompleted: true,
    demoCompleted: false,
    quickTryCompleted: false,
    reflectCompleted: false,
    lastVisitedSection: 'demo'
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/courses/ai-literacy-101')} 
          className="flex items-center text-white/70 hover:text-white"
        >
          <ArrowLeft size={16} className="mr-1" />
          Вернуться к курсу
        </Button>
        
        <h1 className="text-3xl font-bold mt-4">Управление структурой уроков</h1>
        <p className="text-white/60 mt-1">
          Инструменты для обновления и просмотра структуры уроков в новом формате микроуроков
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <LessonStructureUpdater />
          
          <div className="bg-space-800/60 backdrop-blur-lg border border-space-700 rounded-lg p-4">
            <h2 className="text-lg font-medium mb-2">Информация о реструктуризации</h2>
            <p className="text-white/80 text-sm mb-4">
              Микроструктура урока включает следующие компоненты:
            </p>
            
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start">
                <span className="text-sky-400 font-medium mr-2">Hook</span> - 
                <span className="ml-1">Вовлекающее введение в тему урока</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 font-medium mr-2">Explain</span> - 
                <span className="ml-1">Объяснение ключевых концепций</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-400 font-medium mr-2">Demo</span> - 
                <span className="ml-1">Демонстрация применения знаний</span>
              </li>
              <li className="flex items-start">
                <span className="text-violet-400 font-medium mr-2">Quick Try</span> - 
                <span className="ml-1">Практическое задание для закрепления</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-400 font-medium mr-2">Reflect</span> - 
                <span className="ml-1">Рефлексия и осмысление материала</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-8">
          <div className="bg-space-800/60 backdrop-blur-lg border border-space-700 rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Предпросмотр микроструктуры урока</h2>
            <Separator className="mb-6" />
            
            <MicroLessonStructureNew 
              lessonId={999}
              structure={demoStructure}
              userProgress={demoProgress}
              onProgressUpdate={async () => {}}
              onComplete={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonStructurePage;