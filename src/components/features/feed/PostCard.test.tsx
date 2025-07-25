import { render, screen } from '@testing-library/react'
import { PostCard } from './PostCard'

describe('PostCard', () => {
  const mockPost = {
    id: '1',
    title: 'Тестовый пост',
    content: '<p>Это содержание поста</p>',
    author: {
      full_name: 'Иван Иванов',
      avatar_url: 'https://example.com/avatar.jpg'
    },
    channel: {
      name: 'Новости',
      color: '#3B82F6'
    },
    published_at: new Date().toISOString(),
    likes_count: 10,
    comments_count: 5,
    media_urls: [],
    is_liked: false,
    is_bookmarked: false
  }

  it('renders post information', () => {
    render(<PostCard post={mockPost} />)
    
    expect(screen.getByText('Тестовый пост')).toBeInTheDocument()
    expect(screen.getByText('Иван Иванов')).toBeInTheDocument()
    expect(screen.getByText('Новости')).toBeInTheDocument()
  })

  it('displays reaction counts', () => {
    render(<PostCard post={mockPost} />)
    
    // В Telegram стиле эмодзи и числа в одном элементе
    expect(screen.getByText('❤️ 10')).toBeInTheDocument()
    expect(screen.getByText('💬 5')).toBeInTheDocument()
  })

  it('shows media when provided', () => {
    const postWithMedia = {
      ...mockPost,
      media_urls: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg']
    }
    
    render(<PostCard post={postWithMedia} />)
    
    const images = screen.getAllByAltText('')
    expect(images).toHaveLength(2) // Только медиа изображения
  })
}) 