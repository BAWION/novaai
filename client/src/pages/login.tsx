import React from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { ParticlesBackground } from "@/components/particles-background";
import { useAuth } from "@/context/auth-context";

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useAuth();

  const handleTelegramLogin = () => {
    // For demo purposes, simulate Telegram login
    login({ id: 1, username: "anna", displayName: "Анна" });
    navigate("/onboarding");
  };

  const handleStartJourney = () => {
    navigate("/onboarding");
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <ParticlesBackground />

      <section className="container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center mt-16">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]"
          >
            NovaAI University
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Полностью автоматизированная платформа, где искусственный интеллект проектирует, обновляет и персонализирует ваше обучение
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Glassmorphism className="rounded-2xl p-6 md:p-8 w-full max-w-md relative overflow-hidden border-white/10" borderGradient>
            <div className="text-center mb-6">
              <h2 className="font-orbitron text-2xl font-semibold">
                Добро пожаловать
              </h2>
              <p className="text-white/60 mt-1">Начните свой путь в мир ИИ</p>
            </div>

            <div className="mb-6">
              <button
                onClick={handleTelegramLogin}
                className="w-full bg-[#0088cc] hover:bg-[#0099dd] text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-300"
              >
                <i className="fab fa-telegram mr-3 text-xl"></i>
                Войти через Telegram
              </button>
            </div>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-white/10"></div>
              <span className="px-3 text-white/50 text-sm">или</span>
              <div className="flex-grow h-px bg-white/10"></div>
            </div>

            <button
              onClick={handleStartJourney}
              className="w-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center"
            >
              <span>Начать знакомство</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </button>

            <div className="mt-6 text-center text-white/50 text-sm">
              Создавая аккаунт, вы соглашаетесь с{" "}
              <Link href="/terms">
                <a className="text-[#B28DFF] hover:text-primary-200">
                  условиями использования
                </a>
              </Link>
            </div>
          </Glassmorphism>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Glassmorphism className="p-4 rounded-xl flex items-center max-w-[280px]">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#6E3AFF]/20 to-[#6E3AFF]/10 text-[#B28DFF]">
              <i className="fas fa-robot text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="font-medium">ИИ-онбординг</h3>
              <p className="text-white/60 text-sm">Персональный план обучения</p>
            </div>
          </Glassmorphism>

          <Glassmorphism className="p-4 rounded-xl flex items-center max-w-[280px]">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2EBAE1]/20 to-[#2EBAE1]/10 text-[#8BE0F7]">
              <i className="fas fa-graduation-cap text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="font-medium">Адаптивные треки</h3>
              <p className="text-white/60 text-sm">Учитывают ваш уровень</p>
            </div>
          </Glassmorphism>

          <Glassmorphism className="p-4 rounded-xl flex items-center max-w-[280px]">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF3A8C]/20 to-[#FF3A8C]/10 text-[#FF3A8C]">
              <i className="fas fa-certificate text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="font-medium">NFT-сертификаты</h3>
              <p className="text-white/60 text-sm">Подтверждение навыков</p>
            </div>
          </Glassmorphism>
        </motion.div>
      </section>
    </div>
  );
}
