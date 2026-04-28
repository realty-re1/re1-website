'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, Search, Settings } from 'lucide-react'

const navItems = [
  { label: '매물', href: '#properties' },
  { label: '공간 디자인', href: '#design' },
  { label: '포트폴리오', href: '#portfolio' },
  { label: '소셜', href: '#social' },
  { label: '오시는 길', href: '#footer' },
]

interface HeaderProps {
  onSearch?: (keyword: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch?.(searchValue)
    const el = document.getElementById('properties')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* 로고 */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/re1-알파.png"
            alt="아리원 공인중개사사무소"
            width={130}
            height={36}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* 검색바 (데스크탑) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              placeholder="지역, 역세권, 키워드로 검색 (예: 종로, 3호선, 고시원)"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:border-[#1A7F8E] focus:bg-white transition-all"
            />
          </div>
        </form>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-[#1A7F8E] transition-colors duration-200 whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* 우측 액션 */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:010-9142-3205"
            className="flex items-center gap-1.5 text-sm font-medium text-[#1A7F8E] hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            <Phone size={15} />
            010-9142-3205
          </a>
          <a
            href="#inquiry"
            className="px-4 py-2 bg-[#1A7F8E] text-white text-sm font-medium rounded-lg hover:bg-[#156e7b] transition-colors whitespace-nowrap"
          >
            중개 의뢰
          </a>
          {/* 관리자 링크 - 눈에 띄지 않지만 접근 가능 */}
          <Link
            href="/admin/login"
            className="p-1.5 text-gray-300 hover:text-gray-500 transition-colors"
            title="관리자 페이지"
          >
            <Settings size={16} />
          </Link>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 모바일 검색바 */}
      <div className="md:hidden px-4 pb-3 border-t border-gray-50">
        <form onSubmit={handleSearch} className="relative mt-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="지역, 역세권, 키워드 검색"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:border-[#1A7F8E]"
          />
        </form>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-[#1A7F8E]"
              onClick={() => setIsMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <a href="tel:010-9142-3205" className="flex items-center gap-2 text-sm font-medium text-[#1A7F8E]">
              <Phone size={15} /> 010-9142-3205
            </a>
            <Link href="/admin/login" className="text-xs text-gray-300 hover:text-gray-500">
              관리자
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
