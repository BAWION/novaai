import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Target, CalendarIcon, CheckCircle2, Clock } from 'lucide-react';
import { format, addMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';

// Типы для целей
type Goal = {
  id: number;
  userId: number;
  targetMinutesMonthly: number;
  targetDate: Date;
  status: string;
  createdAt: Date;
  // Дополнительные поля, добавляемые при получении из API
  currentMonthlyMinutes?: number;
  progressPercent?: number;
  isAchieved?: boolean;
};

interface TimeSavedGoalCardProps {
  goals: Goal[];
  isLoading: boolean;
  onGoalCreated: () => void;
}

// Схема валидации формы
const createGoalSchema = z.object({
  targetMinutesMonthly: z.number().positive({
    message: 'Введите положительное число минут',
  }),
  targetDate: z.date({
    required_error: 'Выберите дату достижения цели',
  }).refine((date) => {
    const now = new Date();
    return date > now;
  }, {
    message: 'Дата должна быть в будущем',
  }),
});

type CreateGoalFormValues = z.infer<typeof createGoalSchema>;

export const TimeSavedGoalCard: React.FC<TimeSavedGoalCardProps> = ({
  goals,
  isLoading,
  onGoalCreated
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Получаем наиболее актуальную цель
  const activeGoals = goals.filter(goal => goal.status === 'active');
  const latestGoal = activeGoals.length > 0 ? activeGoals[0] : null;

  // Инициализация формы
  const form = useForm<CreateGoalFormValues>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      targetMinutesMonthly: 0,
      targetDate: addMonths(new Date(), 3), // По умолчанию +3 месяца
    },
  });

  // Обработчик отправки формы
  const onSubmit = async (values: CreateGoalFormValues) => {
    try {
      setIsSubmitting(true);
      
      const response = await apiRequest('POST', '/api/time-saved/goals', {
        targetMinutesMonthly: values.targetMinutesMonthly,
        targetDate: values.targetDate.toISOString(),
      });
      
      if (!response.ok) {
        throw new Error('Не удалось создать цель');
      }
      
      toast({
        title: 'Цель создана',
        description: 'Ваша цель по экономии времени успешно создана',
        variant: 'default',
      });
      
      setIsDialogOpen(false);
      form.reset();
      onGoalCreated();
    } catch (error) {
      console.error('Ошибка при создании цели:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать цель по экономии времени',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full h-full glassmorphism">
      <CardHeader className="relative">
        <div className="absolute -right-1 -top-1 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Target className="w-7 h-7 text-primary/50" />
        </div>
        <CardTitle className="text-xl">Цели</CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : latestGoal ? (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    Экономить {latestGoal.targetMinutesMonthly} мин/месяц
                  </p>
                </div>
                
                {latestGoal.isAchieved && (
                  <div className="flex items-center text-green-500">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    <span className="text-xs font-medium">Достигнута</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    Текущий прогресс: {latestGoal.currentMonthlyMinutes || 0} мин/месяц
                  </span>
                  <span>{latestGoal.progressPercent || 0}%</span>
                </div>
                
                <Progress value={latestGoal.progressPercent} 
                  className={cn(
                    "h-2",
                    latestGoal.progressPercent && latestGoal.progressPercent >= 100
                      ? "bg-green-200" 
                      : "bg-muted"
                  )}
                />
                
                <p className="text-xs text-muted-foreground mt-3">
                  Целевая дата: {format(new Date(latestGoal.targetDate), 'dd MMMM yyyy', { locale: ru })}
                </p>
              </div>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  Создать новую цель
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создание новой цели</DialogTitle>
                  <DialogDescription>
                    Установите цель по экономии времени для отслеживания прогресса
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="targetMinutesMonthly"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Минут в месяц</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Например, 600 минут"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="targetDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Дата достижения</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ru })
                                  ) : (
                                    <span>Выберите дату</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Создание...' : 'Создать цель'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">
                У вас пока нет целей по экономии времени
              </p>
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Создать первую цель
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Создание новой цели</DialogTitle>
                    <DialogDescription>
                      Установите цель по экономии времени для отслеживания прогресса
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="targetMinutesMonthly"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Минут в месяц</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="Например, 600 минут"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="targetDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Дата достижения</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: ru })
                                    ) : (
                                      <span>Выберите дату</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? 'Создание...' : 'Создать цель'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};