import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-6">
          <h2 className="text-2xl font-bold">LMS Platform</h2>
        </div>
        <nav className="mt-6">
          <Link
            href="/dashboard"
            className="block px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Главная
          </Link>
          <Link
            href="/courses"
            className="block px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Курсы
          </Link>
          <Link
            href="/feed"
            className="block px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Лента
          </Link>
          <Link
            href="/profile"
            className="block px-6 py-3 hover:bg-gray-800 transition-colors"
          >
            Профиль
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
} 