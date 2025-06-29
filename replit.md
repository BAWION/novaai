# NovaAI University - AI Educational Platform

## Overview

NovaAI University is a comprehensive AI-powered educational platform built with modern web technologies. It offers adaptive learning experiences, personalized course recommendations, and skills assessment through an innovative Skills DNA system. The platform combines traditional educational content delivery with AI-powered tutoring and progress tracking.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Components**: Radix UI with shadcn/ui design system
- **Styling**: Tailwind CSS v4 with CSS variables
- **State Management**: TanStack React Query for server state
- **Routing**: React Router for client-side navigation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with secure cookies
- **API Design**: RESTful API with JSON responses

## Key Components

### 1. Course Management System
- Comprehensive course catalog with search and filtering
- Modular course structure with lessons and assessments
- Progress tracking with completion statistics
- Interactive lesson content with rich media support

### 2. Skills DNA System
- Multi-stage diagnostic assessment (7 stages)
- Radar chart visualization of skill profiles
- Gap analysis and personalized recommendations
- Adaptive questioning based on user responses

### 3. AI Integration
- OpenAI GPT-4o integration for AI tutoring
- Anthropic Claude SDK for content generation
- Personalized learning path recommendations
- Intelligent content adaptation

### 4. User Management
- Role-based access control (student, teacher, admin)
- Comprehensive user profiles with learning preferences
- Authentication with secure session handling
- Admin panel for user and content management

### 5. Progress Tracking
- Real-time lesson completion tracking
- Skills progression monitoring
- Achievement system with milestones
- Analytics dashboard for learning insights

### 6. Community Integration
- Telegram channel integration (@humanreadytech)
- News feed with posts, hashtags, and engagement metrics
- Real-time content updates from external sources
- Social features for community engagement

## Data Flow

### User Authentication Flow
1. User registration with profile creation
2. Secure session establishment
3. Role-based access control enforcement
4. Session persistence across browser sessions

### Learning Journey Flow
1. Initial skills assessment through Skills DNA
2. Personalized course recommendations
3. Adaptive content delivery based on progress
4. Continuous skill tracking and updates
5. AI-powered tutoring integration

### Content Management Flow
1. Admin creates courses and modules
2. Content approval and publication workflow
3. Real-time content updates to learners
4. Performance analytics and optimization

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with connection pooling
- **AI Services**: OpenAI API, Anthropic Claude API
- **Build Tools**: Vite, ESBuild for production builds
- **UI Libraries**: Radix UI ecosystem
- **Validation**: Zod for runtime type checking

### Development Tools
- **Testing**: Cypress for E2E testing
- **Code Quality**: TypeScript strict mode
- **Bundling**: Vite with optimized chunking
- **Hot Reload**: Vite HMR for development

## Deployment Strategy

### Development Environment
- Local development with `npm run dev`
- Hot module replacement for fast iteration
- PostgreSQL database connection
- Environment variable configuration

### Production Deployment
- **Primary**: Replit deployment with full-stack hosting
- **Frontend Alternative**: Vercel deployment with API proxy
- Build optimization with code splitting
- Static asset optimization and caching

### Database Management
- Drizzle ORM for type-safe database operations
- Migration system for schema updates
- Connection pooling for performance
- Backup and recovery procedures

## Changelog

- June 29, 2025: ИСПРАВЛЕНЫ ПРОБЛЕМЫ ДЕПЛОЯ VERCEL  
  - Заменено некорректное регулярное выражение /(.*\\.(css|js)) на отдельные правила
  - Создано два отдельных правила для CSS и JS файлов в headers
  - Устранена ошибка "Header at index 1 has invalid source pattern" при деплое
  - Удалена несовместимая зависимость react-d3-radar (требовала React 15 вместо 18)
  - Исправлена команда сборки: только frontend (vite build) для статического деплоя
  - API проксирование на Replit backend через rewrites в vercel.json
  - Конфигурация готова для полноценного продакшн деплоя
- June 28, 2025: ИСПРАВЛЕНА КОНФИГУРАЦИЯ VERCEL ДЕПЛОЯ
  - Обновлен vercel.json с правильной outputDirectory: "dist/public"
  - Добавлены заголовки кэширования для CSS/JS файлов для корректного отображения стилей
  - Настроено проксирование API запросов на Replit сервер
  - Конфигурация готова для GitHub репозитория https://github.com/BAWION/novaai.git
  - После обновления в GitHub, Vercel автоматически пересоберет с правильными настройками
- June 25, 2025: ОБНОВЛЕНА ГЛАВНАЯ СТРАНИЦА - ПОЛНЫЙ ФУНКЦИОНАЛ
  - Заменены устаревшие описания платформы на современные возможности Skills DNA
  - Добавлены все 6 ключевых функций: Skills DNA диагностика, умный подбор курсов, адаптивный прогресс, ИИ-тьютор, LabHub, Сообщество
  - Главный заголовок изменен на "Skills DNA — ваш навигатор в мире ИИ"
  - Подчеркнуто автоматическое обновление навыков после каждого урока
  - Кнопка CTA изменена на "Создать Skills DNA профиль"
  - Описания отражают интеграцию с радарными диаграммами и персонализированными рекомендациями
  - Добавлена LabHub как интерактивная лаборатория для практики ML и Data Science
  - Включено Сообщество как Telegram-канал с экспертами и новостями ИИ
