import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { TimeSavedCard } from './TimeSavedCard';
import { TimeSavedGoalCard } from './TimeSavedGoalCard';
import { TimeSavedHistoryGraph } from './TimeSavedHistoryGraph';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, Info } from 'lucide-react';
import { useLocation } from 'wouter';

export function TimeSavedPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Если пользователь не авторизован
  if (!user) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <Alert variant="default" className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertTitle>Необходима авторизация</AlertTitle>
          <AlertDescription>
            Для просмотра информации об экономии времени необходимо войти в систему.
          </AlertDescription>
          <Button
            onClick={() => setLocation('/login')}
            className="mt-4"
          >
            Войти в систему
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Экономия времени</h1>
        <p className="text-muted-foreground">
          Отслеживайте, сколько времени вы экономите благодаря полученным навыкам
        </p>
      </div>

      <Alert variant="default" className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>S4 (INSIGHT "Time-Saved")</AlertTitle>
        <AlertDescription>
          Модуль "Экономия времени" помогает вам увидеть конкретную пользу от обучения. 
          Система рассчитывает, сколько часов вы экономите благодаря полученным навыкам,
          и позволяет ставить цели по экономии времени.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="col-span-1 md:col-span-2">
          <TimeSavedCard />
        </div>
        <div className="col-span-1">
          <TimeSavedGoalCard />
        </div>
      </div>

      <div className="mb-8">
        <TimeSavedHistoryGraph />
      </div>

      <div className="bg-primary/5 rounded-lg p-6 text-sm">
        <h3 className="font-semibold mb-2">Как рассчитывается экономия времени?</h3>
        <p className="mb-4">
          Система анализирует ваши навыки и их уровни, затем оценивает, сколько времени вы экономите при выполнении задач 
          благодаря полученным знаниям.
        </p>
        <p className="mb-2">Расчет основан на трех ключевых факторах:</p>
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>Уровень освоения навыка (от 1 до 5)</li>
          <li>Среднее количество минут, экономимых на одной задаче</li>
          <li>Типичное количество задач, выполняемых за месяц</li>
        </ul>
        <p>
          Чем выше уровень ваших навыков, тем больше времени вы экономите при выполнении ежедневных задач.
          Эта экономия складывается в часы, дни и даже недели в течение года!
        </p>
      </div>
    </div>
  );
}