# Принудительное исправление Vercel деплоя

## Текущая проблема
Vercel возвращает 401 + SSO защиту (`_vercel_sso_nonce` cookie).
Это означает что проект защищен системой аутентификации.

## Решение 1: Отключение защиты в Vercel Dashboard

### В панели Vercel:
1. Откройте проект → **Settings**
2. **Security** → найдите **"Deployment Protection"** или **"Access Control"**
3. Отключите все типы защиты:
   - Password Protection
   - Vercel Authentication 
   - Team-only access
4. **Save changes**

### Если не видите эти настройки:
- **General** → Project Settings → убедитесь что проект **Public**
- **Domains** → проверьте что домен не имеет ограничений доступа

## Решение 2: Принудительный публичный деплой

Закоммитим обновленный `vercel.json`:

```bash
git add vercel.json
git commit -m "fix: принудительный публичный доступ через public: true"
git push origin main
```

## Решение 3: Пересоздание проекта (если ничего не помогает)

```bash
# Удалить текущий проект в Vercel Dashboard
# Создать новый:
vercel --prod
# При создании выбрать "Public" доступ
```

## Проверка после исправления:
```bash
curl -I https://your-domain.vercel.app/
# Должен возвращать: HTTP/2 200
# Вместо: HTTP/2 401
```

## Текущий статус:
- ✅ Сборка работает
- ✅ API проксирование настроено  
- ✅ vercel.json исправлен
- ❌ Доступ заблокирован SSO/Password Protection

**Основная задача**: Снять защиту доступа в Vercel Settings.