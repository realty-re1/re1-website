'use client'

import { useEffect, useState } from 'react'
import { Building2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { supabase, type DesignGallery } from '@/lib/supabase'

const DEMO_ITEMS: DesignGallery[] = [
  { id: '1', title: '종로 고시원 리모델링 완공', type: 'portfolio', portfolio_images: [], description: '2024년 6월 완공', created_at: '' },
  { id: '2', title: '광화문 오피스 인테리어', type: 'portfolio', portfolio_images: [], description: '2024년 4월 완공', created_at: '' },
  { id: '3', title: '인사동 카페 인테리어', type: 'portfolio', portfolio_images: [], description: '2024년 2월 완공', created_at: '' },
  { id: '4', title: '을지로 호스텔 리뉴얼', type: 'portfolio', portfolio_images: [], description: '2023년 12월 완공', created_at: '' },
  { id: '5', title: '삼청동 갤러리 카페', type: 'portfolio', portfolio_images: [], description: '2023년 10월 완공', created_at: '' },
]

export default function PortfolioSection() {
  const [items, setItems] = useState<DesignGallery[]>(DEMO_ITEMS)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    const el = document.getElementById('portfolio')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('design_gallery').select('*').eq('type', 'portfolio').order('created_at', { ascending: false })
      if (data && data.length > 0) setItems(data)
    }
    fetch()
  }, [])

  return (
    <section id="portfolio" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-[#1A7F8E] text-sm font-medium tracking-widest uppercase mb-2">Portfolio</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">시공 포트폴리오</h2>
              <p className="text-gray-500 mt-3 max-w-md">실제 디자인 및 시공까지 완료된 프로젝트들입니다.</p>
            </div>
            <a
              href="#design-inquiry"
              className="flex-shrink-0 px-6 py-3 bg-[#1A7F8E] text-white text-sm font-medium rounded-lg hover:bg-[#156e7b] transition-colors flex items-center gap-2"
            >
              공간 솔루션 상담 요청 <ArrowRight size={16} />
            </a>
          </div>

          {/* Masonry 그리드 */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {items.map((item, i) => (
              <div
                key={item.id}
                className="break-inside-avoid group relative rounded-xl overflow-hidden bg-gray-100 hover:shadow-xl transition-all duration-300"
                style={{ height: i % 3 === 1 ? '320px' : i % 3 === 2 ? '240px' : '280px' }}
              >
                {item.portfolio_images && item.portfolio_images.length > 0 ? (
                  <Image
                    src={item.portfolio_images[0]}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9]">
                    <Building2 size={36} className="text-[#1A7F8E] opacity-40 mb-2" />
                    <span className="text-[#1A7F8E] text-xs opacity-60">사진 준비 중</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-white/70 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
