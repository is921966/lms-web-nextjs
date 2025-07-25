import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />)
    
    expect(screen.getByText(/LMS Web Platform/i)).toBeInTheDocument()
  })

  it('shows main navigation links', () => {
    render(<Home />)
    
    expect(screen.getByText(/Курсы/i)).toBeInTheDocument()
    expect(screen.getByText(/Лента/i)).toBeInTheDocument()
  })
}) 