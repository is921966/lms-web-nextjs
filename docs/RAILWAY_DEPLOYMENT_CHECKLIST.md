# ✅ Railway Deployment Checklist

## 1. Проверьте статус деплоя в Dashboard

### В правой панели активности найдите:
- ✅ **"Deployment successful"** или **"Active"** - хорошо
- ❌ **"Failed"**, **"Crashed"**, **"Building"** - проблема

### Если статус "Failed" или "Crashed":
1. Кликните на деплой
2. Перейдите в **Deploy Logs**
3. Ищите ошибки (обычно красным текстом)
4. Частые проблемы:
   - Missing environment variables
   - Port binding errors
   - Build failures

## 2. Включите публичный доступ

### Перейдите в Settings сервиса:
1. Кликните на сервис `lms-web-nextjs`
2. Перейдите на вкладку **Settings**
3. Найдите секцию **Networking**
4. Нажмите **Generate Domain** или **Add Domain**
5. Railway создаст URL вида:
   - `your-app-name.up.railway.app`
   - или случайное имя вроде `careful-tree-production.up.railway.app`

## 3. Проверьте переменные окружения

### В разделе Variables убедитесь, что есть:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `PORT` (должен быть автоматически установлен Railway)

### Дополнительно можно добавить:
```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.up.railway.app
```

## 4. Проверьте логи приложения

### В Observability → Logs найдите:
```
✅ Listening on port 3000 (или другой порт)
✅ Ready on http://localhost:3000
✅ Environment: production
```

### Если видите ошибки:
```
❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL
❌ Error: Cannot connect to database
❌ Error: Port is already in use
```

## 5. Диагностика проблем

### Если приложение не запускается:

**A. Проверьте Build Logs:**
```
✅ Creating an optimized production build...
✅ Compiled successfully
✅ Collecting page data
✅ Generating static pages
```

**B. Проверьте Deploy Logs:**
```
✅ Starting server...
✅ Listening on port $PORT
```

**C. Частые ошибки и решения:**

| Ошибка | Решение |
|--------|---------|
| "Missing environment variable" | Добавьте переменную в Variables |
| "Cannot find module" | Проверьте package.json и node_modules |
| "Port is already in use" | Используйте `process.env.PORT` |
| "Supabase connection failed" | Проверьте правильность ключей |

## 6. После успешного деплоя

### Скопируйте URL из Settings → Domains
Например: `https://your-app-name.up.railway.app`

### Проверьте работу:
```bash
# Запустите наш скрипт проверки
./scripts/check-production.sh https://your-app-name.up.railway.app

# Или вручную
curl https://your-app-name.up.railway.app/api/health
```

## 7. Troubleshooting команды

### Если нужно перезапустить:
1. В правой панели найдите три точки `...`
2. Выберите **Restart**

### Если нужно откатиться:
1. Найдите предыдущий успешный деплой
2. Нажмите **Rollback to this deployment**

### Если нужно пересобрать:
1. Сделайте пустой коммит:
   ```bash
   git commit --allow-empty -m "Trigger rebuild"
   git push
   ```

## 📱 Финальная проверка

После получения рабочего URL:
- [ ] Главная страница загружается
- [ ] /api/health возвращает 200 OK
- [ ] /courses показывает страницу курсов
- [ ] /feed показывает ленту новостей
- [ ] Нет ошибок в консоли браузера
- [ ] Supabase подключение работает

## 🎉 Успех!

Если все пункты выполнены - ваше приложение работает в production! 