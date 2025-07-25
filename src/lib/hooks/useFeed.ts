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
          author:profiles(full_name, avatar_url),
          channel:feed_channels(name, color)
        `)
        .order('published_at', { ascending: false })

      if (error) throw error

      setPosts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (post: { title: string; content: string; channel_id: string }) => {
    const supabase = createBrowserClient()
    const { error } = await supabase
      .from('feed_posts')
      .insert(post)

    if (error) throw error
    
    // Reload posts
    await loadPosts()
  }

  return {
    posts,
    loading,
    error,
    createPost,
    refresh: loadPosts
  }
} 