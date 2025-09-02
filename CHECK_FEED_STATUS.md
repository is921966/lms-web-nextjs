# 🔍 Проверка статуса ленты после заполнения БД

## После выполнения SQL в Supabase:

1. **Проверьте API статус:**
   ```bash
   curl https://lms-web-nextjs-production.up.railway.app/api/check-db | jq
   ```
   
   Должно показать:
   - profiles: 3 записей
   - channels: 3 записей  
   - posts: 3 записей

2. **Откройте ленту:**
   https://lms-web-nextjs-production.up.railway.app/feed
   
   Должны появиться посты:
   - "Запуск новой LMS платформы!"
   - "Новый курс: Основы менеджмента"
   - "График отпусков"

## Если лента все еще пуста:

1. **Проверьте логи Railway:**
   - Railway Dashboard → ваш проект → Logs
   - Ищите ошибки при загрузке постов

2. **Проверьте таблицы в Supabase:**
   - Table Editor → feed_posts
   - Должны быть 3 записи

3. **Попробуйте обновить страницу** (Ctrl+F5)

## Если ничего не помогает:
Отправьте мне скриншот из Supabase Table Editor таблицы feed_posts 