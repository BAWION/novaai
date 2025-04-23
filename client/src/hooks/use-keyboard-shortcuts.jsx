import { useEffect, useState } from "react";
import React from "react";

/**
 * Хук для управления клавиатурными сокращениями
 * @param {Array} shortcuts - Массив объектов с сокращениями
 * @param {Object} options - Опции
 * @returns {Object} Объект с состоянием и методами управления подсказками
 */
export function useKeyboardShortcuts(shortcuts, options = {}) {
  const { isEnabled = true, overrideSystem = false } = options;
  const [helpVisible, setHelpVisible] = useState(false);
  
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e) => {
      // Если активный элемент - input, textarea или contentEditable, не обрабатываем горячие клавиши
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      // Показ/скрытие подсказок клавиш
      if (e.key === "?" && !e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setHelpVisible(!helpVisible);
        return;
      }
      
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrlKey = false,
          altKey = false,
          shiftKey = false,
          metaKey = false,
          handler
        } = shortcut;
        
        if (
          e.key.toLowerCase() === key.toLowerCase() &&
          e.ctrlKey === ctrlKey &&
          e.altKey === altKey &&
          e.shiftKey === shiftKey &&
          e.metaKey === metaKey
        ) {
          if (overrideSystem || !ctrlKey || (ctrlKey && !overrideSystem)) {
            e.preventDefault();
            handler(e);
            return;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, isEnabled, overrideSystem, helpVisible]);

  // Группировка сочетаний клавиш по группам для вывода в помощи
  const groupedShortcuts = () => {
    const groups = {};
    
    shortcuts.forEach((shortcut) => {
      const group = shortcut.group || "Общие";
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(shortcut);
    });
    
    return Object.entries(groups).map(([group, shortcuts]) => ({
      group,
      shortcuts
    }));
  };

  // Форматирование сочетания клавиш для отображения
  const formatShortcut = (shortcut) => {
    const parts = [];
    
    if (shortcut.ctrlKey) parts.push("Ctrl");
    if (shortcut.altKey) parts.push("Alt");
    if (shortcut.shiftKey) parts.push("Shift");
    if (shortcut.metaKey) parts.push("Meta");
    
    parts.push(shortcut.key.toUpperCase());
    
    return parts.join(" + ");
  };

  // Компонент подсказки для клавиатурных сокращений
  const ShortcutsHelp = () => {
    if (!helpVisible) return null;
    
    return (
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={() => setHelpVisible(false)}
      >
        <div
          className="bg-space-800 border border-white/20 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Клавиатурные сокращения</h3>
            <button
              className="text-white/60 hover:text-white p-1"
              onClick={() => setHelpVisible(false)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="space-y-4">
            {groupedShortcuts().map((group) => (
              <div key={group.group}>
                <h4 className="font-medium text-primary mb-2">{group.group}</h4>
                <div className="space-y-2">
                  {group.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1 border-b border-white/10"
                    >
                      <span className="text-white/80">{shortcut.description}</span>
                      <kbd className="px-2 py-1 bg-space-700 rounded text-xs font-mono">
                        {formatShortcut(shortcut)}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="text-sm text-white/60 mt-4">
              Нажмите <kbd className="px-1 bg-space-700 rounded">?</kbd> чтобы закрыть это окно
            </div>
          </div>
        </div>
      </div>
    );
  };

  return {
    helpVisible,
    setHelpVisible,
    ShortcutsHelp
  };
}