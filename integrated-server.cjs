// Integrated server for NovaAI University - combines API and static serving
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy
app.set('trust proxy', 1);

// CORS configuration
app.use(cors({
  origin: [
    'https://novaai-academy.vercel.app',
    'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev',
    'http://localhost:5173',
    /\.replit\.dev$/,
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.get('user-agent')?.substring(0, 50) || 'unknown'}`);
  next();
});

// In-memory storage for users and sessions
const users = new Map();
const sessions = new Map();
let userCounter = 1;

// Utility functions
function generateToken() {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 12)}`;
}

function validateToken(token) {
  if (!token || !sessions.has(token)) return null;
  const session = sessions.get(token);
  const user = users.get(session.userId);
  if (!user) return null;
  
  // Update last access
  session.lastAccess = new Date().toISOString();
  return { user, session };
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'NovaAI University API',
    version: '2.1.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth/*',
      courses: '/api/courses',
      health: '/health'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    users: users.size,
    activeSessions: sessions.size,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
    }
  });
});

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log(`Registration attempt: ${username} <${email}>`);
    
    // Validation
    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны для заполнения'
      });
    }
    
    // Check existing user
    const existingUser = Array.from(users.values()).find(
      user => user.username.toLowerCase() === username.toLowerCase() || 
              user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Пользователь с такими данными уже существует'
      });
    }
    
    // Create user
    const userId = userCounter++;
    const user = {
      id: userId,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      lastLogin: null,
      isActive: true
    };
    
    users.set(userId, user);
    
    // Create session
    const token = generateToken();
    sessions.set(token, {
      userId,
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      userAgent: req.get('user-agent') || 'unknown'
    });
    
    console.log(`✓ User registered: ${username} (ID: ${userId})`);
    
    res.status(201).json({
      success: true,
      message: 'Регистрация успешно завершена',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      },
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при регистрации'
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(`Login attempt: ${username}`);
    
    // Validation
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Логин и пароль обязательны'
      });
    }
    
    // Find user
    const user = Array.from(users.values()).find(
      u => u.username.toLowerCase() === username.toLowerCase() || 
           u.email.toLowerCase() === username.toLowerCase()
    );
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверные учетные данные'
      });
    }
    
    // Update user
    user.lastLogin = new Date().toISOString();
    
    // Create session
    const token = generateToken();
    sessions.set(token, {
      userId: user.id,
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString(),
      userAgent: req.get('user-agent') || 'unknown'
    });
    
    console.log(`✓ User logged in: ${username} (ID: ${user.id})`);
    
    res.json({
      success: true,
      message: 'Вход выполнен успешно',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        lastLogin: user.lastLogin
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при входе'
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.headers['x-auth-token'] || 
                  req.query.token;
    
    const validation = validateToken(token);
    
    if (!validation) {
      return res.status(401).json({
        success: false,
        message: 'Токен недействителен или истек'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: validation.user.id,
        username: validation.user.username,
        email: validation.user.email,
        lastLogin: validation.user.lastLogin
      },
      session: {
        createdAt: validation.session.createdAt,
        lastAccess: validation.session.lastAccess
      }
    });
    
  } catch (error) {
    console.error('Auth validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка проверки авторизации'
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.body.token || 
                  req.query.token;
    
    if (token && sessions.has(token)) {
      sessions.delete(token);
      console.log(`✓ User logged out: token ${token.substring(0, 20)}...`);
    }
    
    res.json({
      success: true,
      message: 'Выход выполнен успешно'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при выходе'
    });
  }
});

// Courses API
app.get('/api/courses', (req, res) => {
  try {
    console.log('Courses API called');
    
    const courses = [
      {
        id: 1,
        title: 'AI Literacy 101',
        description: 'Основы искусственного интеллекта для современного мира',
        modules: 6,
        level: 'Beginner',
        duration: '4 недели',
        category: 'AI Fundamentals',
        status: 'active',
        enrolled: 1247
      },
      {
        id: 2,
        title: 'Python Basics',
        description: 'Изучение основ программирования на Python',
        modules: 8,
        level: 'Beginner',
        duration: '6 недель',
        category: 'Programming',
        status: 'active',
        enrolled: 892
      },
      {
        id: 3,
        title: 'Skills DNA Navigator',
        description: 'Диагностика и развитие профессиональных навыков',
        modules: 7,
        level: 'Intermediate',
        duration: '2 недели',
        category: 'Skills Assessment',
        status: 'active',
        enrolled: 634
      },
      {
        id: 4,
        title: 'No-Code AI',
        description: 'Создание AI-решений без программирования',
        modules: 8,
        level: 'Intermediate',
        duration: '5 недель',
        category: 'No-Code Development',
        status: 'active',
        enrolled: 456
      },
      {
        id: 5,
        title: 'Telegram Bots on Replit',
        description: 'Создание Telegram-ботов без кода на платформе Replit',
        modules: 5,
        level: 'Beginner',
        duration: '3 недели',
        category: 'Bot Development',
        status: 'active',
        enrolled: 289
      }
    ];
    
    res.json(courses);
    
  } catch (error) {
    console.error('Courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения курсов'
    });
  }
});

// Events logging
app.post('/api/events', (req, res) => {
  try {
    const { eventType, data, userId } = req.body;
    
    console.log(`Event: ${eventType}`, { userId, data: data ? JSON.stringify(data).substring(0, 100) : 'none' });
    
    res.status(201).json({
      id: Date.now(),
      eventType,
      timestamp: new Date().toISOString(),
      status: 'logged'
    });
    
  } catch (error) {
    console.error('Event logging error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка логирования события'
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Эндпоинт не найден',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(60));
  console.log('🚀 NovaAI University API Server RUNNING');
  console.log('='.repeat(60));
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 URL: https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev`);
  console.log(`🔐 Auth: Registration & Login Active`);
  console.log(`📚 Courses: API Endpoint Ready`);
  console.log(`🔄 CORS: Enabled for Vercel Frontend`);
  console.log(`⏰ Started: ${new Date().toISOString()}`);
  console.log('='.repeat(60));
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;