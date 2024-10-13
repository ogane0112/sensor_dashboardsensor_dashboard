import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Sidebar from "@/components/side/sidebar"
import SidebarToggle from "@/components/side/sidebar-toggle"
import { cookies } from 'next/headers'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "バナナ管理表",
  description: "ラズパイで収集したデータをわかりやすく表示させます！",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = cookies()
  const isSidebarOpen = cookieStore.get('sidebar')?.value !== 'closed'

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Sidebar isOpen={isSidebarOpen} />
        <SidebarToggle isOpen={isSidebarOpen} />
        <main className={`
          transition-all duration-300 ease-in-out p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen
          ${isSidebarOpen ? 'lg:ml-64' : ''}
        `}>
          {children}
        </main>
      </body>
    </html>
  )
}
