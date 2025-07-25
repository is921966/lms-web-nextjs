import { renderHook, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { useFeed } from './useFeed'

const mockCreateBrowserClient = vi.fn()

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createBrowserClient: () => mockCreateBrowserClient()
}))

// Default mock implementation
mockCreateBrowserClient.mockReturnValue({
  from: () => ({
    select: () => ({
      order: () => ({
        data: [
          {
            id: '1',
            title: 'Test Post',
            content: 'Test content',
            author: { full_name: 'Test User' },
            channel: { name: 'Test Channel', color: '#000' },
            published_at: new Date().toISOString(),
            likes_count: 0,
            comments_count: 0
          }
        ],
        error: null
      })
    })
  })
})

describe('useFeed', () => {
  it('loads posts on mount', async () => {
    const { result } = renderHook(() => useFeed())

    expect(result.current.loading).toBe(true)
    expect(result.current.posts).toEqual([])

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.posts).toHaveLength(1)
    expect(result.current.posts[0].title).toBe('Test Post')
  })

  it('handles errors gracefully', async () => {
    // Mock error
    mockCreateBrowserClient.mockReturnValueOnce({
      from: () => ({
        select: () => ({
          order: () => ({
            data: null,
            error: new Error('Failed to fetch')
          })
        })
      })
    })

    const { result } = renderHook(() => useFeed())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBe('Failed to fetch')
    expect(result.current.posts).toEqual([])
  })
}) 