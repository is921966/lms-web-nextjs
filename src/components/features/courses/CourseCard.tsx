interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string
    instructor: {
      full_name: string
    }
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    duration_hours: number
    enrollments_count: number
    progress?: number
  }
  onEnroll?: () => void
  onContinue?: () => void
}

export function CourseCard({ course, onEnroll, onContinue }: CourseCardProps) {
  const isEnrolled = course.progress !== undefined

  return (
    <div>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <span>{course.duration_hours}ч</span>
      
      {isEnrolled && (
        <>
          <span>{course.progress}%</span>
          <button onClick={onContinue}>Продолжить обучение</button>
        </>
      )}
      
      {!isEnrolled && (
        <button onClick={onEnroll}>Записаться на курс</button>
      )}
    </div>
  )
} 