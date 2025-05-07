import React from "react";
import { useUserProfile } from "@/context/user-profile-context";
import MainLayout from "@/components/main-layout";
import SkillsDnaProfile from "@/components/skills-dna-profile";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Book, 
  Brain, 
  ChevronRight, 
  Dna, 
  GraduationCap, 
  Star, 
  Zap 
} from "lucide-react";

/**
 * Страница Skills DNA
 * Отображает профиль навыков пользователя и рекомендуемые курсы
 */
export default function SkillsDnaPage() {
  const { userProfile } = useUserProfile();
  const [isLoading, setIsLoading] = React.useState(false);
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
            <Dna className="h-8 w-8 mr-3 text-indigo-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Skills DNA
            </span>
          </h1>
          <p className="text-white/70 mt-2 max-w-3xl">
            Уникальная система картирования навыков, которая анализирует ваши компетенции 
            и создает персонализированные рекомендации для максимально эффективного обучения
          </p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-space-800 border border-white/10 mb-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-indigo-600/20">
              <Brain className="h-4 w-4 mr-2" />
              Профиль навыков
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-indigo-600/20">
              <Star className="h-4 w-4 mr-2" />
              Рекомендации
            </TabsTrigger>
            <TabsTrigger value="learning-path" className="data-[state=active]:bg-indigo-600/20">
              <GraduationCap className="h-4 w-4 mr-2" />
              Траектория обучения
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <SkillsDnaProfile showHeader={false} />
          </TabsContent>
          
          <TabsContent value="recommendations" className="mt-0">
            <Card className="bg-space-800/70 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  Рекомендуемые курсы
                </CardTitle>
                <CardDescription className="text-white/70">
                  На основе вашего профиля Skills DNA мы подобрали курсы, 
                  которые помогут вам развить необходимые навыки
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-pulse p-3 rounded-full bg-indigo-500/10">
                      <Zap className="h-8 w-8 text-indigo-400" />
                    </div>
                    <p className="mt-4 text-white/70">Формируем персонализированные рекомендации...</p>
                  </div>
                ) : !userProfile?.userId ? (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">Требуется авторизация</h3>
                    <p className="text-white/70 mb-4">
                      Войдите в систему, чтобы получить персонализированные рекомендации
                    </p>
                    <Button onClick={() => window.location.href = '/auth'}>
                      Войти в систему
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-white/80 italic">
                      Пройдите диагностику Skills DNA, чтобы получить персонализированные рекомендации курсов
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <Button 
                        variant="default" 
                        className="flex items-center"
                        onClick={() => window.location.href = '/quick-diagnosis'}
                      >
                        Быстрая диагностика
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center border-white/20 hover:border-white/30"
                        onClick={() => window.location.href = '/deep-diagnosis'}
                      >
                        Глубокая диагностика
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="learning-path" className="mt-0">
            <Card className="bg-space-800/70 border-blue-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2 text-indigo-400" />
                  Персональная траектория обучения
                </CardTitle>
                <CardDescription className="text-white/70">
                  Оптимальный путь для развития ваших навыков в сфере AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Book className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Функция в разработке</h3>
                  <p className="text-white/70 mb-4">
                    Персональные траектории обучения скоро будут доступны.
                    Пройдите диагностику Skills DNA, чтобы мы могли подготовить для вас
                    оптимальный путь обучения.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button 
                      variant="default" 
                      className="flex items-center"
                      onClick={() => window.location.href = '/quick-diagnosis'}
                    >
                      Быстрая диагностика
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center border-white/20 hover:border-white/30"
                      onClick={() => window.location.href = '/deep-diagnosis'}
                    >
                      Глубокая диагностика
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}