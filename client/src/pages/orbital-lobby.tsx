import React from "react";
import { Link } from "wouter";

export default function OrbitalLobby() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">OrbitalLobby</h1>
        <p className="text-blue-200 mb-8">Страница orbital-lobby Galaxion</p>
        <div className="space-x-4">
          <Link href="/">
            <a className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
              На главную
            </a>
          </Link>
          <Link href="/login">
            <a className="bg-white/10 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-all duration-200 border border-white/20">
              Войти
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}