import { useQuery } from "@tanstack/react-query";
import { diagnosisApi } from "@/api/diagnosis-api";
import { useUserProfile } from "@/context/user-profile-context";
// Безопасный импорт хука useAuth без непосредственного вызова
import * as AuthModule from "@/context/auth-context";

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
  
  // Приоритет: переданный userId -> ID из контекста auth -> ID из профиля -> демо-пользователь (999)
  let currentUserId = userId || authUser?.id || userProfile?.userId;
  
  // Если пользователь не определен, включаем демо-режим с userId = 999
  const demoMode = !currentUserId;
  if (demoMode) {
    currentUserId = 999; // ID для демо-пользователя/администратора
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

  return {
    skills: skillsData,
    summary: summaryData,
    isLoading: isProgressLoading || isSummaryLoading,
    error: progressError || summaryError,
    isEmpty,
    refetch: refetchSkillsData,
    isDemoMode: demoMode,
    userId: currentUserId
  };
};