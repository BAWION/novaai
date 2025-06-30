import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for lab assignments
const SAMPLE_ASSIGNMENTS = [
  {
    id: "lab-01",
    title: "Линейная регрессия",
    description: "Реализуйте алгоритм линейной регрессии с нуля и примените его к датасету цен на недвижимость.",
    difficulty: "Средняя",
    estTime: "2-3 часа",
    completed: false,
    dueDate: "2025-05-01"
  },
  {
    id: "lab-02",
    title: "Анализ текстовых данных",
    description: "Используйте NLP-библиотеки для анализа тональности текста из датасета отзывов на продукты.",
    difficulty: "Сложная",
    estTime: "3-4 часа",
    completed: false,
    dueDate: "2025-05-08"
  },
  {
    id: "lab-03",
    title: "Визуализация данных",
    description: "Создайте интерактивные визуализации с помощью Plotly для финансового датасета.",
    difficulty: "Легкая",
    estTime: "1-2 часа",
    completed: true,
    dueDate: "2025-04-25",
    grade: "95/100"
  }
];

// Sample history data
const SAMPLE_HISTORY = [
  {
    id: "submission-01",
    labId: "lab-03",
    labTitle: "Визуализация данных",
    submittedAt: "2025-04-24T14:35:22",
    status: "passed",
    grade: "95/100",
    feedback: "Отличная работа! Хорошо структурированный код и креативный подход к визуализации."
  },
  {
    id: "submission-02",
    labId: "lab-02",
    labTitle: "Нейронные сети: основы",
    submittedAt: "2025-04-15T10:22:43",
    status: "failed",
    feedback: "Нейронная сеть не сходится. Проверьте параметры обучения и нормализацию данных."
  },
  {
    id: "submission-03",
    labId: "lab-01",
    labTitle: "Обработка изображений",
    submittedAt: "2025-04-05T16:12:05",
    status: "passed",
    grade: "89/100",
    feedback: "Хорошая работа, но есть возможности для оптимизации производительности."
  }
];

