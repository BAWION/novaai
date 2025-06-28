/**
 * Рабочий единый сервер NovaAI University
 * Объединяет API и статические файлы на порту 5000
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const app = express();
const PORT = 5000;

// Простое хранилище пользователей
const users = new Map();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Настройка сессий
app.use(session({
  secret: 'novaai-secret-key',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000 // 24 часа
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 часа
  }
}));

// CORS
app.use((req, res, next) => {
  const origin = req.headers.origin || `${req.protocol}://${req.get('host')}`;
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  next();
});

// API Routes

// Регистрация
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }
    
    if (users.has(email)) {
      return res.status(400).json({ error: 'Пользователь уже существует' });
    }
    
    const user = {
      id: Date.now(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      createdAt: new Date().toISOString()
    };
    
    users.set(user.email, user);
    
    // Сохраняем в сессию
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    
    console.log(`[AUTH] Регистрация: ${user.email} (ID: ${user.id})`);
    
    res.json({
      success: true,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('[AUTH] Ошибка регистрации:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Вход
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }
    
    const userEmail = email.trim().toLowerCase();
    const user = users.get(userEmail);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    
    // Сохраняем в сессию
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    
    console.log(`[AUTH] Вход: ${user.email} (ID: ${user.id})`);
    
    res.json({
      success: true,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('[AUTH] Ошибка входа:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Проверка авторизации
app.get('/api/auth/me', (req, res) => {
  try {
    if (!req.session.userId || !req.session.userEmail) {
      return res.status(401).json({ error: 'Не авторизован' });
    }
    
    const user = users.get(req.session.userEmail);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    
    res.json({
      success: true,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('[AUTH] Ошибка проверки:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Выход
app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('[AUTH] Ошибка выхода:', err);
      return res.status(500).json({ error: 'Ошибка выхода' });
    }
    res.json({ success: true, message: 'Выход выполнен' });
  });
});

// Курсы
app.get('/api/courses', (req, res) => {
  res.json({
    success: true,
    courses: [
      {
        id: 1,
        title: "AI Literacy 101",
        description: "Основы искусственного интеллекта для начинающих",
        duration: "120 минут",
        modules: 8,
        lessons: 15
      },
      {
        id: 2,
        title: "Python Basics",
        description: "Изучение основ программирования на Python",
        duration: "240 минут",
        modules: 6,
        lessons: 12
      },
      {
        id: 3,
        title: "Skills DNA Navigator",
        description: "Система персонализированного обучения",
        duration: "60 минут",
        modules: 3,
        lessons: 7
      }
    ]
  });
});

// Статические файлы из dist
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback для SPA
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send(`
      <html>
        <body style="font-family: system-ui; padding: 40px; text-align: center;">
          <h1>🚧 NovaAI University</h1>
          <p>Приложение собирается... Попробуйте через минуту.</p>
          <p><a href="/">Обновить страницу</a></p>
        </body>
      </html>
    `);
  }
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 NovaAI University Server запущен!`);
  console.log(`📍 Адрес: http://0.0.0.0:${PORT}`);
  console.log(`✅ API готов к работе`);
  console.log(`📊 Пользователей: ${users.size}`);
  console.log(`\n📋 Доступные эндпоинты:`);
  console.log(`   POST /api/auth/register`);
  console.log(`   POST /api/auth/login`); 
  console.log(`   GET  /api/auth/me`);
  console.log(`   POST /api/auth/logout`);
  console.log(`   GET  /api/courses`);
  console.log(`\n⚡ Сервер готов принимать запросы!\n`);
});