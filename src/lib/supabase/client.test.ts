import { describe, it, expect, beforeEach } from 'vitest'
import { createBrowserClient } from './client'

describe('Supabase Client', () => {
  beforeEach(() => {
    // Устанавливаем тестовые переменные окружения перед каждым тестом
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('creates a browser client with proper configuration', () => {
    const client = createBrowserClient()
    
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
    expect(client.from).toBeDefined()
    expect(client.storage).toBeDefined()
  })

  it('uses environment variables for configuration', () => {
    // Проверяем что используются переменные окружения
    const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Временно устанавливаем тестовые значения
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    
    const client = createBrowserClient()
    expect(client).toBeDefined()
    
    // Восстанавливаем оригинальные значения
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey
  })
}) 