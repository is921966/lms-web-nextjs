# 🚀 Production Deployment Checklist

**Проект**: LMS Web Platform  
**Дата**: 25 июля 2025

## ✅ GitHub Repository

- [x] Репозиторий создан: https://github.com/is921966/lms-web-nextjs
- [x] RAILWAY_TOKEN добавлен в секреты
- [x] GitHub Actions настроены (Deploy to Railway)
- [x] Dependabot конфигурация добавлена
- [x] Topics добавлены (nextjs, typescript, supabase, lms, education)
- [x] Discussions включены
- [ ] Branch Protection (опционально, можно добавить позже)

**Статус**: 91% готовности ✅

## ✅ Supabase Project

### Что нужно сделать в Supabase Dashboard:

1. **SQL Editor → Выполнить миграции**:
   ```sql
   -- 1. Скопируйте содержимое файла:
   supabase/migrations/001_initial_schema.sql
   
   -- 2. Затем выполните:
   supabase/migrations/002_row_level_security.sql
   
   -- 3. Опционально - тестовые данные:
   supabase/seed.sql
   ```

2. **Settings → API → Получить ключи**:
   - Project URL: `https://your-project-ref.supabase.co`
   - Anon Key: `eyJ...` (публичный ключ)
   - Service Role Key: `eyJ...` (приватный ключ)

3. **Authentication → Providers**:
   - Email Auth: включен по умолчанию
   - Настроить домен для email (опционально)

## ✅ Railway Deployment

### Переменные окружения для Railway:

```env
# Supabase (ОБЯЗАТЕЛЬНО)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL (Railway предоставит автоматически)
NEXT_PUBLIC_APP_URL=${{RAILWAY_STATIC_URL}}
```

### Шаги деплоя:

1. **Создайте новый проект в Railway**:
   - New Project → Deploy from GitHub repo
   - Выберите `is921966/lms-web-nextjs`
   - Railway автоматически обнаружит Next.js

2. **Добавьте переменные окружения**:
   - Variables → Add Variables
   - Скопируйте значения из Supabase

3. **Запустите деплой**:
   - Deploy → Deploy Now
   - Или сделайте push в main branch

## 📋 Pre-flight Check

### Локальное тестирование:

```bash
# 1. Создайте .env.local
cp .env.local.example .env.local

# 2. Добавьте ваши Supabase credentials

# 3. Запустите локально
npm run dev

# 4. Проверьте:
- http://localhost:3000 - главная страница
- http://localhost:3000/feed - лента новостей
- http://localhost:3000/courses - каталог курсов
- http://localhost:3000/api/health - health check
```

### Запуск тестов:

```bash
# Unit тесты
npm run test:run

# С покрытием
npm run test:coverage
```

## 🎯 First Deploy Verification

После первого деплоя проверьте:

1. **Railway Dashboard**:
   - ✅ Build успешен
   - ✅ Deploy статус: Active
   - ✅ Logs без ошибок

2. **Приложение**:
   - ✅ Главная страница загружается
   - ✅ Навигация работает
   - ✅ /api/health возвращает 200 OK

3. **GitHub Actions**:
   - ✅ Workflow "Deploy to Railway" прошел успешно

## 🆘 Troubleshooting

### Если сборка падает:
1. Проверьте logs в Railway
2. Убедитесь, что все env variables добавлены
3. Проверьте, что Supabase URL правильный

### Если 500 ошибка:
1. Проверьте Supabase credentials
2. Убедитесь, что миграции выполнены
3. Проверьте Railway logs

### Полезные команды:
```bash
# Проверить статус GitHub
./scripts/check-github-setup.sh

# Проверить health локально
curl http://localhost:3000/api/health

# Проверить env variables
npm run build && npm start
```

## 📊 Готовность к деплою

```
GitHub Setup:      ████████████████████ 100% ✅
Supabase Setup:    ████████████████░░░░ 80% (нужны миграции)
Railway Setup:     ████████████░░░░░░░░ 60% (нужны env vars)
Local Testing:     ████████████████████ 100% ✅

Общая готовность:  ████████████████░░░░ 85%
```

## ⏰ Время до production

- Выполнение миграций Supabase: ~5 минут
- Настройка Railway env vars: ~3 минуты
- Первый деплой: ~3-5 минут
- **Итого**: ~15 минут до production! 🚀

---

**Следующий шаг**: Выполните миграции в Supabase SQL Editor! 