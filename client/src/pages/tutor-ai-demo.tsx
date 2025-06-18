import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { TutorAIFeatures } from "@/components/courses/tutor-ai-features";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Target, Zap } from "lucide-react";

export default function TutorAIDemo() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">TutorAI Integration Demo</h1>
          </div>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Полностью интегрированная система адаптивного обучения, 
            вдохновленная лучшими практиками TutorAI
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-green-500/10 border-green-500/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="font-medium text-green-400">Микроуроки</p>
              <p className="text-xs text-white/60">3-7 минут</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="font-medium text-blue-400">ИИ-Ассистент</p>
              <p className="text-xs text-white/60">Контекстный</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-500/10 border-purple-500/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="font-medium text-purple-400">Адаптивность</p>
              <p className="text-xs text-white/60">3 уровня</p>
            </CardContent>
          </Card>
          
          <Card className="bg-orange-500/10 border-orange-500/20">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <p className="font-medium text-orange-400">Квизы</p>
              <p className="text-xs text-white/60">Встроенные</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Demo */}
        <TutorAIFeatures />

        {/* Implementation Summary */}
        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Что реализовано из TutorAI референса
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  📚 Контентная структура и навигация
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Микроуроки 3-7 минут</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Интерактивный прогресс-бар</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Хлебные крошки навигации</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Древовидная структура course → module → lesson</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  🧠 AI-поддержка в обучении
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Контекстный Орб-ассистент</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">ИИ знает содержание урока</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">OpenAI GPT-4 интеграция</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Возможность задавать вопросы по теме</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  📈 Адаптивная подача материала
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">3 уровня сложности (новичок/средний/эксперт)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Skills DNA персонализация</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Переключатель "объяснить проще/глубже"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Адаптивный контент на основе уровня</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
                  🧪 Проверка знаний и аналитика
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Встроенные квизы в уроках</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">ИИ-анализ ответов и обратная связь</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Интеграция с Skills DNA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white/80">Реальные метрики в админ-панели</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  ✅ Готово к продакшену
                </Badge>
                <span className="text-white font-medium">NovaAI University полностью интегрирует лучшие практики TutorAI</span>
              </div>
              <p className="text-white/70">
                Все ключевые элементы TutorAI успешно адаптированы и интегрированы в нашу платформу: 
                микроформат обучения, адаптивная сложность, ИИ-поддержка, встроенные квизы, 
                продвинутая аналитика и Skills DNA персонализация.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}