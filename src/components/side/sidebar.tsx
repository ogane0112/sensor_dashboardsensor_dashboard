import Link from 'next/link'
import { Home, Database, Thermometer, Gauge, Droplet } from 'lucide-react'

const menuItems = [
  { name: 'ホーム', icon: Home, path: '/' },
  { name: '全データ', icon: Database, path: '/data' },
  { name: '気温', icon: Thermometer, path: '/temperature' },
  { name: '気圧', icon: Gauge, path: '/pressure' },
  { name: '湿度', icon: Droplet, path: '/humidity' }
]

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 w-64 h-screen transition-transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-900">
        <div className="mt-16"> {/* Add padding-top for mobile */}
          <ul className="space-y-2 font-medium">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className="flex items-center p-2 text-gray-300 rounded-lg hover:bg-gray-700 group"
                >
                  <item.icon className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white" />
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}