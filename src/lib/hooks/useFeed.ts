'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

interface Post {
  id: string
  title: string
  content: string
  author: {
    full_name: string
    avatar_url?: string
  }
  channel: {
    name: string
    color: string
  }
  published_at: string
  likes_count: number
  comments_count: number
  media_urls?: string[]
  is_liked?: boolean
  is_bookmarked?: boolean
}

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from('feed_posts')
        .select(`
          *,
          author:author_id(full_name, avatar_url),
          channel:channel_id(name, color)
        `)
        .order('published_at', { ascending: false })

      if (error) {
        console.error('Error loading posts:', error)
        throw error
      }

      // Обрабатываем случай, когда связанные данные могут отсутствовать
      const formattedPosts = (data || []).map(post => ({
        ...post,
        author: post.author || { full_name: 'Неизвестный автор' },
        channel: post.channel || { name: 'Общий канал', color: '#6B7280' },
        likes_count: post.likes_count || 0,
        comments_count: post.comments_count || 0
      }))

      setPosts(formattedPosts)
    } catch (err) {
      console.error('Feed loading error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (post: { title: string; content: string; channel_id: string }) => {
    try {
      const supabase = createBrowserClient()
      
      // Используем фиксированный author_id для тестирования
      const postWithAuthor = {
        ...post,
        author_id: 'd0d5e7a0-1111-1111-1111-111111111111' // ID тестового админа
      }
      
      const { error } = await supabase
        .from('feed_posts')
        .insert(postWithAuthor)

      if (error) {
        console.error('Error creating post:', error)
        throw error
      }
      
      // Reload posts
      await loadPosts()
    } catch (err) {
      console.error('Post creation error:', err)
      throw err
    }
  }

  return {
    posts,
    loading,
    error,
    createPost,
    refresh: loadPosts
  }
} 