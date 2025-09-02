# 🚀 Быстрая настройка базы данных

## Один шаг для заполнения БД:

1. Создайте файл `.env.local` в папке `lms-web`:
```bash
NEXT_PUBLIC_SUPABASE_URL=ваш-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-key  
SUPABASE_SERVICE_ROLE_KEY=ваш-service-key
```

2. Запустите команду:
```bash
node scripts/auto-populate-db.js
```

## Где взять ключи:
- Supabase Dashboard → Project Settings → API
- Скопируйте все 3 значения

Скрипт автоматически:
✅ Удалит ограничения
✅ Попробует разные роли
✅ Создаст все данные
✅ Покажет результат 