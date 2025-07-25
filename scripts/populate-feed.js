#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Проверяем наличие переменных окружения
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Ошибка: Необходимо установить переменные окружения');
  console.log('Создайте файл .env.local со следующими переменными:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndPopulateFeed() {
  console.log('🔍 Проверяем состояние базы данных...\n');

  try {
    // Проверяем наличие профилей
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*');

    if (profileError) {
      console.error('❌ Ошибка при получении профилей:', profileError.message);
      console.log('Возможно, таблицы еще не созданы. Примените миграции из docs/SUPABASE_MIGRATION_GUIDE.md');
      return;
    }

    console.log(`✅ Найдено профилей: ${profiles?.length || 0}`);

    // Проверяем наличие каналов
    const { data: channels, error: channelError } = await supabase
      .from('feed_channels')
      .select('*');

    console.log(`✅ Найдено каналов: ${channels?.length || 0}`);

    // Проверяем наличие постов
    const { data: posts, error: postError } = await supabase
      .from('feed_posts')
      .select('*');

    console.log(`✅ Найдено постов: ${posts?.length || 0}\n`);

    // Если данных нет, предлагаем создать тестовые
    if (!profiles?.length || !channels?.length || !posts?.length) {
      console.log('📝 База данных пуста. Создаем тестовые данные...\n');
      await createTestData();
    } else {
      console.log('✅ База данных уже содержит данные!');
      console.log('\nПоследние 3 поста:');
      posts.slice(0, 3).forEach(post => {
        console.log(`- "${post.title}" (${new Date(post.published_at).toLocaleDateString('ru-RU')})`);
      });
    }

  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

async function createTestData() {
  try {
    // 1. Создаем тестовый профиль
    console.log('1️⃣ Создаем тестовые профили...');
    const testProfiles = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        full_name: 'Администратор системы',
        role: 'admin',
        department: 'IT',
        position: 'Системный администратор'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        full_name: 'Мария Иванова',
        role: 'user',
        department: 'HR',
        position: 'HR менеджер'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        full_name: 'Петр Сидоров',
        role: 'user',
        department: 'Продажи',
        position: 'Менеджер по продажам'
      }
    ];

    for (const profile of testProfiles) {
      const { error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' });
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`   ❌ Ошибка создания профиля ${profile.full_name}:`, error.message);
      } else {
        console.log(`   ✅ Профиль ${profile.full_name} создан`);
      }
    }

    // 2. Создаем каналы
    console.log('\n2️⃣ Создаем каналы ленты...');
    const channels = [
      {
        id: '550e8400-e29b-41d4-a716-446655440101',
        name: 'Новости компании',
        slug: 'company-news',
        description: 'Официальные новости и объявления',
        icon: '📢',
        color: '#3B82F6',
        is_official: true,
        creator_id: '550e8400-e29b-41d4-a716-446655440001'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440102',
        name: 'Обучение и развитие',
        slug: 'learning',
        description: 'Новости о курсах и тренингах',
        icon: '📚',
        color: '#10B981',
        is_official: true,
        creator_id: '550e8400-e29b-41d4-a716-446655440001'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440103',
        name: 'HR новости',
        slug: 'hr-news',
        description: 'Важная информация от HR отдела',
        icon: '👥',
        color: '#F59E0B',
        is_official: true,
        creator_id: '550e8400-e29b-41d4-a716-446655440002'
      }
    ];

    for (const channel of channels) {
      const { error } = await supabase
        .from('feed_channels')
        .upsert(channel, { onConflict: 'id' });
      
      if (error && !error.message.includes('duplicate')) {
        console.error(`   ❌ Ошибка создания канала ${channel.name}:`, error.message);
      } else {
        console.log(`   ✅ Канал "${channel.name}" создан`);
      }
    }

    // 3. Создаем посты
    console.log('\n3️⃣ Создаем тестовые посты...');
    const posts = [
      {
        channel_id: '550e8400-e29b-41d4-a716-446655440101',
        author_id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Запуск новой платформы корпоративного обучения',
        content: `Рады сообщить о запуске новой LMS платформы! 

Теперь все сотрудники могут:
- Проходить курсы в удобное время
- Отслеживать прогресс обучения
- Получать сертификаты

Начните обучение уже сегодня!`,
        excerpt: 'Запущена новая платформа для корпоративного обучения',
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
        tags: ['обучение', 'новости', 'платформа'],
        published_at: new Date()
      },
      {
        channel_id: '550e8400-e29b-41d4-a716-446655440102',
        author_id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'Новый курс: Основы проектного менеджмента',
        content: `Открыта регистрация на курс "Основы проектного менеджмента"!

Вы научитесь:
✓ Планировать проекты
✓ Управлять командой
✓ Контролировать сроки и бюджет

Старт курса: 1 августа 2025`,
        excerpt: 'Открыта регистрация на новый курс по проектному менеджменту',
        tags: ['курсы', 'менеджмент', 'обучение'],
        published_at: new Date(Date.now() - 24 * 60 * 60 * 1000) // вчера
      },
      {
        channel_id: '550e8400-e29b-41d4-a716-446655440103',
        author_id: '550e8400-e29b-41d4-a716-446655440002',
        title: 'График отпусков на август',
        content: `Напоминаем о необходимости подать заявления на отпуск до 31 июля.

Форма заявления доступна в личном кабинете.

При планировании отпуска учитывайте загрузку вашего отдела.`,
        excerpt: 'Не забудьте подать заявление на отпуск до конца месяца',
        tags: ['hr', 'отпуск', 'важно'],
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 дня назад
      },
      {
        channel_id: '550e8400-e29b-41d4-a716-446655440101',
        author_id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Результаты квартала',
        content: `Подводим итоги второго квартала 2025 года.

Ключевые достижения:
📈 Рост продаж на 15%
🎯 Выполнение плана на 112%
👥 Расширение команды на 20 человек

Благодарим всех за отличную работу!`,
        excerpt: 'Компания показала отличные результаты во втором квартале',
        media_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        tags: ['результаты', 'квартал', 'достижения'],
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 дня назад
      }
    ];

    for (const post of posts) {
      const { error } = await supabase
        .from('feed_posts')
        .insert(post);
      
      if (error) {
        console.error(`   ❌ Ошибка создания поста "${post.title}":`, error.message);
      } else {
        console.log(`   ✅ Пост "${post.title}" создан`);
      }
    }

    // 4. Добавляем подписки
    console.log('\n4️⃣ Создаем подписки на каналы...');
    const subscriptions = [
      { user_id: '550e8400-e29b-41d4-a716-446655440001', channel_id: '550e8400-e29b-41d4-a716-446655440101' },
      { user_id: '550e8400-e29b-41d4-a716-446655440001', channel_id: '550e8400-e29b-41d4-a716-446655440102' },
      { user_id: '550e8400-e29b-41d4-a716-446655440002', channel_id: '550e8400-e29b-41d4-a716-446655440101' },
      { user_id: '550e8400-e29b-41d4-a716-446655440002', channel_id: '550e8400-e29b-41d4-a716-446655440103' },
      { user_id: '550e8400-e29b-41d4-a716-446655440003', channel_id: '550e8400-e29b-41d4-a716-446655440101' },
    ];

    for (const sub of subscriptions) {
      await supabase
        .from('feed_subscriptions')
        .upsert(sub, { onConflict: 'user_id,channel_id' });
    }
    console.log('   ✅ Подписки созданы');

    console.log('\n✅ Тестовые данные успешно созданы!');
    console.log('🌐 Откройте приложение и проверьте ленту новостей');

  } catch (error) {
    console.error('❌ Ошибка при создании тестовых данных:', error.message);
  }
}

// Запускаем проверку
checkAndPopulateFeed(); 