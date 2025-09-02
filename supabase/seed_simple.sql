-- Упрощенный seed для Supabase
-- Выполните этот SQL в Supabase SQL Editor

-- 1. Сначала удаляем все foreign key ограничения
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey CASCADE;
ALTER TABLE feed_channels DROP CONSTRAINT IF EXISTS feed_channels_creator_id_fkey CASCADE;
ALTER TABLE feed_posts DROP CONSTRAINT IF EXISTS feed_posts_author_id_fkey CASCADE;
ALTER TABLE feed_posts DROP CONSTRAINT IF EXISTS feed_posts_channel_id_fkey CASCADE;

-- 2. Создаем тестовые профили
INSERT INTO profiles (id, full_name, role, department, position, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'Администратор', 'admin', 'IT', 'Админ', NOW(), NOW()),
('22222222-2222-2222-2222-222222222222', 'Мария Иванова', 'student', 'HR', 'Менеджер', NOW(), NOW()),
('33333333-3333-3333-3333-333333333333', 'Петр Сидоров', 'student', 'Продажи', 'Менеджер', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- 3. Создаем каналы
INSERT INTO feed_channels (id, name, slug, description, icon, color, is_official, creator_id, created_at) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Новости компании', 'company-news', 'Официальные новости', '📢', '#3B82F6', true, '11111111-1111-1111-1111-111111111111', NOW()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Обучение', 'learning', 'Курсы и тренинги', '📚', '#10B981', true, '11111111-1111-1111-1111-111111111111', NOW()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'HR новости', 'hr-news', 'От HR отдела', '👥', '#F59E0B', true, '22222222-2222-2222-2222-222222222222', NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- 4. Создаем посты (упрощенная структура)
INSERT INTO feed_posts (
  id,
  channel_id, 
  author_id, 
  title, 
  content, 
  excerpt,
  media_urls,
  published_at,
  likes_count,
  comments_count
) VALUES
(
  gen_random_uuid(),
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'Запуск новой LMS платформы!',
  'Рады сообщить о запуске новой платформы корпоративного обучения. Теперь все сотрудники могут проходить курсы онлайн.',
  'Запущена новая платформа обучения',
  ARRAY['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800'],
  NOW(),
  15,
  7
),
(
  gen_random_uuid(),
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '22222222-2222-2222-2222-222222222222',
  'Новый курс: Основы менеджмента',
  'Открыта регистрация на курс "Основы менеджмента". Старт 1 августа 2025.',
  'Новый курс по менеджменту',
  NULL,
  NOW() - INTERVAL '1 day',
  23,
  5
),
(
  gen_random_uuid(),
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '22222222-2222-2222-2222-222222222222',
  'График отпусков',
  'Напоминаем о необходимости подать заявления на отпуск до 31 июля.',
  'Подайте заявление на отпуск',
  NULL,
  NOW() - INTERVAL '2 days',
  8,
  3
);

-- 5. Обновляем счетчики в каналах
UPDATE feed_channels SET 
  posts_count = (SELECT COUNT(*) FROM feed_posts WHERE channel_id = feed_channels.id),
  subscribers_count = 100
WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc');

-- 6. Готово!
-- Теперь в вашей ленте есть тестовые данные 