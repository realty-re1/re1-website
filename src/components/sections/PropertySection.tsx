'use client'

import { useState, useEffect } from 'react'
import { supabase, type Property, type PropertyCategory } from '@/lib/supabase'
import { MapPin, Building2, ArrowRight, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import PropertyModal from '@/components/PropertyModal'

const TABS: { label: string; value: PropertyCategory | 'all' }[] = [
  { label: '전체', value: 'all' },
  { label: '고시원/호스텔', value: '고시원/호스텔' },
  { label: '오피스', value: '오피스' },
  { label: '상가', value: '상가' },
  { label: '아파트', value: '아파트' },
  { label: '기타', value: '기타' },
]

const DEMO_PROPERTIES: Property[] = [
  { id: '1', title: '종로3가 프리미엄 고시원', category: '고시원/호스텔', price: '월 45만원~', deposit: '500만원', monthly_rent: '45만원~', premium: '없음', area: '6.6㎡~', floor: '3~5층', address: '서울시 종로구 종로3가', description: '리모델링 완료, 전 객실 에어컨·냉장고·CCTV 완비. 지하철 3·5호선 역세권', images: [], is_featured: true, tags: ['급매'], status: 'available', created_at: '', updated_at: '' },
  { id: '2', title: '광화문 역세권 오피스', category: '오피스', price: '보증 1억 / 월 400만원', deposit: '1억원', monthly_rent: '400만원', premium: '협의', area: '165㎡ (50평)', floor: '8층', address: '서울시 종로구 세종로', description: '대형 통창 채광, 주차 가능, 즉시 입주 가능', images: [], is_featured: true, tags: ['고수익'], status: 'available', created_at: '', updated_at: '' },
  { id: '3', title: '인사동 1층 상가', category: '상가', price: '보증 5천 / 월 250만원', deposit: '5천만원', monthly_rent: '250만원', premium: '3천만원', area: '99㎡ (30평)', floor: '1층', address: '서울시 종로구 인사동', description: '유동인구 풍부, 관광특구 내 위치, 가시성 최상', images: [], is_featured: false, tags: ['공간솔루션'], status: 'available', created_at: '', updated_at: '' },
  { id: '4', title: '을지로 소형 오피스', category: '오피스', price: '보증 3천 / 월 150만원', deposit: '3천만원', monthly_rent: '150만원', premium: '없음', area: '49.5㎡ (15평)', floor: '5층', address: '서울시 중구 을지로', description: '을지로3가역 2분, 소형 스타트업 최적', images: [], is_featured: false, tags: ['급매'], status: 'available', created_at: '', updated_at: '' },
  { id: '5', title: '종로 외국인 호스텔', category: '고시원/호스텔', price: '월 65만원~', deposit: '100만원', monthly_rent: '65만원~', premium: '없음', area: '13㎡~', floor: '2~4층', address: '서울시 종로구 종로', description: '외국인 관광객 운영 중, 높은 수익률 보장', images: [], is_featured: true, tags: ['고수익', '공간솔루션'], status: 'available', created_at: '', updated_at: '' },
]

interface PropertySectionProps {
  searchKeyword?: string
}

export default function PropertySection({ searchKeyword }: PropertySectionProps) {
  const [activeTab, setActiveTab] = useState<PropertyCategory | 'all'>('고시원/호스텔')
  const [properties, setProperties] = useState<Property[]>(DEMO_PROPERTIES)
  const [selected, setSelected] = useState<Property>(DEMO_PROPERTIES[0])
  const [modalOpen, setModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    const el = document.getElementById('properties')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    async function fetchProperties() {
      let query = supabase.from('properties').select('*').eq('status', 'available').order('created_at', { ascending: false })
      if (activeTab !== 'all') query = query.eq('category', activeTab)
      const { data } = await query
      if (data && data.length > 0) {
        setProperties(data)
        setSelected(data[0])
      }
    }
    fetchProperties()
  }, [activeTab])

  const filtered = properties.filter(p => {
    const matchTab = activeTab === 'all' || p.category === activeTab
    const matchSearch = !searchKeyword || [p.title, p.address, p.description, p.category].some(v => v?.toLowerCase().includes(searchKeyword.toLowerCase()))
    return matchTab && matchSearch
  })

  return (
    <section id="properties" className="pt-24 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* 섹션 헤더 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-[#1A7F8E] text-sm font-medium tracking-widest uppercase mb-1">Properties</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">현재 매물</h2>
            </div>
            <div className="flex gap-2.5">
              <a href="#inquiry" className="px-5 py-2.5 bg-[#1A7F8E] text-white text-sm font-medium rounded-lg hover:bg-[#156e7b] transition-colors flex items-center gap-2">
                중개 의뢰 <ArrowRight size={15} />
              </a>
              <a href="#inquiry-sell" className="px-5 py-2.5 border-2 border-[#1A7F8E] text-[#1A7F8E] text-sm font-medium rounded-lg hover:bg-[#e8f4f6] transition-colors">
                매물 내놓기
              </a>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 flex-wrap mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab.value ? 'bg-[#1A7F8E] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Split View */}
          <div className="flex gap-0 border border-gray-100 rounded-2xl overflow-hidden shadow-sm" style={{ height: '560px' }}>

            {/* 좌측: 매물 리스트 */}
            <div className="w-full md:w-2/5 overflow-y-auto border-r border-gray-100 flex-shrink-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Building2 size={40} className="mb-3 opacity-30" />
                  <p className="text-sm">매물이 없습니다.</p>
                </div>
              ) : (
                filtered.map((property) => (
                  <button
                    key={property.id}
                    onClick={() => setSelected(property)}
                    className={`w-full text-left flex gap-3 p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group ${selected?.id === property.id ? 'bg-[#e8f4f6] border-l-2 border-l-[#1A7F8E]' : ''}`}
                  >
                    {/* 썸네일 */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                      {property.images && property.images.length > 0 ? (
                        <Image src={property.images[0]} alt={property.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9] flex items-center justify-center">
                          <Building2 size={24} className="text-[#1A7F8E] opacity-50" />
                        </div>
                      )}
                    </div>
                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">{property.title}</p>
                        {property.is_featured && <span className="flex-shrink-0 text-xs bg-[#1A7F8E] text-white px-1.5 py-0.5 rounded-full">추천</span>}
                      </div>
                      <p className="text-[#1A7F8E] font-bold text-sm mt-0.5">{property.price}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={11} className="text-gray-400 flex-shrink-0" />
                        <p className="text-xs text-gray-400 truncate">{property.address}</p>
                      </div>
                      <div className="flex gap-1 mt-1.5 flex-wrap">
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{property.category}</span>
                        {property.tags?.map(tag => (
                          <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${tag === '급매' ? 'bg-red-100 text-red-600' : tag === '고수익' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
                            {tag === '급매' ? '🚨 급매' : tag === '고수익' ? '💰 고수익' : '🎨 솔루션'}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1A7F8E] self-center flex-shrink-0 transition-colors" />
                  </button>
                ))
              )}
            </div>

            {/* 우측: 선택된 매물 프리뷰 */}
            <div className="hidden md:flex flex-col flex-1 overflow-hidden">
              {selected ? (
                <>
                  {/* 대표 이미지 */}
                  <div className="relative h-56 bg-gray-100 flex-shrink-0">
                    {selected.images && selected.images.length > 0 ? (
                      <Image src={selected.images[0]} alt={selected.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9] flex flex-col items-center justify-center">
                        <Building2 size={48} className="text-[#1A7F8E] opacity-30 mb-2" />
                        <span className="text-sm text-[#1A7F8E] opacity-50">사진 준비 중</span>
                      </div>
                    )}
                    {selected.is_featured && (
                      <span className="absolute top-3 left-3 bg-[#1A7F8E] text-white text-xs px-2.5 py-1 rounded-full font-medium">추천 매물</span>
                    )}
                  </div>

                  {/* 핵심 정보 */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="font-bold text-gray-900 text-xl mb-1 leading-tight">{selected.title}</h3>
                    <p className="text-[#1A7F8E] font-bold text-2xl mb-4">{selected.price}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: '보증금', value: selected.deposit },
                        { label: '월세', value: selected.monthly_rent },
                        { label: '면적', value: selected.area },
                        { label: '층수', value: selected.floor },
                      ].map(item => item.value && (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                          <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <MapPin size={14} className="text-[#1A7F8E]" />
                      {selected.address}
                    </div>

                    {selected.description && (
                      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{selected.description}</p>
                    )}
                  </div>

                  {/* 상세보기 버튼 */}
                  <div className="p-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
                    <button
                      onClick={() => setModalOpen(true)}
                      className="flex-1 py-3 bg-[#1A7F8E] text-white text-sm font-semibold rounded-xl hover:bg-[#156e7b] transition-colors"
                    >
                      상세보기 / 문의하기
                    </button>
                    <a href="tel:010-9142-3205" className="px-4 py-3 border border-[#1A7F8E] text-[#1A7F8E] rounded-xl hover:bg-[#e8f4f6] transition-colors">
                      <MapPin size={18} />
                    </a>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Building2 size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">좌측에서 매물을 선택하세요</p>
                </div>
              )}
            </div>
          </div>

          {/* 모바일: 상세보기 버튼 */}
          {selected && (
            <div className="md:hidden mt-4">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3 bg-[#1A7F8E] text-white text-sm font-semibold rounded-xl"
              >
                선택된 매물 상세보기: {selected.title}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {modalOpen && selected && (
        <PropertyModal property={selected} onClose={() => setModalOpen(false)} />
      )}
    </section>
  )
}
