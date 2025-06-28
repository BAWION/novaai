// Backend API сервер для NovaAI University
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev:5173',
    'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev',
    'https://novaai-academy.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Тестовая база пользователей
const users = new Map();
let userIdCounter = 1;

// API Routes
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  console.log('Registration attempt:', { username, email });
  
  if (!username || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Заполните все поля' 
    });
  }
  
  // Проверка существующего пользователя
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
  
  res.json({ 
    success: true, 
    message: 'Регистрация успешна',
    user: newUser
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username });
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Заполните все поля' 
    });
  }
  
  // Поиск пользователя
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
  
  res.json({ 
    success: true, 
    message: 'Вход выполнен успешно',
    user: foundUser
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(401).json({ message: 'Not authenticated' });
});

app.get('/api/courses', (req, res) => {
  res.json([
    { 
      id: 1, 
      title: 'AI Literacy 101', 
      description: 'Основы искусственного интеллекта', 
      modules: 6,
      level: 'basic'
    },
    { 
      id: 2, 
      title: 'Python Basics', 
      description: 'Основы программирования на Python', 
      modules: 8,
      level: 'basic'
    },
    { 
      id: 3, 
      title: 'Skills DNA', 
      description: 'Диагностика и развитие навыков', 
      modules: 7,
      level: 'practice'
    }
  ]);
});

app.post('/api/events', (req, res) => {
  console.log('Event logged:', req.body);
  res.status(201).json({ 
    id: Date.now(),
    eventType: req.body.eventType,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ NovaAI University API Server running on port ${PORT}`);
  console.log(`✓ Backend URL: https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev`);
  console.log(`✓ Registered users: ${users.size}`);
});