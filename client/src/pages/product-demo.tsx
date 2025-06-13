import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Zap,
  Code,
  Target,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Home,
  CheckCircle,
  Star,
  TrendingUp,
  MessageCircle,
  Lightbulb,
  Cpu,
  Database,
  Network
} from "lucide-react";

interface DemoSlide {
  id: number;
  title: string;
  subtitle?: string;
  component: React.ReactNode;
}

export default function ProductDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [direction, setDirection] = useState(0);

  const demoSlides: DemoSlide[] = [
    {
      id: 1,
      title: "NovaAI University",
      subtitle: "Интерактивная демонстрация продукта",
      component: (
        <div className="h-full flex flex-col justify-center items-center text-center space-y-8">
          {/* Intro Video */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-4xl mb-8"
          >
            <div className="relative rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl">
              <video
                className="w-full h-auto"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="/attached_assets/8_seconds__202506122300_1749847207365.mp4" type="video/mp4" />
                Ваш браузер не поддерживает видео элемент.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Brain className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400 rounded-full animate-bounce"></div>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <h1 className="text-5xl font-bold mb-4">NovaAI University</h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Первая AI-driven образовательная платформа в России
            </p>
            <Badge className="mt-4 bg-primary/20 text-primary border-primary/30">
              Интерактивное демо
            </Badge>
          </motion.div>
        </div>
      )
    },

    {
      id: 2,
      title: "Skills DNA Navigator",
      subtitle: "Глубокая диагностика компетенций",
      component: (
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-purple-300 mb-4">Skills DNA Navigator</h3>
              <p className="text-white/80 text-lg mb-6">
                Четырехэтапная система диагностики создает уникальный "генетический код" навыков каждого пользователя
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                { step: 1, title: "Роль и опыт", icon: Users, color: "bg-blue-500" },
                { step: 2, title: "Технические навыки", icon: Code, color: "bg-green-500" },
                { step: 3, title: "Когнитивные способности", icon: Brain, color: "bg-purple-500" },
                { step: 4, title: "Цели обучения", icon: Target, color: "bg-orange-500" }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Этап {item.step}</h4>
                    <p className="text-white/70 text-sm">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-full max-w-md"
            >
              <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-purple-700/30 border-purple-500/30">
                <h4 className="text-xl font-bold mb-4 text-center">Ваш Skills DNA</h4>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Python</span>
                      <span className="text-sm text-purple-300">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Machine Learning</span>
                      <span className="text-sm text-purple-300">70%</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Data Analysis</span>
                      <span className="text-sm text-purple-300">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Deep Learning</span>
                      <span className="text-sm text-purple-300">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-purple-500/20 rounded-lg">
                  <p className="text-sm text-purple-200">
                    <CheckCircle className="w-4 h-4 inline mr-2" />
                    Рекомендуется: Углубленный курс по Deep Learning
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      )
    },

    {
      id: 3,
      title: "Adaptive Learning Engine",
      subtitle: "ИИ создает персональные траектории",
      component: (
        <div className="h-full flex flex-col space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold text-cyan-300 mb-4">Adaptive Learning Engine</h3>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              Искусственный интеллект анализирует ваш прогресс и динамически адаптирует содержание курсов
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-8 flex-grow">
            {/* Input Data */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full p-6 bg-gradient-to-br from-blue-900/50 to-blue-700/30 border-blue-500/30">
                <div className="text-center mb-4">
                  <Database className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <h4 className="text-xl font-bold text-blue-300">Входные данные</h4>
                </div>
                
                <div className="space-y-3">
                  {[
                    "Skills DNA профиль",
                    "История обучения",
                    "Скорость освоения",
                    "Предпочтения стиля",
                    "Время активности"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-blue-200">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* AI Processing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full p-6 bg-gradient-to-br from-purple-900/50 to-purple-700/30 border-purple-500/30">
                <div className="text-center mb-4">
                  <div className="relative">
                    <Cpu className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>
                  <h4 className="text-xl font-bold text-purple-300">AI Обработка</h4>
                </div>
                
                <div className="space-y-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto"
                  />
                  
                  <div className="text-center space-y-2">
                    <p className="text-sm text-purple-200">Анализ паттернов</p>
                    <p className="text-sm text-purple-200">Прогнозирование успеха</p>
                    <p className="text-sm text-purple-200">Оптимизация контента</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Output */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="h-full p-6 bg-gradient-to-br from-green-900/50 to-green-700/30 border-green-500/30">
                <div className="text-center mb-4">
                  <Target className="w-12 h-12 text-green-400 mx-auto mb-2" />
                  <h4 className="text-xl font-bold text-green-300">Результат</h4>
                </div>
                
                <div className="space-y-3">
                  {[
                    "Персональный учебный план",
                    "Адаптивная сложность",
                    "Умные рекомендации",
                    "Оптимальные интервалы",
                    "Мотивационные элементы"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-200">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Connecting Lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg className="w-full h-full">
              <motion.path
                d="M 200 300 Q 400 250 600 300"
                stroke="rgba(99, 102, 241, 0.5)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
              />
              <motion.path
                d="M 600 300 Q 800 250 1000 300"
                stroke="rgba(34, 197, 94, 0.5)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              />
            </svg>
          </div>
        </div>
      )
    },

    {
      id: 4,
      title: "Micro-Learning Labs",
      subtitle: "Интерактивные практические задания",
      component: (
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl font-bold text-green-300 mb-4">Micro-Learning Labs</h3>
              <p className="text-white/80 text-lg mb-6">
                Интерактивные песочницы для немедленного применения изученной теории
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                { 
                  title: "Код-песочницы",
                  desc: "Пишите и тестируйте код прямо в браузере",
                  icon: Code,
                  color: "text-blue-400"
                },
                { 
                  title: "AI-ментор 24/7",
                  desc: "Мгновенные подсказки и объяснения ошибок",
                  icon: MessageCircle,
                  color: "text-purple-400"
                },
                { 
                  title: "Реальные проекты",
                  desc: "Задания на основе индустриальных кейсов",
                  icon: Lightbulb,
                  color: "text-yellow-400"
                },
                { 
                  title: "Геймификация",
                  desc: "Очки, достижения и лидерборды",
                  icon: Star,
                  color: "text-green-400"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <item.icon className={`w-6 h-6 ${item.color} mt-1`} />
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-white/70 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-full"
            >
              <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-gray-600/30">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold">Python Sandbox</h4>
                  <Badge className="bg-green-500/20 text-green-300">Live</Badge>
                </div>
                
                <div className="bg-black/50 rounded-lg p-4 font-mono text-sm mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="overflow-hidden"
                  >
                    <div className="text-green-400"># Создание нейронной сети</div>
                    <div className="text-blue-400">import tensorflow as tf</div>
                    <div className="text-yellow-400">model = tf.keras.Sequential([</div>
                    <div className="text-white ml-4">tf.keras.layers.Dense(128, activation=&apos;relu&apos;),</div>
                    <div className="text-white ml-4">tf.keras.layers.Dense(10, activation=&apos;softmax&apos;)</div>
                    <div className="text-yellow-400">])</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="mt-2 text-green-300"
                  >
                    <span className="text-gray-400">{">>>"} </span>Модель создана успешно!
                  </motion.div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Запустить
                  </Button>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">AI-ментор готов помочь</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      )
    },

    {
      id: 5,
      title: "AI-Ассистент",
      subtitle: "Персональный наставник 24/7",
      component: (
        <div className="h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl w-full"
          >
            <Card className="p-8 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border-indigo-500/30">
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Brain className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-indigo-300 mb-2">AI-Ассистент Nova</h3>
                <p className="text-white/80">Ваш персональный наставник в мире искусственного интеллекта</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-bold">Что умеет Nova:</h4>
                  
                  <div className="space-y-4">
                    {[
                      "Объясняет сложные концепции простыми словами",
                      "Подсказывает решения задач пошагово",
                      "Адаптирует объяснения под ваш уровень",
                      "Предлагает дополнительные материалы",
                      "Мотивирует и отслеживает прогресс"
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-6">
                  <h4 className="text-lg font-bold mb-4">Пример диалога:</h4>
                  
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-blue-600/20 rounded-lg p-3 ml-8"
                    >
                      <p className="text-sm">Как работает backpropagation?</p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="bg-purple-600/20 rounded-lg p-3 mr-8"
                    >
                      <div className="flex items-start space-x-2">
                        <Brain className="w-4 h-4 text-purple-400 mt-0.5" />
                        <p className="text-sm">
                          Представьте backpropagation как обучение через ошибки. 
                          Нейросеть делает прогноз, сравнивает с правильным ответом, 
                          и корректирует веса, чтобы в следующий раз ошибиться меньше.
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 }}
                      className="bg-green-600/20 rounded-lg p-3 mr-8"
                    >
                      <p className="text-xs text-green-300">
                        💡 Рекомендую: Интерактивная визуализация в модуле "Основы нейросетей"
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )
    },

    {
      id: 6,
      title: "Результаты и метрики",
      subtitle: "Измеримый прогресс в обучении",
      component: (
        <div className="space-y-8 h-full">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-3xl font-bold mb-4">Результаты обучения</h3>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              Платформа отслеживает прогресс и предоставляет детальную аналитику успеваемости
            </p>
          </motion.div>

          <div className="grid grid-cols-3 gap-8">
            {[
              { 
                title: "Время до трудоустройства",
                value: "3.2 месяца",
                change: "-40%",
                icon: TrendingUp,
                color: "text-green-400"
              },
              { 
                title: "Завершение курсов",
                value: "87%",
                change: "+65%",
                icon: CheckCircle,
                color: "text-blue-400"
              },
              { 
                title: "Удовлетворенность",
                value: "4.8/5",
                change: "+23%",
                icon: Star,
                color: "text-yellow-400"
              }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <Card className="p-6 text-center bg-white/5 border-white/10">
                  <metric.icon className={`w-12 h-12 ${metric.color} mx-auto mb-4`} />
                  <h4 className="text-2xl font-bold mb-2">{metric.value}</h4>
                  <p className="text-white/70 mb-2">{metric.title}</p>
                  <Badge className={`${metric.color.includes('green') ? 'bg-green-500/20 text-green-300' : 
                    metric.color.includes('blue') ? 'bg-blue-500/20 text-blue-300' : 
                    'bg-yellow-500/20 text-yellow-300'}`}>
                    {metric.change} vs традиционные курсы
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center"
          >
            <Card className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border-purple-500/30">
              <h4 className="text-2xl font-bold mb-4">Готовы начать свой путь в AI?</h4>
              <p className="text-white/80 text-lg mb-6">
                Присоединяйтесь к тысячам студентов, которые уже трансформируют свою карьеру с NovaAI University
              </p>
              <div className="flex justify-center space-x-4">
                <Button className="bg-primary hover:bg-primary/90 px-8 py-3">
                  Начать бесплатно
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3">
                  Узнать больше
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setDirection(1);
        setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, demoSlides.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % demoSlides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + demoSlides.length) % demoSlides.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const resetDemo = () => {
    setCurrentSlide(0);
    setIsPlaying(false);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#1a1a2e] to-[#16213e] text-white overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/presentation-selector">
            <div className="flex items-center cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center mr-3">
                <span className="font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                NovaAI University
              </span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/presentation-selector">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Назад к выбору
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 flex-1">
        {/* Slide Content */}
        <div className="relative h-[calc(100vh-200px)] mb-8">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 flex flex-col"
            >
              {/* Slide Header */}
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {demoSlides[currentSlide].title}
                </h1>
                {demoSlides[currentSlide].subtitle && (
                  <p className="text-xl text-white/70">
                    {demoSlides[currentSlide].subtitle}
                  </p>
                )}
              </div>

              {/* Slide Content */}
              <div className="flex-1">
                {demoSlides[currentSlide].component}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <Card className="p-4 bg-black/50 backdrop-blur-md border-white/20">
            <div className="flex items-center space-x-4">
              {/* Navigation */}
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {/* Play/Pause */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              {/* Reset */}
              <Button
                variant="outline"
                size="sm"
                onClick={resetDemo}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              {/* Slide Indicators */}
              <div className="flex space-x-2">
                {demoSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide 
                        ? 'bg-primary' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              
              {/* Next */}
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}