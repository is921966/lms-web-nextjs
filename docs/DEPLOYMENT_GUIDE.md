# 🚀 Production Deployment Guide

Пошаговое руководство по развертыванию LMS Web Platform в production.

## 📋 Требования

- Аккаунт [Supabase](https://supabase.com)
- Аккаунт [Railway](https://railway.app) или [Vercel](https://vercel.com)
- GitHub репозиторий с кодом проекта

## Шаг 1: Настройка Supabase 🗄️

### 1.1 Создание проекта

1. Перейдите на [app.supabase.com](https://app.supabase.com)
2. Нажмите "New Project"
3. Заполните:
   - **Name**: `lms-production`
   - **Database Password**: сохраните в безопасном месте!
   - **Region**: выберите ближайший к вашим пользователям

### 1.2 Настройка базы данных

1. После создания проекта перейдите в SQL Editor
2. Выполните миграции в порядке:

```sql
-- Выполните содержимое файла:
-- supabase/migrations/001_initial_schema.sql
```

Затем:

```sql
-- Выполните содержимое файла:
-- supabase/migrations/002_row_level_security.sql
```

### 1.3 Получение ключей

1. Перейдите в Settings → API
2. Скопируйте:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

## Шаг 2: Deployment в Railway 🚂

### 2.1 Подготовка репозитория

1. Создайте новый репозиторий на GitHub
2. Добавьте код:

```bash
cd lms-web
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/lms-web.git
git push -u origin main
```

### 2.2 Создание проекта в Railway

1. Перейдите на [railway.app](https://railway.app)
2. Нажмите "New Project"
3. Выберите "Deploy from GitHub repo"
4. Авторизуйте Railway для доступа к вашему репозиторию
5. Выберите репозиторий `lms-web`

### 2.3 Настройка переменных окружения

В Railway добавьте переменные:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### 2.4 Deploy

Railway автоматически:
- Обнаружит Next.js проект
- Установит зависимости
- Соберет production build
- Запустит приложение

## Альтернатива: Deployment в Vercel ▲

### 3.1 Установка Vercel CLI

```bash
npm i -g vercel
```

### 3.2 Deploy

```bash
cd lms-web
vercel

# Следуйте инструкциям:
# - Link to existing project? No
# - What's your project's name? lms-web
# - In which directory is your code located? ./
# - Want to override the settings? No
```

### 3.3 Добавление переменных окружения

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

## Шаг 4: Проверка deployment ✅

### 4.1 Health Check

```bash
curl https://your-app.railway.app/api/health
# или
curl https://your-app.vercel.app/api/health
```

Должен вернуть:
```json
{
  "status": "ok",
  "timestamp": "2025-07-25T...",
  "service": "lms-web",
  "version": "0.1.0"
}
```

### 4.2 Проверка функциональности

1. Откройте приложение в браузере
2. Проверьте:
   - ✅ Главная страница загружается
   - ✅ Навигация работает
   - ✅ Страница курсов открывается
   - ✅ Лента новостей отображается

## Шаг 5: Настройка домена (опционально) 🌐

### Railway
1. Settings → Domains
2. Add Custom Domain
3. Настройте DNS записи

### Vercel
1. Settings → Domains
2. Add Domain
3. Следуйте инструкциям DNS

## 📊 Мониторинг

### Рекомендуемые сервисы:

1. **Sentry** для отслеживания ошибок:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

2. **Vercel Analytics** (если используете Vercel):
```bash
npm install @vercel/analytics
```

## 🔒 Безопасность

### Чеклист:
- [ ] Все переменные окружения настроены
- [ ] Service Role Key НЕ используется на клиенте
- [ ] RLS политики проверены
- [ ] CORS настроен правильно
- [ ] Rate limiting включен

## 🚨 Troubleshooting

### Проблема: "Database connection failed"
**Решение**: Проверьте SUPABASE_URL и ключи

### Проблема: "Build failed"
**Решение**: 
```bash
npm run build # локально
npm run test:run # все тесты должны проходить
```

### Проблема: "RLS policy violation"
**Решение**: Проверьте политики в Supabase Dashboard

## 📝 Post-Deployment

После успешного deployment:

1. **Создайте тестовые данные**:
   - Несколько каналов в ленте
   - Тестовые курсы
   - Пример постов

2. **Настройте резервное копирование**:
   - Supabase делает автоматические бэкапы
   - Настройте дополнительные если нужно

3. **Включите мониторинг**:
   - Railway Metrics
   - Supabase Dashboard
   - Внешний uptime monitor

## 🎉 Готово!

Ваше приложение теперь работает в production! 

### Полезные ссылки:
- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Вопросы?** Создайте issue в репозитории или обратитесь в поддержку выбранной платформы. 