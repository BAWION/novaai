/**
 * Простой единый сервер для NovaAI University
 * Объединяет API и фронтенд на одном порту 5000
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Простое хранилище пользователей в памяти
const users = new Map();
const sessions = new Map();

// Middleware
app.use(express.json());
app.use(express.static('dist'));

// CORS для всех запросов
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  next();
});

// API Routes

// Регистрация
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }
  
  if (users.has(email)) {
    return res.status(400).json({ error: 'Пользователь уже существует' });
  }
  
  const user = {
    id: Date.now(),
    username,
    email,
    password, // В реальном приложении нужно хешировать
    createdAt: new Date().toISOString()
  };
  
  users.set(email, user);
  
  // Создаем сессию
  const sessionId = Math.random().toString(36).substring(7);
  sessions.set(sessionId, { userId: user.id, email });
  
  console.log(`[AUTH] Регистрация пользователя: ${email}`);
  
  res.json({
    success: true,
    user: { id: user.id, username, email },
    sessionId
  });
});

// Вход
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email и пароль обязательны' });
  }
  
  const user = users.get(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Неверный email или пароль' });
  }
  
  // Создаем сессию
  const sessionId = Math.random().toString(36).substring(7);
  sessions.set(sessionId, { userId: user.id, email });
  
  console.log(`[AUTH] Вход пользователя: ${email}`);
  
  res.json({
    success: true,
    user: { id: user.id, username: user.username, email },
    sessionId
  });
});

// Проверка аутентификации
app.get('/api/auth/me', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  
  const session = sessions.get(sessionId);
  const user = users.get(session.email);
  
  if (!user) {
    return res.status(401).json({ error: 'Пользователь не найден' });
  }
  
  res.json({
    success: true,
    user: { id: user.id, username: user.username, email: user.email }
  });
});

// Простой эндпоинт для курсов
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    courses: [
      {
        id: 1,
        title: "AI Literacy 101",
        description: "Основы искусственного интеллекта",
        duration: "120 минут"
      },
      {
        id: 2, 
        title: "Python Basics",
        description: "Основы программирования на Python",
        duration: "180 минут"
      }
    ]
  });
});

// Обслуживание фронтенда
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not built. Run: npm run build');
  }
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 NovaAI University запущен!`);
  console.log(`📍 Локально: http://localhost:${PORT}`);
  console.log(`🌐 Сеть: http://0.0.0.0:${PORT}`);
  console.log(`\n✅ API эндпоинты:`);
  console.log(`   POST /api/auth/register - Регистрация`);
  console.log(`   POST /api/auth/login - Вход`);
  console.log(`   GET /api/auth/me - Профиль`);
  console.log(`   GET /api/courses - Курсы`);
  console.log(`\n📦 Пользователи: ${users.size}, Сессии: ${sessions.size}\n`);
});