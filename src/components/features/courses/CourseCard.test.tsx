import { render, screen } from '@testing-library/react'
import { CourseCard } from './CourseCard'

describe('CourseCard', () => {
  const mockCourse = {
    id: '1',
    title: 'Test Course',
    description: 'Test description',
    instructor: { full_name: 'John Doe' },
    category: 'Programming',
    difficulty: 'beginner' as const,
    duration_hours: 10,
    enrollments_count: 100
  }

  it('renders course information', () => {
    render(<CourseCard course={mockCourse} />)
    
    expect(screen.getByText('Test Course')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
    expect(screen.getByText('10ч')).toBeInTheDocument()
  })

  it('shows enroll button when not enrolled', () => {
    render(<CourseCard course={mockCourse} />)
    
    expect(screen.getByText('Записаться на курс')).toBeInTheDocument()
  })

  it('shows progress when enrolled', () => {
    const enrolledCourse = { ...mockCourse, progress: 60 }
    render(<CourseCard course={enrolledCourse} />)
    
    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('Продолжить обучение')).toBeInTheDocument()
  })
}) 