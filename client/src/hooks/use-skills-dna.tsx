import { useQuery } from "@tanstack/react-query";
import { diagnosisApi } from "@/api/diagnosis-api";
import { useUserProfile } from "@/context/user-profile-context";
// Безопасный импорт хука useAuth без непосредственного вызова
import * as AuthModule from "@/context/auth-context";
import { useEffect, useState } from "react";

/**
 * Тип данных для записи истории прогресса
 */
export interface ProgressHistoryEntry {
  date: string;
  skills: Record<string, number>;
  overallLevel?: number;
}

/**
 * Тип возвращаемого значения хука useSkillsDna
 */
export interface SkillsDnaData {
  skills: Record<string, number>;
  summary: any;
  isLoading: boolean;
  error: Error | null;
  isEmpty: boolean;
  refetch: () => void;
  isDemoMode: boolean;
  userId: number | undefined;
  progressHistory?: ProgressHistoryEntry[];
}

/**
 * Хук для получения данных Skills DNA пользователя
 * @param userId ID пользователя (если не указан, используется текущий пользователь)
 * @returns Объект с данными Skills DNA и состоянием запроса
 */
export default function useSkillsDna(userId?: number): SkillsDnaData {
  const { userProfile } = useUserProfile();
  
  // Безопасно получаем пользователя из контекста авторизации, если он доступен
  let authUser = null;
  try {
    // Мы используем динамический импорт хука useAuth
    // Это позволяет компоненту работать даже вне контекста AuthProvider
    const useAuth: Function = (AuthModule as any).useAuth;
    if (typeof useAuth === 'function') {
      try {
        const auth = useAuth();
        authUser = auth?.user || null;
      } catch (authError) {
        // Здесь перехватываем ошибку из useAuth в случае 
        // если компонент не обернут в AuthProvider
        console.log("[useSkillsDna] Не удалось получить auth данные:", (authError as Error).message);
      }
    }
  } catch (error: any) {
    console.log("[useSkillsDna] AuthContext недоступен:", error.message);
  }
  
  // Проверяем явно запрошен ли демо-режим через явное указание userId = 999
  const isExplicitDemo = userId === 999;
  
  // Приоритет: переданный userId -> ID из контекста auth -> ID из профиля -> демо-пользователь (999)
  let currentUserId = userId || authUser?.id || userProfile?.userId;
  
  // Если пользователь не определен или явно запрошен демо-режим, включаем демо-режим с userId = 999
  const forceDemoMode = isExplicitDemo || !currentUserId;
  const demoMode = forceDemoMode || currentUserId === 999;
  
  if (demoMode) {
    currentUserId = 999; // ID для демо-пользователя/администратора
  }
  
  // Выводим отладочную информацию
  console.log("[useSkillsDna] Источники userId:", { 
    authUserId: authUser?.id,
    profileUserId: userProfile?.userId,
    demoMode,
    forceDemoMode,
    isExplicitDemo
  });
  
  // Для обработки ошибки аутентификации (401) автоматически переключаемся на демо-режим
  const [shouldUseDemoMode, setShouldUseDemoMode] = useState(demoMode);
  
  // Применим демо-режим если shouldUseDemoMode = true
  const effectiveUserId = shouldUseDemoMode ? 999 : currentUserId;

  // При первой загрузке компонента инициализируем демо-данные, если мы в демо-режиме
  useEffect(() => {
    if (demoMode || shouldUseDemoMode) {
      console.log("[useSkillsDna] Инициализация демо-данных");
      diagnosisApi.initializeDemoData()
        .then(() => {
          console.log("[useSkillsDna] Демо-данные успешно инициализированы");
        })
        .catch(error => {
          console.error("[useSkillsDna] Ошибка при инициализации демо-данных:", error);
        });
    }
  }, [demoMode, shouldUseDemoMode]);

  // Запрос на получение прогресса пользователя по Skills DNA
  const {
    data: progressData,
    isLoading: isProgressLoading,
    error: progressError,
    refetch: refetchProgress
  } = useQuery({
    queryKey: ['skillsDna', 'progress', effectiveUserId],
    queryFn: () => diagnosisApi.getUserProgress(effectiveUserId as number),
    enabled: !!effectiveUserId,
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: demoMode || shouldUseDemoMode ? 0 : 1, // В демо-режиме не пытаемся повторить запрос
    retryOnMount: demoMode || shouldUseDemoMode // В демо-режиме повторяем запрос при монтировании компонента
  });

  // Запрос на получение сводной информации о прогрессе пользователя
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary
  } = useQuery({
    queryKey: ['skillsDna', 'summary', effectiveUserId],
    queryFn: () => diagnosisApi.getUserSummary(effectiveUserId as number),
    enabled: !!effectiveUserId,
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: demoMode || shouldUseDemoMode ? 0 : 1, // В демо-режиме не пытаемся повторить запрос
    retryOnMount: demoMode || shouldUseDemoMode // В демо-режиме повторяем запрос при монтировании компонента
  });

  // Эффект для обработки ошибок аутентификации
  useEffect(() => {
    // Проверяем наличие ошибок
    const hasError = progressError || summaryError;
    
    // Отладочное логирование состояния ошибок
    if (hasError) {
      // Подробно анализируем ошибку для определения типа
      const detectAuthError = (err: any) => {
        if (!err) return false;
        
        // Проверяем наличие статуса 401 в объекте error
        if (err.status === 401) return true;
        
        // Проверяем сообщение ошибки
        const errMsg = err instanceof Error ? err.message : String(err);
        return errMsg.includes('401') || 
               errMsg.toLowerCase().includes('unauthorized') ||
               errMsg.toLowerCase().includes('not authenticated') ||
               errMsg.toLowerCase().includes('авторизаци');
      };
      
      const hasAuthError = detectAuthError(progressError) || detectAuthError(summaryError);
      
      if (hasAuthError) {
        console.warn("[useSkillsDna] Обнаружена ошибка аутентификации:", {
          progressError: progressError instanceof Error ? progressError.message : progressError,
          summaryError: summaryError instanceof Error ? summaryError.message : summaryError,
          userId: currentUserId
        });
        
        // Если у нас есть пользователь, но API возвращает 401,
        // это означает, что токен авторизации недействителен, но мы не хотим показывать ошибку
        // Включаем демо-режим, чтобы пользователь видел данные
        if (authUser || userProfile?.userId) {
          console.log("[useSkillsDna] Переключение на демо-режим из-за проблем с аутентификацией при наличии пользователя");
          setShouldUseDemoMode(true);
        } else {
          // Пользователь не авторизован - показываем сообщение о необходимости авторизации
          console.log("[useSkillsDna] Пользователь не авторизован, показываем сообщение об ошибке");
        }
      }
    }
  }, [progressError, summaryError, currentUserId, authUser, userProfile]);

  // Преобразуем данные прогресса в формат для радарной диаграммы
  const skillsData = progressData?.reduce((acc: Record<string, number>, item: any) => {
    // Проверяем, есть ли имя навыка и прогресс
    if (item.name) {
      // Используем progress если доступен, иначе преобразуем level в число
      const level = typeof item.progress === 'number' 
        ? item.progress 
        : (item.level || 0);
      
      acc[item.name] = level;
    }
    return acc;
  }, {}) || {};

  // Проверяем, есть ли какие-либо данные навыков
  const isEmpty = !progressError && !isProgressLoading && Object.keys(skillsData).length === 0;

  // Функция для обновления данных
  const refetchSkillsData = () => {
    console.log("[useSkillsDna] Обновление данных Skills DNA для пользователя:", effectiveUserId);
    if (demoMode || shouldUseDemoMode) {
      // Для демо-режима сначала инициализируем данные, затем обновляем запросы
      diagnosisApi.initializeDemoData().then(() => {
        refetchProgress();
        refetchSummary();
      });
    } else {
      refetchProgress();
      refetchSummary();
    }
  };

  // Генерируем историю прогресса на основе текущих данных
  // В реальном приложении это должно приходить с сервера
  const generateProgressHistory = (): ProgressHistoryEntry[] => {
    if (isEmpty || !skillsData || Object.keys(skillsData).length === 0) return [];
    
    // Для демонстрации создаем историю прогресса на основе текущих данных
    // Создаем записи за последние 3 месяца
    const now = new Date();
    const history: ProgressHistoryEntry[] = [];
    
    // Добавляем текущие значения
    history.push({
      date: now.toISOString().split('T')[0],
      skills: {...skillsData},
      overallLevel: summaryData?.overallLevel || 0
    });
    
    // Добавляем исторические значения со случайными отклонениями
    for (let i = 1; i <= 3; i++) {
      const pastDate = new Date();
      pastDate.setMonth(now.getMonth() - i);
      
      const pastSkills: Record<string, number> = {};
      Object.entries(skillsData).forEach(([key, value]) => {
        // Значение в прошлом немного меньше текущего (прогресс)
        const pastValue = Math.max(5, (value as number) - 5 * i - Math.floor(Math.random() * 10));
        pastSkills[key] = pastValue;
      });
      
      history.push({
        date: pastDate.toISOString().split('T')[0],
        skills: pastSkills,
        overallLevel: (summaryData?.overallLevel || 0) - (5 * i)
      });
    }
    
    // Сортируем по дате, сначала новые
    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };
  
  // Создаем историю прогресса для демонстрации
  const progressHistory = generateProgressHistory();

  return {
    skills: skillsData,
    summary: summaryData,
    isLoading: isProgressLoading || isSummaryLoading,
    error: progressError || summaryError,
    isEmpty,
    refetch: refetchSkillsData,
    isDemoMode: demoMode || shouldUseDemoMode,
    userId: currentUserId,
    progressHistory
  };
};