// Stable authentication server for NovaAI University
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration for Vercel frontend
app.use(cors({
  origin: [
    'https://novaai-academy.vercel.app',
    'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev',
    /\.replit\.dev$/,
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With']
}));

// Simple user storage
const users = new Map();
const sessions = new Map();
let userCounter = 1;

// Generate simple session token
function generateToken() {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'NovaAI University API',
    status: 'operational',
    authentication: 'enabled',
    timestamp: new Date().toISOString()
  });
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: Math.floor(process.uptime()),
    users: users.size,
    sessions: sessions.size
  });
});

// Registration endpoint
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    console.log(`Registration: ${username} <${email}>`);
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Все поля обязательны'
      });
    }
    
    // Check existing users
    const existing = Array.from(users.values()).find(
      u => u.username.toLowerCase() === username.toLowerCase() || 
           u.email.toLowerCase() === email.toLowerCase()
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
    
    // Create session
    const token = generateToken();
    sessions.set(token, {
      userId,
      createdAt: new Date().toISOString()
    });
    
    console.log(`User registered: ${username} (ID: ${userId})`);
    
    res.status(201).json({
      success: true,
      message: 'Регистрация успешна',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(`Login: ${username}`);
    
    if (!username || !password) {
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
    
    // Create session
    const token = generateToken();
    sessions.set(token, {
      userId: user.id,
      createdAt: new Date().toISOString()
    });
    
    console.log(`User logged in: ${username} (ID: ${user.id})`);
    
    res.json({
      success: true,
      message: 'Вход выполнен',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера'
    });
  }
});

// User info endpoint
app.get('/api/auth/me', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
    
    if (!token || !sessions.has(token)) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован'
      });
    }
    
    const session = sessions.get(token);
    const user = users.get(session.userId);
    
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
  console.log(`Event: ${req.body.eventType}`);
  res.status(201).json({
    id: Date.now(),
    timestamp: new Date().toISOString()
  });
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
    message: 'Endpoint не найден'
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`NovaAI University API Server running on port ${PORT}`);
  console.log(`Authentication endpoints active`);
  console.log(`CORS enabled for Vercel frontend`);
  console.log(`Server URL: https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev`);
  console.log(`Started: ${new Date().toISOString()}`);
});

// Keep process alive
process.on('SIGTERM', () => {
  console.log('Shutting down gracefully');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('Shutting down gracefully');
  server.close(() => process.exit(0));
});

// Prevent process exit
process.stdin.resume();

module.exports = app;