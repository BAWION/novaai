/**
 * Функция для проверки наличия секретов в окружении
 * @param secrets Массив ключей секретов для проверки
 * @returns Массив найденных секретов
 */
export async function check_secrets(secrets: string[]): Promise<string[]> {
  try {
    // Вызываем функцию проверки секретов с бэкенда
    const response = await fetch('/api/check-secrets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys: secrets }),
    });
    
    if (!response.ok) {
      console.error('Failed to check secrets');
      return [];
    }
    
    const data = await response.json();
    return data.availableSecrets || [];
  } catch (error) {
    console.error('Error checking secrets:', error);
    return [];
  }
}