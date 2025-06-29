import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Search, BookOpen, FileText, Send, Clock, Star, Download, ExternalLink, Bookmark, BookmarkPlus } from 'lucide-react';

// Типы для статей и туториалов
interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: number;
  imageUrl?: string;
  url: string;
  isFeatured: boolean;
  isNew: boolean;
  isSaved: boolean;
}

interface Tutorial {
  id: number;
  title: string;
  description: string;
  level: 'Базовый' | 'Средний' | 'Продвинутый';
  tags: string[];
  duration: number; // в минутах
  author: string;
  date: string;
  steps: number;
  url: string;
  imageUrl?: string;
  isFeatured: boolean;
  isNew: boolean;
  isSaved: boolean;
}

// Мок-данные для статей
const articles: Article[] = [
  {
    id: 1,
    title: 'Введение в искусственный интеллект и машинное обучение',
    description: 'Базовое понимание ИИ, машинного обучения и их влияния на современные технологии',
    category: 'ИИ Основы',
    tags: ['Искусственный интеллект', 'Машинное обучение', 'Введение'],
    author: 'Александр Иванов',
    date: '15 апреля 2025',
    readTime: 8,
    url: '/articles/intro-to-ai',
    isFeatured: true,
    isNew: true,
    isSaved: false
  },
  {
    id: 2,
    title: 'Нейронные сети и глубокое обучение: ключевые концепции',
    description: 'Изучение основ нейронных сетей, архитектур и принципов глубокого обучения',
    category: 'Глубокое обучение',
    tags: ['Нейронные сети', 'Глубокое обучение', 'Архитектуры'],
    author: 'Мария Петрова',
    date: '10 апреля 2025',
    readTime: 12,
    url: '/articles/neural-networks-essentials',
    isFeatured: true,
    isNew: false,
    isSaved: true
  },
  {
    id: 3,
    title: 'GPT-4o: революция в генеративном ИИ',
    description: 'Анализ возможностей и применений новейшей модели GPT-4o от OpenAI',
    category: 'Генеративный ИИ',
    tags: ['GPT-4o', 'OpenAI', 'Генеративные модели'],
    author: 'Дмитрий Соколов',
    date: '20 апреля 2025',
    readTime: 10,
    url: '/articles/gpt4o-revolution',
    isFeatured: false,
    isNew: true,
    isSaved: false
  },
  {
    id: 4,
    title: 'Этика и ответственность в разработке ИИ',
    description: 'Обсуждение этических вопросов, связанных с развитием искусственного интеллекта',
    category: 'Этика ИИ',
    tags: ['Этика', 'Ответственность', 'Регулирование ИИ'],
    author: 'Елена Смирнова',
    date: '5 апреля 2025',
    readTime: 15,
    url: '/articles/ai-ethics',
    isFeatured: false,
    isNew: false,
    isSaved: true
  },
  {
    id: 5,
    title: 'Трансформеры в обработке естественного языка',
    description: 'Подробный обзор архитектуры трансформеров и их применения в NLP',
    category: 'Обработка языка',
    tags: ['Трансформеры', 'NLP', 'BERT', 'Attention'],
    author: 'Игорь Васильев',
    date: '12 апреля 2025',
    readTime: 18,
    url: '/articles/transformers-nlp',
    isFeatured: false,
    isNew: false,
    isSaved: false
  }
];

// Мок-данные для туториалов
const tutorials: Tutorial[] = [
  {
    id: 1,
    title: 'Создание чат-бота с использованием OpenAI API',
    description: 'Пошаговое руководство по созданию умного чат-бота с использованием OpenAI API',
    level: 'Средний',
    tags: ['OpenAI', 'API', 'Чат-боты'],
    duration: 45,
    author: 'Андрей Волков',
    date: '18 апреля 2025',
    steps: 8,
    url: '/tutorials/chatbot-openai',
    isFeatured: true,
    isNew: true,
    isSaved: false
  },
  {
    id: 2,
    title: 'Основы компьютерного зрения с TensorFlow',
    description: 'Практическое введение в компьютерное зрение с библиотекой TensorFlow',
    level: 'Базовый',
    tags: ['TensorFlow', 'Компьютерное зрение', 'CNN'],
    duration: 60,
    author: 'Наталья Козлова',
    date: '5 апреля 2025',
    steps: 10,
    url: '/tutorials/cv-tensorflow',
    isFeatured: false,
    isNew: false,
    isSaved: true
  },
  {
    id: 3,
    title: 'Создание системы рекомендаций для вашего приложения',
    description: 'Построение персонализированной системы рекомендаций с использованием коллаборативной фильтрации',
    level: 'Продвинутый',
    tags: ['Система рекомендаций', 'Коллаборативная фильтрация', 'Python'],
    duration: 90,
    author: 'Павел Морозов',
    date: '22 апреля 2025',
    steps: 12,
    url: '/tutorials/recommendation-system',
    isFeatured: true,
    isNew: true,
    isSaved: false
  },
  {
    id: 4,
    title: 'Обработка текста с помощью BERT',
    description: 'Изучение обработки текста и классификации с использованием модели BERT',
    level: 'Продвинутый',
    tags: ['BERT', 'NLP', 'Классификация текста'],
    duration: 75,
    author: 'Карина Лебедева',
    date: '10 апреля 2025',
    steps: 9,
    url: '/tutorials/bert-text-processing',
    isFeatured: false,
    isNew: false,
    isSaved: true
  }
];

