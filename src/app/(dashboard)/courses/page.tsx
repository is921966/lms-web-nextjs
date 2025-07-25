'use client'

import { useState, useEffect } from 'react'
import { CourseCard } from '@/components/features/courses/CourseCard'

const categories = ['Все', 'Программирование', 'Менеджмент', 'Дизайн', 'Маркетинг']
const difficulties = ['Все', 'beginner', 'intermediate', 'advanced']

interface Course {
  id: string
  title: string
  description: string
  cover_image?: string
  instructor: {
    full_name: string
  }
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration_hours: number
  enrollments_count: number
  progress?: number
}

export default function CoursesPage() {
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Все')

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setLoading(false)
      // В реальном приложении здесь будет загрузка из Supabase
    }, 1000)
  }, [])

  const filteredCourses = courses.filter(course => {
    // Фильтрация курсов (пока заглушка)
    return true
  })

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Каталог курсов</h1>
      
      {/* Фильтры */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Категория</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Сложность</label>
            <select 
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff === 'Все' ? 'Все' : 
                   diff === 'beginner' ? 'Начальный' :
                   diff === 'intermediate' ? 'Средний' : 'Продвинутый'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Список курсов */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Загрузка курсов...</p>
        </div>
      ) : (
        <div>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Курсы не найдены</p>
              <p className="text-sm text-gray-400">
                Попробуйте изменить параметры фильтрации
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  onEnroll={() => console.log('Enroll', course.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 