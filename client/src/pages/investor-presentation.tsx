import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import {
  TrendingUp,
  Users,
  Brain,
  Target,
  Rocket,
  DollarSign,
  Globe,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Zap,
  BookOpen,
  Code,
  Database,
  Network,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Briefcase,
  Home,
  X
} from "lucide-react";

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  component: React.ReactNode;
}

const marketData = [
  { year: "2023", market: 150, forecast: 150 },
  { year: "2024", market: 220, forecast: 210 },
  { year: "2025", market: 320, forecast: 290 },
  { year: "2026", market: 450, forecast: 420 },
  { year: "2027", market: 650, forecast: 590 },
  { year: "2028", market: 900, forecast: 820 }
];

const competitorData = [
  { name: "Coursera", students: 100, revenue: 523, growth: 12 },
  { name: "Udacity", students: 50, revenue: 150, growth: -5 },
  { name: "edX", students: 70, revenue: 200, growth: 8 },
  { name: "NovaAI", students: 5, revenue: 0, growth: 300 }
];

const revenueProjection = [
  { month: "Янв 2025", revenue: 0, users: 100 },
  { month: "Апр 2025", revenue: 15, users: 500 },
  { month: "Июл 2025", revenue: 45, users: 1200 },
  { month: "Окт 2025", revenue: 80, users: 2000 },
  { month: "Янв 2026", revenue: 120, users: 3000 },
  { month: "Апр 2026", revenue: 180, users: 4500 },
  { month: "Июл 2026", revenue: 250, users: 6000 },
  { month: "Окт 2026", revenue: 350, users: 8000 },
  { month: "Янв 2027", revenue: 500, users: 12000 },
];

const userGrowthData = [
  { month: "Мар", organic: 150, paid: 50, total: 200 },
  { month: "Апр", organic: 280, paid: 120, total: 400 },
  { month: "Май", organic: 450, paid: 200, total: 650 },
  { month: "Июн", organic: 700, paid: 300, total: 1000 },
  { month: "Июл", organic: 1050, paid: 450, total: 1500 },
  { month: "Авг", organic: 1500, paid: 600, total: 2100 },
];

const marketSegments = [
  { name: "Студенты", value: 35, color: "#8B5CF6" },
  { name: "IT-специалисты", value: 30, color: "#06B6D4" },
  { name: "Исследователи", value: 20, color: "#10B981" },
  { name: "Бизнес", value: 15, color: "#F59E0B" }
];

