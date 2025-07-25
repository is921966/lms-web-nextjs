-- Seed данные для тестирования БЕЗ Supabase Auth
-- Выполните этот SQL в Supabase SQL Editor

-- ВАЖНО: Сначала удалите ограничение foreign key
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Проверяем какие роли допустимы
-- Раскомментируйте эту строку чтобы увидеть ограничения:
-- \d profiles

-- 1. Создаем тестовые профили
-- Используем роли которые точно существуют в системе
INSERT INTO profiles (id, full_name, role, department, position, created_at, updated_at) VALUES 
('d0d5e7a0-1111-1111-1111-111111111111', 'Администратор системы', 'admin', 'IT', 'Системный администратор', NOW(), NOW()),
('d0d5e7a0-2222-2222-2222-222222222222', 'Мария Иванова', 'employee', 'HR', 'HR менеджер', NOW(), NOW()),
('d0d5e7a0-3333-3333-3333-333333333333', 'Петр Сидоров', 'employee', 'Продажи', 'Менеджер по продажам', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  department = EXCLUDED.department,
  position = EXCLUDED.position,
  updated_at = NOW();

-- Если роль 'employee' не подходит, попробуйте эти варианты:
-- 'student', 'instructor', 'moderator'

-- 2. Создаем каналы ленты
INSERT INTO feed_channels (id, name, slug, description, icon, color, is_official, creator_id, created_at) VALUES
('c0c5e7a0-1111-1111-1111-111111111111', 'Новости компании', 'company-news', 'Официальные новости и объявления', '📢', '#3B82F6', true, 'd0d5e7a0-1111-1111-1111-111111111111', NOW()),
('c0c5e7a0-2222-2222-2222-222222222222', 'Обучение и развитие', 'learning', 'Новости о курсах и тренингах', '📚', '#10B981', true, 'd0d5e7a0-1111-1111-1111-111111111111', NOW()),
('c0c5e7a0-3333-3333-3333-333333333333', 'HR новости', 'hr-news', 'Важная информация от HR отдела', '👥', '#F59E0B', true, 'd0d5e7a0-2222-2222-2222-222222222222', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 3. Создаем посты в ленте
INSERT INTO feed_posts (
    channel_id, 
    author_id, 
    title, 
    content, 
    excerpt,
    media_type,
    media_url,
    tags,
    published_at,
    created_at,
    updated_at
) VALUES 
(
    'c0c5e7a0-1111-1111-1111-111111111111',
    'd0d5e7a0-1111-1111-1111-111111111111',
    'Запуск новой платформы корпоративного обучения',
    E'Рады сообщить о запуске новой LMS платформы!\n\nТеперь все сотрудники могут:\n- Проходить курсы в удобное время\n- Отслеживать прогресс обучения\n- Получать сертификаты\n\nНачните обучение уже сегодня!',
    'Запущена новая платформа для корпоративного обучения',
    'image',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
    ARRAY['обучение', 'новости', 'платформа'],
    NOW(),
    NOW(),
    NOW()
),
(
    'c0c5e7a0-2222-2222-2222-222222222222',
    'd0d5e7a0-2222-2222-2222-222222222222',
    'Новый курс: Основы проектного менеджмента',
    E'Открыта регистрация на курс "Основы проектного менеджмента"!\n\nВы научитесь:\n✓ Планировать проекты\n✓ Управлять командой\n✓ Контролировать сроки и бюджет\n\nСтарт курса: 1 августа 2025',
    'Открыта регистрация на новый курс по проектному менеджменту',
    NULL,
    NULL,
    ARRAY['курсы', 'менеджмент', 'обучение'],
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),
(
    'c0c5e7a0-3333-3333-3333-333333333333',
    'd0d5e7a0-2222-2222-2222-222222222222',
    'График отпусков на август',
    E'Напоминаем о необходимости подать заявления на отпуск до 31 июля.\n\nФорма заявления доступна в личном кабинете.\n\nПри планировании отпуска учитывайте загрузку вашего отдела.',
    'Не забудьте подать заявление на отпуск до конца месяца',
    NULL,
    NULL,
    ARRAY['hr', 'отпуск', 'важно'],
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
(
    'c0c5e7a0-1111-1111-1111-111111111111',
    'd0d5e7a0-1111-1111-1111-111111111111',
    'Результаты квартала',
    E'Подводим итоги второго квартала 2025 года.\n\nКлючевые достижения:\n📈 Рост продаж на 15%\n🎯 Выполнение плана на 112%\n👥 Расширение команды на 20 человек\n\nБлагодарим всех за отличную работу!',
    'Компания показала отличные результаты во втором квартале',
    'image',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    ARRAY['результаты', 'квартал', 'достижения'],
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
);

-- 4. Обновляем счетчики
UPDATE feed_channels 
SET subscribers_count = (
    SELECT COUNT(DISTINCT author_id) 
    FROM feed_posts 
    WHERE channel_id = feed_channels.id
);

UPDATE feed_posts 
SET 
    likes_count = floor(random() * 20 + 5)::int,
    comments_count = floor(random() * 10)::int;

-- 5. Создаем подписки
INSERT INTO feed_subscriptions (user_id, channel_id, created_at) VALUES
('d0d5e7a0-1111-1111-1111-111111111111', 'c0c5e7a0-1111-1111-1111-111111111111', NOW()),
('d0d5e7a0-1111-1111-1111-111111111111', 'c0c5e7a0-2222-2222-2222-222222222222', NOW()),
('d0d5e7a0-2222-2222-2222-222222222222', 'c0c5e7a0-1111-1111-1111-111111111111', NOW()),
('d0d5e7a0-2222-2222-2222-222222222222', 'c0c5e7a0-3333-3333-3333-333333333333', NOW()),
('d0d5e7a0-3333-3333-3333-333333333333', 'c0c5e7a0-1111-1111-1111-111111111111', NOW())
ON CONFLICT (user_id, channel_id) DO NOTHING;

-- Проверка результата
SELECT 'Profiles:' as table_name, COUNT(*) as count FROM profiles
UNION ALL
SELECT 'Channels:', COUNT(*) FROM feed_channels
UNION ALL
SELECT 'Posts:', COUNT(*) FROM feed_posts
UNION ALL
SELECT 'Subscriptions:', COUNT(*) FROM feed_subscriptions; 