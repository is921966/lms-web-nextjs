'use client'

import { useState, useEffect } from 'react'

export default function FeedPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-8">Лента новостей</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Загрузка...</p>
        </div>
      ) : (
        <div>
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">Пока нет постов</p>
          ) : (
            <div>
              {/* Здесь будут посты */}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 