export default function InvestorPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextSlide();
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const slides: Slide[] = [
    {
      id: 1,
      title: "NovaAI University",
      subtitle: "Революция в образовании через искусственный интеллект",
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <motion.div 
            className="relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Brain className="w-16 h-16 text-white" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-4 h-4 text-black" />
            </motion.div>
          </motion.div>
          
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              NovaAI University
            </h1>
            <p className="text-2xl text-gray-600 max-w-2xl">
              Первая в России AI-платформа, где искусственный интеллект создает персонализированные образовательные траектории
            </p>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-500">
            <Badge variant="outline" className="px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              5K+ пользователей
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              50+ курсов
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              95% удовлетворенность
            </Badge>
          </div>
        </div>
      )
    },
    
    {
      id: 2,
      title: "Проблема",
      subtitle: "Образование в области ИИ фрагментировано и неперсонализировано",
      component: (
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-red-600">Текущие проблемы рынка</h3>
            
            <div className="space-y-4">
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Отсутствие персонализации</h4>
                  <p className="text-gray-600">Один курс для всех уровней подготовки</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Высокий барьер входа</h4>
                  <p className="text-gray-600">Сложно понять с чего начать изучение ИИ</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Отсутствие практики</h4>
                  <p className="text-gray-600">Теория без реальных проектов</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-start space-x-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <AlertCircle className="w-6 h-6 text-red-500 mt-1" />
                <div>
                  <h4 className="font-semibold">Дорогие курсы</h4>
                  <p className="text-gray-600">$2000+ за специализированное обучение</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <Card className="p-6 bg-red-50 border-red-200">
              <div className="text-center space-y-4">
                <TrendingDown className="w-16 h-16 text-red-500 mx-auto" />
                <h4 className="text-2xl font-bold text-red-700">Только 23%</h4>
                <p className="text-red-600">студентов завершают курсы по ИИ</p>
              </div>
            </Card>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <h5 className="font-bold text-gray-700">85%</h5>
                <p className="text-sm text-gray-600">недовольны темпом обучения</p>
              </Card>
              <Card className="p-4 text-center">
                <h5 className="font-bold text-gray-700">78%</h5>
                <p className="text-sm text-gray-600">хотят персонализацию</p>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    {
      id: 3,
      title: "Наше решение",
      subtitle: "AI-powered платформа с персонализированным обучением",
      component: (
        <div className="grid grid-cols-3 gap-8 h-full">
          <motion.div 
            className="space-y-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple-800">Skills DNA</h3>
                <p className="text-purple-700">
                  Глубокая диагностика навыков и построение персонального профиля компетенций
                </p>
                <ul className="text-sm text-purple-600 space-y-1">
                  <li>• 40+ параметров оценки</li>
                  <li>• Визуализация навыков</li>
                  <li>• Отслеживание прогресса</li>
                </ul>
              </div>
            </Card>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-cyan-800">Адаптивные курсы</h3>
                <p className="text-cyan-700">
                  ИИ создает уникальную образовательную траекторию для каждого студента
                </p>
                <ul className="text-sm text-cyan-600 space-y-1">
                  <li>• Динамическая сложность</li>
                  <li>• Персональные рекомендации</li>
                  <li>• Микро-обучение</li>
                </ul>
              </div>
            </Card>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 h-full bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800">AI-ассистент</h3>
                <p className="text-green-700">
                  Персональный наставник, доступный 24/7 для поддержки и ответов
                </p>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• Мгновенные ответы</li>
                  <li>• Объяснение концепций</li>
                  <li>• Помощь с проектами</li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
      )
    },

    {
      id: 4,
      title: "Рынок и возможности",
      subtitle: "Быстрорастущий рынок AI-образования",
      component: (
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Размер рынка</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}B`, 'Размер рынка']} />
                <Area type="monotone" dataKey="market" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-purple-50">
                <h4 className="font-bold text-purple-800">CAGR 2023-2028</h4>
                <p className="text-3xl font-bold text-purple-600">42.8%</p>
              </Card>
              <Card className="p-4 bg-cyan-50">
                <h4 className="font-bold text-cyan-800">TAM 2028</h4>
                <p className="text-3xl font-bold text-cyan-600">$900B</p>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Целевые сегменты</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={marketSegments}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {marketSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-4">
              <Card className="p-4 bg-yellow-50">
                <h4 className="font-bold text-yellow-800">Российский рынок</h4>
                <p className="text-yellow-700">Недостаточно качественных AI-курсов на русском языке</p>
                <div className="flex items-center mt-2">
                  <Globe className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm text-yellow-600">147M потенциальных пользователей</span>
                </div>
              </Card>
              
              <Card className="p-4 bg-blue-50">
                <h4 className="font-bold text-blue-800">Первые в сегменте</h4>
                <p className="text-blue-700">Отсутствие прямых конкурентов с AI-персонализацией</p>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    {
      id: 5,
      title: "Бизнес-модель",
      subtitle: "Freemium с высокой конверсией",
      component: (
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Монетизация</h3>
            
            <div className="space-y-4">
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-green-800">Базовый план</h4>
                    <p className="text-green-600">Доступ к основным курсам</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-700">Бесплатно</p>
                    <p className="text-sm text-green-600">Ограниченный доступ</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-purple-50 border-purple-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-purple-800">Pro план</h4>
                    <p className="text-purple-600">Полный доступ + AI-ассистент</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-700">₽1,990/мес</p>
                    <p className="text-sm text-purple-600">или ₽19,900/год</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-blue-800">Enterprise</h4>
                    <p className="text-blue-600">Корпоративные решения</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-700">от ₽50,000/мес</p>
                    <p className="text-sm text-blue-600">до 1000 сотрудников</p>
                  </div>
                </div>
              </Card>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-800 mb-2">Ключевые метрики</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Конверсия в Pro:</span>
                  <span className="font-bold text-gray-800 ml-2">12%</span>
                </div>
                <div>
                  <span className="text-gray-600">LTV:</span>
                  <span className="font-bold text-gray-800 ml-2">₽24,000</span>
                </div>
                <div>
                  <span className="text-gray-600">CAC:</span>
                  <span className="font-bold text-gray-800 ml-2">₽3,500</span>
                </div>
                <div>
                  <span className="text-gray-600">Churn:</span>
                  <span className="font-bold text-gray-800 ml-2">5%/мес</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Прогноз выручки</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis yAxisId="revenue" orientation="left" />
                <YAxis yAxisId="users" orientation="right" />
                <Tooltip />
                <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} name="Выручка (млн ₽)" />
                <Line yAxisId="users" type="monotone" dataKey="users" stroke="#06B6D4" strokeWidth={2} name="Пользователи" />
              </LineChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center bg-purple-50">
                <h5 className="font-bold text-purple-800">2025</h5>
                <p className="text-2xl font-bold text-purple-600">₽80M</p>
                <p className="text-sm text-purple-600">выручка</p>
              </Card>
              <Card className="p-4 text-center bg-cyan-50">
                <h5 className="font-bold text-cyan-800">2026</h5>
                <p className="text-2xl font-bold text-cyan-600">₽350M</p>
                <p className="text-sm text-cyan-600">выручка</p>
              </Card>
              <Card className="p-4 text-center bg-green-50">
                <h5 className="font-bold text-green-800">2027</h5>
                <p className="text-2xl font-bold text-green-600">₽500M</p>
                <p className="text-sm text-green-600">выручка</p>
              </Card>
            </div>
          </div>
        </div>
      )
    },

    {
      id: 6,
      title: "Конкурентные преимущества",
      subtitle: "Уникальная технология и подход",
      component: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Наши преимущества</h3>
              
              <div className="space-y-4">
                <motion.div 
                  className="flex items-start space-x-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800">AI-первый подход</h4>
                    <p className="text-gray-600">Единственная платформа, где ИИ создает контент</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start space-x-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800">Глубокая персонализация</h4>
                    <p className="text-gray-600">Skills DNA анализирует 40+ параметров</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start space-x-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800">Российский фокус</h4>
                    <p className="text-gray-600">Контент на русском языке с учетом локальных особенностей</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start space-x-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800">Доступная цена</h4>
                    <p className="text-gray-600">В 5-10 раз дешевле международных конкурентов</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Сравнение с конкурентами</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={competitorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="growth" fill="#10B981" name="Рост (%)" />
                </BarChart>
              </ResponsiveContainer>
              
              <div className="bg-gradient-to-r from-purple-50 to-cyan-50 p-4 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Защищенность позиции</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Патентуемая технология Skills DNA</span>
                    <Badge variant="outline">В процессе</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Первый на российском рынке</span>
                    <Badge className="bg-green-500">Достигнуто</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Барьеры входа для конкурентов</span>
                    <Badge className="bg-yellow-500">Высокие</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    {
      id: 7,
      title: "Команда",
      subtitle: "Опытные профессионалы в области AI и образования",
      component: (
        <div className="grid grid-cols-3 gap-8 h-full">
          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">CEO</span>
            </div>
            <h3 className="text-xl font-bold">Основатель & CEO</h3>
            <p className="text-gray-600 mb-4">Ex-Google AI, Stanford PhD</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• 10+ лет в Machine Learning</p>
              <p>• Автор 20+ научных публикаций</p>
              <p>• Руководил командой из 50+ инженеров</p>
            </div>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">CTO</span>
            </div>
            <h3 className="text-xl font-bold">Технический директор</h3>
            <p className="text-gray-600 mb-4">Ex-Yandex, MIT MS</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Архитектор поисковых систем</p>
              <p>• Эксперт по масштабируемости</p>
              <p>• 15+ лет в разработке</p>
            </div>
          </motion.div>

          <motion.div 
            className="text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">CPO</span>
            </div>
            <h3 className="text-xl font-bold">Продуктовый директор</h3>
            <p className="text-gray-600 mb-4">Ex-Coursera, Wharton MBA</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Создал 5+ EdTech продуктов</p>
              <p>• 1M+ активных пользователей</p>
              <p>• Эксперт по UX в образовании</p>
            </div>
          </motion.div>
        </div>
      )
    },

    {
      id: 8,
      title: "Финансирование",
      subtitle: "Привлекаем $5M для ускорения роста",
      component: (
        <div className="grid grid-cols-2 gap-8 h-full">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Использование средств</h3>
            
            <div className="space-y-4">
              <Card className="p-4 bg-purple-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-purple-800">Разработка продукта</h4>
                  <span className="text-purple-600 font-bold">40%</span>
                </div>
                <Progress value={40} className="mb-2" />
                <p className="text-sm text-purple-600">Развитие AI-алгоритмов и платформы</p>
              </Card>
              
              <Card className="p-4 bg-cyan-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-cyan-800">Маркетинг и привлечение</h4>
                  <span className="text-cyan-600 font-bold">30%</span>
                </div>
                <Progress value={30} className="mb-2" />
                <p className="text-sm text-cyan-600">Масштабирование пользовательской базы</p>
              </Card>
              
              <Card className="p-4 bg-green-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-green-800">Команда</h4>
                  <span className="text-green-600 font-bold">25%</span>
                </div>
                <Progress value={25} className="mb-2" />
                <p className="text-sm text-green-600">Найм топовых инженеров и специалистов</p>
              </Card>
              
              <Card className="p-4 bg-yellow-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-yellow-800">Операционные расходы</h4>
                  <span className="text-yellow-600 font-bold">5%</span>
                </div>
                <Progress value={5} className="mb-2" />
                <p className="text-sm text-yellow-600">Инфраструктура и административные расходы</p>
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Milestone и метрики</h3>
            
            <div className="space-y-4">
              <Card className="p-4 border-l-4 border-l-green-500">
                <h4 className="font-bold text-green-800">6 месяцев</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 10,000 активных пользователей</li>
                  <li>• Запуск корпоративной версии</li>
                  <li>• Интеграция с крупными университетами</li>
                </ul>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-blue-500">
                <h4 className="font-bold text-blue-800">12 месяцев</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 50,000 активных пользователей</li>
                  <li>• $2M ARR</li>
                  <li>• Выход на самоокупаемость</li>
                </ul>
              </Card>
              
              <Card className="p-4 border-l-4 border-l-purple-500">
                <h4 className="font-bold text-purple-800">18 месяцев</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 100,000 активных пользователей</li>
                  <li>• Экспансия в СНГ</li>
                  <li>• Подготовка к Series A</li>
                </ul>
              </Card>
            </div>
            
            <Card className="p-6 bg-gradient-to-r from-purple-500 to-cyan-500 text-white">
              <div className="text-center">
                <DollarSign className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">$5,000,000</h3>
                <p className="text-lg">Привлекаем в рамках Seed раунда</p>
                <p className="text-sm opacity-90 mt-2">Оценка компании: $20M</p>
              </div>
            </Card>
          </div>
        </div>
      )
    },

    {
      id: 9,
      title: "Возможности роста",
      subtitle: "Масштабирование и международная экспансия",
      component: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Краткосрочный рост (1-2 года)</h3>
              
              <div className="space-y-4">
                <Card className="p-4 bg-blue-50 border-blue-200">
                  <div className="flex items-start space-x-4">
                    <Target className="w-8 h-8 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-bold text-blue-800">Расширение в СНГ</h4>
                      <p className="text-blue-600">Казахстан, Беларусь, Узбекистан</p>
                      <p className="text-sm text-blue-500">+250M потенциальных пользователей</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-start space-x-4">
                    <Briefcase className="w-8 h-8 text-green-500 mt-1" />
                    <div>
                      <h4 className="font-bold text-green-800">B2B сегмент</h4>
                      <p className="text-green-600">Корпоративные решения для переобучения сотрудников</p>
                      <p className="text-sm text-green-500">ARPU в 10x выше B2C</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-purple-50 border-purple-200">
                  <div className="flex items-start space-x-4">
                    <BookOpen className="w-8 h-8 text-purple-500 mt-1" />
                    <div>
                      <h4 className="font-bold text-purple-800">Новые направления</h4>
                      <p className="text-purple-600">Data Science, DevOps, Cybersecurity</p>
                      <p className="text-sm text-purple-500">Расширение TAM в 3 раза</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Долгосрочная стратегия (3-5 лет)</h3>
              
              <div className="space-y-4">
                <Card className="p-4 bg-orange-50 border-orange-200">
                  <div className="flex items-start space-x-4">
                    <Globe className="w-8 h-8 text-orange-500 mt-1" />
                    <div>
                      <h4 className="font-bold text-orange-800">Глобальная экспансия</h4>
                      <p className="text-orange-600">Европа, Азия, Латинская Америка</p>
                      <p className="text-sm text-orange-500">Многоязычная платформа</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-red-50 border-red-200">
                  <div className="flex items-start space-x-4">
                    <Network className="w-8 h-8 text-red-500 mt-1" />
                    <div>
                      <h4 className="font-bold text-red-800">AI-платформа как сервис</h4>
                      <p className="text-red-600">Лицензирование технологии другим EdTech</p>
                      <p className="text-sm text-red-500">Новая бизнес-модель с высокой маржинальностью</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-indigo-50 border-indigo-200">
                  <div className="flex items-start space-x-4">
                    <Award className="w-8 h-8 text-indigo-500 mt-1" />
                    <div>
                      <h4 className="font-bold text-indigo-800">Аккредитация и сертификация</h4>
                      <p className="text-indigo-600">Признанные дипломы и сертификаты</p>
                      <p className="text-sm text-indigo-500">Партнерства с университетами и работодателями</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          
          <Card className="p-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Видение 2030</h3>
              <p className="text-xl mb-6">Стать глобальным лидером в AI-образовании</p>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-4xl font-bold">10M+</p>
                  <p className="text-sm opacity-90">активных пользователей</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">$1B+</p>
                  <p className="text-sm opacity-90">годовая выручка</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">50+</p>
                  <p className="text-sm opacity-90">стран присутствия</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )
    },

    {
      id: 10,
      title: "Контакты",
      subtitle: "Готовы обсудить инвестиции",
      component: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <motion.div 
            className="text-center space-y-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
              <Rocket className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Присоединяйтесь к революции в образовании
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl">
              NovaAI University меняет способ изучения искусственного интеллекта. 
              Инвестируйте в будущее образования уже сегодня.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
              <h3 className="text-xl font-bold text-purple-800 mb-4">Связаться с нами</h3>
              <div className="space-y-3 text-purple-700">
                <p>📧 investors@novaai-university.com</p>
                <p>📱 +7 (495) 123-45-67</p>
                <p>🏢 Москва, Сколково</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-cyan-50 to-cyan-100">
              <h3 className="text-xl font-bold text-cyan-800 mb-4">Следующие шаги</h3>
              <div className="space-y-3 text-cyan-700">
                <p>1. Демонстрация продукта</p>
                <p>2. Встреча с командой</p>
                <p>3. Due diligence</p>
                <p>4. Структурирование сделки</p>
              </div>
            </Card>
          </div>
          
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 text-lg"
          >
            Запланировать встречу
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">NovaAI University</h1>
                  <p className="text-sm text-gray-600">Презентация для инвесторов</p>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 font-medium"
                >
                  <Home className="w-4 h-4 mr-2" />
                  На главную
                </Button>
              </Link>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentSlide(0);
                  setProgress(0);
                  setIsPlaying(false);
                }}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === slides.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              
              <span className="text-sm text-gray-600">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex space-x-1">
              {slides.map((_, index) => (
                <div key={index} className="flex-1">
                  <div 
                    className={`h-2 rounded-full cursor-pointer transition-colors ${
                      index < currentSlide 
                        ? 'bg-purple-500' 
                        : index === currentSlide 
                          ? 'bg-purple-300' 
                          : 'bg-gray-200'
                    }`}
                    onClick={() => goToSlide(index)}
                  >
                    {index === currentSlide && (
                      <div 
                        className="h-full bg-purple-500 rounded-full transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="min-h-[600px]"
          >
            <Card className="h-full bg-white shadow-lg border border-gray-200">
              <CardHeader className="text-center pb-6 bg-white border-b border-gray-100">
                <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
                  {slides[currentSlide].title}
                </CardTitle>
                {slides[currentSlide].subtitle && (
                  <p className="text-xl text-gray-800 mt-2 font-medium">
                    {slides[currentSlide].subtitle}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pb-8 bg-white">
                {slides[currentSlide].component}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>© 2025 NovaAI University. Конфиденциальная презентация для инвесторов.</p>
            <div className="flex items-center space-x-4">
              <span>Версия 1.0</span>
              <span>•</span>
              <span>Обновлено: Июнь 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}