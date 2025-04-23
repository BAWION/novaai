// Типы для Web Speech API, которые могут отсутствовать в стандартных определениях TypeScript
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionOptions {
  lang?: string;
  interimResults?: boolean;
  continuous?: boolean;
  maxAlternatives?: number;
}

class SpeechRecognitionClass extends EventTarget {
  lang: string = '';
  interimResults: boolean = false;
  continuous: boolean = false;
  maxAlternatives: number = 1;
  
  constructor() {
    super();
  }
  
  start(): void {}
  stop(): void {}
  abort(): void {}
  
  onstart: ((event: Event) => void) | null = null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onend: ((event: Event) => void) | null = null;
}

// Получаем реализацию Web Speech API из браузера
const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

/**
 * Хук для использования распознавания речи
 * @param options Настройки распознавания речи
 * @returns Объект с методами и состоянием распознавания речи
 */
export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  let recognition: SpeechRecognitionClass | null = null;
  
  // Проверяем поддержку браузером
  const isSupported = !!SpeechRecognitionImpl;
  
  if (isSupported) {
    // Создаем экземпляр распознавания речи
    recognition = new SpeechRecognitionImpl() as SpeechRecognitionClass;
    
    // Применяем опции
    if (options.lang) recognition.lang = options.lang;
    if (options.continuous !== undefined) recognition.continuous = options.continuous;
    if (options.interimResults !== undefined) recognition.interimResults = options.interimResults;
    if (options.maxAlternatives !== undefined) recognition.maxAlternatives = options.maxAlternatives;
  }
  
  /**
   * Начать распознавание речи
   */
  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        return true;
      } catch (e) {
        console.error('Error starting speech recognition:', e);
        return false;
      }
    }
    return false;
  };
  
  /**
   * Остановить распознавание речи
   */
  const stopListening = () => {
    if (recognition) {
      try {
        recognition.stop();
        return true;
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
        return false;
      }
    }
    return false;
  };
  
  /**
   * Установить обработчик результатов распознавания
   * @param handler Функция-обработчик результата распознавания
   */
  const onResult = (handler: (text: string, isFinal: boolean) => void) => {
    if (recognition) {
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex];
        const transcript = result[0].transcript;
        handler(transcript, result.isFinal);
      };
    }
  };
  
  /**
   * Установить обработчик ошибок
   * @param handler Функция-обработчик ошибок
   */
  const onError = (handler: (event: Event) => void) => {
    if (recognition) {
      recognition.onerror = handler;
    }
  };
  
  /**
   * Установить обработчик завершения распознавания
   * @param handler Функция-обработчик завершения
   */
  const onEnd = (handler: (event: Event) => void) => {
    if (recognition) {
      recognition.onend = handler;
    }
  };
  
  /**
   * Установить обработчик начала распознавания
   * @param handler Функция-обработчик начала
   */
  const onStart = (handler: (event: Event) => void) => {
    if (recognition) {
      recognition.onstart = handler;
    }
  };
  
  return {
    isSupported,
    startListening,
    stopListening,
    onResult,
    onError,
    onEnd,
    onStart
  };
}

/**
 * Создает и управляет процессом распознавания речи
 * @param options Настройки распознавания речи
 * @returns Объект для управления распознаванием речи
 */
export function createSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const {
    isSupported,
    startListening,
    stopListening,
    onResult,
    onError,
    onEnd,
    onStart
  } = useSpeechRecognition({
    lang: options.lang || 'ru-RU',
    continuous: options.continuous !== undefined ? options.continuous : true,
    interimResults: options.interimResults !== undefined ? options.interimResults : true,
    maxAlternatives: options.maxAlternatives || 1
  });
  
  return {
    isSupported,
    start: startListening,
    stop: stopListening,
    onResult,
    onError,
    onEnd,
    onStart
  };
}