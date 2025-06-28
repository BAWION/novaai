// Working Express server for NovaAI University
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

// Trust proxy for correct headers
app.set('trust proxy', 1);

// CORS middleware
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

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Origin: ${req.get('origin') || 'none'}`);
  next();
});

// In-memory storage
const users = new Map();
const sessions = new Map();
let userCounter = 1;

// Helper functions
function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function validateSession(sessionId) {
  if (!sessionId || !sessions.has(sessionId)) {
    return null;
  }
  const session = sessions.get(sessionId);
  const user = users.get(session.userId);
  return user ? { user, session } : null;
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'NovaAI University API',
    version: '2.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login', '/api/auth/me'],
      courses: ['/api/courses'],
      health: ['/health']
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: users.size,
    sessions: sessions.size,
    memory: process.memoryUsage()
  });
});

// Authentication routes
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log(`Registration request: ${username}, ${email}`);
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны'
      });
    }
    
    // Check for existing user
    const existingUser = Array.from(users.values()).find(
      user => user.username === username || user.email === email
    );
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Пользователь уже существует'
      });
    }
    
    // Create new user
    const userId = userCounter++;
    const user = {
      id: userId,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    users.set(userId, user);
    
    // Create session
    const sessionId = generateSessionId();
    sessions.set(sessionId, {
      userId,
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString()
    });
    
    console.log(`User registered successfully: ${username} (ID: ${userId})`);
    
    res.json({
      success: true,
      message: 'Регистрация успешна',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: sessionId
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(`Login request: ${username}`);
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Логин и пароль обязательны'
      });
    }
    
    // Find user
    const user = Array.from(users.values()).find(
      u => u.username === username || u.email === username
    );
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Неверные учетные данные'
      });
    }
    
    // Update last login
    user.lastLogin = new Date().toISOString();
    
    // Create session
    const sessionId = generateSessionId();
    sessions.set(sessionId, {
      userId: user.id,
      createdAt: new Date().toISOString(),
      lastAccess: new Date().toISOString()
    });
    
    console.log(`User logged in successfully: ${username} (ID: ${user.id})`);
    
    res.json({
      success: true,
      message: 'Вход выполнен',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token: sessionId
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.headers['x-auth-token'] || 
                  req.query.token;
    
    const validation = validateSession(token);
    
    if (!validation) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован'
      });
    }
    
    // Update session access time
    validation.session.lastAccess = new Date().toISOString();
    
    res.json({
      success: true,
      user: {
        id: validation.user.id,
        username: validation.user.username,
        email: validation.user.email
      }
    });
    
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Courses endpoint
app.get('/api/courses', (req, res) => {
  try {
    console.log('Courses requested');
    
    const courses = [
      {
        id: 1,
        title: 'AI Literacy 101',
        description: 'Основы искусственного интеллекта',
        modules: 6,
        level: 'Beginner',
        duration: '4 недели',
        category: 'AI',
        status: 'active'
      },
      {
        id: 2,
        title: 'Python Basics',
        description: 'Основы программирования на Python',
        modules: 8,
        level: 'Beginner',
        duration: '6 недель',
        category: 'Programming',
        status: 'active'
      },
      {
        id: 3,
        title: 'Skills DNA Navigator',
        description: 'Диагностика и развитие навыков',
        modules: 7,
        level: 'Intermediate',
        duration: '2 недели',
        category: 'Assessment',
        status: 'active'
      },
      {
        id: 4,
        title: 'No-Code AI',
        description: 'Создание AI-решений без кода',
        modules: 8,
        level: 'Intermediate',
        duration: '5 недель',
        category: 'No-Code',
        status: 'active'
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
    const { eventType, data } = req.body;
    
    console.log(`Event logged: ${eventType}`, data);
    
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
      message: 'Ошибка логирования'
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Внутренняя ошибка сервера'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint не найден',
    path: req.originalUrl
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('==========================================');
  console.log('✓ NovaAI University API Server STARTED');
  console.log(`✓ Port: ${PORT}`);
  console.log('✓ URL: https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev');
  console.log('✓ CORS: Enabled for Vercel frontend');
  console.log('✓ Auth: Registration and login ready');
  console.log('✓ Courses: API endpoint active');
  console.log(`✓ Started: ${new Date().toISOString()}`);
  console.log('==========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;