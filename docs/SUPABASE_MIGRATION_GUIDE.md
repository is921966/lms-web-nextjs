# 🗄️ Supabase Migration Guide

## 📋 Быстрый старт (копируйте команды по порядку)

### Шаг 1: Откройте SQL Editor в Supabase Dashboard

1. Войдите в ваш Supabase проект
2. Слева выберите **SQL Editor**
3. Нажмите **New query**

### Шаг 2: Создайте структуру базы данных

Скопируйте и выполните весь блок:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  department TEXT,
  position TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  instructor_id UUID REFERENCES profiles(id),
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER NOT NULL DEFAULT 0,
  price DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course_modules table
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enrollments table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Feed tables
CREATE TABLE feed_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_official BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  creator_id UUID REFERENCES profiles(id),
  subscribers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feed_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES feed_channels(id) ON DELETE CASCADE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, channel_id)
);

CREATE TABLE feed_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES feed_channels(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  media_urls TEXT[],
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feed_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  parent_id UUID REFERENCES feed_comments(id),
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE feed_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'like',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE TABLE feed_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_feed_posts_channel ON feed_posts(channel_id);
CREATE INDEX idx_feed_posts_author ON feed_posts(author_id);
CREATE INDEX idx_feed_posts_published ON feed_posts(published_at DESC);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
```

### Шаг 3: Настройте Row Level Security (RLS)

Скопируйте и выполните:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Courses policies
CREATE POLICY "Published courses are viewable by everyone" 
  ON courses FOR SELECT USING (status = 'published');

CREATE POLICY "Instructors can manage own courses" 
  ON courses FOR ALL USING (auth.uid() = instructor_id);

-- Course modules policies
CREATE POLICY "Modules viewable for published courses" 
  ON course_modules FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = course_modules.course_id 
      AND courses.status = 'published'
    )
  );

-- Lessons policies
CREATE POLICY "Lessons viewable for published courses" 
  ON lessons FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM course_modules 
      JOIN courses ON courses.id = course_modules.course_id 
      WHERE course_modules.id = lessons.module_id 
      AND courses.status = 'published'
    )
  );

-- Enrollments policies
CREATE POLICY "Users can view own enrollments" 
  ON enrollments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses" 
  ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Feed channels policies
CREATE POLICY "Public channels viewable by everyone" 
  ON feed_channels FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create channels" 
  ON feed_channels FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Feed posts policies
CREATE POLICY "Posts in public channels viewable by everyone" 
  ON feed_posts FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM feed_channels 
      WHERE feed_channels.id = feed_posts.channel_id 
      AND feed_channels.is_public = true
    )
  );

CREATE POLICY "Users can create posts" 
  ON feed_posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" 
  ON feed_posts FOR UPDATE USING (auth.uid() = author_id);

-- Feed subscriptions policies
CREATE POLICY "Users can manage own subscriptions" 
  ON feed_subscriptions FOR ALL USING (auth.uid() = user_id);

-- Feed reactions policies
CREATE POLICY "Users can manage own reactions" 
  ON feed_reactions FOR ALL USING (auth.uid() = user_id);

-- Feed bookmarks policies
CREATE POLICY "Users can manage own bookmarks" 
  ON feed_bookmarks FOR ALL USING (auth.uid() = user_id);

-- Feed comments policies
CREATE POLICY "Comments viewable by everyone" 
  ON feed_comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments" 
  ON feed_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
```

### Шаг 4: Добавьте тестовые данные (опционально)

```sql
-- Создаем тестовых пользователей
INSERT INTO profiles (id, full_name, email, role, department, position) VALUES
  ('d0d3f4a5-8b5a-4c6d-9e7f-1a2b3c4d5e6f', 'Иван Иванов', 'ivan@example.com', 'admin', 'IT', 'Руководитель отдела'),
  ('a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Мария Петрова', 'maria@example.com', 'instructor', 'HR', 'HR Manager'),
  ('b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'Алексей Сидоров', 'alex@example.com', 'student', 'Sales', 'Менеджер');

-- Создаем каналы для ленты
INSERT INTO feed_channels (id, name, slug, description, icon, is_official, creator_id) VALUES
  ('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Новости компании', 'company-news', 'Официальные новости и объявления', 'newspaper', true, 'd0d3f4a5-8b5a-4c6d-9e7f-1a2b3c4d5e6f'),
  ('d4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a', 'HR отдел', 'hr-department', 'Новости от HR отдела', 'users', true, 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d');

-- Создаем курсы
INSERT INTO courses (id, title, description, instructor_id, category, difficulty, duration_hours, status) VALUES
  ('e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b', 'Основы TypeScript', 'Изучите основы TypeScript для современной веб-разработки', 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Программирование', 'beginner', 20, 'published'),
  ('f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c', 'React для начинающих', 'Полный курс по React с практическими примерами', 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Программирование', 'intermediate', 30, 'published');

-- Создаем посты
INSERT INTO feed_posts (channel_id, author_id, title, content, excerpt) VALUES
  ('c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'd0d3f4a5-8b5a-4c6d-9e7f-1a2b3c4d5e6f', 
   'Добро пожаловать в новую LMS платформу!', 
   'Мы рады представить вам нашу новую платформу для корпоративного обучения. Здесь вы найдете курсы, новости и многое другое.',
   'Запуск новой платформы для обучения сотрудников');
```

## ✅ Проверка успешности миграции

После выполнения всех команд:

1. Перейдите в **Table Editor** в Supabase
2. Проверьте, что созданы все таблицы:
   - profiles
   - courses
   - feed_channels
   - feed_posts
   - и другие

3. Если добавили тестовые данные, проверьте их наличие

## 🔑 Получение ключей для Railway

1. В Supabase Dashboard перейдите в **Settings → API**
2. Скопируйте:
   - **URL**: `https://ваш-проект.supabase.co`
   - **anon key**: `eyJ...` (публичный ключ)
   - **service_role key**: `eyJ...` (приватный ключ)

## ⚡ Готово!

Теперь ваша база данных настроена и готова к использованию. Следующий шаг - добавить эти ключи в Railway и запустить деплой!

---

**Время выполнения**: ~5 минут  
**Сложность**: Простая (копировать и вставить) 