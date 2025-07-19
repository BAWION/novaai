import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, FileText, Code, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Assignment {
  id: number;
  title: string;
  description: string;
  type: 'quiz' | 'case_study' | 'coding';
  content: any;
  points: number;
}

interface AssignmentViewerProps {
  assignments: Assignment[];
  lessonId: number;
  onComplete?: (assignmentId: number, score: number) => void;
}

const AssignmentViewer = ({ assignments, lessonId, onComplete }: AssignmentViewerProps) => {
  const [activeAssignment, setActiveAssignment] = useState<number | null>(null);
  const [completedAssignments, setCompletedAssignments] = useState<Set<number>>(new Set());

  const getAssignmentIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <PlayCircle className="h-5 w-5 text-blue-500" />;
      case 'case_study':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'coding':
        return <Code className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAssignmentTypeName = (type: string) => {
    switch (type) {
      case 'quiz':
        return 'Тест';
      case 'case_study':
        return 'Кейс-задание';
      case 'coding':
        return 'Программирование';
      default:
        return 'Задание';
    }
  };

  const handleAssignmentComplete = (assignmentId: number, score: number) => {
    setCompletedAssignments(prev => new Set(Array.from(prev).concat(assignmentId)));
    onComplete?.(assignmentId, score);
  };

  if (!assignments || assignments.length === 0) {
    return (
      <Card className="border-white/10 bg-space-800/30 backdrop-blur-sm">
        <CardContent className="py-8">
          <div className="text-center text-white/60">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Практические задания для этого урока появятся позже</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="border-white/10 bg-space-800/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getAssignmentIcon(assignment.type)}
                  <div>
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription>{assignment.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    {getAssignmentTypeName(assignment.type)}
                  </Badge>
                  <Badge variant="outline" className="border-yellow-500/30 text-yellow-300">
                    {assignment.points} баллов
                  </Badge>
                  {completedAssignments.has(assignment.id) && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeAssignment === assignment.id ? (
                <AssignmentContent 
                  assignment={assignment}
                  onComplete={(score) => handleAssignmentComplete(assignment.id, score)}
                  onClose={() => setActiveAssignment(null)}
                />
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-sm text-white/70">
                    Нажмите "Начать", чтобы приступить к выполнению задания
                  </p>
                  <Button 
                    onClick={() => setActiveAssignment(assignment.id)}
                    disabled={completedAssignments.has(assignment.id)}
                  >
                    {completedAssignments.has(assignment.id) ? 'Завершено' : 'Начать'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface AssignmentContentProps {
  assignment: Assignment;
  onComplete: (score: number) => void;
  onClose: () => void;
}

const AssignmentContent = ({ assignment, onComplete, onClose }: AssignmentContentProps) => {
  const [answers, setAnswers] = useState<any>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // Простая логика подсчета баллов
    let score = 0;
    
    if (assignment.type === 'quiz' && assignment.content.questions) {
      assignment.content.questions.forEach((question: any) => {
        if (answers[question.id] === question.correct) {
          score += question.points || 1;
        }
      });
    } else {
      score = assignment.points; // Максимальный балл для других типов заданий
    }
    
    setSubmitted(true);
    setTimeout(() => {
      onComplete(score);
    }, 1500);
  };

  if (assignment.type === 'quiz' && assignment.content.questions) {
    return (
      <div className="space-y-4">
        {assignment.content.questions.map((question: any, index: number) => (
          <div key={question.id} className="p-4 border border-white/10 rounded-lg">
            <h4 className="font-medium mb-3">{index + 1}. {question.question || question.text}</h4>
            <div className="space-y-2">
              {question.options?.map((option: any, optionIndex: number) => (
                <label key={optionIndex} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={optionIndex}
                    onChange={(e) => setAnswers((prev: any) => ({
                      ...prev,
                      [question.id]: parseInt(e.target.value)
                    }))}
                    className="text-blue-500"
                    disabled={submitted}
                  />
                  <span className="text-sm">{typeof option === 'string' ? option : option.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={submitted}>
            {submitted ? 'Отправлено!' : 'Отправить ответы'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    );
  }

  if (assignment.type === 'case_study') {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-white/10 rounded-lg bg-blue-500/5">
          <h4 className="font-medium mb-2">Сценарий кейса:</h4>
          <p className="text-sm text-white/80 mb-4">{assignment.content.scenario}</p>
          
          {assignment.content.questions?.map((question: any, index: number) => (
            <div key={question.id} className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {index + 1}. {question.text}
              </label>
              <textarea
                className="w-full p-3 rounded border border-white/10 bg-space-700/50 text-white resize-none"
                rows={4}
                placeholder="Введите ваш ответ..."
                onChange={(e) => setAnswers((prev: any) => ({
                  ...prev,
                  [question.id]: e.target.value
                }))}
                disabled={submitted}
              />
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={submitted}>
            {submitted ? 'Отправлено!' : 'Отправить решение'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    );
  }

  if (assignment.type === 'coding') {
    return (
      <div className="space-y-4">
        <div className="p-4 border border-white/10 rounded-lg">
          <h4 className="font-medium mb-2">Стартовый код:</h4>
          <pre className="text-sm bg-gray-900 p-3 rounded overflow-x-auto">
            <code>{assignment.content.starterCode}</code>
          </pre>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Ваше решение:</label>
          <textarea
            className="w-full p-3 rounded border border-white/10 bg-space-700/50 text-white font-mono text-sm"
            rows={12}
            placeholder="Введите ваш код..."
            defaultValue={assignment.content.starterCode}
            onChange={(e) => setAnswers({ code: e.target.value })}
            disabled={submitted}
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button onClick={handleSubmit} disabled={submitted}>
            {submitted ? 'Отправлено!' : 'Отправить код'}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Закрыть
          </Button>
        </div>
      </div>
    );
  }

  return <div>Неизвестный тип задания</div>;
};

export default AssignmentViewer;
