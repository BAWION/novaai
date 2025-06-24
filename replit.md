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

- June 24, 2025: Завершен курс "Python для начинающих" - достигнута 100% готовность
  - Курс Python полностью завершен: 17 уроков в 9 модулях с комплексным содержимым
  - Добавлены все недостающие модули: Структуры данных, Функции, ООП, Работа с файлами, Обработка ошибок
  - Каждый урок содержит теорию, практические примеры и реальные кейсы использования
  - Текущий статус курсов: AI Literacy 101 (100%), Prompt-инжиниринг (100%), Этика ИИ (100%), Python для начинающих (100%)
  - Исправлена система накопления постов в Telegram ленте - новые посты сверху, старые остаются
- June 23, 2025: Завершена интеграция с Telegram каналом @humanreadytech
  - Создан компонент TelegramFeed для отображения ленты новостей
  - Добавлен API эндпоинт /api/telegram с web scraping функциональностью
  - Реализована лента новостей с автоматическим обновлением каждые 5 минут
  - Убрано уведомление об источнике данных для чистоты интерфейса
  - Лента новостей успешно интегрирована в раздел "Сообщества"
- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.