import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Login() {
  const [location, navigate] = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    try {
      // Простая авторизация для демо
      if (credentials.username && credentials.password) {
        navigate("/dashboard");
      } else {
        setError("Введите логин и пароль");
      }
    } catch (err) {
      setError("Ошибка входа");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Вход в Galaxion</h1>
            <p className="text-blue-200">Добро пожаловать в космос знаний</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Логин
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Введите логин"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Пароль
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Введите пароль"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {isLoggingIn ? "Вход..." : "Войти"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/register">
              <a className="text-blue-300 hover:text-blue-200 text-sm">
                Нет аккаунта? Зарегистрироваться
              </a>
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link href="/">
              <a className="text-blue-300 hover:text-blue-200 text-sm">
                ← Вернуться на главную
              </a>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
