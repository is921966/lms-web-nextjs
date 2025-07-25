import { render, screen, fireEvent } from '@testing-library/react'
import { PostEditor } from './PostEditor'
import { vi } from 'vitest'

describe('PostEditor', () => {
  const mockOnSubmit = vi.fn()
  const mockChannels = [
    { id: '1', name: 'Новости', color: '#3B82F6' },
    { id: '2', name: 'Обучение', color: '#10B981' }
  ]

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders title input and content area', () => {
    render(<PostEditor onSubmit={mockOnSubmit} channels={mockChannels} />)
    
    expect(screen.getByPlaceholderText(/О чем вы хотите рассказать/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Начните писать/i)).toBeInTheDocument()
  })

  it('shows channel selector', () => {
    render(<PostEditor onSubmit={mockOnSubmit} channels={mockChannels} />)
    
    expect(screen.getByLabelText(/Выберите канал/i)).toBeInTheDocument()
  })

  it('disables submit when form is empty', () => {
    render(<PostEditor onSubmit={mockOnSubmit} channels={mockChannels} />)
    
    const submitButton = screen.getByText(/Опубликовать/i)
    expect(submitButton).toBeDisabled()
  })

  it('enables submit when form is filled', () => {
    render(<PostEditor onSubmit={mockOnSubmit} channels={mockChannels} />)
    
    // Заполняем форму
    const titleInput = screen.getByPlaceholderText(/О чем вы хотите рассказать/i)
    fireEvent.change(titleInput, { target: { value: 'Тестовый заголовок' } })
    
    // Выбираем канал
    const channelSelect = screen.getByRole('combobox')
    fireEvent.change(channelSelect, { target: { value: '1' } })
    
    const submitButton = screen.getByText(/Опубликовать/i)
    expect(submitButton).not.toBeDisabled()
  })
}) 