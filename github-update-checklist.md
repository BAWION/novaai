# Обновления для GitHub репозитория https://github.com/BAWION/novaai.git

## Файлы для обновления:

### 1. vercel.json (КРИТИЧНО)
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.(css|js))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Проверьте package.json scripts:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### 3. Проверьте vite.config.ts build output:
```typescript
build: {
  outDir: path.resolve(import.meta.dirname, "dist/public"),
  emptyOutDir: true,
}
```

## Команды для обновления репозитория:

```bash
# 1. Скопируйте файлы из текущего проекта
cp vercel.json /path/to/your/local/novaai/
cp package.json /path/to/your/local/novaai/
cp vite.config.ts /path/to/your/local/novaai/

# 2. Закоммитьте изменения
cd /path/to/your/local/novaai/
git add .
git commit -m "Fix Vercel deployment configuration - styles and API proxy"
git push origin main

# 3. Vercel автоматически пересоберет проект
```

## Что это исправит:

✅ CSS стили будут загружаться корректно
✅ API запросы будут проксироваться на Replit
✅ Single Page Application роутинг будет работать
✅ Статические файлы будут кэшироваться

## Дополнительные файлы (опционально):

### .gitignore (убедитесь что есть):
```
node_modules/
dist/
.env
.env.local
.env.production
.DS_Store
```

### README.md для GitHub:
```markdown
# NovaAI University

Образовательная платформа с ИИ-тьютором и системой Skills DNA.

## Развертывание на Vercel

1. Форкните репозиторий
2. Подключите к Vercel
3. Добавьте Environment Variables:
   - OPENAI_API_KEY
   - ANTHROPIC_API_KEY
4. Deploy автоматически

## Локальная разработка

```bash
npm install
npm run dev
```
```

После обновления этих файлов в GitHub, Vercel автоматически пересоберет проект с правильными настройками.