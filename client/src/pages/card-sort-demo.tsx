import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { CheckCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface DraggedItem {
  id: string;
  text: string;
  category: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  color: string;
  items: DraggedItem[];
}

export default function CardSortDemo() {
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const initialItems: DraggedItem[] = [
    { id: '1', text: 'Алгоритм распознавания лиц', category: 'bias' },
    { id: '2', text: 'GDPR и 152-ФЗ', category: 'privacy' },
    { id: '3', text: 'Объяснимые решения ИИ', category: 'transparency' },
    { id: '4', text: 'Данные медицинских карт', category: 'privacy' },
    { id: '5', text: 'Алгоритм найма сотрудников', category: 'bias' },
    { id: '6', text: 'LIME и SHAP анализ', category: 'transparency' },
    { id: '7', text: 'Гендерные предрассудки в ИИ', category: 'bias' },
    { id: '8', text: 'Шифрование персональных данных', category: 'privacy' },
    { id: '9', text: 'Интерпретация модели ИИ', category: 'transparency' }
  ];

  const [availableItems, setAvailableItems] = useState<DraggedItem[]>(initialItems);
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'bias',
      title: 'Предвзятость и справедливость',
      description: 'Вопросы дискриминации и справедливого отношения',
      color: 'bg-red-600',
      items: []
    },
    {
      id: 'privacy',
      title: 'Приватность и безопасность',
      description: 'Защита персональных данных и конфиденциальности',
      color: 'bg-blue-600',
      items: []
    },
    {
      id: 'transparency',
      title: 'Прозрачность и объяснимость',
      description: 'Понимание принятия решений ИИ',
      color: 'bg-green-600',
      items: []
    }
  ]);

  const handleDragStart = (item: DraggedItem) => {
    setDraggedItem(item);
  };

  const handleDrop = (categoryId: string) => {
    if (!draggedItem) return;

    // Добавляем элемент в категорию
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, items: [...cat.items, draggedItem] }
        : cat
    ));

    // Убираем элемент из доступных
    setAvailableItems(prev => prev.filter(item => item.id !== draggedItem.id));
    setDraggedItem(null);

    // Проверяем завершение
    if (availableItems.length === 1) { // Последний элемент
      checkCompletion();
    }
  };

  const checkCompletion = () => {
    let correctCount = 0;
    categories.forEach(cat => {
      cat.items.forEach(item => {
        if (item.category === cat.id) {
          correctCount++;
        }
      });
    });

    const totalItems = initialItems.length;
    const percentage = Math.round((correctCount / totalItems) * 100);
    setScore(percentage);
    setCompleted(true);
  };

  const resetActivity = () => {
    setAvailableItems(initialItems);
    setCategories(prev => prev.map(cat => ({ ...cat, items: [] })));
    setCompleted(false);
    setScore(0);
    setDraggedItem(null);
  };

  const removeFromCategory = (categoryId: string, itemId: string) => {
    const item = categories.find(cat => cat.id === categoryId)?.items.find(item => item.id === itemId);
    if (!item) return;

    // Возвращаем элемент в доступные
    setAvailableItems(prev => [...prev, item]);
    
    // Убираем из категории
    setCategories(prev => prev.map(cat => 
      cat.id === categoryId 
        ? { ...cat, items: cat.items.filter(i => i.id !== itemId) }
        : cat
    ));
  };

  const progress = Math.round(((initialItems.length - availableItems.length) / initialItems.length) * 100);

  return (
    <DashboardLayout title="Card Sort Activity Demo" subtitle="Демонстрация сортировки карточек">
      <div className="space-y-6">
        {/* Навигация */}
        <div className="mb-6">
          <Link href="/ai-ethics-v2">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к курсу
            </Button>
          </Link>
        </div>

        {/* Заголовок и прогресс */}
        <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-800">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl text-white">Классификация этических вопросов</CardTitle>
                <p className="text-purple-200 mt-2">
                  Перетащите концепции в соответствующие категории этики ИИ
                </p>
              </div>
              <Button onClick={resetActivity} variant="outline" className="border-purple-400 text-purple-200">
                <RotateCcw className="h-4 w-4 mr-2" />
                Сбросить
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-purple-200">
                <span>Прогресс: {initialItems.length - availableItems.length}/{initialItems.length}</span>
                <span>{progress}% завершено</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Результат */}
        {completed && (
          <Card className="bg-green-900 border-green-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Задание завершено!</h3>
                    <p className="text-green-200">Ваш результат: {score}% правильных ответов</p>
                  </div>
                </div>
                <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                  {score >= 80 ? 'Отлично!' : score >= 60 ? 'Хорошо!' : 'Попробуйте еще раз'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Доступные элементы */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Концепции для классификации</CardTitle>
              <p className="text-gray-400">Перетащите элементы в подходящие категории</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {availableItems.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={() => handleDragStart(item)}
                    className="p-3 bg-gray-700 rounded-lg border-2 border-dashed border-gray-600 hover:border-blue-500 cursor-move transition-colors"
                  >
                    <span className="text-white font-medium">{item.text}</span>
                  </div>
                ))}
                {availableItems.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    Все элементы размещены! 🎉
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Категории */}
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <div>
                      <CardTitle className="text-white text-lg">{category.title}</CardTitle>
                      <p className="text-gray-400 text-sm">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="min-h-[120px] p-4 border-2 border-dashed border-gray-600 rounded-lg space-y-2"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(category.id)}
                  >
                    {category.items.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        Перетащите элементы сюда
                      </div>
                    ) : (
                      category.items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2 rounded border ${
                            item.category === category.id 
                              ? 'bg-green-700 border-green-600' 
                              : 'bg-red-700 border-red-600'
                          } cursor-pointer hover:opacity-80`}
                          onClick={() => removeFromCategory(category.id, item.id)}
                        >
                          <span className="text-white text-sm">{item.text}</span>
                          {item.category === category.id && (
                            <CheckCircle className="h-4 w-4 text-green-300 inline ml-2" />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Инструкции */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="pt-6">
            <h4 className="text-lg font-semibold text-white mb-3">Как выполнить задание:</h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">1.</span>
                <span className="text-gray-300">Выберите концепцию из левого списка</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">2.</span>
                <span className="text-gray-300">Перетащите её в подходящую категорию</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-400 font-bold">3.</span>
                <span className="text-gray-300">Зеленые карточки - правильно, красные - исправьте</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
