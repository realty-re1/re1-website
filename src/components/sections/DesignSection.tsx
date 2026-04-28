'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ArrowRight } from 'lucide-react'

const DEMO_ITEMS = [
  {
    id: '1',
    title: '종로 고시원 리모델링',
    description: '노후 고시원을 프리미엄 게스트하우스로 전환. 래브라도라이트 텍스처 마감.',
    before: null,
    after: null,
  },
  {
    id: '2',
    title: '광화문 오피스 인테리어',
    description: '트래버틴 + 우드 슬랫 조합의 하이엔드 오피스 공간 설계.',
    before: null,
    after: null,
  },
]

function ImageCompareSlider({ beforeSrc, afterSrc }: { beforeSrc: string | null; afterSrc: string | null }) {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const pos = ((clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.min(Math.max(pos, 0), 100))
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX)
  }, [handleMove])

  const handleMouseUp = useCallback(() => { isDragging.current = false }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div
      ref={containerRef}
      className="relative h-72 rounded-xl overflow-hidden cursor-col-resize select-none bg-gray-100"
      onMouseDown={() => { isDragging.current = true }}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
    >
      {/* After (base) */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A7F8E]/20 to-[#1A7F8E]/5">
        <span className="text-[#1A7F8E] font-medium text-sm">예상 CG / 완료 후</span>
      </div>

      {/* Before (overlay) */}
      <div
        className="absolute inset-0 overflow-hidden flex items-center justify-center bg-gray-200"
        style={{ width: `${sliderPos}%` }}
      >
        <span className="text-gray-500 font-medium text-sm">현재 현장</span>
      </div>

      {/* 슬라이더 핸들 */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center">
          <div className="flex gap-1">
            <div className="w-0.5 h-4 bg-[#1A7F8E] rounded" />
            <div className="w-0.5 h-4 bg-[#1A7F8E] rounded" />
          </div>
        </div>
      </div>

      {/* 라벨 */}
      <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">Before</div>
      <div className="absolute bottom-3 right-3 bg-[#1A7F8E]/80 text-white text-xs px-2 py-1 rounded">After</div>
    </div>
  )
}

export default function DesignSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    const el = document.getElementById('design')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="design" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <p className="text-[#1A7F8E] text-sm font-medium tracking-widest uppercase mb-2">Design Solution</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">공간 디자인 솔루션</h2>
              <p className="text-gray-500 mt-3 max-w-md">
                중개한 매물에 아리원만의 하이엔드 공간 디자인을 적용하면 어떻게 달라질까요?
                슬라이더를 좌우로 드래그해 비교해 보세요.
              </p>
            </div>
            <a
              href="#design-inquiry"
              className="flex-shrink-0 px-6 py-3 bg-[#1A7F8E] text-white text-sm font-medium rounded-lg hover:bg-[#156e7b] transition-colors flex items-center gap-2"
            >
              공간 솔루션 상담 요청 <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DEMO_ITEMS.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                <ImageCompareSlider beforeSrc={item.before} afterSrc={item.after} />
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
