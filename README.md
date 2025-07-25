# LMS Web Platform 🚀

![Build Status](https://github.com/is921966/lms-web-nextjs/workflows/Deploy%20to%20Railway/badge.svg)
![Tests](https://img.shields.io/badge/tests-21%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Современная веб-платформа для корпоративного обучения, построенная на Next.js 14 и Supabase.

## 🏗 Технологический стек

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Стилизация**: Tailwind CSS, shadcn/ui
- **База данных**: Supabase (PostgreSQL)
- **Тестирование**: Vitest, React Testing Library
- **Deployment**: Railway, Vercel
- **CI/CD**: GitHub Actions

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

Создайте файл `.env.local` на основе `.env.local.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## 🧪 Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск тестов в режиме наблюдения
npm run test

# Запуск тестов с покрытием
npm run test:coverage

# Единоразовый запуск тестов
npm run test:run
```

### Текущее покрытие

- **22 теста** - все проходят ✅
- **100% TDD compliance**
- Модули с тестами:
  - Feed (PostCard, PostEditor, useFeed)
  - Courses (CourseCard, CoursesPage)
  - Общие компоненты

## 📁 Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Dashboard layout группа
│   │   ├── courses/      # Страница курсов
│   │   ├── feed/         # Лента новостей
│   │   └── layout.tsx    # Dashboard layout
│   ├── api/              # API endpoints
│   │   └── health/       # Health check
│   └── page.tsx          # Главная страница
├── components/           # React компоненты
│   └── features/        # Feature-based компоненты
│       ├── courses/     # Компоненты курсов
│       └── feed/        # Компоненты ленты
├── lib/                 # Утилиты и хуки
│   ├── hooks/          # Custom React hooks
│   └── supabase/       # Supabase клиент
└── test/               # Тестовые утилиты
```

## 🔧 Основные команды

```bash
npm run dev          # Запуск dev сервера
npm run build        # Production сборка
npm run start        # Запуск production сервера
npm run lint         # Проверка линтером
npm test             # Запуск тестов
```

## 🌟 Основные возможности

### Feed модуль
- Просмотр ленты новостей
- Создание постов (PostEditor)
- Два стиля отображения (Classic/Telegram)
- Реакции и комментарии

### Course модуль
- Каталог курсов
- Фильтрация по категориям и сложности
- Карточки курсов с прогрессом
- Запись на курсы

## 🚀 Deployment

### Railway

1. Создайте проект в Railway
2. Подключите GitHub репозиторий
3. Добавьте переменные окружения
4. Deploy произойдет автоматически

### Vercel

```bash
npx vercel
```

## 📊 База данных

Схема БД включает:
- Пользователи и профили
- Курсы и модули
- Лента и подписки
- Комментарии и реакции

Миграции находятся в `supabase/migrations/`

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch
3. Напишите тесты (TDD обязателен!)
4. Commit изменений
5. Push в branch
6. Создайте Pull Request

## 📝 Лицензия

MIT

---

**Создано с ❤️ используя современные технологии и TDD подход**
