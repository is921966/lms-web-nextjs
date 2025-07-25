interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    author: {
      full_name: string
      avatar_url?: string
    }
    channel: {
      name: string
      color: string
    }
    published_at: string
    likes_count: number
    comments_count: number
    media_urls?: string[]
    is_liked?: boolean
    is_bookmarked?: boolean
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="flex gap-3 mb-4 p-3 rounded-lg hover:bg-gray-50">
      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
      
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium">{post.author.full_name}</span>
          <span className="text-xs text-gray-500">{post.channel.name}</span>
        </div>
        
        <h4 className="font-medium mb-1">{post.title}</h4>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {post.media_urls.map((url, idx) => (
              <img 
                key={idx}
                src={url} 
                alt=""
                className="rounded-lg object-cover w-full h-32"
              />
            ))}
          </div>
        )}
        
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <button className="hover:text-red-500 transition-colors">❤️ {post.likes_count}</button>
          <button className="hover:text-blue-500 transition-colors">💬 {post.comments_count}</button>
        </div>
      </div>
    </div>
  )
} 