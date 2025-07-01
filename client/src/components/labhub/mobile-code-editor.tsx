import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { Glassmorphism } from "@/components/ui/glassmorphism";

interface MobileCodeEditorProps {
  initialCode: string;
  language: string;
  onRun?: (code: string) => void;
  onSave?: (code: string) => void;
  output?: string;
  isRunning?: boolean;
  autoScroll?: boolean;
  readOnly?: boolean;
  height?: string;
}

export function MobileCodeEditor({
  initialCode,
  language,
  onRun,
  onSave,
  output = '',
  isRunning = false,
  autoScroll = true,
  readOnly = false,
  height = '300px',
}: MobileCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [activeTab, setActiveTab] = useState<'code' | 'output'>('code');
  const isMobile = useIsMobile();
  const outputRef = React.useRef<HTMLDivElement>(null);
  
  // Автоскролл вывода
  useEffect(() => {
    if (autoScroll && outputRef.current && activeTab === 'output') {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, autoScroll, activeTab]);
  
  // Адаптивно изменяем стили и поведение на основе типа устройства
  const getEditorStyles = () => {
    if (isMobile) {
      return {
        container: "flex flex-col h-full",
        tabs: "flex mb-2",
        tabButton: "flex-1 py-2 text-center font-medium rounded-t-lg",
        editor: "w-full h-full font-mono text-sm p-3 bg-space-900/30 rounded-lg border border-white/10 outline-none resize-none",
        output: "w-full h-full font-mono text-sm p-3 bg-space-900/30 rounded-lg border border-white/10 whitespace-pre-wrap overflow-auto",
        controls: "mt-3 flex justify-end space-x-2"
      };
    }
    
    return {
      container: "grid grid-cols-2 gap-4 h-full",
      tabs: "hidden",
      tabButton: "",
      editor: "w-full h-full font-mono text-sm p-3 bg-space-900/30 rounded-lg border border-white/10 outline-none resize-none",
      output: "w-full h-full font-mono text-sm p-3 bg-space-900/30 rounded-lg border border-white/10 whitespace-pre-wrap overflow-auto",
      controls: "absolute bottom-3 right-3 flex space-x-2"
    };
  };
  
  const styles = getEditorStyles();
  
  const handleRun = () => {
    onRun && onRun(code);
    if (isMobile) {
      setActiveTab('output');
    }
  };
  
  const handleSave = () => {
    onSave && onSave(code);
  };
  
  return (
    <Glassmorphism className="w-full p-4 relative h-full">
      <div className={styles.container} style={{ height }}>
        {/* Tabs для мобильной версии */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${
              activeTab === 'code'
                ? 'bg-space-800 text-white border-t border-l border-r border-white/10'
                : 'bg-space-900/50 text-white/60'
            }`}
            onClick={() => setActiveTab('code')}
          >
            <i className="fas fa-code mr-2"></i>
            Код
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === 'output'
                ? 'bg-space-800 text-white border-t border-l border-r border-white/10'
                : 'bg-space-900/50 text-white/60'
            }`}
            onClick={() => setActiveTab('output')}
          >
            <i className="fas fa-terminal mr-2"></i>
            Вывод
          </button>
        </div>
        
        {/* Редактор кода и Вывод */}
        {isMobile ? (
          <AnimatePresence mode="wait">
            {activeTab === 'code' ? (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={styles.editor}
                  style={{ height: "calc(100% - 40px)" }}
                  readOnly={readOnly}
                  spellCheck={false}
                  data-language={language}
                />
              </motion.div>
            ) : (
              <motion.div
                key="output"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <div 
                  ref={outputRef}
                  className={styles.output}
                  style={{ height: "calc(100% - 40px)" }}
                >
                  {isRunning ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mr-2"></div>
                      <span className="text-white/70">Выполнение...</span>
                    </div>
                  ) : output ? (
                    output
                  ) : (
                    <span className="text-white/30">Запустите код, чтобы увидеть результат</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        ) : (
          <>
            <div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={styles.editor}
                readOnly={readOnly}
                spellCheck={false}
                data-language={language}
              />
            </div>
            <div>
              <div ref={outputRef} className={styles.output}>
                {isRunning ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mr-2"></div>
                    <span className="text-white/70">Выполнение...</span>
                  </div>
                ) : output ? (
                  output
                ) : (
                  <span className="text-white/30">Запустите код, чтобы увидеть результат</span>
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Кнопки управления */}
        <div className={styles.controls}>
          {!readOnly && (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors text-sm font-medium"
              >
                <i className="fas fa-save mr-2"></i>
                {isMobile ? '' : 'Сохранить'}
              </button>
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg ${
                  isRunning
                    ? 'bg-white/10 text-white/50'
                    : 'bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white hover:from-[#5A26E0] hover:to-[#1A9BCA]'
                } transition-colors text-sm font-medium`}
              >
                <i className={`fas ${isRunning ? 'fa-spinner fa-spin' : 'fa-play'} mr-2`}></i>
                {isMobile ? '' : 'Запустить'}
              </button>
            </>
          )}
        </div>
      </div>
    </Glassmorphism>
  );
}