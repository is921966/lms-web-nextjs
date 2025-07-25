#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Проверка настройки GitHub репозитория..."
echo "==========================================="

# Проверка основной информации
echo -e "\n📋 Основная информация:"
gh repo view --json name,description,isPrivate,defaultBranchRef --jq '
  "Название: \(.name)
Описание: \(.description)
Приватность: \(if .isPrivate then "Private" else "Public" end)
Default branch: \(.defaultBranchRef.name)"'

# Проверка функций
echo -e "\n🔧 Функции репозитория:"
gh api repos/is921966/lms-web-nextjs | jq -r '
  "Issues: \(if .has_issues then "✅ Включены" else "❌ Выключены" end)
Wiki: \(if .has_wiki then "✅ Включена" else "❌ Выключена" end)
Projects: \(if .has_projects then "✅ Включены" else "❌ Выключены" end)
Discussions: \(if .has_discussions then "✅ Включены" else "❌ Выключены" end)"'

# Проверка workflows
echo -e "\n🚀 GitHub Actions:"
WORKFLOW_COUNT=$(gh workflow list 2>/dev/null | wc -l)
if [ $WORKFLOW_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ Workflows найдены:${NC}"
    gh workflow list 2>/dev/null || echo "Используем API..."
    gh api repos/is921966/lms-web-nextjs/actions/workflows --jq '.workflows[] | "  - \(.name) [\(.state)]"'
else
    echo -e "${RED}❌ Workflows не найдены${NC}"
fi

# Проверка секретов
echo -e "\n🔐 Секреты:"
SECRET_COUNT=$(gh secret list | wc -l)
if [ $SECRET_COUNT -gt 0 ]; then
    echo -e "${GREEN}✅ Найдено секретов: $SECRET_COUNT${NC}"
    gh secret list
else
    echo -e "${RED}❌ Секреты не настроены${NC}"
    echo -e "${YELLOW}⚠️  Необходимо добавить RAILWAY_TOKEN${NC}"
fi

# Проверка branch protection
echo -e "\n🛡️ Защита веток:"
if gh api repos/is921966/lms-web-nextjs/branches/main/protection 2>/dev/null; then
    echo -e "${GREEN}✅ Main branch защищена${NC}"
else
    echo -e "${RED}❌ Main branch не защищена${NC}"
fi

# Проверка topics
echo -e "\n🏷️ Topics:"
gh repo view --json repositoryTopics --jq '.repositoryTopics[].name' | while read topic; do
    echo "  - $topic"
done

echo -e "\n==========================================="
echo "📊 Итоговый статус настройки:"

# Подсчет настроенных элементов
TOTAL=0
CONFIGURED=0

# Базовые настройки
TOTAL=$((TOTAL + 5))
CONFIGURED=$((CONFIGURED + 5))

# Функции
if gh api repos/is921966/lms-web-nextjs | jq -e '.has_issues and .has_wiki and .has_projects and .has_discussions' >/dev/null 2>&1; then
    CONFIGURED=$((CONFIGURED + 4))
else
    CONFIGURED=$((CONFIGURED + 3))
fi
TOTAL=$((TOTAL + 4))

# Workflows
if [ $WORKFLOW_COUNT -gt 0 ]; then
    CONFIGURED=$((CONFIGURED + 1))
fi
TOTAL=$((TOTAL + 1))

# Секреты
if [ $SECRET_COUNT -gt 0 ]; then
    CONFIGURED=$((CONFIGURED + 1))
fi
TOTAL=$((TOTAL + 1))

# Branch protection
if gh api repos/is921966/lms-web-nextjs/branches/main/protection 2>/dev/null; then
    CONFIGURED=$((CONFIGURED + 1))
fi
TOTAL=$((TOTAL + 1))

PERCENTAGE=$((CONFIGURED * 100 / TOTAL))

echo -e "Настроено: $CONFIGURED из $TOTAL ($PERCENTAGE%)"

if [ $PERCENTAGE -eq 100 ]; then
    echo -e "${GREEN}✅ Репозиторий полностью настроен!${NC}"
else
    echo -e "${YELLOW}⚠️  Требуется дополнительная настройка${NC}"
    echo -e "\nСм. /docs/GITHUB_SETUP_STATUS.md для подробностей"
fi 