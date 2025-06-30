# Galaxion - AI Educational Platform

## Overview

Galaxion is a comprehensive AI-powered educational platform built with modern web technologies. It offers adaptive learning experiences, personalized course recommendations, and skills assessment through an innovative Skills DNA system. The platform combines traditional educational content delivery with AI-powered tutoring and progress tracking through NovaAI - the intelligent assistant that guides learners throughout their educational journey.

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
- **Live Production**: https://www.galaxion.org/ (Vercel frontend + Replit API backend)
- **Development**: Replit deployment with full-stack hosting
- Architecture: Vercel for static frontend, Replit for API backend with proxy
- Build optimization with code splitting and static asset optimization

### Database Management
- Drizzle ORM for type-safe database operations
- Migration system for schema updates
- Connection pooling for performance
- Backup and recovery procedures

## Changelog

- 2025-06-30: ЗАВЕРШЕНА ГАЛАКТИЧЕСКАЯ ДОРОЖНАЯ КАРТА С КОСМИЧЕСКИМ ДИЗАЙНОМ
  - ✅ Создана полная галактическая дорожная карта с живым космическим фоном (50+ анимированных звезд, туманности)
  - ✅ Добавлены орбитальные пути между планетами-модулями с SVG-анимацией
  - ✅ Планеты с различными размерами: стартовая (16px), базовые (14px), специализированные (12px), спутники (10px)
  - ✅ Анимированные эффекты: покачивание, вращение, пульсирующие кольца, цветное свечение по статусу
  - ✅ Блокировка заблокированных модулей с визуальными индикаторами замка
  - ✅ Статистика маршрута: общее время обучения, количество завершенных/доступных модулей
  - ✅ Временные оценки для каждого модуля (от 45 минут до 6ч 45м)
  - ✅ Легенда статусов и прогресс-бар общего завершения пути
  - ✅ Информационная панель с длительностью, прогрессом и описанием выбранного модуля
  - ✅ Кнопка "Начать модуль" для доступных курсов
  - РЕЗУЛЬТАТ: Полноценная космическая дорожная карта обучения с детальной визуализацией прогресса