export default function LabHub() {
  const [activeTab, setActiveTab] = useState("assignments");
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
  const [code, setCode] = useState(`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Загрузим данные
data = pd.read_csv('housing.csv')

# Базовое исследование данных
print(data.head())
print(data.describe())

# Визуализация
plt.figure(figsize=(10, 6))
plt.scatter(data['area'], data['price'])
plt.xlabel('Площадь (м²)')
plt.ylabel('Цена ($)')
plt.title('Зависимость цены от площади')
plt.show()

# TODO: Реализуйте линейную регрессию
# ...

# TODO: Визуализируйте результаты
# ...`);

  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "легкая":
        return "text-green-400";
      case "средняя":
        return "text-yellow-400";
      case "сложная":
        return "text-red-400";
      default:
        return "text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('ru-RU');
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("");
    
    // Simulate code execution with a delay
    setTimeout(() => {
      setOutput(`>>> import numpy as np
>>> import pandas as pd
>>> import matplotlib.pyplot as plt

>>> # Загрузим данные
>>> data = pd.read_csv('housing.csv')

>>> # Базовое исследование данных
>>> print(data.head())
   area  rooms  age  price
0   85      4   12  199000
1  120      5    8  259000
2   70      3   25  125000
3  110      4    5  252000
4  155      6   15  320000

>>> print(data.describe())
             area       rooms         age        price
count   500.000000  500.000000  500.000000   500.000000
mean    105.124000    4.020000   15.120000  210532.000000
std      32.845813    1.119056    8.979398   62593.166842
min      45.000000    1.000000    1.000000   90000.000000
25%      80.000000    3.000000    7.000000  165000.000000
50%     100.000000    4.000000   15.000000  205000.000000
75%     125.000000    5.000000   22.000000  250000.000000
max     200.000000    8.000000   40.000000  500000.000000

>>> # График будет отображен в интерфейсе (в реальном приложении)

[INFO] Выполнение завершено успешно. Обратите внимание, что реализация линейной регрессии и визуализация результатов еще не завершены.`);
      setIsRunning(false);
    }, 2500);
  };

  const handleOpenAssignment = (id: string) => {
    setSelectedAssignment(id);
  };

  const handleSubmitAssignment = () => {
    alert("Задание отправлено на проверку!");
    // В реальном приложении здесь был бы API-запрос
  };

  return (
    <DashboardLayout 
      title="LabHub" 
      subtitle="Интерактивная лаборатория для практики Data Science и ML"
    >
      {selectedAssignment ? (
        <div className="space-y-4">
          {/* Assignment details & IDE */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Assignment details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-1/3"
            >
              <Glassmorphism className="h-full p-5 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-orbitron text-xl font-bold">
                    {SAMPLE_ASSIGNMENTS.find(a => a.id === selectedAssignment)?.title}
                  </h2>
                  <button
                    onClick={() => setSelectedAssignment(null)}
                    className="text-white/70 hover:text-white"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white/80 text-sm font-medium mb-1">Описание:</h3>
                    <p className="text-white/70">
                      {SAMPLE_ASSIGNMENTS.find(a => a.id === selectedAssignment)?.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <h3 className="text-white/80 text-sm font-medium mb-1">Сложность:</h3>
                      <p className={`${getDifficultyColor(SAMPLE_ASSIGNMENTS.find(a => a.id === selectedAssignment)?.difficulty || '')}`}>
                        {SAMPLE_ASSIGNMENTS.find(a => a.id === selectedAssignment)?.difficulty}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-white/80 text-sm font-medium mb-1">Время выполнения:</h3>
                      <p className="text-white/70">
                        {SAMPLE_ASSIGNMENTS.find(a => a.id === selectedAssignment)?.estTime}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-white/80 text-sm font-medium mb-1">Дедлайн:</h3>
                      <p className="text-white/70">
                        {formatDate(SAMPLE_ASSIGNMENTS.find(a => a.id === selectedAssignment)?.dueDate || '')}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white/80 text-sm font-medium mb-1">Требования:</h3>
                    <ul className="list-disc pl-5 text-white/70 text-sm space-y-1">
                      <li>Реализовать линейную регрессию без использования sklearn</li>
                      <li>Визуализировать исходные данные и результаты</li>
                      <li>Рассчитать MSE и R-squared</li>
                      <li>Добавить комментарии к ключевым этапам</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white/80 text-sm font-medium mb-1">Ресурсы:</h3>
                    <div className="space-y-2">
                      <a href="#" className="block text-[#B28DFF] hover:text-[#D2B8FF] text-sm">
                        <i className="fas fa-file-csv mr-2"></i> housing.csv (датасет)
                      </a>
                      <a href="#" className="block text-[#B28DFF] hover:text-[#D2B8FF] text-sm">
                        <i className="fas fa-book mr-2"></i> Документация по линейной регрессии
                      </a>
                      <a href="#" className="block text-[#B28DFF] hover:text-[#D2B8FF] text-sm">
                        <i className="fas fa-question-circle mr-2"></i> Форум поддержки
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handleSubmitAssignment}
                    className="w-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    Отправить на проверку
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Code editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full lg:w-2/3"
            >
              <Glassmorphism className="h-full p-5 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-medium">Редактор кода</h2>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-white/80"
                      title="Сохранить"
                    >
                      <i className="fas fa-save"></i>
                    </button>
                    <button
                      className="px-3 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-white/80"
                      title="Форматировать код"
                    >
                      <i className="fas fa-indent"></i>
                    </button>
                    <button
                      className={`px-3 py-1 text-xs rounded-md ${
                        isRunning 
                          ? "bg-red-500/20 hover:bg-red-500/30 text-red-300" 
                          : "bg-green-600/20 hover:bg-green-600/30 text-green-300"
                      }`}
                      title={isRunning ? "Остановить" : "Запустить"}
                      onClick={handleRunCode}
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <><i className="fas fa-stop"></i> Остановить</>
                      ) : (
                        <><i className="fas fa-play"></i> Запустить</>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Code editor area */}
                <div className="flex flex-col h-[calc(100%-3rem)]">
                  <div className="flex-1 rounded-t-lg overflow-hidden">
                    <textarea
                      className="w-full h-full p-4 bg-space-900 text-white/90 font-mono text-sm focus:outline-none resize-none"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      spellCheck={false}
                    />
                  </div>
                  
                  {/* Terminal output */}
                  <div className="h-64 bg-black/50 rounded-b-lg overflow-auto">
                    <div className="p-3 text-xs text-white/70 border-b border-white/10 bg-black/30">
                      <i className="fas fa-terminal mr-2"></i> Terminal Output
                    </div>
                    <pre className="p-3 text-xs text-green-400 font-mono whitespace-pre-wrap">
                      {isRunning ? (
                        <div className="flex items-center">
                          <div className="animate-pulse mr-2">⬤</div>
                          Выполнение кода...
                        </div>
                      ) : output ? (
                        output
                      ) : (
                        <span className="text-white/30">Запустите код для просмотра результатов...</span>
                      )}
                    </pre>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          </div>
        </div>
      ) : (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="assignments">Задания</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assignments" className="space-y-6">
            <h2 className="font-orbitron text-xl font-semibold">
              Доступные задания
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SAMPLE_ASSIGNMENTS.map((assignment) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="transition-all duration-300"
                >
                  <Glassmorphism className={`rounded-xl p-5 h-full ${
                    assignment.completed 
                      ? "border-l-4 border-l-green-500" 
                      : "border-l-4 border-l-[#6E3AFF]"
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{assignment.title}</h3>
                      <span className={`text-sm ${getDifficultyColor(assignment.difficulty)}`}>
                        {assignment.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {assignment.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-xs text-white/60 mb-4">
                      <span><i className="far fa-clock mr-1"></i> {assignment.estTime}</span>
                      <span><i className="far fa-calendar-alt mr-1"></i> До {formatDate(assignment.dueDate)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      {assignment.completed ? (
                        <span className="text-green-400 text-sm">
                          <i className="fas fa-check-circle mr-1"></i> Завершено: {assignment.grade}
                        </span>
                      ) : (
                        <span className="text-yellow-400 text-sm">
                          <i className="fas fa-hourglass-half mr-1"></i> Ожидает выполнения
                        </span>
                      )}
                      
                      <button
                        onClick={() => handleOpenAssignment(assignment.id)}
                        className="bg-white/10 hover:bg-white/20 text-white py-1 px-3 rounded-lg text-sm transition duration-300"
                      >
                        {assignment.completed ? "Просмотр" : "Начать"}
                      </button>
                    </div>
                  </Glassmorphism>
                </motion.div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6">
            <h2 className="font-orbitron text-xl font-semibold">
              История отправок
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-white/70 border-b border-white/10">
                    <th className="pb-3 pl-2">Задание</th>
                    <th className="pb-3">Дата отправки</th>
                    <th className="pb-3">Статус</th>
                    <th className="pb-3">Оценка</th>
                    <th className="pb-3 pr-2">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_HISTORY.map((history) => (
                    <tr key={history.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 pl-2">
                        <div className="font-medium">{history.labTitle}</div>
                        <div className="text-xs text-white/50">ID: {history.labId}</div>
                      </td>
                      <td className="py-4">
                        <div>{formatDateTime(history.submittedAt)}</div>
                      </td>
                      <td className="py-4">
                        <span className={`${getStatusColor(history.status)}`}>
                          {history.status === "passed" ? "Пройдено" : "Не пройдено"}
                        </span>
                      </td>
                      <td className="py-4">
                        {history.grade || "-"}
                      </td>
                      <td className="py-4 pr-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenAssignment(history.labId)}
                            className="bg-white/10 hover:bg-white/20 text-white py-1 px-3 rounded-lg text-xs transition duration-300"
                          >
                            Просмотр
                          </button>
                          <button
                            className="bg-white/10 hover:bg-white/20 text-white py-1 px-3 rounded-lg text-xs transition duration-300"
                          >
                            Отчет
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </DashboardLayout>
  );
}