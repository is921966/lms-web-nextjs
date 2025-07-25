import { render, screen } from '@testing-library/react'
import CoursesPage from './page'

describe('Courses Page', () => {
  it('renders page header', () => {
    render(<CoursesPage />)
    
    expect(screen.getByText(/Каталог курсов/i)).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<CoursesPage />)
    
    expect(screen.getByText(/Загрузка курсов/i)).toBeInTheDocument()
  })

  it('displays filter section', () => {
    render(<CoursesPage />)
    
    expect(screen.getByText(/Категория/i)).toBeInTheDocument()
    expect(screen.getByText(/Сложность/i)).toBeInTheDocument()
  })
}) 