#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Проверка production деплоя LMS Web Platform"
echo "==========================================="

# Запрашиваем URL у пользователя или используем переданный
if [ -z "$1" ]; then
    echo "❓ Введите production URL (например: https://lms-web-nextjs.up.railway.app):"
    read -r PRODUCTION_URL
else
    PRODUCTION_URL=$1
fi

# Убираем слеш в конце если есть
PRODUCTION_URL=${PRODUCTION_URL%/}

echo -e "\n📍 Проверяем URL: $PRODUCTION_URL"
echo "==========================================="

# Функция проверки endpoint
check_endpoint() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    echo -ne "Проверяем $description ($endpoint)... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTION_URL$endpoint")
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}✅ OK (HTTP $response)${NC}"
        return 0
    else
        echo -e "${RED}❌ FAIL (HTTP $response, expected $expected_status)${NC}"
        return 1
    fi
}

# Счетчики
TOTAL=0
PASSED=0

# Проверка основной страницы
TOTAL=$((TOTAL + 1))
if check_endpoint "/" "200" "главная страница"; then
    PASSED=$((PASSED + 1))
fi

# Проверка health check
TOTAL=$((TOTAL + 1))
if check_endpoint "/api/health" "200" "health check API"; then
    PASSED=$((PASSED + 1))
    
    # Получаем детали health check
    echo -e "  ${YELLOW}Детали health check:${NC}"
    curl -s "$PRODUCTION_URL/api/health" | jq '.' 2>/dev/null || echo "  Не удалось распарсить JSON"
fi

# Проверка страницы курсов
TOTAL=$((TOTAL + 1))
if check_endpoint "/courses" "200" "страница курсов"; then
    PASSED=$((PASSED + 1))
fi

# Проверка страницы ленты
TOTAL=$((TOTAL + 1))
if check_endpoint "/feed" "200" "лента новостей"; then
    PASSED=$((PASSED + 1))
fi

# Проверка 404 страницы
TOTAL=$((TOTAL + 1))
if check_endpoint "/non-existent-page-12345" "404" "404 страница"; then
    PASSED=$((PASSED + 1))
fi

# Проверка скорости ответа главной страницы
echo -e "\n⏱️  Проверка производительности:"
response_time=$(curl -s -o /dev/null -w "%{time_total}" "$PRODUCTION_URL/")
echo -e "  Время ответа главной страницы: ${YELLOW}${response_time}s${NC}"

# Проверка заголовков
echo -e "\n📋 Заголовки ответа:"
curl -s -I "$PRODUCTION_URL/" | grep -E "x-powered-by|server|content-type" | sed 's/^/  /'

# Итоговая статистика
echo -e "\n==========================================="
echo -e "📊 Результаты проверки:"
echo -e "  Пройдено: ${GREEN}$PASSED${NC} из $TOTAL тестов"

if [ $PASSED -eq $TOTAL ]; then
    echo -e "\n${GREEN}✅ Все проверки пройдены успешно!${NC}"
    echo -e "${GREEN}🎉 Production деплой работает корректно!${NC}"
else
    echo -e "\n${RED}⚠️  Некоторые проверки не прошли${NC}"
    echo -e "Проверьте логи в Railway Dashboard"
fi

echo -e "\n💡 Полезные команды:"
echo "  - Просмотр логов: Railway Dashboard → Observability → Logs"
echo "  - Мониторинг: Railway Dashboard → Observability → Metrics"
echo "  - Переменные окружения: Railway Dashboard → Variables"

# Опциональная проверка Supabase подключения
echo -e "\n🔍 Дополнительные проверки (опционально):"
echo "  1. Создайте тестового пользователя через Supabase Dashboard"
echo "  2. Попробуйте создать пост в ленте"
echo "  3. Проверьте загрузку курсов из базы данных" 