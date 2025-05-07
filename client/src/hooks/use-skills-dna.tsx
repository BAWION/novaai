import { useQuery } from "@tanstack/react-query";
import { diagnosisApi } from "@/api/diagnosis-api";
import { useUserProfile } from "@/context/user-profile-context";

/**
 * Хук для получения данных Skills DNA пользователя
 * @param userId ID пользователя (если не указан, используется текущий пользователь)
 * @returns Объект с данными Skills DNA и состоянием запроса
 */
export function useSkillsDna(userId?: number) {
  const { userProfile } = useUserProfile();
  const currentUserId = userId || userProfile?.userId;

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
    if (item.skillName && typeof item.level === 'number') {
      acc[item.skillName] = item.level;
    }
    return acc;
  }, {}) || {};

  // Проверяем, есть ли какие-либо данные навыков
  const isEmpty = !progressError && !isProgressLoading && Object.keys(skillsData).length === 0;

  // Функция для обновления данных
  const refetchSkillsData = () => {
    refetchProgress();
    refetchSummary();
  };

  return {
    skills: skillsData,
    summary: summaryData,
    isLoading: isProgressLoading || isSummaryLoading,
    error: progressError || summaryError,
    isEmpty, // Новое свойство, указывающее на отсутствие данных
    refetch: refetchSkillsData
  };
}