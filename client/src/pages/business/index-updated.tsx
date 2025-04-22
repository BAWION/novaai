import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function BusinessAIOverview() {
  // Карта отраслей и соответствующих им уровней применения ИИ
  const industryHeatmap = [
    { name: 'Финансы & FinTech', level: 85, color: 'from-blue-600 to-blue-400' },
    { name: 'Розничная торговля', level: 75, color: 'from-indigo-600 to-indigo-400' },
    { name: 'Телекоммуникации', level: 70, color: 'from-purple-600 to-purple-400' },
    { name: 'Здравоохранение', level: 65, color: 'from-violet-600 to-violet-400' },
    { name: 'Производство', level: 60, color: 'from-sky-600 to-sky-400' },
    { name: 'Логистика', level: 55, color: 'from-cyan-600 to-cyan-400' },
    { name: 'Энергетика', level: 50, color: 'from-teal-600 to-teal-400' },
    { name: 'Образование', level: 45, color: 'from-emerald-600 to-emerald-400' },
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
                  какие ИИ-решения из экосистемы NovaAI подойдут для бизнеса, 
                  оценить стоимость внедрения и рассчитать ожидаемый ROI.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <i className="fas fa-play-circle mr-2"></i>
                    Смотреть видео-обзор (1 мин)
                  </Button>
                  <Link href="/business/maturity-check">
                    <Button variant="outline">
                      <i className="fas fa-chart-line mr-2"></i>
                      Оценить готовность к ИИ
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-2/5 lg:w-1/3 aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-white/50 text-center">
                  <i className="fas fa-film text-3xl mb-2"></i>
                  <p>Видео-презентация</p>
                </div>
              </div>
            </div>
          </Glassmorphism>
        </motion.div>

        {/* Heatmap: ИИ × Отрасли */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold mb-4">
            <i className="fas fa-industry mr-2 text-white/70"></i>
            Карта применения ИИ по отраслям
          </h3>
          <Glassmorphism className="p-6 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {industryHeatmap.map((industry, index) => (
                <motion.div
                  key={industry.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
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
                className="p-6 rounded-xl flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <i className={`fas ${section.icon} text-xl`}></i>
                  </div>
                  {section.isPro && (
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500">
                      PRO
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold mb-2">{section.title}</h4>
                <p className="text-white/70 text-sm flex-grow mb-4">{section.description}</p>
                <Link href={section.to}>
                  <Button className="w-full" variant="outline">
                    {section.buttonText}
                    <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </Link>
              </Glassmorphism>
            ))}
          </div>
        </motion.div>

        {/* Бизнес-сценарий */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold mb-4">
            <i className="fas fa-user-tie mr-2 text-white/70"></i>
            Пример использования
          </h3>
          <Glassmorphism className="p-6 rounded-xl">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <div className="aspect-square rounded-xl bg-slate-800/50 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                    <i className="fas fa-user-tie text-3xl text-white/80"></i>
                  </div>
                  <h4 className="text-lg font-medium mb-2">Менеджер Ольга</h4>
                  <p className="text-white/70 text-sm">Руководитель продукта в финтех-компании</p>
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h4 className="text-lg font-medium mb-4">Путь внедрения ИИ:</h4>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-3 mt-0.5">1</div>
                    <div>
                      <p className="font-medium">Прошла AI Maturity Check</p>
                      <p className="text-white/70 text-sm">Получила отчёт с уровнем готовности "Bronze" и рекомендациями по улучшению процессов сбора данных.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-3 mt-0.5">2</div>
                    <div>
                      <p className="font-medium">Изучила кейсы в Case Library</p>
                      <p className="text-white/70 text-sm">Нашла кейс "Сбер: AI-чат-оператор" с 35% экономии на обслуживании клиентов.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-3 mt-0.5">3</div>
                    <div>
                      <p className="font-medium">Рассчитала ROI внедрения</p>
                      <p className="text-white/70 text-sm">В калькуляторе для 100 агентов получила прогноз окупаемости через 4 месяца.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-3 mt-0.5">4</div>
                    <div>
                      <p className="font-medium">Получила технические рекомендации</p>
                      <p className="text-white/70 text-sm">Solution Wizard предложил стек "SpeechKit + GPT" с детальным планом интеграции.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs mr-3 mt-0.5">5</div>
                    <div>
                      <p className="font-medium">Запустила пилотный проект</p>
                      <p className="text-white/70 text-sm">Через Pilot Sandbox протестировала решение на 10 реальных звонках с минимальными затратами.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Glassmorphism>
        </motion.div>

        {/* PRO-карточка */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Glassmorphism className="p-6 rounded-xl border border-amber-500/30">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-2/3">
                <h3 className="text-xl font-semibold mb-2 text-amber-500">Корпоративные возможности</h3>
                <p className="text-white/80 mb-4">
                  Получите доступ ко всем бизнес-инструментам, включая ROI Playground и Pilot Sandbox, 
                  подключите данные вашей компании и получите индивидуальную консультацию экспертов NovaAI.
                </p>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                  Активировать PRO-доступ
                </Button>
              </div>
              <div className="w-full md:w-1/3 p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                <h4 className="font-medium text-amber-500 mb-2">Преимущества PRO:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <i className="fas fa-check text-amber-500 mr-2"></i>
                    <span className="text-white/80">Полный доступ к ROI-калькулятору</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-amber-500 mr-2"></i>
                    <span className="text-white/80">Готовые PoC-решения в песочнице</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-amber-500 mr-2"></i>
                    <span className="text-white/80">Интеграция с данными компании</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check text-amber-500 mr-2"></i>
                    <span className="text-white/80">Персональная консультация</span>
                  </li>
                </ul>
              </div>
            </div>
          </Glassmorphism>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}