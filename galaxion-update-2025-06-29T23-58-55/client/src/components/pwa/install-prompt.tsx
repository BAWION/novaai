import { useState, useEffect } from 'react';
import { setupInstallPrompt } from '@/lib/pwa-utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';

/**
 * Компонент кнопки для установки PWA приложения
 */
export function PWAInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [startInstall, setStartInstall] = useState<(() => Promise<void>) | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Инициализируем функцию установки
    const promptInstall = setupInstallPrompt(() => {
      setCanInstall(true);
      setTimeout(() => setIsVisible(true), 3000); // Показываем через 3 секунды после загрузки
    });
    
    setStartInstall(() => promptInstall);
    
    // Проверяем, не был ли уже сделан выбор пользователем
    const hasBeenPrompted = localStorage.getItem('pwa-install-prompted');
    if (hasBeenPrompted) {
      setIsVisible(false);
    }
    
    return () => {
      setCanInstall(false);
      setStartInstall(null);
    };
  }, []);
  
  const handleInstall = async () => {
    // Отмечаем, что пользователю уже предлагали установить PWA
    localStorage.setItem('pwa-install-prompted', 'true');
    
    if (startInstall) {
      await startInstall();
    }
    
    setIsVisible(false);
  };
  
  const handleDismiss = () => {
    localStorage.setItem('pwa-install-prompted', 'true');
    setIsVisible(false);
  };
  
  if (!canInstall || !isVisible) {
    return null;
  }
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full px-4"
        >
          <div className="bg-space-800 bg-opacity-95 backdrop-blur-sm border border-[#6E3AFF]/30 rounded-xl p-4 shadow-xl">
            <div className="flex items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white">Установить приложение</h3>
                <p className="text-sm text-white/70 mt-1">
                  Установите NovaAI University на ваше устройство для быстрого доступа и работы офлайн
                </p>
              </div>
              <button 
                onClick={handleDismiss}
                className="text-white/50 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={handleDismiss}
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                Позже
              </Button>
              <Button 
                onClick={handleInstall}
                className="flex-1 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#5A26E0] hover:to-[#1A9BCA] border-0"
              >
                <Download className="w-4 h-4 mr-2" />
                Установить
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Плавающая кнопка установки PWA для мобильных устройств
 */
export function MobilePWAInstallButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [startInstall, setStartInstall] = useState<(() => Promise<void>) | null>(null);
  
  useEffect(() => {
    // Проверяем, что это мобильное устройство
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    
    // Инициализируем функцию установки
    const promptInstall = setupInstallPrompt(() => {
      setCanInstall(true);
    });
    
    setStartInstall(() => promptInstall);
    
    return () => {
      setCanInstall(false);
      setStartInstall(null);
    };
  }, []);
  
  const handleInstall = async () => {
    if (startInstall) {
      await startInstall();
    }
  };
  
  if (!canInstall) {
    return null;
  }
  
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleInstall}
      className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] shadow-lg flex items-center justify-center"
    >
      <Download className="w-5 h-5 text-white" />
    </motion.button>
  );
}