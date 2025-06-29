import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, CheckCircle, HelpCircle, FileText, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

// Типы заданий
export enum AssignmentType {
  CODE = "code",
  TEXT = "text",
  CREATIVE = "creative",
  PROJECT = "project",
}

// Интерфейс для файла решения
export interface SolutionFile {
  name: string;
  content: string;
  language?: string;
}

// Интерфейс для практического задания
export interface PracticeAssignment {
  id: string;
  type: AssignmentType;
  title: string;
  description: string;
  hint?: string;
  instructions: string;
  sampleSolution?: string;
  sampleFiles?: SolutionFile[];
  criteria: string[]; // Критерии оценки
}

// Интерфейс свойств компонента
interface PracticeAssignmentProps {
  assignment: PracticeAssignment;
  onComplete?: (solution: string, files?: SolutionFile[]) => void;
  onRequestFeedback?: (solution: string, files?: SolutionFile[]) => Promise<string>;
}

export function PracticeAssignment({
  assignment,
  onComplete,
  onRequestFeedback,
}: PracticeAssignmentProps) {
  const [activeTab, setActiveTab] = useState<string>("instructions");
  const [solution, setSolution] = useState<string>("");
  const [files, setFiles] = useState<SolutionFile[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleSolutionChange = (value: string) => {
    setSolution(value);
  };

  const handleSubmitSolution = () => {
    if (onComplete) {
      setIsSubmitting(true);
      // Имитация отправки и проверки решения
      setTimeout(() => {
        onComplete(solution, files);
        setCompleted(true);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleRequestFeedback = async () => {
    if (onRequestFeedback && solution.trim()) {
      setIsLoading(true);
      try {
        const result = await onRequestFeedback(solution, files);
        setFeedback(result);
        setActiveTab("feedback");
      } catch (error) {
        setFeedback("Произошла ошибка при получении обратной связи. Пожалуйста, попробуйте позже.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="shadow-lg bg-white dark:bg-zinc-800">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            {assignment.title}
          </CardTitle>
          <span className={`text-sm px-2 py-1 rounded-full ${
            completed 
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
          }`}>
            {completed ? (
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Завершено
              </span>
            ) : (
              <span>
                {assignment.type === AssignmentType.CODE ? "Кодирование" :
                 assignment.type === AssignmentType.TEXT ? "Текстовый ответ" :
                 assignment.type === AssignmentType.CREATIVE ? "Творческое задание" :
                 "Проект"}
              </span>
            )}
          </span>
        </div>
        <CardDescription>
          {assignment.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="instructions">Инструкции</TabsTrigger>
            <TabsTrigger value="solution">Решение</TabsTrigger>
            <TabsTrigger value="feedback" disabled={!feedback}>Обратная связь</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instructions" className="space-y-4">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{assignment.instructions}</ReactMarkdown>
            </div>
            
            {assignment.hint && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-300">Подсказка</p>
                    <p className="text-sm mt-1">{assignment.hint}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Критерии оценки:</h4>
              <ul className="space-y-1 list-disc list-inside text-sm">
                {assignment.criteria.map((criterion, index) => (
                  <li key={index}>{criterion}</li>
                ))}
              </ul>
            </div>
            
            {assignment.sampleSolution && (
              <div className="mt-6">
                <h4 className="font-medium mb-2">Пример решения:</h4>
                <Card>
                  <CardContent className="p-3 text-sm">
                    <pre className="whitespace-pre-wrap">{assignment.sampleSolution}</pre>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="pt-4 flex justify-end">
              <Button onClick={() => setActiveTab("solution")}>
                Перейти к решению
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="solution">
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">Ваше решение:</label>
                <Textarea
                  placeholder={
                    assignment.type === AssignmentType.CODE
                      ? "Введите ваш код здесь..."
                      : assignment.type === AssignmentType.TEXT
                      ? "Напишите ваш ответ здесь..."
                      : "Опишите ваше решение здесь..."
                  }
                  className="h-48 font-mono"
                  value={solution}
                  onChange={(e) => handleSolutionChange(e.target.value)}
                  disabled={completed}
                />
              </div>
              
              {assignment.type === AssignmentType.PROJECT && (
                <div className="p-4 border border-dashed rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm">
                      Загрузка файлов будет доступна в будущих версиях
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="feedback">
            {feedback ? (
              <div className="space-y-4">
                <Card className="bg-gray-50 dark:bg-zinc-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Обратная связь по вашему решению</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{feedback}</ReactMarkdown>
                  </CardContent>
                </Card>
                
                {!completed && (
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("solution")}>
                      Вернуться к решению
                    </Button>
                    <Button onClick={handleSubmitSolution} disabled={isSubmitting}>
                      {isSubmitting ? "Отправка..." : "Завершить задание"}
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">Нет обратной связи</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setActiveTab(
            activeTab === "instructions" ? "solution" :
            activeTab === "solution" && feedback ? "feedback" : "instructions"
          )}
        >
          {activeTab === "instructions" ? "К решению" :
           activeTab === "solution" && feedback ? "К обратной связи" : "К инструкциям"}
        </Button>
        
        {activeTab === "solution" && (
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={handleRequestFeedback}
              disabled={!solution.trim() || isLoading}
            >
              {isLoading ? "Получение обратной связи..." : "Получить обратную связь"}
              <Send className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              onClick={handleSubmitSolution}
              disabled={!solution.trim() || isSubmitting || completed}
            >
              {isSubmitting ? "Отправка..." : completed ? "Завершено" : "Завершить задание"}
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}