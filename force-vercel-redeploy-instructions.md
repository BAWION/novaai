# Принудительный редеплой с актуальным коммитом

## Проблема:
Vercel использует старый коммит 3948cb1 вместо нового 1489116 с обновленным vercel.json

## Решение:

### Вариант 1: Принудительный push
```bash
git push --force-with-lease origin main
```

### Вариант 2: Очистка кэша в Vercel
1. Vercel Dashboard → Settings → General
2. Найдите "Clear Build Cache" 
3. Нажмите Clear и сделайте новый деплой

### Вариант 3: Новый коммит
```bash
git commit --allow-empty -m "Force rebuild with latest vercel.json"
git push origin main
```

### Вариант 4: Ручной редеплой
1. В Vercel Deployments
2. Найдите коммит 1489116 в списке
3. Если его нет - нажмите "Create Deployment"
4. Выберите ветку main и последний коммит

## Проверка результата:
В логах сборки должно появиться:
```
Cloning github.com/BAWION/novaai (Branch: main, Commit: 1489116)
```

Тогда CSS файлы будут загружаться правильно.