import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { NovaAssistant } from "@/components/nova-assistant";
import { ParticlesBackground } from "@/components/particles-background";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

// Типы уроков
type LessonContentType = "text" | "video" | "interactive" | "quiz";

// Структура содержимого урока
interface LessonSection {
  type: LessonContentType;
  title: string;
  content: string | React.ReactNode;
  code?: string;
  duration?: number; // в секундах
}

interface MicroLesson {
  id: string;
  title: string;
  description: string;
  targetDuration: number; // в минутах
  difficulty: 1 | 2 | 3;
  sections: LessonSection[];
  quizQuestions?: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

export default function MicroLesson() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Создаем демо-урок для Даниила "Python для начинающих"
  const lesson: MicroLesson = {
    id: "python-intro-1",
    title: "Первые шаги в Python",
    description: "Познакомимся с Python и напишем первую программу",
    targetDuration: 7, // 7 минут
    difficulty: 1,
    sections: [
      {
        type: "text",
        title: "Привет, мир программирования!",
        content: (
          <div className="space-y-4">
            <p>
              Привет, Даня! Рад познакомиться — я твой космический помощник в изучении Python. 
              Python — один из самых популярных языков программирования в мире искусственного интеллекта.
            </p>
            <p>
              Сегодня мы сделаем твой первый шаг в программировании — напишем простую программу и познакомимся с базовыми концепциями.
            </p>
            <div className="mt-4 p-3 bg-primary/10 rounded-md border border-primary/20">
              <p className="font-medium text-primary">Что тебя ждет в этом уроке:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Узнаешь, что такое Python и почему его стоит изучать</li>
                <li>Напишешь свою первую программу</li>
                <li>Поймешь, как работает код</li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        type: "text",
        title: "Что такое Python?",
        content: (
          <div className="space-y-4">
            <p>
              Python — это язык программирования, который был создан для людей. 
              Он разработан так, чтобы быть понятным и читаемым, даже если ты никогда раньше не программировал.
            </p>
            <p className="font-medium text-primary">Python популярен, потому что:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Простой и понятный синтаксис (правила написания кода)</li>
              <li>Подходит для разных задач: от создания веб-сайтов до ИИ</li>
              <li>Большое сообщество и много готовых решений</li>
              <li>Его используют в NASA, Google, Instagram и других крупных компаниях</li>
            </ul>
          </div>
        ),
      },
      {
        type: "interactive",
        title: "Первая программа на Python",
        content: (
          <div className="space-y-4">
            <p>
              Давай напишем твою первую программу на Python! В программировании 
              есть традиция начинать с программы "Hello, World!" — она просто выводит 
              этот текст на экран.
            </p>
            <div className="p-4 bg-black/80 rounded-md font-mono text-green-400">
              <p>print("Привет, мир!")</p>
            </div>
            <p className="mt-2">
              Это весь код! В Python для вывода текста используется функция <code className="bg-black/20 px-1 rounded">print()</code>, 
              а текст заключается в кавычки.
            </p>
            <div className="mt-4 p-3 bg-secondary/10 rounded-md border border-secondary/20">
              <p className="font-medium text-secondary">Результат работы программы:</p>
              <div className="mt-2 p-2 bg-black/60 rounded">
                <p className="text-white">Привет, мир!</p>
              </div>
            </div>
          </div>
        ),
        code: 'print("Привет, мир!")',
      },
      {
        type: "interactive",
        title: "Персонализируем программу",
        content: (
          <div className="space-y-4">
            <p>
              Теперь сделаем программу более личной — добавим твоё имя и создадим переменную.
            </p>
            <p>
              <span className="font-medium text-primary">Переменная</span> — это 
              контейнер с именем, в котором хранятся данные. Представь, что это коробка с 
              этикеткой, куда можно положить что угодно.
            </p>
            <div className="p-4 bg-black/80 rounded-md font-mono text-green-400">
              <p># Создаем переменную с именем</p>
              <p>имя = "Даня"</p>
              <p># Используем переменную в выводе</p>
              <p>print("Привет,", имя, "! Добро пожаловать в мир Python!")</p>
            </div>
            <p className="mt-2">
              Заметь несколько важных вещей:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Строки начинающиеся с # это комментарии — они нужны для людей, компьютер их игнорирует</li>
              <li>Python понимает русский язык, но обычно переменные пишут латиницей</li>
              <li>Мы использовали запятые в функции print() чтобы соединить несколько элементов</li>
            </ul>
            <div className="mt-4 p-3 bg-secondary/10 rounded-md border border-secondary/20">
              <p className="font-medium text-secondary">Результат работы программы:</p>
              <div className="mt-2 p-2 bg-black/60 rounded">
                <p className="text-white">Привет, Даня! Добро пожаловать в мир Python!</p>
              </div>
            </div>
          </div>
        ),
        code: 'имя = "Даня"\nprint("Привет,", имя, "! Добро пожаловать в мир Python!")',
      },
      {
        type: "quiz",
        title: "Проверка знаний",
        content: (
          <div className="space-y-6">
            <p>
              Давай проверим, что ты узнал из этого микро-урока. Выбери правильные 
              ответы на вопросы:
            </p>
            <div className="space-y-8">
              {[
                {
                  question: "Как вывести текст 'Привет!' на экран в Python?",
                  options: [
                    "echo('Привет!')",
                    "print('Привет!')",
                    "console.log('Привет!')",
                    "Привет!"
                  ],
                  answer: 1
                },
                {
                  question: "Что такое переменная в программировании?",
                  options: [
                    "Формула для вычислений",
                    "Контейнер с именем для хранения данных",
                    "Функция для вывода текста",
                    "Комментарий в коде"
                  ],
                  answer: 1
                }
              ].map((q, qIndex) => (
                <div key={qIndex} className="p-4 bg-primary/5 rounded-lg">
                  <p className="font-medium mb-3">{qIndex + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, oIndex) => (
                      <div 
                        key={oIndex}
                        onClick={() => handleQuizAnswer(qIndex, oIndex)}
                        className={`p-3 rounded-md cursor-pointer transition-all ${
                          answers[qIndex] === oIndex 
                            ? "bg-primary/20 border border-primary" 
                            : "bg-black/10 hover:bg-black/20"
                        }`}
                      >
                        <p>{option}</p>
                      </div>
                    ))}
                  </div>
                  {answers[qIndex] !== undefined && (
                    <p className={`mt-2 ${answers[qIndex] === q.answer ? "text-green-500" : "text-red-500"}`}>
                      {answers[qIndex] === q.answer 
                        ? "✓ Верно!" 
                        : `✗ Неверно. Правильный ответ: ${q.options[q.answer]}`
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        type: "text",
        title: "Что дальше?",
        content: (
          <div className="space-y-4">
            <p>
              Отлично! Ты сделал свой первый шаг в мире программирования на Python. 
              Теперь ты знаешь, как вывести текст и создать переменную — это основа 
              для любых программ.
            </p>
            <p>
              В следующем уроке мы научимся:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Работать с разными типами данных (числа, строки)</li>
              <li>Выполнять простые вычисления</li>
              <li>Получать ввод от пользователя</li>
            </ul>
            <p className="mt-3 text-primary font-medium">
              А пока попробуй самостоятельно поэкспериментировать с кодом, который мы написали. 
              Попробуй изменить текст, создать новые переменные или использовать другие слова.
            </p>
          </div>
        ),
      }
    ],
  };

  useEffect(() => {
    // Устанавливаем время начала урока
    if (!startTime) {
      setStartTime(new Date());
    }

    // Обновляем прогресс
    const totalSections = lesson.sections.length;
    setProgress(Math.round(((currentSectionIndex + 1) / totalSections) * 100));
  }, [currentSectionIndex, startTime, lesson.sections.length]);

  const handleNextSection = () => {
    if (currentSectionIndex < lesson.sections.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo(0, 0); // Прокручиваем вверх для нового раздела
    } else {
      setShowCongrats(true);
      // Сохраняем прогресс
      const endTime = new Date();
      const timeTakenMs = startTime ? endTime.getTime() - startTime.getTime() : 0;
      const timeTakenMinutes = Math.round(timeTakenMs / 60000);
      
      toast({
        title: "Урок завершен!",
        description: `Ты прошел урок за ${timeTakenMinutes} минут. Отличная работа!`,
        variant: "default"
      });
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const currentSection = lesson.sections[currentSectionIndex];
  const allQuizAnswered = currentSection.type === 'quiz'
    ? Object.keys(answers).length === 2 // у нас 2 вопроса в квизе
    : true;

  return (
    <div className="min-h-screen w-full flex flex-col">
      <ParticlesBackground />

      <section className="container mx-auto px-4 min-h-[80vh] py-8 mt-12 mb-12">
        <Glassmorphism className="max-w-4xl mx-auto rounded-2xl p-6 md:p-8 relative">
          {!showCongrats ? (
            <div className="flex flex-col">
              {/* Заголовок урока */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <h1 className="font-orbitron text-2xl md:text-3xl font-semibold">
                    {lesson.title}
                  </h1>
                  <div className="flex items-center bg-black/20 px-3 py-1 rounded-full">
                    <i className="fas fa-stopwatch mr-2"></i>
                    <span className="text-sm">{lesson.targetDuration} мин</span>
                  </div>
                </div>
                <p className="text-white/70 mt-2">{lesson.description}</p>
                
                {/* Прогресс-бар */}
                <div className="mt-4 flex items-center">
                  <div className="h-2 flex-grow bg-black/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium">
                    {currentSectionIndex + 1} из {lesson.sections.length}
                  </span>
                </div>
              </div>

              {/* Содержимое секции */}
              <div className="mb-6">
                <h2 className="text-xl mb-4 font-medium font-space">
                  {currentSection.title}
                </h2>
                <div className="prose prose-invert max-w-none">
                  {currentSection.content}
                </div>
              </div>

              {/* Навигация */}
              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevSection}
                  disabled={currentSectionIndex === 0}
                >
                  <i className="fas fa-arrow-left mr-2"></i>Назад
                </Button>
                <Button
                  onClick={handleNextSection}
                  disabled={!allQuizAnswered}
                >
                  {currentSectionIndex === lesson.sections.length - 1 ? "Завершить" : "Далее"}
                  {currentSectionIndex !== lesson.sections.length - 1 && (
                    <i className="fas fa-arrow-right ml-2"></i>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-10"
            >
              <div className="inline-block p-6 rounded-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] mb-6">
                <i className="fas fa-trophy text-4xl"></i>
              </div>
              <h2 className="font-orbitron text-3xl font-bold mb-4">
                Поздравляю!
              </h2>
              <p className="text-xl mb-8">
                Ты успешно завершил свой первый урок по Python
              </p>
              <div className="max-w-lg mx-auto p-5 bg-primary/10 rounded-lg mb-8">
                <h3 className="font-medium text-lg mb-3">Что ты узнал:</h3>
                <ul className="text-left list-disc pl-5 space-y-2">
                  <li>Что такое Python и почему он популярен</li>
                  <li>Как вывести текст на экран с помощью функции print()</li>
                  <li>Как создавать и использовать переменные</li>
                  <li>Как добавлять комментарии в код</li>
                </ul>
              </div>
              <div className="flex justify-center space-x-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="px-6">
                    На главную
                  </Button>
                </Link>
                <Link href="/python-intro-2">
                  <Button className="px-6">
                    Следующий урок
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </Glassmorphism>
      </section>
    </div>
  );
}