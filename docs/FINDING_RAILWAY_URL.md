# 🔍 Как найти Production URL в Railway

## Где искать URL вашего деплоя

### Вариант 1: В главном дашборде проекта
1. Откройте Railway Dashboard: https://railway.app
2. Выберите проект `lms-web-nextjs`
3. Кликните на сервис (обычно показан как карточка)
4. URL будет отображаться:
   - В правом верхнем углу карточки сервиса
   - Обычно выглядит как: `lms-web-nextjs-production.up.railway.app`

### Вариант 2: В настройках сервиса
1. Кликните на сервис в проекте
2. Перейдите на вкладку **Settings**
3. В секции **Domains** вы увидите:
   - Railway-provided domain (автоматически сгенерированный)
   - Возможность добавить Custom Domain

### Вариант 3: В разделе деплоев
1. В правой панели активности найдите последний успешный деплой
2. Кликните на него
3. URL будет показан в деталях деплоя

## 📱 Типичные форматы Railway URL

Railway генерирует URL в следующих форматах:
- `{service-name}-production.up.railway.app`
- `{service-name}-{random-id}.up.railway.app`
- `{custom-name}.up.railway.app`

## ⚠️ Важные моменты

1. **URL появляется только после успешного деплоя**
   - Статус должен быть "Active" или "Success"
   - Не "Building" или "Failed"

2. **Проверьте, что сервис "exposed"**
   - В Settings должна быть включена опция "Generate Domain"
   - Или добавлен Custom Domain

3. **Порт должен быть правильно настроен**
   - Railway автоматически определяет порт из переменной PORT
   - Next.js обычно использует порт 3000

## 🚀 После получения URL

Запустите проверку:
```bash
./scripts/check-production.sh https://your-app.up.railway.app
```

Или проверьте вручную:
```bash
# Проверка главной страницы
curl https://your-app.up.railway.app

# Проверка health check
curl https://your-app.up.railway.app/api/health

# Открыть в браузере
open https://your-app.up.railway.app
```

## 🆘 Если URL не работает

1. **Проверьте логи в Railway**:
   - Observability → Logs
   - Ищите ошибки запуска

2. **Проверьте переменные окружения**:
   - Все ли Supabase ключи добавлены?
   - Правильные ли значения?

3. **Проверьте статус деплоя**:
   - Должен быть "Active"
   - Не должно быть "Crashed" или "Failed"

4. **Health check может помочь**:
   - Если `/api/health` работает, значит сервер запущен
   - Если нет - проблема с запуском приложения 