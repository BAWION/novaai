#!/usr/bin/env node

/**
 * Полное развертывание NovaAI University на VPS
 * Максимальная производительность и контроль
 */

import fs from 'fs';

const log = (msg, color = 'white') => {
  const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[color]}${msg}${colors.reset}`);
};

function createDockerCompose() {
  const dockerCompose = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://nova:password@db:5432/novaai
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=novaai
      - POSTGRES_USER=nova
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

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
    restart: unless-stopped

volumes:
  postgres_data:
`;

  fs.writeFileSync('docker-compose.yml', dockerCompose);
  log('✅ Создан docker-compose.yml', 'green');
}

function createDockerfile() {
  const dockerfile = `FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
`;

  fs.writeFileSync('Dockerfile', dockerfile);
  log('✅ Создан Dockerfile', 'green');
}

function createNginxConfig() {
  const nginxConf = `events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

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
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
`;

  fs.writeFileSync('nginx.conf', nginxConf);
  log('✅ Создан nginx.conf', 'green');
}

function createDeployScript() {
  const deployScript = `#!/bin/bash

# Скрипт развертывания NovaAI University на VPS

echo "🚀 Развертывание NovaAI University на VPS"

# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
if ! command -v docker &> /dev/null; then
    echo "📦 Установка Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
fi

# Установка Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Установка Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Клонирование проекта (замените на ваш репозиторий)
# git clone https://github.com/your-username/novaai-university.git
# cd novaai-university

# Создание .env файла
echo "📝 Настройка переменных окружения..."
cat > .env << EOF
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
NODE_ENV=production
EOF

# Получение SSL сертификата (Let's Encrypt)
sudo apt install certbot -y
sudo mkdir -p ssl
# sudo certbot certonly --standalone -d your-domain.com
# sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
# sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem

# Сборка и запуск
echo "🏗️  Сборка и запуск сервисов..."
docker-compose up -d --build

echo "✅ Развертывание завершено!"
echo "🌐 Ваша платформа доступна на https://your-domain.com"
`;

  fs.writeFileSync('deploy-vps.sh', deployScript);
  fs.chmodSync('deploy-vps.sh', '755');
  log('✅ Создан deploy-vps.sh', 'green');
}

function createEnvTemplate() {
  const envTemplate = `# Переменные окружения для VPS развертывания

# API ключи (обязательно)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# База данных
DATABASE_URL=postgresql://nova:password@db:5432/novaai

# Окружение
NODE_ENV=production

# Домен
DOMAIN=your-domain.com
`;

  fs.writeFileSync('.env.production', envTemplate);
  log('✅ Создан .env.production', 'green');
}

function showInstructions() {
  log('\n📋 ИНСТРУКЦИЯ ПО VPS РАЗВЕРТЫВАНИЮ:', 'blue');
  log('1. Арендуйте VPS (Ubuntu 20.04+, минимум 2GB RAM)', 'yellow');
  log('2. Скопируйте файлы на сервер:', 'yellow');
  log('   scp -r . user@your-server:/home/user/novaai/', 'white');
  log('3. Подключитесь к серверу:', 'yellow');
  log('   ssh user@your-server', 'white');
  log('4. Запустите развертывание:', 'yellow');
  log('   cd novaai && ./deploy-vps.sh', 'white');
  log('5. Настройте DNS домена на IP сервера', 'yellow');
  
  log('\n🎯 РЕЗУЛЬТАТ:', 'green');
  log('• Полный контроль над инфраструктурой', 'white');
  log('• Высокая производительность', 'white');
  log('• Собственная база данных', 'white');
  log('• SSL сертификат', 'white');
  log('• Автоматические перезапуски', 'white');
  
  log('\n💰 СТОИМОСТЬ: $10-50/месяц', 'blue');
  log('⚡ ПРОИЗВОДИТЕЛЬНОСТЬ: 1000+ пользователей', 'blue');
}

function main() {
  log('🏗️  Создание файлов для VPS развертывания\n', 'blue');
  
  createDockerCompose();
  createDockerfile();
  createNginxConfig();
  createDeployScript();
  createEnvTemplate();
  
  showInstructions();
}

main();