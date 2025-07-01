# Galaxion - AI Educational Platform

🌌 **Космическая образовательная платформа нового поколения**

## Обзор

Galaxion — это революционная образовательная платформа, которая превращает изучение искусственного интеллекта в захватывающее космическое путешествие. Платформа предлагает персонализированные пути обучения через систему Skills DNA и интерактивный галактический интерфейс.

## ✨ Ключевые особенности

- 🧬 **Skills DNA System** - Персонализированная диагностика навыков с радарными диаграммами
- 🌌 **Cosmic Interface** - Интерактивная галактическая карта курсов с 5 тематическими галактиками
- 🤖 **AI-Powered Learning** - ИИ-тьютор NovaAI для персонального обучения
- 📱 **Mobile Responsive** - Полностью адаптивный дизайн для всех устройств
- 🎯 **Gamification** - Геймификация обучения через космические метафоры
- 🚀 **Real-time Progress** - Живое отслеживание прогресса и обновление навыков

## 🛠 Технологический стек

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: TanStack React Query
- **Routing**: Wouter
- **Animations**: CSS animations + космические эффекты

### Backend
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL + Drizzle ORM
- **Sessions**: Express sessions с безопасными cookies
- **API**: RESTful API с JSON responses

### AI Integration
- **OpenAI**: GPT-4o для ИИ-тьютора
- **Anthropic**: Claude для генерации контента
- **Персонализация**: Адаптивные алгоритмы рекомендаций

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Клонирование репозитория
git clone https://github.com/BAWION/novaai.git
cd novaai

# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшна
npm run build
```

### Развертывание на Vercel

1. **GitHub Integration**
   ```bash
   git push origin main
   ```

2. **Vercel Setup**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

3. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-replit-backend.replit.dev
   VITE_APP_NAME=Galaxion
   VITE_APP_VERSION=2.1.0
   ```

## 📁 Структура проекта

```
galaxion/
├── client/                 # Frontend приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   │   ├── ui/         # shadcn/ui компоненты
│   │   │   ├── course/     # Компоненты курсов
│   │   │   └── skills-dna/ # Skills DNA система
│   │   ├── pages/          # Страницы приложения
│   │   │   ├── cosmic-home.tsx    # Космическая главная
│   │   │   ├── galaxy-universe.tsx # Галактическая карта
│   │   │   └── skills-dna-page.tsx # Skills DNA диагностика
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Утилиты и helpers
├── server/                 # Backend API
│   ├── index.ts           # Express сервер
│   ├── routes.ts          # API маршруты
│   └── storage.ts         # Интерфейс базы данных
├── shared/                 # Общие типы и схемы
│   └── schema.ts          # Drizzle ORM схемы
├── public/                 # Статические файлы
│   └── screenshots/       # Скриншоты платформы
└── docs/                  # Документация
```

## 🌟 Основные компоненты

### 🏠 Cosmic Home Page
- Космический дизайн с анимированными звездами и планетами
- Интерактивный слайдер с реальными скриншотами платформы
- Секция Skills DNA с живой ДНК-визуализацией
- 5 тематических галактик ИИ для навигации по курсам

### 🧬 Skills DNA System
- 7-этапная диагностика навыков
- Радарные диаграммы для визуализации профиля
- Автоматические рекомендации курсов
- Живое обновление после каждого урока

### 🌌 Galaxy Map Interface
- Интерактивная карта галактик:
  - 🤖 Машинное обучение
  - 👁️ Компьютерное зрение  
  - 🗣️ Обработка языка
  - ⚙️ Автоматизация
  - 🏢 Бизнес и этика ИИ
- Фильтрация курсов по тематикам
- Адаптивный дизайн для мобильных устройств

### 🤖 AI Tutor Integration
- Персональный ИИ-ассистент NovaAI
- Контекстуальная помощь во время обучения
- Адаптивные объяснения сложных концепций

## 📱 Мобильная адаптивность

- **Компактные галактики**: 8x8px иконки без белых краев
- **Responsive UI**: Адаптивные формы и навигация
- **Touch-friendly**: Оптимизированы для touch интерфейсов
- **Performance**: Оптимизированные анимации для мобильных

## 🎨 Дизайн-система

### Цветовая палитра
- **Космические градиенты**: От глубокого космоса до звездного света
- **Тематические цвета галактик**: Каждая галактика имеет уникальную палитру
- **Accessibility**: Контрастные цвета для читаемости

### Анимации
- **Космические эффекты**: Анимированные звезды, планеты, туманности
- **Плавные переходы**: 60 FPS анимации
- **Производительность**: Оптимизированы для всех устройств

## 📈 Производительность

- ⚡ **Lazy Loading**: Компоненты загружаются по требованию
- 🗜️ **Code Splitting**: Маршруты разделены для быстрой загрузки
- 📦 **Optimized Bundle**: Vite оптимизация с tree-shaking
- 🖼️ **Image Optimization**: Сжатие и lazy loading изображений

## 🔧 API Архитектура

### Основные эндпоинты
- `/api/auth/*` - Аутентификация и сессии
- `/api/courses` - Управление курсами
- `/api/skills-dna` - Skills DNA диагностика
- `/api/progress` - Отслеживание прогресса
- `/api/ai-tutor` - ИИ-тьютор интеграция

### Безопасность
- Secure session cookies
- CORS настройки
- Rate limiting
- Input validation с Zod

## 🌐 Производственное развертывание

### Архитектура
- **Frontend**: Vercel (статические файлы)
- **Backend**: Replit (API сервер)
- **Database**: PostgreSQL
- **CDN**: Автоматическое кэширование статики

### Домены
- **Production**: [galaxion.org](https://galaxion.org)
- **Development**: Replit preview

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Внесите изменения
4. Добавьте тесты
5. Создайте Pull Request

## 📄 Лицензия

MIT License - см. LICENSE файл для деталей.

## 🙏 Благодарности

- OpenAI за GPT-4o API
- Anthropic за Claude API
- Vercel за хостинг платформу
- Replit за development environment

---

**🚀 Создано для будущего образования в области ИИ**

*Galaxion - где обучение встречается с космосом* ✨
