'use client'

import { useState } from 'react'

interface PostEditorProps {
  onSubmit: (post: {
    title: string
    content: string
    channel_id: string
  }) => Promise<void>
  channels: Array<{ id: string; name: string; color: string }>
}

export function PostEditor({ onSubmit, channels }: PostEditorProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedChannel, setSelectedChannel] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isFormValid = title.trim() && selectedChannel

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title,
        content: content || 'Начните писать...',
        channel_id: selectedChannel,
      })
      
      // Reset form
      setTitle('')
      setContent('')
      setSelectedChannel('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-6 mb-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Заголовок
          </label>
          <input
            id="title"
            type="text"
            placeholder="О чем вы хотите рассказать?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="channel" className="block text-sm font-medium mb-2">
            Выберите канал
          </label>
          <select
            id="channel"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Выберите канал</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-2">
            Содержание
          </label>
          <textarea
            id="content"
            placeholder="Начните писать..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Публикация...' : 'Опубликовать'}
        </button>
      </div>
    </form>
  )
} 