# Руководство по развертыванию NovaAI University в продакшн

## Вариант 1: Vercel + Ваш домен (Рекомендуется)

### Преимущества:
- ✅ Собственный домен
- ✅ Автоматический SSL
- ✅ CDN по всему миру
- ✅ Простое развертывание
- ✅ Бесплатный план для старта

### Пошаговая инструкция:

#### 1. Подготовка проекта
```bash
# Собираем фронтенд
npm run build

# Проверяем что API работает на Replit
curl https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/courses
```

#### 2. Настройка Vercel
1. Зайдите на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. В настройках проекта добавьте переменные окружения:
   ```
   OPENAI_API_KEY=ваш_ключ
   ANTHROPIC_API_KEY=ваш_ключ
   DATABASE_URL=postgresql://...
   ```

#### 3. Настройка домена
1. В панели Vercel: Settings → Domains
2. Добавьте ваш домен (например: `novaai-university.com`)
3. Настройте DNS записи у вашего регистратора:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

#### 4. Обновление конфигурации
Файл `vercel.json` уже настроен, но обновим URL API:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://your-replit-app.replit.app/api/$1"
    }
  ]
}
```

### Результат:
- Фронтенд работает на вашем домене
- API работает на Replit
- SSL сертификат автоматический
- Готово к приему трафика

---

## Вариант 2: Полное развертывание на VPS

### Преимущества:
- ✅ Полный контроль
- ✅ Лучшая производительность
- ✅ Собственная база данных
- ✅ Масштабируемость

### Требования:
- VPS с Ubuntu 20.04+
- Docker и Docker Compose
- Домен с настроенными DNS

### Пошаговая инструкция:

#### 1. Создайте Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

#### 2. Создайте docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/novaai
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - postgres

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=novaai
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app

volumes:
  postgres_data:
```

#### 3. Настройте Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/certs/key.pem;

    location / {
        proxy_pass http://app:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 4. Развертывание
```bash
# На сервере
git clone your-repo
cd novaai-university

# Создайте .env файл
echo "OPENAI_API_KEY=your_key" > .env

# Запустите
docker-compose up -d

# Получите SSL сертификат
certbot --nginx -d your-domain.com
```

---

## Рекомендация

Для быстрого запуска рекомендую **Vercel** - это позволит вам:
1. Запустить продукт за 10 минут
2. Использовать свой домен
3. Получить автоматический SSL
4. Начать принимать трафик сегодня

API можно оставить на Replit, а позже при росте нагрузки перенести на VPS.

## Следующие шаги

1. Выберите вариант развертывания
2. Подготовьте домен
3. Настройте DNS
4. Разверните приложение
5. Протестируйте работу

Нужна помощь с конкретным вариантом?