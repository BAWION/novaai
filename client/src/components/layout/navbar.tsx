import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useAuth } from "@/context/auth-context";
import { CourseDropdown } from "./course-dropdown";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Glassmorphism
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-2" : "py-3"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center shadow-[0_0_15px_rgba(110,58,255,0.5)]">
              <span className="font-orbitron font-bold text-lg">N</span>
            </div>
            <span className="ml-2 font-orbitron font-medium text-lg md:text-xl">
              NovaAI University
            </span>
          </a>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <CourseDropdown />
          <Link href="/community">
            <a className={`text-white/70 hover:text-white transition ${location === '/community' ? 'text-white' : ''}`}>
              Комьюнити
            </a>
          </Link>
          <Link href="/about">
            <a className={`text-white/70 hover:text-white transition ${location === '/about' ? 'text-white' : ''}`}>
              О проекте
            </a>
          </Link>
          
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="glassmorphism px-4 py-2 rounded-full text-[#B28DFF] hover:text-white border border-[#6E3AFF]/30 transition"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Выйти
            </button>
          ) : (
            <Link href="/login">
              <a className="glassmorphism px-4 py-2 rounded-full text-[#B28DFF] hover:text-white border border-[#6E3AFF]/30 transition">
                <i className="fab fa-telegram mr-2"></i>Войти
              </a>
            </Link>
          )}
        </div>

        <button 
          className="md:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas fa-${isMobileMenuOpen ? 'times' : 'bars'}`}></i>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden absolute top-full left-0 right-0 glassmorphism backdrop-blur-lg py-4 px-4 border-t border-white/10"
        >
          <div className="flex flex-col space-y-3">
            <div className="py-2">
              <div className="text-white/70 hover:text-white transition mb-2">
                Курсы:
              </div>
              <div className="ml-4 flex flex-col space-y-2">
                <Link href="/courses">
                  <a className="text-white/70 hover:text-white transition text-sm py-1">
                    <i className="fas fa-book mr-2"></i>Все курсы
                  </a>
                </Link>
                <Link href="/courses?category=python">
                  <a className="text-white/70 hover:text-white transition text-sm py-1">
                    <i className="fas fa-python mr-2"></i>Python-разработка
                  </a>
                </Link>
                <Link href="/courses?category=machine-learning">
                  <a className="text-white/70 hover:text-white transition text-sm py-1">
                    <i className="fas fa-brain mr-2"></i>Машинное обучение
                  </a>
                </Link>
                <Link href="/courses?category=deep-learning">
                  <a className="text-white/70 hover:text-white transition text-sm py-1">
                    <i className="fas fa-network-wired mr-2"></i>Глубокое обучение
                  </a>
                </Link>
                <Link href="/courses?category=business-ai">
                  <a className="text-white/70 hover:text-white transition text-sm py-1">
                    <i className="fas fa-briefcase mr-2"></i>Business AI Module
                  </a>
                </Link>
              </div>
            </div>
            <Link href="/community">
              <a className="text-white/70 hover:text-white transition py-2">
                Комьюнити
              </a>
            </Link>
            <Link href="/about">
              <a className="text-white/70 hover:text-white transition py-2">
                О проекте
              </a>
            </Link>
            
            <div className="pt-2">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="w-full glassmorphism py-2 px-4 rounded-full text-[#B28DFF] hover:text-white border border-[#6E3AFF]/30 transition"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>Выйти
                </button>
              ) : (
                <Link href="/login">
                  <a className="block w-full text-center glassmorphism py-2 px-4 rounded-full text-[#B28DFF] hover:text-white border border-[#6E3AFF]/30 transition">
                    <i className="fab fa-telegram mr-2"></i>Войти
                  </a>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </Glassmorphism>
  );
}
