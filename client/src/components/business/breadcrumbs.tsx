import React from 'react';
import { Link, useLocation } from 'wouter';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BusinessBreadcrumbsProps {
  className?: string;
}

export function BusinessBreadcrumbs({ className = '' }: BusinessBreadcrumbsProps) {
  const [location] = useLocation();
  
  // Определим маппинг для генерации хлебных крошек на основе текущего пути
  const getItems = (): BreadcrumbItem[] => {
    // Базовый элемент для бизнес-раздела
    const baseItems: BreadcrumbItem[] = [
      { label: 'Business AI', path: '/business' },
    ];
    
    // Формируем дополнительные элементы в зависимости от текущего пути
    if (location === '/business') {
      return baseItems;
    }
    
    if (location === '/business/cases') {
      return [
        ...baseItems,
        { label: 'Case Library', path: '/business/cases' }
      ];
    }
    
    if (location.startsWith('/business/cases/')) {
      const caseId = location.split('/').pop() || '';
      return [
        ...baseItems,
        { label: 'Case Library', path: '/business/cases' },
        { label: 'Кейс #' + caseId, path: location }
      ];
    }
    
    if (location === '/business/maturity-check') {
      return [
        ...baseItems,
        { label: 'AI Maturity Check', path: '/business/maturity-check' }
      ];
    }
    
    if (location === '/business/roi') {
      return [
        ...baseItems,
        { label: 'ROI Playground', path: '/business/roi' }
      ];
    }
    
    if (location === '/business/wizard') {
      return [
        ...baseItems,
        { label: 'Solution Wizard', path: '/business/wizard' }
      ];
    }
    
    if (location === '/business/sandbox') {
      return [
        ...baseItems,
        { label: 'Pilot Sandbox', path: '/business/sandbox' }
      ];
    }
    
    // Если путь не распознан, возвращаем только базовый элемент
    return baseItems;
  };
  
  const items = getItems();
  
  return (
    <div className={`flex items-center text-sm space-x-2 ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <span className="text-white/30 mx-1">
              <i className="fas fa-chevron-right text-xs"></i>
            </span>
          )}
          
          {index === items.length - 1 ? (
            // Последний элемент (текущая страница)
            <span className="text-white/90">{item.label}</span>
          ) : (
            // Предыдущие элементы с ссылками
            <Link href={item.path}>
              <a className="text-blue-400 hover:text-blue-300 transition-colors">
                {item.label}
              </a>
            </Link>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}