# Исправление проблем со стилями на Vercel

## Проблема:
На скриншоте видно, что стили не загружаются - текст белый на темном фоне без CSS стилей.

## Причина:
Vercel неправильно обрабатывает статические файлы из-за конфигурации.

## Решение:

### 1. Обновите настройки проекта в Vercel Dashboard:

1. Откройте https://vercel.com/dashboard
2. Найдите проект NovaAI Academy
3. Перейдите в Settings → General
4. Обновите Build & Development Settings:

```
Framework Preset: Vite
Build Command: npm run build  
Output Directory: dist/public
Install Command: npm install
```

### 2. Добавьте Environment Variables:

В Settings → Environment Variables:
```
OPENAI_API_KEY = ваш_ключ
ANTHROPIC_API_KEY = ваш_ключ  
NODE_ENV = production
```

### 3. Принудительно пересоберите:

1. Перейдите в Deployments
2. Найдите последний деплой
3. Нажмите три точки → Redeploy

### 4. Проверьте в браузере:

- Откройте Developer Tools (F12)
- Во вкладке Network смотрите, загружаются ли CSS файлы
- Должны загружаться файлы типа `/assets/index-[hash].css`

## Альтернативное решение через CLI:

Если у вас есть Vercel CLI:

```bash
# Пересоберите проект
npm run build

# Обновите на Vercel
vercel --prod
```

## Результат:
После исправления сайт должен выглядеть правильно со всеми стилями, как на текущем Replit версии.