- June 25, 2025: СОЗДАНА БИБЛИОТЕКА КУРСОВ (информационная)
  - Заменена простая секция каталога на полноценную библиотеку курсов
  - Убраны кнопки "Изучить курс" для чисто информационного просмотра
  - Добавлены реальные данные по модулям и времени обучения для каждого курса
  - Компактные карточки курсов без излишних иконок с шляпами
  - Сетка 4 колонки на больших экранах для оптимального использования пространства
  - Интеграция с API курсов для отображения актуальных данных
  - Фильтрация по категориям: AI, Python, Автоматизация, No-Code
- June 24, 2025: ИСПРАВЛЕНЫ проблемы деплоя и валидации данных
  - Устранены ошибки импорта useAuth hook в make-automation-course-page.tsx и telegram-bots-course-page.tsx
  - Создан файл совместимости useAuth.tsx для legacy импортов
  - Добавлена санитизация данных диагностики для обработки null значений в кэшированных результатах
  - Улучшена схема валидации Zod с автоматической трансформацией null → 0
  - Исправлены конфликты дублированных экспортов в системе аутентификации
  - Сервер разработки работает стабильно, готов к продакшн деплою
- June 25, 2025: ЗАВЕРШЕН КУРС "No-Code AI" (100%)
  - Полный курс по созданию ИИ-решений без программирования (8 модулей, 15 уроков)
  - Модули: Введение, Make.com, Zapier, GPT интеграции, Управление данными, CRM-процессы, Контент и маркетинг, Продвинутые техники
  - Практические уроки: от базовых автоматизаций до сложных ИИ-агентов
  - Интеграции: OpenAI API, Make.com, Zapier, CRM системы, аналитические инструменты
  - Курс готов к использованию студентами
- June 24, 2025: ЗАВЕРШЕН КУРС "Автоматизация Make.com+ChatGPT" (100%)
  - Полноценный курс по no-code автоматизации с ИИ интеграцией (300 минут)
  - 6 модулей с 12 практическими уроками
  - Проекты: умный CRM, контент-генератор, ИИ-анализатор, email-маркетинг
  - Интеграции: OpenAI API, Telegram, Google Workspace, CRM системы
  - Полный контент от основ Make.com до продвинутых multi-step сценариев
- June 24, 2025: СОЗДАН КУРС "Автоматизация Make.com+ChatGPT"
  - Полноценный курс по no-code автоматизации с ИИ интеграцией (300 минут)
  - 6 модулей: от основ Make.com до продвинутых multi-step сценариев
  - Практические проекты: умный CRM, контент-генератор, автоматизация поддержки
  - Интеграции: OpenAI API, Google Workspace, CRM системы, мессенджеры
  - Фокус на реальные бизнес-задачи: лиды, email-маркетинг, обработка данных
- June 24, 2025: ИСПРАВЛЕНА проблема с URL-адресами уроков
  - Добавлено автоматическое перенаправление на правильные URL курсов
  - API эндпоинт /api/modules/:id/course для получения информации о курсе
  - Универсальная маршрутизация /courses/:courseSlug/modules/:moduleId/lessons/:lessonId
  - Хлебные крошки навигации "Курсы → Курс → Модуль"
  - Уроки Telegram-ботов теперь показывают корректный URL: /courses/telegram-bots-replit/modules/44/lessons/82
- June 24, 2025: СОЗДАН КУРС "Создание Telegram-ботов на Replit без кода"
  - Полноценный курс с 5 модулями и 10 уроками (180 минут обучения)
  - Модули: Основы ботов, Настройка Replit, Команды и меню, API интеграции, Монетизация
  - Практические уроки: от регистрации BotFather до профессионального развертывания
  - Интеграции: погодный API, курсы валют, QR-коды, платежные системы
  - Курс добавлен в базу данных и доступен в каталоге платформы
- June 24, 2025: Расширен план развития курсов до 20 востребованных направлений
  - Добавлены подробные описания и обоснования актуальности для каждого курса
  - Приоритизация курсов по уровням: топ (10-9 баллов), высокий (8), средний (7), дополнительный (6-5)
  - Топ-курсы: Telegram-боты на Replit, сайты за 60 минут с Cursor+AI, автоматизация Make.com+ChatGPT
  - Высокоприоритетные: AI для TikTok+CapCut, Notion AI, мини-стартапы без кода, продвинутые промпты ChatGPT
  - Средние: AI-блог за день, Replit-конструктор, Midjourney+DALL-E промпты, AI-финансист
  - Дополнительные: музыка с Suno, AI-юрист, UX-исследования, геймдев, видеомонтаж
  - Все курсы распределены по категориям и целевой аудитории с детальными описаниями
- June 24, 2025: Интегрирована архитектура курсов в админ-панель + план развития
  - Добавлена архитектура курсов в раздел "Курсы" старой админ-панели
  - Форма планирования новых курсов с приоритизацией и оценкой спроса
  - Завершен курс "No-Code AI" (100%): 8 модулей, 11 уроков с практическими проектами
  - Текущий статус: AI Literacy 101 (100%), Prompt-инжиниринг (100%), Этика ИИ (100%), Python (100%), No-Code AI (100%)
  - Админ-панель теперь показывает готовность курсов и позволяет планировать новые
- June 23, 2025: Завершена интеграция с Telegram каналом @humanreadytech
  - Создан компонент TelegramFeed для отображения ленты новостей
  - Добавлен API эндпоинт /api/telegram с web scraping функциональностью
  - Реализована лента новостей с автоматическим обновлением каждые 5 минут
  - Убрано уведомление об источнике данных для чистоты интерфейса
  - Лента новостей успешно интегрирована в раздел "Сообщества"
- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.