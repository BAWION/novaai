import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Brain, 
  Rocket, 
  Users,
  TrendingUp,
  Code,
  ArrowRight,
  Home
} from "lucide-react";

export default function PresentationSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1426] via-[#1a1a2e] to-[#16213e] text-white">
      {/* Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center mr-3">
                <span className="font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                NovaAI University
              </span>
            </div>
          </Link>
          
          <Link href="/">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Home className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Выберите <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">презентацию</span>
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Два взгляда на NovaAI University: для инвесторов и демонстрация продукта
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Investor Presentation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="h-full bg-gradient-to-br from-purple-900/30 to-purple-700/20 border-purple-500/30 backdrop-blur-md hover:border-purple-400/50 transition-all duration-300 group">
              <div className="p-8 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-purple-300 mb-2">Для инвесторов</h2>
                  <p className="text-purple-200/80">Бизнес-модель, рынок и финансы</p>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                    <span className="text-purple-200">Анализ рынка и возможности</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Rocket className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                    <span className="text-purple-200">Бизнес-модель и монетизация</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                    <span className="text-purple-200">Команда и конкурентные преимущества</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <DollarSign className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                    <span className="text-purple-200">Финансовые прогнозы и метрики</span>
                  </div>
                </div>

                <Link href="/investor-presentation">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                    Открыть презентацию
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Product Presentation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="h-full bg-gradient-to-br from-cyan-900/30 to-cyan-700/20 border-cyan-500/30 backdrop-blur-md hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="p-8 h-full flex flex-col">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-cyan-300 mb-2">Демо продукта</h2>
                  <p className="text-cyan-200/80">Интерактивная демонстрация платформы</p>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-start space-x-3">
                    <Brain className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-cyan-200">Skills DNA диагностика</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Code className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-cyan-200">Adaptive Learning Engine</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-cyan-200">Интерактивные лаборатории</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Rocket className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <span className="text-cyan-200">AI-ассистент в действии</span>
                  </div>
                </div>

                <Link href="/product-demo">
                  <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/25">
                    Запустить демо
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="max-w-4xl mx-auto p-8 bg-white/5 backdrop-blur-md border-white/10">
            <h3 className="text-2xl font-bold mb-4">О NovaAI University</h3>
            <p className="text-white/80 text-lg leading-relaxed">
              Первая на российском рынке образовательная экосистема, где искусственный интеллект 
              самостоятельно проектирует, обновляет и персонализирует обучение для каждого пользователя. 
              От школьников до Senior-разработчиков — платформа адаптируется под любой уровень подготовки.
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}