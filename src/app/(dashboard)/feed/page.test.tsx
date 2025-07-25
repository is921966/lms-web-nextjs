import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import FeedPage from './page'

// Mock компоненты
vi.mock('@/components/features/feed/PostCard', () => ({
  PostCard: ({ post }: any) => <div data-testid="post-card">{post.title}</div>
}))

describe('Feed Page', () => {
  it('renders feed header', () => {
    render(<FeedPage />)
    
    expect(screen.getByText(/Лента новостей/i)).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<FeedPage />)
    
    expect(screen.getByText(/Загрузка/i)).toBeInTheDocument()
  })
}) 