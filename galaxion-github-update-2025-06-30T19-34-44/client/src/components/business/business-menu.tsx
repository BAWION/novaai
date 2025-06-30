import React from 'react';
import { Link } from 'wouter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface BusinessMenuItem {
  label: string;
  path: string;
  icon: string;
  description?: string;
  isPro?: boolean;
}

const businessMenuItems: BusinessMenuItem[] = [
  {
    label: 'Overview',
    path: '/business',
    icon: 'fa-home',
    description: 'Обзор Business AI Module'
  },
  {
    label: 'Case Library',
    path: '/business/cases',
    icon: 'fa-file-alt',
    description: 'Каталог кейсов внедрения ИИ'
  },
  {
    label: 'AI Maturity Check',
    path: '/business/maturity-check',
    icon: 'fa-chart-line',
    description: 'Оценка готовности к внедрению ИИ'
  },
  {
    label: 'ROI Playground',
    path: '/business/roi',
    icon: 'fa-calculator',
    description: 'Калькулятор экономического эффекта',
    isPro: true
  },
  {
    label: 'Solution Wizard',
    path: '/business/wizard',
    icon: 'fa-magic',
    description: 'ИИ-консультант для подбора технологий'
  },
  {
    label: 'Pilot Sandbox',
    path: '/business/sandbox',
    icon: 'fa-rocket',
    description: 'Готовые PoC-решения',
    isPro: true
  }
];

interface BusinessMenuProps {
  className?: string;
}

export function BusinessMenu({ className = '' }: BusinessMenuProps) {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <i className="fas fa-briefcase"></i>
            <span>Business AI</span>
            <i className="fas fa-chevron-down text-xs ml-1"></i>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72">
          <DropdownMenuLabel>Business AI Module</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {businessMenuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <DropdownMenuItem className="cursor-pointer flex items-start gap-3 py-2">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 shrink-0">
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium">{item.label}</span>
                    {item.isPro && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/20">
                        PRO
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.description}
                    </p>
                  )}
                </div>
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}