'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase, type Property } from '@/lib/supabase'
import { Building2, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import PropertyModal from '@/components/PropertyModal'

const THEMES = [
  { key: '급매', label: '🚨 급매 / 특급 가성비', desc: '지금 당장 잡아야 할 급매 매물', color: 'bg-red-50 border-red-100', badge: 'bg-red-100 text-red-600' },
  { key: '고수익', label: '💰 고수익 보장형', desc: '안정적인 수익을 기대할 수 있는 매물', color: 'bg-amber-50 border-amber-100', badge: 'bg-amber-100 text-amber-600' },
  { key: '공간솔루션', label: '🎨 공간 솔루션 추천', desc: '아리원 디자인으로 가치를 높일 수 있는 매물', color: 'bg-purple-50 border-purple-100', badge: 'bg-purple-100 text-purple-600' },
]

const DEMO: Property[] = [
  { id: '1', title: '종로3가 프리미엄 고시원', category: '고시원/호스텔', price: '월 45만원~', deposit: '500만원', monthly_rent: '45만원~', area: '6.6㎡~', floor: '3~5층', address: '서울시 종로구 종로3가', description: '리모델링 완료, 3·5호선 역세권', images: [], is_featured: true, tags: ['급매'], status: 'available', created_at: '', updated_at: '' },
  { id: '2', title: '광화문 역세권 오피스', category: '오피스', price: '보증 1억 / 월 400만원', deposit: '1억원', monthly_rent: '400만원', area: '165㎡', floor: '8층', address: '서울시 종로구 세종로', description: '대형 통창, 주차 가능', images: [], is_featured: true, tags: ['고수익'], status: 'available', created_at: '', updated_at: '' },
  { id: '3', title: '인사동 1층 상가', category: '상가', price: '보증 5천 / 월 250만원', deposit: '5천만원', monthly_rent: '250만원', area: '99㎡', floor: '1층', address: '서울시 종로구 인사동', description: '유동인구 풍부, 관광특구', images: [], is_featured: false, tags: ['공간솔루션'], status: 'available', created_at: '', updated_at: '' },
  { id: '4', title: '을지로 소형 오피스', category: '오피스', price: '보증 3천 / 월 150만원', deposit: '3천만원', monthly_rent: '150만원', area: '49.5㎡', floor: '5층', address: '서울시 중구 을지로', description: '을지로3가역 2분', images: [], is_featured: false, tags: ['급매'], status: 'available', created_at: '', updated_at: '' },
  { id: '5', title: '종로 외국인 호스텔', category: '고시원/호스텔', price: '월 65만원~', deposit: '100만원', monthly_rent: '65만원~', area: '13㎡~', floor: '2~4층', address: '서울시 종로구 종로', description: '외국인 운영 중, 높은 수익률', images: [], is_featured: true, tags: ['고수익', '공간솔루션'], status: 'available', created_at: '', updated_at: '' },
]

function PropertyCard({ property, badge, onSelect }: { property: Property; badge: string; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className="flex-shrink-0 w-64 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-gray-100"
    >
      <div className="relative h-40 bg-gray-100">
        {property.images && property.images.length > 0 ? (
          <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9] flex items-center justify-center">
            <Building2 size={32} className="text-[#1A7F8E] opacity-30" />
          </div>
        )}
        <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badge}`}>
          {property.tags?.includes('급매') ? '🚨 급매' : property.tags?.includes('고수익') ? '💰 고수익' : '🎨 솔루션'}
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">{property.title}</p>
        <p className="text-[#1A7F8E] font-bold text-base mt-1">{property.price}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <MapPin size={11} className="text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-400 truncate">{property.address}</p>
        </div>
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{property.description}</p>
      </div>
    </div>
  )
}

function ThemeRow({ theme, properties, onSelect }: {
  theme: typeof THEMES[0]
  properties: Property[]
  onSelect: (p: Property) => void
}) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' })
  }

  if (properties.length === 0) return null

  return (
    <div className={`rounded-2xl border p-6 ${theme.color}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{theme.label}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{theme.desc}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
            <ChevronLeft size={16} className="text-gray-600" />
          </button>
          <button onClick={() => scroll('right')} className="w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center hover:shadow-md transition-shadow">
            <ChevronRight size={16} className="text-gray-600" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {properties.map(p => (
          <PropertyCard key={p.id} property={p} badge={theme.badge} onSelect={() => onSelect(p)} />
        ))}
      </div>
    </div>
  )
}

export default function CurationSection() {
  const [properties, setProperties] = useState<Property[]>(DEMO)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    const el = document.getElementById('curation')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('properties').select('*').eq('status', 'available').order('created_at', { ascending: false })
      if (data && data.length > 0) setProperties(data)
    }
    fetch()
  }, [])

  const getByTag = (tag: string) => properties.filter(p => p.tags?.includes(tag as any))

  return (
    <section id="curation" className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-10">
            <p className="text-[#1A7F8E] text-sm font-medium tracking-widest uppercase mb-2">Curated Picks</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">테마별 추천 매물</h2>
            <p className="text-gray-500 mt-2">아리원이 엄선한 테마별 추천 매물을 확인해 보세요.</p>
          </div>

          <div className="flex flex-col gap-6">
            {THEMES.map(theme => (
              <ThemeRow
                key={theme.key}
                theme={theme}
                properties={getByTag(theme.key)}
                onSelect={setSelectedProperty}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}
    </section>
  )
}
