'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

const SOCIAL_CHANNELS = [
  {
    id: 'naver',
    name: '네이버 블로그',
    handle: '@realty-re1',
    url: 'https://blog.naver.com/realty-re1',
    color: '#03C75A',
    bgColor: '#f0fff7',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" fill="#03C75A" />
      </svg>
    ),
    posts: [
      { title: '종로 고시원 추천 TOP 5', date: '2026.04.20', thumbnail: null },
      { title: '광화문 오피스 임대 시세', date: '2026.04.15', thumbnail: null },
      { title: '호스텔 창업, 이것만 알면 된다', date: '2026.04.10', thumbnail: null },
    ],
  },
  {
    id: 'youtube',
    name: '유튜브',
    handle: '@re1_realty',
    url: 'https://youtube.com/@re1_realty',
    color: '#FF0000',
    bgColor: '#fff5f5',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    posts: [
      { title: '고시원 리모델링 현장 공개', date: '2026.04.18', thumbnail: null },
      { title: '부동산 투자 실전 가이드', date: '2026.04.12', thumbnail: null },
      { title: '인테리어 비용 절감 꿀팁', date: '2026.04.05', thumbnail: null },
    ],
  },
  {
    id: 'instagram',
    name: '인스타그램',
    handle: '@re1_realty',
    url: 'https://instagram.com/re1_realty',
    color: '#E1306C',
    bgColor: '#fff5f8',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="url(#ig-gradient)">
        <defs>
          <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F77737" />
            <stop offset="50%" stopColor="#E1306C" />
            <stop offset="100%" stopColor="#833AB4" />
          </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    posts: [
      { title: '래브라도라이트 인테리어', date: '2026.04.21', thumbnail: null },
      { title: '트래버틴 마감 현장', date: '2026.04.16', thumbnail: null },
      { title: '우드 슬랫 오피스', date: '2026.04.08', thumbnail: null },
    ],
  },
]

export default function SocialSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    const el = document.getElementById('social')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="social" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-12">
            <p className="text-[#1A7F8E] text-sm font-medium tracking-widest uppercase mb-2">Social Media</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">소셜 미디어</h2>
            <p className="text-gray-500 mt-3">아리원의 최신 소식을 다양한 채널에서 만나보세요.</p>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            {SOCIAL_CHANNELS.map((channel) => (
              <div
                key={channel.id}
                className="flex-shrink-0 w-80 snap-start bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {/* 채널 헤더 */}
                <div className="p-5 flex items-center justify-between border-b border-gray-50" style={{ backgroundColor: channel.bgColor }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {channel.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{channel.name}</p>
                      <p className="text-xs text-gray-400">{channel.handle}</p>
                    </div>
                  </div>
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/60 transition-colors"
                  >
                    <ExternalLink size={16} className="text-gray-400" />
                  </a>
                </div>

                {/* 게시물 목록 */}
                <div className="divide-y divide-gray-50">
                  {channel.posts.map((post, i) => (
                    <a
                      key={i}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 overflow-hidden">
                        {post.thumbnail ? (
                          <img src={post.thumbnail} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${channel.color}20, ${channel.color}40)` }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#1A7F8E] transition-colors">
                          {post.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{post.date}</p>
                      </div>
                      <ExternalLink size={14} className="text-gray-300 group-hover:text-[#1A7F8E] flex-shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>

                <div className="p-4">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-sm font-medium py-2 rounded-lg transition-colors"
                    style={{ color: channel.color, border: `1px solid ${channel.color}30` }}
                  >
                    채널 방문하기
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
