# Решение проблемы Vercel Git кэширования

## Радикальное решение - отключение и переподключение Git

1. **Vercel Dashboard** → **novaai-academy** → **Settings**
2. **Git** → **Disconnect** (отключить репозиторий)
3. **Confirm Disconnect**
4. **Import Git Repository** → выбрать **BAWION/novaai** заново
5. **Deploy** - это создаст полностью свежий деплой

## Альтернатива - изменение branch

1. **Settings** → **Git** 
2. **Production Branch** - временно измените на `development`
3. **Deploy** 
4. Затем верните обратно на `main`
5. **Deploy** еще раз

## Что происходит сейчас

Логи показывают новые домены:
- `novaai-academy-7rhf5gzbg`
- `novaai-academy-2lns7i4hi`

Это означает что Vercel создает новые деплои, но пока не подтягивает актуальный коммит.

## Проверка актуального коммита

Актуальный коммит в GitHub: **0f99fbe**
Vercel использует: **26d1b5a** (устаревший)

После любого из методов выше Vercel подтянет коммит 0f99fbe с исправленным service-worker-simple.js.