/**
 * Стабильный единый сервер NovaAI University с надежной авторизацией
 * Работает параллельно с Vite на порту 5000
 */

const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const cors = require('cors');

const app = express();
const PORT = 5000;

// Хранилище пользователей
const users = new Map([
  ['admin@novaai.com', {
    id: 1,
    username: 'Admin',
    email: 'admin@novaai.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
  }],
  ['demo@novaai.com', {
    id: 2,
    username: 'Demo User',
    email: 'demo@novaai.com',
    password: 'demo123',
    role: 'student',
    createdAt: new Date().toISOString()
  }]
]);

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS настройка для работы с Vite на 5173
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    /\.replit\.dev$/,
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Настройка сессий
app.use(session({
  secret: 'novaai-university-secret-2025',
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
    checkPeriod: 86400000
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
    sameSite: 'lax'
  }
}));

// Логирование запросов
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    users: users.size,
    message: 'NovaAI University API Server running'
  });
});

// Регистрация
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log(`[AUTH] Попытка регистрации: ${email}`);
    
    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Все поля обязательны для заполнения' 
      });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    
    if (users.has(normalizedEmail)) {
      return res.status(400).json({ 
        success: false,
        error: 'Пользователь с таким email уже зарегистрирован' 
      });
    }
    
    const user = {
      id: Date.now(),
      username: username.trim(),
      email: normalizedEmail,
      password: password.trim(),
      role: 'student',
      createdAt: new Date().toISOString()
    };
    
    users.set(normalizedEmail, user);
    
    // Создаем сессию
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.username = user.username;
    
    console.log(`[AUTH] Успешная регистрация: ${user.email} (ID: ${user.id})`);
    
    res.json({
      success: true,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role
      },
      message: 'Регистрация успешно завершена'
    });
  } catch (error) {
    console.error('[AUTH] Ошибка регистрации:', error);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Вход в систему
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`[AUTH] Попытка входа: ${email}`);
    
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ 
        success: false,
        error: 'Email и пароль обязательны' 
      });
    }
    
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.get(normalizedEmail);
    
    if (!user || user.password !== password.trim()) {
      console.log(`[AUTH] Неудачная попытка входа: ${normalizedEmail}`);
      return res.status(401).json({ 
        success: false,
        error: 'Неверный email или пароль' 
      });
    }
    
    // Создаем сессию
    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.username = user.username;
    
    console.log(`[AUTH] Успешный вход: ${user.email} (ID: ${user.id})`);
    
    res.json({
      success: true,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role
      },
      message: 'Вход выполнен успешно'
    });
  } catch (error) {
    console.error('[AUTH] Ошибка входа:', error);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Проверка авторизации
app.get('/api/auth/me', (req, res) => {
  try {
    console.log(`[AUTH] Проверка сессии: ${req.session.userEmail || 'нет сессии'}`);
    
    if (!req.session.userId || !req.session.userEmail) {
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не авторизован' 
      });
    }
    
    const user = users.get(req.session.userEmail);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ 
        success: false,
        error: 'Пользователь не найден в системе' 
      });
    }
    
    res.json({
      success: true,
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('[AUTH] Ошибка проверки:', error);
    res.status(500).json({ 
      success: false,
      error: 'Внутренняя ошибка сервера' 
    });
  }
});

// Выход из системы
app.post('/api/auth/logout', (req, res) => {
  const userEmail = req.session.userEmail;
  req.session.destroy((err) => {
    if (err) {
      console.error('[AUTH] Ошибка выхода:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Ошибка при выходе из системы' 
      });
    }
    console.log(`[AUTH] Выход: ${userEmail}`);
    res.json({ 
      success: true, 
      message: 'Выход выполнен успешно' 
    });
  });
});

// Курсы (демо данные)
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
        lessons: 15,
        category: "AI"
      },
      {
        id: 2,
        title: "Python Basics",
        description: "Изучение основ программирования на Python",
        duration: "240 минут",
        modules: 6,
        lessons: 12,
        category: "Programming"
      },
      {
        id: 3,
        title: "Skills DNA Navigator",
        description: "Система персонализированного обучения с ИИ",
        duration: "60 минут",
        modules: 3,
        lessons: 7,
        category: "Skills"
      }
    ]
  });
});

// Обработка несуществующих API маршрутов
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API endpoint не найден: ${req.path}`
  });
});

// Запуск сервера
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 NovaAI University API Server запущен!`);
  console.log(`📍 Адрес: http://0.0.0.0:${PORT}`);
  console.log(`✅ CORS настроен для Vite (порт 5173)`);
  console.log(`📊 Предустановленных пользователей: ${users.size}`);
  console.log(`\n📋 API Endpoints:`);
  console.log(`   GET  /api/health - Проверка состояния`);
  console.log(`   POST /api/auth/register - Регистрация`);
  console.log(`   POST /api/auth/login - Вход в систему`); 
  console.log(`   GET  /api/auth/me - Проверка авторизации`);
  console.log(`   POST /api/auth/logout - Выход`);
  console.log(`   GET  /api/courses - Список курсов`);
  console.log(`\n🎯 Тестовые аккаунты:`);
  console.log(`   admin@novaai.com / admin123 (админ)`);
  console.log(`   demo@novaai.com / demo123 (студент)`);
  console.log(`\n⚡ API готов к работе!\n`);
});

// Обработка ошибок
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Порт ${PORT} уже используется`);
    process.exit(1);
  } else {
    console.error('❌ Ошибка сервера:', err);
    process.exit(1);
  }
});

// Корректное завершение работы
process.on('SIGTERM', () => {
  console.log('\n⏹️ Получен сигнал SIGTERM, завершение работы...');
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⏹️ Получен сигнал SIGINT, завершение работы...');
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });
});