// Working API Server for NovaAI University
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration for cross-domain requests
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
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));

// Preflight requests handler
app.options('*', cors());

// In-memory storage for users and data
const users = new Map();
const sessions = new Map();
let userIdCounter = 1;
let sessionIdCounter = 1;

// Helper functions
function generateSessionId() {
  return `session_${sessionIdCounter++}_${Date.now()}`;
}

function findUserByCredentials(username) {
  for (let user of users.values()) {
    if (user.username === username || user.email === username) {
      return user;
    }
  }
  return null;
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'NovaAI University API',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'POST /api/auth/logout',
      'GET /api/courses',
      'POST /api/events'
    ]
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    users: users.size,
    sessions: sessions.size
  });
});

// Authentication routes
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  console.log(`[${new Date().toISOString()}] Registration attempt:`, { username, email });
  
  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Все поля обязательны для заполнения'
    });
  }
  
  // Check if user already exists
  const existingUser = findUserByCredentials(username) || findUserByCredentials(email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'Пользователь с такими данными уже существует'
    });
  }
  
  // Create new user
  const userId = userIdCounter++;
  const newUser = {
    id: userId,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    isActive: true
  };
  
  users.set(userId, newUser);
  
  // Create session
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    userId,
    createdAt: new Date().toISOString(),
    lastAccessAt: new Date().toISOString()
  });
  
  console.log(`[${new Date().toISOString()}] Registration successful:`, { userId, username });
  
  res.json({
    success: true,
    message: 'Регистрация успешно завершена',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    },
    sessionId
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log(`[${new Date().toISOString()}] Login attempt:`, { username });
  
  // Validation
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Необходимо указать логин и пароль'
    });
  }
  
  // Find user
  const user = findUserByCredentials(username);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Неверные учетные данные'
    });
  }
  
  // Update last login
  user.lastLoginAt = new Date().toISOString();
  
  // Create session
  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    userId: user.id,
    createdAt: new Date().toISOString(),
    lastAccessAt: new Date().toISOString()
  });
  
  console.log(`[${new Date().toISOString()}] Login successful:`, { userId: user.id, username: user.username });
  
  res.json({
    success: true,
    message: 'Вход выполнен успешно',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    },
    sessionId
  });
});

app.get('/api/auth/me', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '') || req.query.sessionId;
  
  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({
      success: false,
      message: 'Не авторизован'
    });
  }
  
  const session = sessions.get(sessionId);
  const user = users.get(session.userId);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Пользователь не найден'
    });
  }
  
  // Update session access time
  session.lastAccessAt = new Date().toISOString();
  
  res.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  const sessionId = req.headers.authorization?.replace('Bearer ', '') || req.body.sessionId;
  
  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
    console.log(`[${new Date().toISOString()}] Logout successful for session:`, sessionId);
  }
  
  res.json({
    success: true,
    message: 'Выход выполнен успешно'
  });
});

// Courses API
app.get('/api/courses', (req, res) => {
  console.log(`[${new Date().toISOString()}] Courses request received`);
  
  const courses = [
    {
      id: 1,
      title: 'AI Literacy 101',
      description: 'Основы искусственного интеллекта для современного мира',
      modules: 6,
      level: 'beginner',
      duration: '4 недели',
      category: 'AI Basics',
      status: 'active'
    },
    {
      id: 2,
      title: 'Python Basics',
      description: 'Изучение основ программирования на Python',
      modules: 8,
      level: 'beginner',
      duration: '6 недель',
      category: 'Programming',
      status: 'active'
    },
    {
      id: 3,
      title: 'Skills DNA Navigator',
      description: 'Диагностика и развитие профессиональных навыков',
      modules: 7,
      level: 'intermediate',
      duration: '2 недели',
      category: 'Skills Assessment',
      status: 'active'
    },
    {
      id: 4,
      title: 'No-Code AI',
      description: 'Создание AI-решений без программирования',
      modules: 8,
      level: 'intermediate',
      duration: '5 недель',
      category: 'No-Code',
      status: 'active'
    }
  ];
  
  res.json(courses);
});

// Events logging
app.post('/api/events', (req, res) => {
  const { eventType, data } = req.body;
  
  console.log(`[${new Date().toISOString()}] Event logged:`, { eventType, data });
  
  res.status(201).json({
    id: Date.now(),
    eventType,
    timestamp: new Date().toISOString(),
    status: 'logged'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Server error:`, err);
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
    path: req.originalUrl
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ NovaAI University API Server started successfully`);
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Server URL: https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev`);
  console.log(`✓ CORS enabled for Vercel frontend`);
  console.log(`✓ Authentication endpoints ready`);
  console.log(`✓ Timestamp: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;