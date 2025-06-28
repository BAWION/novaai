// Простой запуск сервера без vite для обработки API запросов
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS для фронтенда
app.use(cors({
  origin: [
    'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev:5173',
    'https://novaai-academy.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());

// Простые API эндпоинты для авторизации
app.post('/api/auth/register', (req, res) => {
  console.log('Register request:', req.body);
  res.json({ 
    success: true, 
    message: 'Пользователь зарегистрирован',
    user: { id: 1, username: req.body.username }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  res.json({ 
    success: true, 
    message: 'Успешный вход',
    user: { id: 1, username: req.body.username }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.status(401).json({ message: 'Not authenticated' });
});

app.get('/api/courses', (req, res) => {
  res.json([
    { id: 1, title: 'AI Literacy 101', description: 'Основы ИИ', modules: 6 },
    { id: 2, title: 'Python Basics', description: 'Основы Python', modules: 8 }
  ]);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✓ API Server running on port ${PORT}`);
  console.log(`✓ Backend available at: https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev`);
});