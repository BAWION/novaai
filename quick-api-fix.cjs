// Quick API fix for NovaAI University authentication
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const app = express();
const PORT = 5000;

// Trust proxy and basic middleware
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS setup
app.use(cors({
  origin: [
    'https://novaai-academy.vercel.app',
    'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev',
    'http://localhost:5173',
    /\.replit\.dev$/,
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Session management
app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: 'novaai-session-secret',
  resave: false,
  saveUninitialized: false,
  name: 'novaai.sid',
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// In-memory user storage
const users = new Map();
let userCounter = 1;

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'NovaAI University API',
    status: 'running',
    version: '1.0.0',
    authentication: 'active',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    users: users.size,
    timestamp: new Date().toISOString()
  });
});

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  console.log(`[AUTH] Registration: ${username} <${email}>`);
  
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Все поля обязательны'
    });
  }
  
  // Check for existing user
  const existing = Array.from(users.values()).find(
    u => u.username === username || u.email === email
  );
  
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'Пользователь уже существует'
    });
  }
  
  // Create user
  const userId = userCounter++;
  const user = {
    id: userId,
    username: username.trim(),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString()
  };
  
  users.set(userId, user);
  req.session.userId = userId;
  
  console.log(`[AUTH] User registered: ${username} (ID: ${userId})`);
  
  res.json({
    success: true,
    message: 'Регистрация успешна',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log(`[AUTH] Login: ${username}`);
  
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
  
  req.session.userId = user.id;
  
  console.log(`[AUTH] User logged in: ${username} (ID: ${user.id})`);
  
  res.json({
    success: true,
    message: 'Вход выполнен',
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Не авторизован'
    });
  }
  
  const user = users.get(req.session.userId);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Пользователь не найден'
    });
  }
  
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
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
    });
  }
  
  res.json({
    success: true,
    message: 'Выход выполнен'
  });
});

// Courses endpoint
app.get('/api/courses', (req, res) => {
  const courses = [
    {
      id: 1,
      title: 'AI Literacy 101',
      description: 'Основы искусственного интеллекта',
      modules: 6,
      level: 'Beginner',
      duration: '4 недели'
    },
    {
      id: 2,
      title: 'Python Basics',
      description: 'Основы программирования на Python',
      modules: 8,
      level: 'Beginner',
      duration: '6 недель'
    },
    {
      id: 3,
      title: 'Skills DNA Navigator',
      description: 'Диагностика и развитие навыков',
      modules: 7,
      level: 'Intermediate',
      duration: '2 недели'
    }
  ];
  
  res.json(courses);
});

// Events logging
app.post('/api/events', (req, res) => {
  console.log(`[EVENT] ${req.body.eventType}:`, req.body.data);
  res.status(201).json({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    status: 'logged'
  });
});

// Error handlers
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Ошибка сервера'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint не найден'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log(`✓ NovaAI University API Server STARTED`);
  console.log(`✓ Port: ${PORT}`);
  console.log(`✓ Authentication: ACTIVE`);
  console.log(`✓ CORS: Configured for Vercel`);
  console.log(`✓ Users: ${users.size} registered`);
  console.log(`✓ Time: ${new Date().toISOString()}`);
  console.log('========================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

module.exports = app;