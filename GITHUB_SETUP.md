# 🚀 GitHub Repository Setup

Проект готов к публикации на GitHub! Следуйте этим шагам:

## Способ 1: Через GitHub веб-интерфейс (Рекомендуется)

1. **Создайте новый репозиторий на GitHub**:
   - Перейдите на [github.com/new](https://github.com/new)
   - **Repository name**: `lms-web-platform`
   - **Description**: "Modern LMS Web Platform built with Next.js 14 and Supabase"
   - **Public/Private**: Выберите по желанию
   - **НЕ** инициализируйте с README, .gitignore или license

2. **Подключите локальный репозиторий**:
```bash
# Замените YOUR_USERNAME на ваш GitHub username
git remote add origin https://github.com/YOUR_USERNAME/lms-web-platform.git
git branch -M main
git push -u origin main
```

## Способ 2: Через GitHub CLI

Если у вас установлен GitHub CLI:

```bash
# Установка GitHub CLI (если еще нет)
brew install gh

# Авторизация
gh auth login

# Создание репозитория
gh repo create lms-web-platform --public --source=. --remote=origin --push
```

## После создания репозитория

### 1. Добавьте секреты для CI/CD

В настройках репозитория (Settings → Secrets and variables → Actions) добавьте:

- `RAILWAY_TOKEN` - для автоматического deployment

### 2. Включите GitHub Actions

Actions должны включиться автоматически. Проверьте вкладку Actions.

### 3. Защитите main branch (опционально)

Settings → Branches → Add rule:
- Branch name pattern: `main`
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass before merging

## Структура репозитория

```
lms-web-platform/
├── .github/workflows/   # CI/CD
├── src/                 # Исходный код
├── supabase/           # Миграции БД
├── docs/               # Документация
├── public/             # Статические файлы
├── tests/              # Тесты
├── README.md           # Описание проекта
├── package.json        # Зависимости
└── railway.toml        # Deploy конфигурация
```

## Полезные GitHub Features

### 1. GitHub Pages для документации

```bash
# В Settings → Pages
# Source: Deploy from a branch
# Branch: main
# Folder: /docs
```

### 2. Issues Templates

Создайте `.github/ISSUE_TEMPLATE/`:
- `bug_report.md`
- `feature_request.md`

### 3. Pull Request Template

Создайте `.github/pull_request_template.md`

## README Badges

Добавьте в README.md:

```markdown
![Build Status](https://github.com/YOUR_USERNAME/lms-web-platform/workflows/Deploy%20to%20Railway/badge.svg)
![Tests](https://img.shields.io/badge/tests-21%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
```

## 🎉 Готово!

После выполнения этих шагов ваш проект будет:
- ✅ Опубликован на GitHub
- ✅ Готов для совместной разработки
- ✅ Настроен для автоматического deployment
- ✅ Защищен CI/CD pipeline

---

**Нужна помощь?** Создайте issue в репозитории! 