// NovaAI University API Server для Replit
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // Replit использует порт 5000

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://novaai-academy.vercel.app',
    'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev',
    'http://localhost:5173',
    /\.replit\.dev$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// In-memory storage
const users = new Map();
let userIdCounter = 1;

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'NovaAI University API Server',
    version: '1.0.0',
    endpoints: ['/health', '/api/auth/register', '/api/auth/login', '/api/courses']
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    users: users.size,
    port: PORT
  });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  console.log(`[${new Date().toISOString()}] REGISTER:`, { username, email });
  
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Заполните все поля' 
    });
  }
  
  // Check existing user
  for (let user of users.values()) {
    if (user.username === username || user.email === email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Пользователь уже существует' 
      });
    }
  }
  
  const userId = userIdCounter++;
  const newUser = {
    id: userId,
    username,
    email,
    createdAt: new Date().toISOString()
  };
  
  users.set(userId, newUser);
  
  console.log(`[${new Date().toISOString()}] REGISTER SUCCESS:`, newUser);
  
  res.json({ 
    success: true, 
    message: 'Регистрация успешна',
    user: newUser
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log(`[${new Date().toISOString()}] LOGIN:`, { username });
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Заполните все поля' 
    });
  }
  
  // Find user
  let foundUser = null;
  for (let user of users.values()) {
    if (user.username === username || user.email === username) {
      foundUser = user;
      break;
    }
  }
  
  if (!foundUser) {
    return res.status(401).json({ 
      success: false, 
      message: 'Неверные учетные данные' 
    });
  }
  
  console.log(`[${new Date().toISOString()}] LOGIN SUCCESS:`, foundUser);
  
  res.json({ 
    success: true, 
    message: 'Вход выполнен успешно',
    user: foundUser
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(401).json({ message: 'Not authenticated' });
});

// Courses API
app.get('/api/courses', (req, res) => {
  console.log(`[${new Date().toISOString()}] COURSES: Request received`);
  res.json([
    { 
      id: 1, 
      title: 'AI Literacy 101', 
      description: 'Основы искусственного интеллекта', 
      modules: 6,
      level: 'beginner',
      duration: '4 недели'
    },
    { 
      id: 2, 
      title: 'Python Basics', 
      description: 'Основы программирования на Python', 
      modules: 8,
      level: 'beginner',
      duration: '6 недель'
    },
    { 
      id: 3, 
      title: 'Skills DNA Navigator', 
      description: 'Диагностика и развитие навыков', 
      modules: 7,
      level: 'intermediate',
      duration: '2 недели'
    }
  ]);
});

// Events logging
app.post('/api/events', (req, res) => {
  console.log(`[${new Date().toISOString()}] EVENT:`, req.body);
  res.status(201).json({ 
    id: Date.now(),
    eventType: req.body.eventType,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ NovaAI University API Server running on port ${PORT}`);
  console.log(`✓ Server URL: https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev`);
  console.log(`✓ CORS enabled for Vercel frontend`);
  console.log(`✓ Available endpoints:`);
  console.log(`  • GET /health - Health check`);
  console.log(`  • POST /api/auth/register - User registration`);
  console.log(`  • POST /api/auth/login - User login`);
  console.log(`  • GET /api/courses - Courses list`);
  console.log(`  • POST /api/events - Event logging`);
});