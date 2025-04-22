import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";

// Типы данных для кейсов
interface Case {
  id: string;
  title: string;
  company: string;
  logo: string;
  industry: string;
  aiType: string;
  budget: string;
  problem: string;
  solution: string;
  results: string;
  kpi: string;
  year: number;
}

export default function CaseLibrary() {
  // Пример данных кейсов использования ИИ
  const caseStudies: Case[] = [
    {
      id: "case-1",
      title: "ИИ-чат-оператор для обслуживания клиентов",
      company: "Сбер",
      logo: "🏦",
      industry: "Финансы",
      aiType: "Чат-бот, NLP",
      budget: "₽₽₽",
      problem: "Высокая нагрузка на колл-центры, длительное время ожидания клиентов, рутинные запросы",
      solution: "Автоматизация первой линии поддержки с помощью ИИ-ассистента, маршрутизация сложных запросов к операторам",
      results: "Сокращение времени ожидания на 60%, автоматизация 75% типовых запросов",
      kpi: "Экономия 35% на филиале",
      year: 2024
    },
    {
      id: "case-2",
      title: "Оптимизация логистики с помощью компьютерного зрения",
      company: "Магнит",
      logo: "🛒",
      industry: "Розничная торговля",
      aiType: "Computer Vision",
      budget: "₽₽₽",
      problem: "Неэффективный учет товаров на складах, ошибки в комплектации заказов, медленная обработка",
      solution: "Система компьютерного зрения для распознавания товаров, автоматический учет, проверка комплектации",
      results: "Сокращение ошибок на 94%, увеличение скорости обработки на 50%",
      kpi: "ROI 280% за 18 месяцев",
      year: 2023
    },
    {
      id: "case-3",
      title: "Прогнозирование спроса с ML для оптимизации запасов",
      company: "Wildberries",
      logo: "👕",
      industry: "Электронная коммерция",
      aiType: "ML, Predictive Analytics",
      budget: "₽₽",
      problem: "Избыточные запасы и одновременный дефицит популярных товаров, высокие складские расходы",
      solution: "ML-модель для прогнозирования спроса на основе исторических данных, сезонности и рыночных трендов",
      results: "Сокращение избыточных запасов на 23%, уменьшение случаев дефицита на 45%",
      kpi: "Снижение общих складских расходов на 18%",
      year: 2023
    },
    {
      id: "case-4",
      title: "ИИ-система для выявления мошенничества",
      company: "Тинькофф",
      logo: "💳",
      industry: "Финансы",
      aiType: "ML, Anomaly Detection",
      budget: "₽₽₽₽",
      problem: "Рост числа мошеннических операций, высокие потери от фрода, ложные срабатывания",
      solution: "ML-система для анализа транзакций в реальном времени, выявление аномального поведения, многофакторная оценка рисков",
      results: "Выявление 92% мошеннических операций, снижение ложных срабатываний на 60%",
      kpi: "Предотвращение потерь на 450M₽ в год",
      year: 2024
    },
    {
      id: "case-5",
      title: "Автоматическая модерация UGC-контента",
      company: "ВКонтакте",
      logo: "💬",
      industry: "Социальные медиа",
      aiType: "NLP, Image Recognition",
      budget: "₽₽",
      problem: "Большой объем пользовательского контента, требующего модерации, включая текст и изображения",
      solution: "ML-система для автоматической модерации текста и изображений, выявление нарушений правил платформы",
      results: "Автоматизация 85% процесса модерации, улучшение времени реакции на 70%",
      kpi: "Снижение затрат на модерацию на 40%",
      year: 2023
    },
    {
      id: "case-6",
      title: "Генеративный ИИ для создания рекламных креативов",
      company: "МТС",
      logo: "📱",
      industry: "Телекоммуникации",
      aiType: "Generative AI",
      budget: "₽₽",
      problem: "Высокие затраты на разработку рекламных материалов, длительный цикл создания контента",
      solution: "Система генеративного ИИ для создания текстов, баннеров и креативов для различных каналов коммуникации",
      results: "Ускорение создания контента в 5 раз, увеличение вариативности тестирования на 300%",
      kpi: "Рост CTR на 23%",
      year: 2024
    },
  ];

  // Состояние фильтрации
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [aiTypeFilter, setAiTypeFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");

  // Получение уникальных значений для фильтров
  const industries = Array.from(new Set(caseStudies.map(c => c.industry)));
  const aiTypes = Array.from(new Set(caseStudies.map(c => c.aiType).flatMap(type => type.split(", "))));
  const budgets = ["₽", "₽₽", "₽₽₽", "₽₽₽₽"];

  // Функция фильтрации кейсов
  const filteredCases = caseStudies.filter(caseItem => {
    const matchesSearch = search === "" || 
      caseItem.title.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.problem.toLowerCase().includes(search.toLowerCase()) ||
      caseItem.solution.toLowerCase().includes(search.toLowerCase());
    
    const matchesIndustry = industryFilter === "" || caseItem.industry === industryFilter;
    
    const matchesAiType = aiTypeFilter === "" || caseItem.aiType.includes(aiTypeFilter);
    
    const matchesBudget = budgetFilter === "" || caseItem.budget === budgetFilter;
    
    return matchesSearch && matchesIndustry && matchesAiType && matchesBudget;
  });

  // Функция для отображения карточки кейса
  const CaseCard = ({ caseItem }: { caseItem: Case }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Glassmorphism className="p-5 rounded-xl h-full flex flex-col border border-white/5 hover:border-white/20 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-space-700 flex items-center justify-center text-2xl">
              {caseItem.logo}
            </div>
            <div>
              <h4 className="font-semibold text-lg line-clamp-1">{caseItem.title}</h4>
              <p className="text-white/60 text-sm">{caseItem.company}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs px-2 py-1 rounded-full bg-space-700/50 border border-white/10">
              {caseItem.industry}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-space-700/50 border border-white/10">
              {caseItem.aiType}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-space-700/50 border border-white/10">
              {caseItem.budget}
            </span>
          </div>
          
          <div className="mb-3 flex-grow">
            <h5 className="text-sm font-medium mb-1">Проблема:</h5>
            <p className="text-white/70 text-sm line-clamp-2">{caseItem.problem}</p>
          </div>
          
          <div className="mb-4 flex-grow">
            <h5 className="text-sm font-medium mb-1">Результаты:</h5>
            <p className="text-white/70 text-sm line-clamp-2">{caseItem.results}</p>
          </div>
          
          <div className="mt-auto">
            <div className="mb-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-lg border border-blue-500/10">
              <h5 className="text-sm font-medium text-blue-400">Ключевой KPI:</h5>
              <p className="text-lg font-semibold text-white">{caseItem.kpi}</p>
            </div>
            
            <Button className="w-full" variant="outline">
              Подробнее <i className="fas fa-arrow-right ml-1.5"></i>
            </Button>
          </div>
        </Glassmorphism>
      </motion.div>
    );
  };

  return (
    <DashboardLayout
      title="Case Library"
      subtitle="Каталог внедрений ИИ в российских компаниях"
    >
      <div className="space-y-6">
        {/* Панель фильтров */}
        <Glassmorphism className="p-5 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search" className="mb-1.5 block">Поиск</Label>
              <Input
                id="search"
                type="text"
                placeholder="Проблема или решение..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-space-800/50"
              />
            </div>
            
            <div>
              <Label htmlFor="industry" className="mb-1.5 block">Отрасль</Label>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Все отрасли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все отрасли</SelectItem>
                  {industries.map(industry => (
                    <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="aiType" className="mb-1.5 block">Тип модели ИИ</Label>
              <Select value={aiTypeFilter} onValueChange={setAiTypeFilter}>
                <SelectTrigger id="aiType">
                  <SelectValue placeholder="Все модели" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все модели</SelectItem>
                  {aiTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="budget" className="mb-1.5 block">Бюджет</Label>
              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger id="budget">
                  <SelectValue placeholder="Любой бюджет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Любой бюджет</SelectItem>
                  {budgets.map(budget => (
                    <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Glassmorphism>
        
        {/* Результаты поиска */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              <i className="fas fa-file-alt mr-2 text-white/70"></i>
              Найдено кейсов: {filteredCases.length}
            </h3>
            <Select defaultValue="new">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Сначала новые</SelectItem>
                <SelectItem value="old">Сначала старые</SelectItem>
                <SelectItem value="budget-high">Бюджет: по убыванию</SelectItem>
                <SelectItem value="budget-low">Бюджет: по возрастанию</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.length > 0 ? (
              filteredCases.map(caseItem => (
                <CaseCard key={caseItem.id} caseItem={caseItem} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <i className="fas fa-search text-4xl text-white/20 mb-4 block"></i>
                <h4 className="text-lg font-medium mb-2">Кейсы не найдены</h4>
                <p className="text-white/50">Попробуйте изменить параметры фильтрации</p>
              </div>
            )}
          </div>
        </div>
        
        {/* CTA для добавления кейса */}
        <Glassmorphism className="p-6 rounded-xl border border-[#6E3AFF]/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">У вас есть кейс внедрения ИИ?</h3>
              <p className="text-white/70">Поделитесь своим опытом с сообществом и получите экспертную оценку ROI</p>
            </div>
            <Button className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#5E2AFF] hover:to-[#1E9AE1] whitespace-nowrap">
              <i className="fas fa-plus-circle mr-2"></i>
              Добавить кейс
            </Button>
          </div>
        </Glassmorphism>
      </div>
    </DashboardLayout>
  );
}