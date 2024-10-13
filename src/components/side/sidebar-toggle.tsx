'use client'

import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SidebarToggle({ isOpen }: { isOpen: boolean }) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleSidebar = () => {
    const newState = !isOpen
    document.cookie = `sidebar=${newState ? 'open' : 'closed'}; path=/;`
    router.refresh()
  }

  if (!isMounted) {
    return null
  }

  return (
    <button
      className="fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-md text-white border border-black"
      onClick={toggleSidebar}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  )
}