// Компонент для отображения статьи
const ArticleCard = ({ article }: { article: Article }) => {
  const [isSaved, setIsSaved] = useState(article.isSaved);
  const { toast } = useToast();

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: !isSaved ? 'Статья сохранена' : 'Статья удалена из сохраненных',
      description: !isSaved ? 'Добавлено в ваш список сохраненных материалов' : 'Удалено из вашего списка сохраненных материалов',
      duration: 2000
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium line-clamp-2">{article.title}</CardTitle>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{article.readTime} мин. чтения</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSave}>
              {isSaved ? <Bookmark className="h-5 w-5 text-amber-400" /> : <BookmarkPlus className="h-5 w-5" />}
            </Button>
          </div>
          
          <CardDescription className="line-clamp-2 mt-2">{article.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {article.isNew && <Badge variant="default" className="bg-emerald-600">Новое</Badge>}
            {article.isFeatured && <Badge variant="outline" className="border-amber-500 text-amber-500">Популярное</Badge>}
            <Badge variant="secondary">{article.category}</Badge>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-1.5">
            {article.tags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
            ))}
            {article.tags.length > 2 && <Badge variant="outline" className="text-xs">+{article.tags.length - 2}</Badge>}
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="text-xs text-muted-foreground">{article.date}</div>
            <Button variant="ghost" size="sm" className="gap-1.5 p-0" asChild>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <span>Читать</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Компонент для отображения туториала
const TutorialCard = ({ tutorial }: { tutorial: Tutorial }) => {
  const [isSaved, setIsSaved] = useState(tutorial.isSaved);
  const { toast } = useToast();

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Базовый': return 'bg-green-600';
      case 'Средний': return 'bg-amber-600';
      case 'Продвинутый': return 'bg-purple-600';
      default: return 'bg-blue-600';
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: !isSaved ? 'Туториал сохранен' : 'Туториал удален из сохраненных',
      description: !isSaved ? 'Добавлено в ваш список сохраненных материалов' : 'Удалено из вашего списка сохраненных материалов',
      duration: 2000
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium line-clamp-2">{tutorial.title}</CardTitle>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{tutorial.duration} мин.</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  <span>{tutorial.steps} шагов</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleSave}>
              {isSaved ? <Bookmark className="h-5 w-5 text-amber-400" /> : <BookmarkPlus className="h-5 w-5" />}
            </Button>
          </div>
          
          <CardDescription className="line-clamp-2 mt-2">{tutorial.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tutorial.isNew && <Badge variant="default" className="bg-emerald-600">Новое</Badge>}
            <Badge variant="default" className={getLevelColor(tutorial.level)}>{tutorial.level}</Badge>
            {tutorial.isFeatured && <Badge variant="outline" className="border-amber-500 text-amber-500">Популярное</Badge>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3">
          <div className="flex flex-wrap gap-1.5">
            {tutorial.tags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
            ))}
            {tutorial.tags.length > 2 && <Badge variant="outline" className="text-xs">+{tutorial.tags.length - 2}</Badge>}
          </div>
          <div className="flex justify-between items-center w-full">
            <div className="text-xs text-muted-foreground">{tutorial.date}</div>
            <Button variant="default" size="sm" className="gap-1.5" asChild>
              <a href={tutorial.url}>
                <span>Начать</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Компонент поиска по базе знаний с использованием GPT
const GptSearch = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!query.trim()) {
      toast({
        title: 'Введите запрос',
        description: 'Пожалуйста, введите текст для поиска',
        variant: 'destructive'
      });
      return;
    }

    setIsSearching(true);
    
    // Имитация поиска с помощью GPT (в реальном приложении здесь был бы запрос к API)
    setTimeout(() => {
      setResults(`Результаты поиска по запросу: "${query}"\n\nВ базе знаний NovaAI University найдено несколько релевантных материалов. Основываясь на вашем запросе, я рекомендую следующие ресурсы:\n\n1. Статья "Введение в искусственный интеллект и машинное обучение" - общее понимание основ ИИ и его применений.\n\n2. Туториал "Создание чат-бота с использованием OpenAI API" - практическое руководство для разработки собственного ИИ-приложения.\n\n3. В нашей библиотеке курсов есть полный раздел, посвященный этой теме: "Основы искусственного интеллекта: от теории к практике".\n\nХотите, чтобы я подробнее рассказал о каком-то из этих материалов или поискал что-то более конкретное?`);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
          <Input
            placeholder="Поиск по базе знаний с помощью GPT..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="gap-1.5"
        >
          {isSearching ? 'Поиск...' : 'Найти'}
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {isSearching && (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="text-lg font-medium">Анализирую базу знаний...</div>
            <div className="text-sm text-muted-foreground mt-1">Это может занять несколько секунд</div>
          </div>
        </div>
      )}
      
      {results && !isSearching && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Результаты поиска</CardTitle>
            <CardDescription>Ответ AI-ассистента на основе базы знаний</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 rounded-md border p-4">
              <div className="whitespace-pre-line">
                {results}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setQuery('')}>
              Новый поиск
            </Button>
            <Button size="sm" className="gap-1.5">
              <span>Сохранить результат</span>
              <Download className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

// Основной компонент страницы
export default function KnowledgeVaultPage() {
  return (
    <DashboardLayout title="Хранилище знаний 💾">
      <div className="space-y-6">
        <div className="max-w-4xl">
          <p className="text-muted-foreground">
            Библиотека статей, туториалов и знаний по AI и Data Science с быстрым GPT-поиском.
            Сохраняйте интересные материалы, читайте и изучайте даже в оффлайн-режиме.
          </p>
        </div>
        
        <Separator />
        
        <Tabs defaultValue="articles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="articles" className="gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Статьи</span>
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="gap-1.5">
              <BookOpen className="h-4 w-4" />
              <span>Туториалы</span>
            </TabsTrigger>
            <TabsTrigger value="gpt-search" className="gap-1.5">
              <Search className="h-4 w-4" />
              <span>GPT-поиск</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tutorials" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="gpt-search">
            <GptSearch />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}