- 2025-06-30: СОЗДАНА ТОЧНАЯ ОРБИТАЛЬНАЯ СИСТЕМА ПО ОСЯМ КООРДИНАТ
  - ✅ Панели автоматически закрываются при смене уровня навигации (Galaxy → Universe)
  - ✅ Улучшены границы панелей с отступом 40px для предотвращения выхода за пределы карты
  - ✅ ПЛАНЕТЫ РАЗМЕЩЕНЫ ПО ОСЯМ: справа, сверху справа, сверху, слева сверху, слева, снизу слева, снизу, справа снизу
  - ✅ Фиксированные статичные позиции планет (220px + шаг 100px) без вращения контейнера
  - ✅ Точные углы планет по осям координат (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
  - ✅ Корабль Галаксион размещен в центре с вращающейся анимацией
  - ✅ ОПТИМИЗИРОВАНЫ РАЗМЕРЫ ПЛАНЕТ по объему курса:
    * Малые планеты (24-32px): 1-2 модуля  
    * Средние планеты (36-48px): 3-5 модулей
    * Большие планеты (52-64px): 6+ модулей
  - ✅ Легкая анимация покачивания планет для живости
  - ✅ Видимые орбитальные траектории с увеличенной прозрачностью (border-white/15)
  - ✅ Кольца планет: двойные для больших (52px+), одиночные для средних (36px+)
  - ✅ Цветовая схема по размеру: большие - яркие, средние - умеренные, малые - приглушенные
  - ✅ Постепенное появление планет с задержкой для красивого эффекта
  - РЕЗУЛЬТАТ: Солнечная система с планетами четко по осям координат

- 2025-06-29: УЛУЧШЕН ДИЗАЙН РАМОК НАЗВАНИЙ ГАЛАКТИК
  - ✅ Добавлены индивидуальные углы наклона для каждой галактики
  - ✅ Робототехника: 180° переворот рамки названия
  - ✅ ИИ Этика: 180° переворот рамки названия  
  - ✅ Компьютерное Зрение: 190° поворот рамки названия
  - ✅ Машинное Обучение: -2° небольшой наклон
  - ✅ Языковые Технологии: +1° небольшой наклон
  - ✅ Изменена форма рамок с круглой на прямоугольную с закругленными углами
  - РЕЗУЛЬТАТ: Динамичные рамки с индивидуальными углами поворота для каждой галактики

- 2025-06-29: ДОБАВЛЕНО ВРАЩЕНИЕ ГАЛАКТИК С ФИКСИРОВАННЫМИ НАДПИСЯМИ
  - ✅ Галактики теперь плавно вращаются с разными скоростями (80-200 секунд на оборот)
  - ✅ Надписи галактик остаются горизонтальными и неподвижными
  - ✅ Противоположное вращение текста компенсирует вращение галактики
  - ✅ Каждая галактика имеет уникальную скорость вращения для живости
  - ✅ Сохранены все эффекты пульсации и свечения
  - РЕЗУЛЬТАТ: Живые вращающиеся галактики с читаемыми статичными названиями

- 2025-06-29: ОПТИМИЗИРОВАНЫ РАССТОЯНИЯ И ЗУМЫ ДЛЯ КОМФОРТНОЙ НАВИГАЦИИ
  - ✅ Увеличены расстояния между галактиками (в 2 раза) для лучшего обзора
  - ✅ Расширены орбиты звездных систем (150-350px) и планет-курсов (120-240px)
  - ✅ Замедлена скорость зума (0.008) для более точного контроля
  - ✅ Расширен диапазон зума (0.15-20) для дальнего отдаления
  - ✅ Увеличены пороги автовозврата (0.25/0.2) и задержка (1000ms)
  - ✅ Уменьшены начальные зумы (1.5) для лучшего первоначального обзора
  - РЕЗУЛЬТАТ: Длинные пути зума позволяют детально исследовать каждый уровень

- 2025-06-29: GALAXY MAP ПОЛНОСТЬЮ ОЖИВЛЕНА И ГОТОВА К ИСПОЛЬЗОВАНИЮ
  - ✅ Галактики теперь живые: вращение, пульсация свечения, анимированные эффекты
  - ✅ Компактные стильные надписи с цветными индикаторами вместо громоздких блоков
  - ✅ Двойной клик по галактике активирует переход к планетам-курсам
  - ✅ Убрана информационная рамка для чистого космического вида
  - ✅ Отладочная информация удалена, интерфейс готов для пользователей
  - ✅ Навигационные кнопки перемещены в приборную панель корабля под кнопку "Домой"
  - ✅ Удалена дублирующая кнопка "Домой" из верхнего правого угла
  - РЕЗУЛЬТАТ: Полностью интерактивная и визуально привлекательная галактическая карта с компактным управлением

- 2025-06-29: ЗАВЕРШЕНА ТОЧНАЯ 3-УРОВНЕВАЯ НАВИГАЦИЯ GALAXY MAP
  - ✅ Исправлена стартовая логика: Universe view теперь показывает только 5 спиральных галактик
  - ✅ Реализована правильная иерархия навигации: Universe → Galaxy → System
  - ✅ Galaxy view: центральные звезды с орбитальными системами вместо планет
  - ✅ System view: планеты-курсы с орбитальными станциями и астероидами-модулями  
  - ✅ Двойной клик для перехода между уровнями согласно спецификации
  - ✅ Скролл-навигация: scroll-out возвращает к предыдущему уровню
  - ✅ Обновлены breadcrumb и статусы миссии для каждого уровня навигации
  - ✅ Корабль Галаксион с энергетическими эффектами остается в центре на всех уровнях
  - РЕЗУЛЬТАТ: Полностью соответствует UI Logic Specification с точной 3-уровневой навигацией

- 2025-06-29: ПОЛНОСТЬЮ РЕАЛИЗОВАНА IMMERSIVE GALAXY UNIVERSE СИСТЕМА
  - ✅ Создан новый компонент galaxy-universe-new.tsx с полным космическим опытом
  - ✅ Живое звездное небо: 150+ анимированных звезд, 5 цветных туманностей, пролетающие метеоры
  - ✅ Орбитальное движение планет: реалистичные траектории вокруг галактик с разной скоростью
  - ✅ Корабль Галаксион в центре с плавными переходами между уровнями навигации
  - ✅ Приборная панель корабля: индикаторы мотивации, уровень исследователя, мини-карта
  - ✅ Toast-уведомления с эффектами: искры, вращающиеся иконки, дымные хвосты
  - ✅ Планеты с материализацией: золотые короны для завершенных, пульсация для активных
  - ✅ Мини-астероиды для детального вида модулей курса
  - ✅ Орбитальные траектории видны при наведении
  - ✅ Трехуровневая навигация: Вселенная → Галактика → Планета с плавным зумом
  - РЕЗУЛЬТАТ: Создано полностью immersive космическое путешествие по знаниям

- 2025-06-29: GALAXY UNIVERSE СИСТЕМА ПОЛНОСТЬЮ ИНТЕГРИРОВАНА
  - ✅ Заменена старая орбитальная схема на интерактивную галактическую карту
  - ✅ Исправлены проблемы с экспортом компонентов GalaxyUniverse
  - ✅ Интегрирована новая система в основной дашборд для авторизованных пользователей
  - ✅ 5 тематических галактик: ML, NLP, Computer Vision, AI Ethics, Robotics
  - ✅ Интерактивные возможности: планеты-курсы, телескоп для открытий, анимированный корабль
  - ✅ Система прогресса с цветовой индикацией курсов (синий/желтый/зеленый)
  - РЕЗУЛЬТАТ: Обучение превращено в космическое путешествие с геймификацией

- 2025-06-29: TELEGRAM АВТОРИЗАЦИЯ ГОТОВА К АКТИВАЦИИ
  - Создан бот @Galaxion_Auth_bot (ID: 7095186689) с токеном TELEGRAM_AUTH_BOT_TOKEN
  - Разделены функции: TELEGRAM_BOT_TOKEN для новостей, TELEGRAM_AUTH_BOT_TOKEN для входа
  - Реализован Telegram Login Widget с корректным username: Galaxion_Auth_bot
  - Настроена серверная обработка с криптографической проверкой hash подписи
  - Создан fallback-режим с информативными сообщениями для пользователей
  - Подготовлен telegram-bot-setup-guide.md с пошаговыми инструкциями
  - ФИНАЛЬНЫЙ ШАГ: настройка доменов в @BotFather для активации авторизации
  - Требуется добавить домены: galaxion.org, www.galaxion.org, и replit.dev в настройки бота

- 2025-06-30: СОЗДАН ОПТИМИЗИРОВАННЫЙ GITHUB АРХИВ
  - Архив galaxion-github-clean.zip (9.4 МБ) без лишних файлов
  - Исключены migrations/, .env, node_modules/ (не нужны для фронтенд деплоя)
  - Включены все изменения: Galaxion переименование, Telegram auth, Galaxy Map
  - Готов к полной синхронизации GitHub репозитория

- 2025-06-29: СОЗДАН АРХИВ ДЛЯ GITHUB СИНХРОНИЗАЦИИ
  - Автоматически создан пакет galaxion-update-2025-06-29T18-09-08
  - Готов к загрузке в GitHub репозиторий
  - Содержит обновления навигации, компонентов и метаданных
  - Цель: синхронизация https://www.galaxion.org/ с GitHub

- June 29, 2025: ЗАВЕРШЕНО ПОЛНОЕ ПЕРЕИМЕНОВАНИЕ ПРОЕКТА И РАЗВЕРТЫВАНИЕ
  - ✅ Принудительное обновление файлов для Git commit
  - → Отправка изменений Galaxion в GitHub репозиторий
  - Проект переименован с "NovaAI University" на "Galaxion"
  - NovaAI теперь является ИИ-ассистентом (мудрецом) внутри платформы
  - Обновлена документация с новой архитектурой названий
  - Улучшен логотип в навигации: убрана лишняя иконка, увеличен размер текста до 2xl
  - Полная интеграция нового брендинга во всех интерфейсах
  - ПЛАТФОРМА УСПЕШНО РАЗВЕРНУТА НА: https://www.galaxion.org/
- June 29, 2025: ✅ УСПЕШНО РЕШЕНЫ ВСЕ ПРОБЛЕМЫ ДЕПЛОЯ VERCEL
  - Исправлена структура проекта: удалена дублированная папка src/
  - Добавлена папка client/ в GitHub репозиторий с правильной структурой
  - Обновлен vercel.json: outputDirectory изменен с "dist" на "dist/public"
  - Настроен правильный tailwind.config.ts для сканирования client/src/
  - Создан корректный корневой index.html файл
  - РЕЗУЛЬТАТ: Платформа работает идентично на Replit и Vercel gulcheev.com
  - Все стили CSS загружаются корректно, API проксируется на Replit backend
- June 29, 2025: ИСПРАВЛЕНЫ ПРОБЛЕМЫ ДЕПЛОЯ VERCEL И ДОСТУПА  
  - Заменено некорректное регулярное выражение /(.*\\.(css|js)) на отдельные правила
  - Создано два отдельных правила для CSS и JS файлов в headers
  - Устранена ошибка "Header at index 1 has invalid source pattern" при деплое
  - Удалена несовместимая зависимость react-d3-radar (требовала React 15 вместо 18)
  - Исправлена команда сборки: только frontend (vite build) для статического деплоя
  - Исправлен outputDirectory: "dist" для соответствия фактическому пути сборки Vite
  - НАЙДЕНА РЕАЛЬНАЯ ПРОБЛЕМА: Vercel Authentication включен в настройках Security
  - Vercel Authentication блокирует доступ к сайту (401 ошибка + SSO защита)
  - Добавлено "public": true в vercel.json для принудительного публичного доступа
  - API проксирование на Replit backend через rewrites в vercel.json
  - РЕШЕНИЕ: отключить "Vercel Authentication" в Settings → Security → Deployment Protection
  - НАЙДЕНА И ИСПРАВЛЕНА ОСНОВНАЯ ПРОБЛЕМА: неправильный путь в tailwind.config.ts
  - Исправлен путь: "./client/src/**/*" → "./src/**/*" для правильного сканирования компонентов
  - ПОДТВЕРЖДЕНО: стили теперь работают корректно в Replit превью
  - Требуется коммит для применения исправления на Vercel
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