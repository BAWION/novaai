import React from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function BusinessAIPage() {
  const [, setLocation] = useLocation();

  // Отраслевые показатели готовности к ИИ
  const industries = [
    { name: 'Финансы & FinTech', level: 85, color: 'from-blue-600 to-blue-400' },
    { name: 'Розничная торговля', level: 75, color: 'from-purple-600 to-purple-400' },
    { name: 'Производство', level: 65, color: 'from-orange-600 to-orange-400' },
    { name: 'Здравоохранение', level: 55, color: 'from-red-600 to-red-400' },
    { name: 'Образование', level: 50, color: 'from-indigo-600 to-indigo-400' },
    { name: 'Недвижимость', level: 40, color: 'from-green-600 to-green-400' },
    { name: 'Госсектор', level: 35, color: 'from-slate-600 to-slate-400' },
  ];

  // Функциональные разделы Business AI
  const businessSections = [
    {
      id: 'case-library',
      title: 'Case Library',
      icon: 'fa-file-alt',
      description: 'Каталог русскоязычных и мировых кейсов с фильтрацией по отрасли, типу модели и бюджету.',
      buttonText: 'Перейти в библиотеку',
      to: '/business/cases'
    },
    {
      id: 'maturity-check',
      title: 'AI Maturity Check',
      icon: 'fa-chart-line',
      description: '10-минутный опрос для оценки готовности компании к внедрению ИИ с подробным отчётом.',
      buttonText: 'Пройти тест',
      to: '/business/maturity-check'
    },
    {
      id: 'roi-playground',
      title: 'ROI Playground',
      icon: 'fa-calculator',
      description: 'Калькулятор экономического эффекта от внедрения ИИ с учётом специфики вашего бизнеса.',
      buttonText: 'Рассчитать ROI',
      to: '/business/roi',
      isPro: true
    },
    {
      id: 'solution-wizard',
      title: 'Solution Wizard',
      icon: 'fa-magic',
      description: 'ИИ-консультант для подбора оптимального стека технологий под конкретные бизнес-задачи.',
      buttonText: 'Начать диалог',
      to: '/business/wizard'
    },
    {
      id: 'pilot-sandbox',
      title: 'Pilot Sandbox',
      icon: 'fa-rocket',
      description: 'Готовые к запуску PoC-решения: чат-бот, генеративный баннер, антифрод и многое другое.',
      buttonText: 'Выбрать решение',
      to: '/business/sandbox',
      isPro: true
    },
  ];

  return (
    <DashboardLayout
      title="Business AI Module"
      subtitle="Внедрение ИИ-решений в бизнес-процессы"
    >
      <div className="space-y-8">
        {/* Hero секция */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Glassmorphism className="p-6 md:p-8 rounded-xl border-l-4 border-l-blue-600">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Трансформируйте бизнес с помощью ИИ
                </h2>
                <p className="text-white/80 mb-4">
                  Business AI Module поможет руководителям и продукт-менеджерам быстро определить, 
                  какие ИИ-решения из экосистемы NovaAI подойдут для бизнеса, оценить стоимость 
                  внедрения и рассчитать ожидаемый ROI.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setLocation('/business/maturity-check')}
                  >
                    <i className="fas fa-chart-bar mr-2"></i>
                    Оценить готовность к ИИ
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => setLocation('/business/cases')}
                  >
                    <i className="fas fa-play-circle mr-2"></i>
                    Смотреть видео-обзор (1 мин)
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-80">
                <div className="bg-black/30 rounded-lg p-4">
                  <div className="text-center mb-4">
                    <i className="fas fa-building text-4xl text-blue-400 mb-2"></i>
                    <h3 className="font-semibold">Средняя экономия времени</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">40%</div>
                      <div className="text-white/60">Операционные процессы</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">60%</div>
                      <div className="text-white/60">Аналитика данных</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">25%</div>
                      <div className="text-white/60">Клиентский сервис</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-400">30%</div>
                      <div className="text-white/60">HR-процессы</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Glassmorphism>
        </motion.div>

        {/* Карта применения ИИ по отраслям */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Glassmorphism className="p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">
              <i className="fas fa-industry mr-2 text-white/70"></i>
              Карта применения ИИ по отраслям
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {industries.map((industry, index) => (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="bg-slate-800/40 rounded-lg p-4 border border-white/5 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">{industry.name}</h4>
                    <span className="font-medium text-white/90">{industry.level}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${industry.color}`} 
                      style={{ width: `${industry.level}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Glassmorphism>
        </motion.div>

        {/* Разделы Business AI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4">
            <i className="fas fa-cubes mr-2 text-white/70"></i>
            Инструменты для бизнеса
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {businessSections.map((section, index) => (
              <Glassmorphism 
                key={section.id}
                className="p-6 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600/30 transition-colors">
                      <i className={`fas ${section.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{section.title}</h4>
                        {section.isPro && (
                          <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400 border-amber-500/20">
                            PRO
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/70 mb-4">{section.description}</p>
                      <Button 
                        size="sm" 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setLocation(section.to)}
                      >
                        {section.buttonText}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </Glassmorphism>
            ))}
          </div>
        </motion.div>

        {/* Статистика внедрений */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Glassmorphism className="p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">
              <i className="fas fa-chart-pie mr-2 text-white/70"></i>
              Статистика успешных внедрений
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">350+</div>
                <div className="text-sm text-white/70">Компаний</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">85%</div>
                <div className="text-sm text-white/70">Успешных проектов</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-1">3.2x</div>
                <div className="text-sm text-white/70">Средний ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-1">6 мес</div>
                <div className="text-sm text-white/70">Окупаемость</div>
              </div>
            </div>
          </Glassmorphism>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}