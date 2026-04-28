'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LayoutDashboard, Building2, Wand2, MessageSquare, LogOut, ExternalLink } from 'lucide-react'

const NAV_ITEMS = [
  { label: '대시보드', href: '/admin', icon: LayoutDashboard },
  { label: '매물 관리', href: '/admin/properties', icon: Building2 },
  { label: '메이크오버 관리', href: '/admin/makeover', icon: Wand2 },
  { label: '의뢰/상담', href: '/admin/inquiries', icon: MessageSquare },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-gray-900 flex flex-col z-40">
      <div className="p-5 border-b border-gray-800">
        <Image src="/images/re1-알파.png" alt="아리원" width={120} height={34} className="h-8 w-auto brightness-0 invert" />
        <p className="text-gray-500 text-xs mt-2">관리자 페이지</p>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-[#1A7F8E] text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-800 flex flex-col gap-1">
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
          <ExternalLink size={18} />
          홈페이지 보기
        </a>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors w-full text-left">
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </aside>
  )
}
