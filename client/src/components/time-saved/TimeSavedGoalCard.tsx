import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Target, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TimeSavedGoal } from '@/types/time-saved';
import { Progress } from '@/components/ui/progress';

const createGoalSchema = z.object({
  targetMinutesMonthly: z
    .string()
    .refine((val) => !isNaN(parseInt(val)), {
      message: 'Введите корректное число',
    })
    .refine((val) => parseInt(val) > 0, {
      message: 'Значение должно быть положительным',
    })
    .transform((val) => parseInt(val)),
  targetDate: z.date({
    required_error: 'Выберите целевую дату',
  }).refine((date) => date > new Date(), {
    message: 'Дата должна быть в будущем',
  }),
});

type CreateGoalFormValues = z.infer<typeof createGoalSchema>;

export function TimeSavedGoalCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const queryClient = useQueryClient();

  // Форма для создания цели
  const form = useForm<CreateGoalFormValues>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      targetMinutesMonthly: '120', // По умолчанию 2 часа в месяц
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Через месяц
    },
  });

  // Запрос целей пользователя
  const {
    data: goals,
    isLoading,
    error,
  } = useQuery<TimeSavedGoal[]>({
    queryKey: ['/api/time-saved/goals', user?.id],
    enabled: !!user,
  });

  // Мутация для создания новой цели
  const createGoalMutation = useMutation({
    mutationFn: async (values: CreateGoalFormValues) => {
      const response = await fetch('/api/time-saved/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetMinutesMonthly: values.targetMinutesMonthly,
          targetDate: values.targetDate.toISOString().split('T')[0],
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при создании цели');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Цель создана',
        description: 'Новая цель по экономии времени успешно создана',
      });
      setShowCreateForm(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/time-saved/goals', user?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Ошибка создания цели',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Обработчик отправки формы
  const onSubmit = (values: CreateGoalFormValues) => {
    createGoalMutation.mutate(values);
  };

  // Отображение состояния загрузки
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Цели экономии времени</CardTitle>
          <CardDescription>Загрузка данных...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Если произошла ошибка
  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Цели экономии времени</CardTitle>
          <CardDescription>Не удалось загрузить цели</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Произошла ошибка при загрузке целей экономии времени</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/time-saved/goals', user?.id] })}
          >
            Повторить попытку
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Цели экономии времени
            </CardTitle>
            <CardDescription>
              Установите цели и отслеживайте прогресс
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {goals && goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className={cn(
                  "border rounded-lg p-4 space-y-3",
                  goal.status === "completed" && "border-success bg-success/5",
                  goal.status === "expired" && "border-destructive bg-destructive/5"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      Экономить {goal.targetHoursMonthly} часов в месяц
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(goal.targetDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    goal.status === "active" && "bg-primary/10 text-primary",
                    goal.status === "completed" && "bg-success/10 text-success",
                    goal.status === "expired" && "bg-destructive/10 text-destructive"
                  )}>
                    {goal.status === "active" && "Активная"}
                    {goal.status === "completed" && "Достигнута"}
                    {goal.status === "expired" && "Просрочена"}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс</span>
                    <span>{Math.round(goal.progress * 100)}%</span>
                  </div>
                  <Progress value={goal.progress * 100} className={cn(
                    "h-2",
                    goal.status === "completed" && "bg-success/30 [&>div]:bg-success",
                    goal.status === "expired" && "bg-destructive/30 [&>div]:bg-destructive"
                  )} />
                </div>
                
                {goal.status === "active" && (
                  <p className="text-xs text-muted-foreground">
                    {goal.remainingDays > 0 
                      ? `Осталось ${goal.remainingDays} дней` 
                      : "Срок достижения истекает сегодня"}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <Clock className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold mb-2">У вас пока нет целей</h3>
            <p className="text-muted-foreground max-w-md mb-4">
              Поставьте цель по экономии времени, и мы поможем вам отслеживать прогресс
            </p>
          </div>
        )}

        {showCreateForm ? (
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4">Новая цель экономии времени</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="targetMinutesMonthly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Минут в месяц</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          placeholder="120"
                        />
                      </FormControl>
                      <FormDescription>
                        Сколько минут вы хотите экономить ежемесячно ({parseInt(field.value || '0') / 60} ч)
                      </FormDescription>
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
                      <FormDescription>
                        К какой дате вы планируете достичь этой цели
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                  >
                    Отмена
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createGoalMutation.isPending}
                  >
                    {createGoalMutation.isPending ? 'Создание...' : 'Создать цель'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setShowCreateForm(true)}
          >
            + Поставить новую цель
          </Button>
        )}
      </CardContent>
    </Card>
  );
}