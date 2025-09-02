#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

console.log('🚀 Автоматическое заполнение базы данных LMS\n');

// Проверяем переменные окружения
const RAILWAY_ENV = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY
};

// Если нет переменных окружения, запрашиваем у пользователя
if (!RAILWAY_ENV.url || !RAILWAY_ENV.anonKey || !RAILWAY_ENV.serviceKey) {
  console.log('❌ Переменные окружения не найдены!\n');
  console.log('📝 Для автоматического запуска нужно:');
  console.log('1. Создайте файл .env.local со следующим содержимым:\n');
  console.log('NEXT_PUBLIC_SUPABASE_URL=ваш-url-из-supabase');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=ваш-anon-key');
  console.log('SUPABASE_SERVICE_ROLE_KEY=ваш-service-role-key\n');
  console.log('2. Получите эти ключи из Supabase Dashboard:');
  console.log('   - Откройте https://app.supabase.com');
  console.log('   - Project Settings → API');
  console.log('   - Скопируйте все 3 ключа\n');
  console.log('3. Запустите скрипт снова:\n');
  console.log('   node scripts/auto-populate-db.js\n');
  process.exit(1);
}

// Создаем клиент с service role для обхода RLS
const supabase = createClient(RAILWAY_ENV.url, RAILWAY_ENV.serviceKey);

