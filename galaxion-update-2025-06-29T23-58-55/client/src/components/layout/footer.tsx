import React from "react";
import { Link } from "wouter";
import { Glassmorphism } from "@/components/ui/glassmorphism";

export function Footer() {
  return (
    <Glassmorphism className="mt-10 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center">
                <span className="font-orbitron font-bold text-sm">N</span>
              </div>
              <span className="ml-2 font-orbitron font-medium">NovaAI University</span>
            </div>
            <p className="text-white/60 text-sm mt-1">© 2023 NovaAI. Все права защищены.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4 md:mb-0">
            <div>
              <h4 className="font-medium mb-2">Платформа</h4>
              <ul className="space-y-1 text-sm text-white/60">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    О проекте
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-white transition">
                    Каталог курсов
                  </Link>
                </li>
                <li>
                  <Link href="/teachers" className="hover:text-white transition">
                    Преподаватели
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Ресурсы</h4>
              <ul className="space-y-1 text-sm text-white/60">
                <li>
                  <Link href="/blog" className="hover:text-white transition">
                    Блог
                  </Link>
                </li>
                <li>
                  <Link href="/tracks" className="hover:text-white transition">
                    Учебные треки
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Сообщество</h4>
              <ul className="space-y-1 text-sm text-white/60">
                <li>
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <Link href="/events">
                    <a className="hover:text-white transition">События</a>
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Правовое</h4>
              <ul className="space-y-1 text-sm text-white/60">
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Условия
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Конфиденциальность
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" className="hover:text-white transition">
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link href="/presentation-selector" className="hover:text-white transition font-medium text-purple-300">
                    Для инвесторов
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full glassmorphism flex items-center justify-center hover:border hover:border-[#6E3AFF]/50 transition-all"
            >
              <i className="fab fa-telegram-plane"></i>
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full glassmorphism flex items-center justify-center hover:border hover:border-[#6E3AFF]/50 transition-all"
            >
              <i className="fab fa-discord"></i>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full glassmorphism flex items-center justify-center hover:border hover:border-[#6E3AFF]/50 transition-all"
            >
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </Glassmorphism>
  );
}
