import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    // Проверяем наличие переменных окружения
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase переменные окружения не настроены',
        details: {
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? '✅ Установлена' : '❌ Отсутствует',
          NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey ? '✅ Установлена' : '❌ Отсутствует'
        }
      }, { status: 500 })
    }

    // Создаем клиент Supabase
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Проверяем подключение - получаем количество записей
    const [
      { count: profilesCount, error: profilesError },
      { count: channelsCount, error: channelsError },
      { count: postsCount, error: postsError }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('feed_channels').select('*', { count: 'exact', head: true }),
      supabase.from('feed_posts').select('*', { count: 'exact', head: true })
    ])

    // Если есть ошибки при запросе к таблицам
    if (profilesError || channelsError || postsError) {
      const errors = []
      if (profilesError) errors.push(`profiles: ${profilesError.message}`)
      if (channelsError) errors.push(`feed_channels: ${channelsError.message}`)
      if (postsError) errors.push(`feed_posts: ${postsError.message}`)

      return NextResponse.json({
        status: 'error',
        message: 'Ошибка при запросе к таблицам',
        details: {
          supabaseUrl: '✅ Подключение установлено',
          errors,
          hint: 'Возможно, таблицы еще не созданы. Примените миграции из /supabase/migrations/'
        }
      }, { status: 500 })
    }

    // Все работает!
    return NextResponse.json({
      status: 'success',
      message: 'Подключение к Supabase работает!',
      database: {
        profiles: `${profilesCount || 0} записей`,
        channels: `${channelsCount || 0} записей`,
        posts: `${postsCount || 0} записей`
      },
      recommendation: (postsCount === 0 || postsCount === null) 
        ? '⚠️ База данных пуста. Запустите скрипт заполнения: node scripts/populate-feed.js'
        : '✅ Данные найдены. Лента должна отображаться.'
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Неожиданная ошибка',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 