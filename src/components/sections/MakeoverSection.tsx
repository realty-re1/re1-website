'use client'

import { useState, useEffect } from 'react'
import { supabase, type DesignGallery } from '@/lib/supabase'
import { Building2, ChevronRight, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface MakeoverProject extends DesignGallery {
  before_images?: string[]
  after_images?: string[]
}

const DEMO: MakeoverProject[] = [
  {
    id: '1', title: '종로 고시원 → 프리미엄 게스트하우스', type: 'before_after',
    description: '노후된 고시원을 래브라도라이트·우드 슬랫 마감의 하이엔드 게스트하우스로 전환. 객실 단가 2.3배 향상.',
    before_images: [], after_images: [], created_at: '',
  },
  {
    id: '2', title: '광화문 오피스 공간 리뉴얼', type: 'before_after',
    description: '트래버틴 포인트 월과 오픈 셀링으로 임원용 하이엔드 오피스 구현.',
    before_images: [], after_images: [], created_at: '',
  },
  {
    id: '3', title: '인사동 상가 카페 인테리어', type: 'before_after',
    description: '관광객 유입 극대화를 위한 포토존 중심 공간 재설계.',
    before_images: [], after_images: [], created_at: '',
  },
]

export default function MakeoverSection() {
  const [projects, setProjects] = useState<MakeoverProject[]>(DEMO)
  const [selected, setSelected] = useState<MakeoverProject>(DEMO[0])
  const [view, setView] = useState<'before' | 'after'>('after')
  const [activeIdx, setActiveIdx] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    const el = document.getElementById('makeover')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('design_gallery')
        .select('*')
        .eq('type', 'before_after')
        .order('created_at', { ascending: false })
      if (data && data.length > 0) {
        setProjects(data)
        setSelected(data[0])
      }
    }
    fetch()
  }, [])

  const handleSelect = (p: MakeoverProject) => {
    setSelected(p)
    setView('after')
    setActiveIdx(0)
  }

  const currentImages = view === 'before'
    ? (selected.before_images ?? (selected.before_image ? [selected.before_image] : []))
    : (selected.after_images ?? (selected.after_image ? [selected.after_image] : []))

  return (
    <section id="makeover" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          {/* 헤더 */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-[#1A7F8E] text-sm font-medium tracking-widest uppercase mb-2">Ariwon Makeover</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">아리원 메이크오버</h2>
              <p className="text-gray-500 mt-3 max-w-lg">공간이 바뀌면 가치가 달라집니다. 아리원이 직접 기획하고 시공한 메이크오버 프로젝트를 확인해 보세요.</p>
            </div>
            <a href="#design-inquiry"
              className="flex-shrink-0 px-6 py-3 bg-[#1A7F8E] text-white text-sm font-medium rounded-lg hover:bg-[#156e7b] transition-colors flex items-center gap-2">
              공간 솔루션 상담 <ArrowRight size={16} />
            </a>
          </div>

          {/* Split View */}
          <div className="flex gap-8 border border-gray-100 rounded-2xl overflow-hidden shadow-sm" style={{ minHeight: '520px' }}>

            {/* 좌측: 프로젝트 리스트 */}
            <div className="w-full md:w-2/5 overflow-y-auto flex-shrink-0 border-r border-gray-100">
              {projects.map((project) => {
                const thumb = project.after_images?.[0] ?? project.after_image ?? project.before_images?.[0] ?? project.before_image
                return (
                  <button
                    key={project.id}
                    onClick={() => handleSelect(project)}
                    className={`w-full text-left flex gap-4 p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors group ${selected?.id === project.id ? 'bg-[#e8f4f6] border-l-2 border-l-[#1A7F8E]' : ''}`}
                  >
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                      {thumb ? (
                        <Image src={thumb} alt={project.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9] flex items-center justify-center">
                          <Building2 size={20} className="text-[#1A7F8E] opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{project.title}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{project.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#1A7F8E] self-center flex-shrink-0 transition-colors" />
                  </button>
                )
              })}
            </div>

            {/* 우측: 상세 뷰 */}
            <div className="hidden md:flex flex-col flex-1 overflow-hidden">
              {selected ? (
                <>
                  {/* Before / After 토글 */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg leading-snug">{selected.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{selected.description}</p>
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 ml-4 flex-shrink-0">
                      <button
                        onClick={() => { setView('before'); setActiveIdx(0) }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'before' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Before
                      </button>
                      <button
                        onClick={() => { setView('after'); setActiveIdx(0) }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'after' ? 'bg-[#1A7F8E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        After
                      </button>
                    </div>
                  </div>

                  {/* 메인 이미지 */}
                  <div className="relative flex-1 bg-gray-100 overflow-hidden">
                    {currentImages.length > 0 ? (
                      <>
                        <Image
                          src={currentImages[activeIdx]}
                          alt={`${selected.title} ${view}`}
                          fill
                          className="object-cover transition-all duration-500"
                        />
                        {/* 뷰 라벨 */}
                        <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${view === 'before' ? 'bg-gray-900/70 text-white' : 'bg-[#1A7F8E]/90 text-white'}`}>
                          {view === 'before' ? '시공 전 (Before)' : '시공 후 (After)'}
                        </span>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9]">
                        <Building2 size={48} className="text-[#1A7F8E] opacity-30 mb-3" />
                        <p className="text-sm text-[#1A7F8E] opacity-60">
                          {view === 'before' ? 'Before 사진 준비 중' : 'After 사진 준비 중'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 썸네일 스트립 */}
                  {currentImages.length > 1 && (
                    <div className="flex gap-2 px-4 py-3 border-t border-gray-100 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
                      {currentImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIdx(i)}
                          className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === activeIdx ? 'border-[#1A7F8E]' : 'border-transparent opacity-60 hover:opacity-90'}`}
                        >
                          <Image src={img} alt="" width={56} height={56} className="object-cover w-full h-full" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Building2 size={48} className="mb-4 opacity-20" />
                  <p className="text-sm">좌측에서 프로젝트를 선택하세요</p>
                </div>
              )}
            </div>
          </div>

          {/* 모바일: 카드 그리드 */}
          <div className="md:hidden mt-6 grid grid-cols-1 gap-4">
            {projects.map(project => {
              const thumb = project.after_images?.[0] ?? project.after_image
              return (
                <div key={project.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                  <div className="relative h-48 bg-gray-100">
                    {thumb ? (
                      <Image src={thumb} alt={project.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9] flex items-center justify-center">
                        <Building2 size={36} className="text-[#1A7F8E] opacity-30" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm">{project.title}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
