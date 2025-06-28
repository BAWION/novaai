#!/usr/bin/env node

// Простой Express API сервер для NovaAI University
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'https://novaai-academy.vercel.app',
    'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Simple in-memory storage
const users = new Map();
let userIdCounter = 1;

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  console.log('[REGISTER]', { username, email });
  
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
  
  console.log('[REGISTER SUCCESS]', newUser);
  
  res.json({ 
    success: true, 
    message: 'Регистрация успешна',
    user: newUser
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('[LOGIN]', { username });
  
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
  
  console.log('[LOGIN SUCCESS]', foundUser);
  
  res.json({ 
    success: true, 
    message: 'Вход выполнен успешно',
    user: foundUser
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(401).json({ message: 'Not authenticated' });
});

// Courses route
app.get('/api/courses', (req, res) => {
  console.log('[COURSES] Request received');
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

// Events logging
app.post('/api/events', (req, res) => {
  console.log('[EVENT]', req.body);
  res.status(201).json({ 
    id: Date.now(),
    eventType: req.body.eventType,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    users: users.size 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ NovaAI University API Server running on port ${PORT}`);
  console.log(`✓ CORS enabled for Vercel frontend`);
  console.log(`✓ Auth endpoints: /api/auth/register, /api/auth/login`);
  console.log(`✓ Courses endpoint: /api/courses`);
  console.log(`✓ Health check: /health`);
});

module.exports = app;