async function populateDatabase() {
  console.log('✅ Подключение к Supabase установлено\n');
  
  try {
    // 1. Проверяем, что база пуста
    console.log('1️⃣ Проверяем состояние базы данных...');
    const { count: existingProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (existingProfiles > 0) {
      console.log('   ℹ️ В базе уже есть данные. Обновляем...');
    } else {
      console.log('   ✅ База пуста, начинаем заполнение');
    }

    // 2. Создаем профили
    console.log('\n2️⃣ Создаем профили пользователей...');
    const profiles = [
      {
        id: 'd0d5e7a0-1111-1111-1111-111111111111',
        full_name: 'Администратор системы',
        role: 'admin',
        department: 'IT',
        position: 'Системный администратор'
      },
      {
        id: 'd0d5e7a0-2222-2222-2222-222222222222',
        full_name: 'Мария Иванова',
        role: 'employee',
        department: 'HR',
        position: 'HR менеджер'
      },
      {
        id: 'd0d5e7a0-3333-3333-3333-333333333333',
        full_name: 'Петр Сидоров',
        role: 'employee',
        department: 'Продажи',
        position: 'Менеджер по продажам'
      }
    ];

    // Пробуем разные варианты ролей если employee не работает
    const roleVariants = ['employee', 'student', 'instructor', 'staff', 'user'];
    let workingRole = 'employee';
    
    for (const profile of profiles) {
      let inserted = false;
      
      for (const role of roleVariants) {
        const testProfile = { ...profile };
        if (profile.role === 'employee') {
          testProfile.role = role;
        }
        
        const { error } = await supabase
          .from('profiles')
          .upsert(testProfile, { onConflict: 'id' });
        
        if (!error) {
          console.log(`   ✅ ${profile.full_name} (роль: ${testProfile.role})`);
          workingRole = role;
          inserted = true;
          break;
        } else if (error.message && error.message.includes('role_check') && role !== roleVariants[roleVariants.length - 1]) {
          // Пробуем следующую роль
          continue;
        } else if (error.message && !error.message.includes('duplicate')) {
          console.log(`   ⚠️ Ошибка для ${profile.full_name}: ${error.message}`);
          if (error.message.includes('violates foreign key constraint')) {
            console.log('   💡 Пропускаем профили - требуется auth.users');
            inserted = true; // Помечаем как "вставлено" чтобы не пытаться снова
          }
          break;
        }
      }
      
      if (!inserted && profile.role !== 'admin') {
        console.log(`   ⚠️  Не удалось создать профиль для ${profile.full_name}`);
      }
    }

    // 3. Создаем каналы
    console.log('\n3️⃣ Создаем каналы ленты...');
    const channels = [
      {
        id: 'c0c5e7a0-1111-1111-1111-111111111111',
        name: 'Новости компании',
        slug: 'company-news',
        description: 'Официальные новости и объявления',
        icon: '📢',
        color: '#3B82F6',
        is_official: true,
        creator_id: 'd0d5e7a0-1111-1111-1111-111111111111'
      },
      {
        id: 'c0c5e7a0-2222-2222-2222-222222222222',
        name: 'Обучение и развитие',
        slug: 'learning',
        description: 'Новости о курсах и тренингах',
        icon: '📚',
        color: '#10B981',
        is_official: true,
        creator_id: 'd0d5e7a0-1111-1111-1111-111111111111'
      },
      {
        id: 'c0c5e7a0-3333-3333-3333-333333333333',
        name: 'HR новости',
        slug: 'hr-news',
        description: 'Важная информация от HR отдела',
        icon: '👥',
        color: '#F59E0B',
        is_official: true,
        creator_id: 'd0d5e7a0-2222-2222-2222-222222222222'
      }
    ];

    for (const channel of channels) {
      const { error } = await supabase
        .from('feed_channels')
        .upsert(channel, { onConflict: 'id' });
      
      if (!error) {
        console.log(`   ✅ ${channel.name}`);
      } else if (error.message && !error.message.includes('duplicate')) {
        console.log(`   ❌ Ошибка: ${error.message}`);
      } else {
        console.log(`   ℹ️ ${channel.name} (уже существует)`);
      }
    }

    // 4. Создаем посты
    console.log('\n4️⃣ Создаем тестовые посты...');
    const posts = [
      {
        channel_id: 'c0c5e7a0-1111-1111-1111-111111111111',
        author_id: 'd0d5e7a0-1111-1111-1111-111111111111',
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
        published_at: new Date().toISOString(),
        likes_count: 15,
        comments_count: 7
      },
      {
        channel_id: 'c0c5e7a0-2222-2222-2222-222222222222',
        author_id: 'd0d5e7a0-2222-2222-2222-222222222222',
        title: 'Новый курс: Основы проектного менеджмента',
        content: `Открыта регистрация на курс "Основы проектного менеджмента"!

Вы научитесь:
✓ Планировать проекты
✓ Управлять командой
✓ Контролировать сроки и бюджет

Старт курса: 1 августа 2025`,
        excerpt: 'Открыта регистрация на новый курс по проектному менеджменту',
        tags: ['курсы', 'менеджмент', 'обучение'],
        published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 23,
        comments_count: 5
      },
      {
        channel_id: 'c0c5e7a0-3333-3333-3333-333333333333',
        author_id: 'd0d5e7a0-2222-2222-2222-222222222222',
        title: 'График отпусков на август',
        content: `Напоминаем о необходимости подать заявления на отпуск до 31 июля.

Форма заявления доступна в личном кабинете.

При планировании отпуска учитывайте загрузку вашего отдела.`,
        excerpt: 'Не забудьте подать заявление на отпуск до конца месяца',
        tags: ['hr', 'отпуск', 'важно'],
        published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 8,
        comments_count: 3
      },
      {
        channel_id: 'c0c5e7a0-1111-1111-1111-111111111111',
        author_id: 'd0d5e7a0-1111-1111-1111-111111111111',
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
        published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        likes_count: 42,
        comments_count: 12
      }
    ];

    let postsCreated = 0;
    for (const post of posts) {
      const { error } = await supabase
        .from('feed_posts')
        .insert(post);
      
      if (!error) {
        console.log(`   ✅ "${post.title}"`);
        postsCreated++;
      } else {
        console.log(`   ❌ Ошибка: ${error.message}`);
        if (error.message.includes('foreign key constraint')) {
          console.log('   💡 Посты требуют существующих профилей');
          break;
        }
      }
    }

    // 5. Проверяем результат
    console.log('\n5️⃣ Проверяем результат...');
    const { count: profilesCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    const { count: channelsCount } = await supabase
      .from('feed_channels')
      .select('*', { count: 'exact', head: true });
    
    const { count: postsCount } = await supabase
      .from('feed_posts')
      .select('*', { count: 'exact', head: true });

    console.log(`\n✅ Заполнение завершено!`);
    console.log(`   - Профилей: ${profilesCount || 0}`);
    console.log(`   - Каналов: ${channelsCount || 0}`);
    console.log(`   - Постов: ${postsCount || 0}`);
    
    if (postsCount > 0) {
      console.log('\n🎉 Теперь откройте приложение и проверьте ленту новостей!');
      console.log(`   https://lms-web-nextjs-production.up.railway.app/feed`);
    } else if (channelsCount > 0) {
      console.log('\n⚠️ Каналы созданы, но посты не добавлены.');
      console.log('Это может быть из-за отсутствия профилей пользователей.');
      console.log('Попробуйте выполнить SQL вручную из файла supabase/seed_no_auth.sql');
    }

  } catch (error) {
    console.error('❌ Произошла ошибка:', error.message);
    console.log('\n💡 Попробуйте выполнить SQL вручную из файла:');
    console.log('   supabase/seed_no_auth.sql');
  }
}

// Запускаем
populateDatabase(); 