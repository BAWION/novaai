import React, { useState } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Code,
  Settings,
  Bot,
  FileText,
  Image,
  Database,
  Zap
} from "lucide-react";

// Типы элементов для No-Code конструктора
export enum NoCodeElementType {
  TEXT = "text",
  IMAGE = "image",
  BUTTON = "button",
  INPUT = "input",
  API_CALL = "api_call",
  CONDITION = "condition",
  MODEL_CALL = "model_call" // Вызов AI-модели
}

// Структура элемента для No-Code конструктора
export interface NoCodeElement {
  id: string;
  type: NoCodeElementType;
  properties: Record<string, any>;
  children?: NoCodeElement[];
}

interface SimulatorToolboxProps {
  initialState?: NoCodeElement[];
  onChange?: (elements: NoCodeElement[]) => void;
  readOnly?: boolean;
  toolType: 'no-code-builder' | 'prompt-template' | 'flow-diagram';
}

/**
 * Компонент панели инструментов No-Code симулятора
 * 
 * Предоставляет интерфейс для создания:
 * - No-Code приложений
 * - Шаблонов промптов
 * - Диаграмм потоков данных
 */
export const SimulatorToolbox: React.FC<SimulatorToolboxProps> = ({
  initialState = [],
  onChange,
  readOnly = false,
  toolType = 'no-code-builder'
}) => {
  const [elements, setElements] = useState<NoCodeElement[]>(initialState);
  const [activeTab, setActiveTab] = useState('components');
  
  // Генерация уникального ID
  const generateId = () => `elem_${Math.random().toString(36).substr(2, 9)}`;
  
  // Добавление нового элемента
  const addElement = (type: NoCodeElementType) => {
    const newElement: NoCodeElement = {
      id: generateId(),
      type,
      properties: getDefaultPropertiesForType(type)
    };
    
    const updatedElements = [...elements, newElement];
    setElements(updatedElements);
    
    if (onChange) {
      onChange(updatedElements);
    }
  };
  
  // Получение дефолтных свойств для типа элемента
  const getDefaultPropertiesForType = (type: NoCodeElementType): Record<string, any> => {
    switch (type) {
      case NoCodeElementType.TEXT:
        return { text: 'Текстовый элемент', fontSize: 16, color: '#FFFFFF' };
      case NoCodeElementType.BUTTON:
        return { label: 'Кнопка', action: '', style: 'primary' };
      case NoCodeElementType.INPUT:
        return { placeholder: 'Введите значение...', name: 'input', required: false };
      case NoCodeElementType.API_CALL:
        return { endpoint: 'https://api.example.com', method: 'GET', headers: {}, body: '' };
      case NoCodeElementType.MODEL_CALL:
        return { model: 'gpt-4o', prompt: 'Опишите...', temperature: 0.7, maxTokens: 100 };
      case NoCodeElementType.IMAGE:
        return { src: 'https://via.placeholder.com/150', alt: 'Изображение', width: 150, height: 150 };
      case NoCodeElementType.CONDITION:
        return { condition: 'value === true', thenAction: '', elseAction: '' };
      default:
        return {};
    }
  };
  
  // Удаление элемента
  const removeElement = (id: string) => {
    const updatedElements = elements.filter(element => element.id !== id);
    setElements(updatedElements);
    
    if (onChange) {
      onChange(updatedElements);
    }
  };
  
  // Обновление свойств элемента
  const updateElementProperty = (id: string, property: string, value: any) => {
    const updatedElements = elements.map(element => {
      if (element.id === id) {
        return {
          ...element,
          properties: {
            ...element.properties,
            [property]: value
          }
        };
      }
      return element;
    });
    
    setElements(updatedElements);
    
    if (onChange) {
      onChange(updatedElements);
    }
  };
  
  // Перемещение элемента
  const moveElement = (id: string, direction: 'up' | 'down') => {
    const index = elements.findIndex(element => element.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === elements.length - 1)
    ) {
      return;
    }
    
    const updatedElements = [...elements];
    const element = updatedElements[index];
    
    if (direction === 'up') {
      updatedElements[index] = updatedElements[index - 1];
      updatedElements[index - 1] = element;
    } else {
      updatedElements[index] = updatedElements[index + 1];
      updatedElements[index + 1] = element;
    }
    
    setElements(updatedElements);
    
    if (onChange) {
      onChange(updatedElements);
    }
  };
  
  // Отображение элементов интерфейса
  const renderElements = () => {
    return elements.map((element, index) => (
      <motion.div
        key={element.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-space-800/50 border border-space-700 rounded-lg p-4 mb-3"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            {getIconForElementType(element.type)}
            <span className="font-medium text-white/90">
              {getElementTypeName(element.type)}
            </span>
          </div>
          
          {!readOnly && (
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => moveElement(element.id, 'up')}
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => moveElement(element.id, 'down')}
                disabled={index === elements.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={() => removeElement(element.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        {renderElementProperties(element)}
      </motion.div>
    ));
  };
  
  // Отображение свойств элемента
  const renderElementProperties = (element: NoCodeElement) => {
    switch (element.type) {
      case NoCodeElementType.TEXT:
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-white/60">Текст</Label>
              <Textarea
                value={element.properties.text}
                onChange={(e) => updateElementProperty(element.id, 'text', e.target.value)}
                placeholder="Введите текст"
                className="mt-1"
                disabled={readOnly}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-white/60">Размер шрифта</Label>
                <Input
                  type="number"
                  value={element.properties.fontSize}
                  onChange={(e) => updateElementProperty(element.id, 'fontSize', Number(e.target.value))}
                  className="mt-1"
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label className="text-xs text-white/60">Цвет</Label>
                <div className="flex mt-1">
                  <Input
                    type="color"
                    value={element.properties.color}
                    onChange={(e) => updateElementProperty(element.id, 'color', e.target.value)}
                    className="w-10 h-8 p-0 mr-2"
                    disabled={readOnly}
                  />
                  <Input
                    type="text"
                    value={element.properties.color}
                    onChange={(e) => updateElementProperty(element.id, 'color', e.target.value)}
                    className="flex-1"
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case NoCodeElementType.BUTTON:
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-white/60">Надпись</Label>
              <Input
                value={element.properties.label}
                onChange={(e) => updateElementProperty(element.id, 'label', e.target.value)}
                placeholder="Текст кнопки"
                className="mt-1"
                disabled={readOnly}
              />
            </div>
            <div>
              <Label className="text-xs text-white/60">Действие</Label>
              <Textarea
                value={element.properties.action}
                onChange={(e) => updateElementProperty(element.id, 'action', e.target.value)}
                placeholder="Код действия"
                className="mt-1 font-mono text-xs"
                disabled={readOnly}
              />
            </div>
            <div>
              <Label className="text-xs text-white/60">Стиль</Label>
              <select
                value={element.properties.style}
                onChange={(e) => updateElementProperty(element.id, 'style', e.target.value)}
                className="w-full mt-1 p-2 bg-space-800/80 border border-space-700 rounded text-white"
                disabled={readOnly}
              >
                <option value="primary">Основной</option>
                <option value="secondary">Второстепенный</option>
                <option value="outline">Контурный</option>
                <option value="ghost">Призрачный</option>
              </select>
            </div>
          </div>
        );
        
      case NoCodeElementType.MODEL_CALL:
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-white/60">Модель</Label>
              <select
                value={element.properties.model}
                onChange={(e) => updateElementProperty(element.id, 'model', e.target.value)}
                className="w-full mt-1 p-2 bg-space-800/80 border border-space-700 rounded text-white"
                disabled={readOnly}
              >
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="llama-3.1-70b">Llama 3.1 (70B)</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-haiku">Claude 3 Haiku</option>
              </select>
            </div>
            <div>
              <Label className="text-xs text-white/60">Промпт</Label>
              <Textarea
                value={element.properties.prompt}
                onChange={(e) => updateElementProperty(element.id, 'prompt', e.target.value)}
                placeholder="Напишите промпт..."
                className="mt-1 min-h-[80px]"
                disabled={readOnly}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-white/60">Температура</Label>
                <Input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={element.properties.temperature}
                  onChange={(e) => updateElementProperty(element.id, 'temperature', Number(e.target.value))}
                  className="mt-1"
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label className="text-xs text-white/60">Максимум токенов</Label>
                <Input
                  type="number"
                  min="1"
                  max="4000"
                  value={element.properties.maxTokens}
                  onChange={(e) => updateElementProperty(element.id, 'maxTokens', Number(e.target.value))}
                  className="mt-1"
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>
        );
        
      // Заглушки для остальных типов, в реальном проекте здесь будут соответствующие компоненты
      default:
        return (
          <div className="p-2 border border-dashed border-space-600 rounded text-center">
            <p className="text-sm text-white/60">
              Редактор для этого типа элемента находится в разработке
            </p>
          </div>
        );
    }
  };
  
  // Получение имени типа элемента
  const getElementTypeName = (type: NoCodeElementType): string => {
    switch (type) {
      case NoCodeElementType.TEXT:
        return "Текст";
      case NoCodeElementType.BUTTON:
        return "Кнопка";
      case NoCodeElementType.INPUT:
        return "Поле ввода";
      case NoCodeElementType.API_CALL:
        return "API запрос";
      case NoCodeElementType.MODEL_CALL:
        return "Вызов AI модели";
      case NoCodeElementType.IMAGE:
        return "Изображение";
      case NoCodeElementType.CONDITION:
        return "Условие";
      default:
        return "Неизвестный элемент";
    }
  };
  
  // Получение иконки для типа элемента
  const getIconForElementType = (type: NoCodeElementType) => {
    switch (type) {
      case NoCodeElementType.TEXT:
        return <FileText className="w-4 h-4 text-blue-400" />;
      case NoCodeElementType.BUTTON:
        return <Zap className="w-4 h-4 text-amber-400" />;
      case NoCodeElementType.INPUT:
        return <Input className="w-4 h-4 text-purple-400" />;
      case NoCodeElementType.API_CALL:
        return <Database className="w-4 h-4 text-green-400" />;
      case NoCodeElementType.MODEL_CALL:
        return <Bot className="w-4 h-4 text-teal-400" />;
      case NoCodeElementType.IMAGE:
        return <Image className="w-4 h-4 text-pink-400" />;
      case NoCodeElementType.CONDITION:
        return <Code className="w-4 h-4 text-orange-400" />;
      default:
        return <Settings className="w-4 h-4 text-gray-400" />;
    }
  };
  
  // Отображение структуры в формате кода
  const getCodePreview = () => {
    return JSON.stringify(elements, null, 2);
  };
  
  // Предпросмотр получаемого интерфейса
  const renderPreview = () => {
    return (
      <div className="p-4 border border-dashed border-space-600 rounded-lg">
        <div className="text-center text-white/60">
          <p>Предпросмотр интерфейса находится в разработке</p>
          <div className="mt-2 text-xs text-white/40">
            Здесь будет отображаться результат построения вашего приложения
          </div>
        </div>
      </div>
    );
  };
  
  // Отображение компонентов для prompt-template
  const renderPromptTemplate = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-white/80">Шаблон промпта</Label>
          <Textarea
            className="mt-2 min-h-[150px] font-mono"
            placeholder="Создайте шаблон промпта с переменными в формате {переменная}"
            value={elements.length > 0 ? elements[0].properties.text : ""}
            onChange={(e) => {
              if (elements.length === 0) {
                // Создаем новый элемент, если его нет
                const newElement: NoCodeElement = {
                  id: generateId(),
                  type: NoCodeElementType.TEXT,
                  properties: { text: e.target.value }
                };
                setElements([newElement]);
                if (onChange) onChange([newElement]);
              } else {
                // Обновляем существующий
                updateElementProperty(elements[0].id, 'text', e.target.value);
              }
            }}
            disabled={readOnly}
          />
        </div>
        
        <div>
          <Label className="text-white/80">Переменные</Label>
          <div className="mt-2 p-3 bg-space-800/50 border border-space-700 rounded-lg">
            <p className="text-sm text-white/60 mb-2">
              Извлеченные переменные из шаблона:
            </p>
            <div className="flex flex-wrap gap-2">
              {extractVariables(elements.length > 0 ? elements[0].properties.text : "").map((variable, index) => (
                <div key={index} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                  {variable}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Извлечение переменных из шаблона промпта
  const extractVariables = (template: string): string[] => {
    if (!template) return [];
    const matches = template.match(/{([^{}]+)}/g) || [];
    return matches.map(match => match.slice(1, -1));
  };
  
  // Основной рендер компонента
  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full mb-6">
          {toolType === 'no-code-builder' && (
            <>
              <TabsTrigger value="components">Компоненты</TabsTrigger>
              <TabsTrigger value="preview">Предпросмотр</TabsTrigger>
              <TabsTrigger value="code">Код</TabsTrigger>
            </>
          )}
          
          {toolType === 'prompt-template' && (
            <>
              <TabsTrigger value="template">Шаблон</TabsTrigger>
              <TabsTrigger value="test">Тестирование</TabsTrigger>
            </>
          )}
          
          {toolType === 'flow-diagram' && (
            <>
              <TabsTrigger value="diagram">Диаграмма</TabsTrigger>
              <TabsTrigger value="logic">Логика</TabsTrigger>
            </>
          )}
        </TabsList>
        
        {toolType === 'no-code-builder' && (
          <>
            <TabsContent value="components" className="space-y-4">
              {!readOnly && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addElement(NoCodeElementType.TEXT)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    Текст
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addElement(NoCodeElementType.BUTTON)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <Zap className="h-3.5 w-3.5 mr-1" />
                    Кнопка
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addElement(NoCodeElementType.MODEL_CALL)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <Bot className="h-3.5 w-3.5 mr-1" />
                    AI модель
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addElement(NoCodeElementType.API_CALL)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <Database className="h-3.5 w-3.5 mr-1" />
                    API запрос
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                {elements.length === 0 ? (
                  <div className="p-8 border border-dashed border-space-600 rounded-lg text-center">
                    <p className="text-white/60 mb-3">Добавьте компоненты для создания приложения</p>
                    {!readOnly && (
                      <Button 
                        variant="outline" 
                        onClick={() => addElement(NoCodeElementType.TEXT)}
                        className="flex items-center gap-1 mx-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Добавить компонент
                      </Button>
                    )}
                  </div>
                ) : (
                  renderElements()
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              {renderPreview()}
            </TabsContent>
            
            <TabsContent value="code">
              <Textarea
                value={getCodePreview()}
                readOnly
                className="w-full h-[400px] font-mono text-xs bg-space-900 p-4"
              />
            </TabsContent>
          </>
        )}
        
        {toolType === 'prompt-template' && (
          <>
            <TabsContent value="template">
              {renderPromptTemplate()}
            </TabsContent>
            
            <TabsContent value="test">
              <div className="p-4 border border-dashed border-space-600 rounded-lg text-center">
                <p className="text-white/60">
                  Инструмент тестирования шаблонов находится в разработке
                </p>
              </div>
            </TabsContent>
          </>
        )}
        
        {toolType === 'flow-diagram' && (
          <>
            <TabsContent value="diagram">
              <div className="p-4 border border-dashed border-space-600 rounded-lg text-center">
                <p className="text-white/60">
                  Редактор диаграмм находится в разработке
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="logic">
              <div className="p-4 border border-dashed border-space-600 rounded-lg text-center">
                <p className="text-white/60">
                  Редактор логики находится в разработке
                </p>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};