import { useQuery } from "@tanstack/react-query";
import { diagnosisApi } from "@/api/diagnosis-api";
import { useUserProfile } from "@/context/user-profile-context";
// Безопасный импорт хука useAuth без непосредственного вызова
import * as AuthModule from "@/context/auth-context";

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
export function useSkillsDna(userId?: number): SkillsDnaData {
  const { userProfile } = useUserProfile();
  
  // Безопасно получаем пользователя из контекста авторизации, если он доступен
  let authUser = null;
  try {
    // Мы используем динамический импорт хука useAuth
    // Это позволяет компоненту работать даже вне контекста AuthProvider
    // Обычно работать с хуками таким образом не рекомендуется,
    // но в данном случае это вынужденное решение проблемы совместимости
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
  
  // Получаем ID пользователя с учетом различных приоритетов
  const providedUserId = userId;
  const authUserId = authUser?.id;
  const profileUserId = userProfile?.userId;
  
  // Проверяем наличие конфликтов идентификации
  let isConflictingIds = false;
  if (providedUserId && authUserId && providedUserId !== authUserId) {
    console.warn("[useSkillsDna] Конфликт ID пользователя: переданный ID не соответствует ID в контексте авторизации");
    isConflictingIds = true;
  }
  
  // Определяем приоритет: переданный userId -> ID из контекста auth -> ID из профиля -> демо-пользователь (999)
  let currentUserId = providedUserId || authUserId || profileUserId;
  
  // Если пользователь не определен или есть конфликт ID, включаем демо-режим с userId = 999
  let demoMode = !currentUserId || isConflictingIds;
  let demoReason = '';
  
  if (!currentUserId) {
    demoReason = 'пользователь не определен';
  } else if (isConflictingIds) {
    demoReason = 'конфликт идентификаторов пользователя';
  }
  
  // Принудительный переход в демо-режим также происходит, если мы получили ошибку 403 (ID_CONFLICT)
  // или 401 (AUTH_REQUIRED) при последнем запросе данных
  const lastError = localStorage.getItem('skillsDnaLastError');
  if (lastError && (lastError === 'ID_CONFLICT' || lastError === 'AUTH_REQUIRED')) {
    console.log("[useSkillsDna] Переключение в демо-режим из-за предыдущей ошибки:", lastError);
    demoMode = true;
    demoReason = lastError === 'ID_CONFLICT' 
      ? 'конфликт ID на сервере'
      : 'требуется авторизация';
    
    // Сбрасываем ошибку, чтобы не входить в бесконечный цикл
    localStorage.removeItem('skillsDnaLastError');
  }
  
  if (demoMode) {
    currentUserId = 999; // ID для демо-пользователя/администратора
    console.log(`[useSkillsDna] Активирован демо-режим (userId=999). Причина: ${demoReason}`);
  }
  
  // Выводим отладочную информацию
  console.log("[useSkillsDna] Источники userId:", { 
    providedUserId: userId,
    authUserId: authUser?.id,
    profileUserId: userProfile?.userId,
    resultUserId: currentUserId,
    demoMode
  });

  // Запрос на получение прогресса пользователя по Skills DNA
  const {
    data: progressData,
    isLoading: isProgressLoading,
    error: progressError,
    refetch: refetchProgress
  } = useQuery({
    queryKey: ['skillsDna', 'progress', currentUserId],
    queryFn: () => diagnosisApi.getUserProgress(currentUserId as number),
    enabled: !!currentUserId,
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: 1 // Уменьшаем количество повторных попыток при ошибке
  });

  // Запрос на получение сводной информации о прогрессе пользователя
  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
    refetch: refetchSummary
  } = useQuery({
    queryKey: ['skillsDna', 'summary', currentUserId],
    queryFn: () => diagnosisApi.getUserSummary(currentUserId as number),
    enabled: !!currentUserId,
    staleTime: 1000 * 60 * 5, // 5 минут
    retry: 1 // Уменьшаем количество повторных попыток при ошибке
  });

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
    console.log("[useSkillsDna] Обновление данных Skills DNA для пользователя:", currentUserId);
    refetchProgress();
    refetchSummary();
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
    isDemoMode: demoMode,
    userId: currentUserId,
    progressHistory
  };
};