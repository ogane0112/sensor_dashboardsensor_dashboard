import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Thermometer, Gauge, Droplet } from 'lucide-react'

export default function Home() {
  const menuItems = [
    { name: 'ホーム', icon: Home, path: '/' },
    { name: '全データ', icon: Database, path: '/data' },
    { name: '気温', icon: Thermometer, path: '/temperature' },
    { name: '気圧', icon: Gauge, path: '/pressure' },
    { name: '湿度', icon: Droplet, path: '/humidity' }
  ]
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">環境データダッシュボード</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.slice(1).map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="mr-2" />
                {item.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={item.path} className="text-blue-500 hover:underline">
                詳細を見る
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
