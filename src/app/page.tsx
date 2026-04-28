'use client'

import { useState } from 'react'
import Image from 'next/image'
import InquiryModal from '@/components/InquiryModal'
import Footer from '@/components/sections/Footer'

export default function Home() {
  const [inquiryType, setInquiryType] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-[#0F172A] flex flex-col relative text-white">
      {/* 중앙 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 py-20 md:py-28">
        <Image
          src="/images/re1-알파.png"
          alt="아리원 공인중개사사무소"
          width={144}
          height={40}
          className="w-28 md:w-36 h-auto object-contain mb-7"
        />
        <h1 className="text-lg md:text-2xl font-bold tracking-tight mb-3 text-center">
          홈페이지 개편 중입니다
        </h1>
        <p className="text-gray-400 text-xs md:text-sm text-center max-w-lg mb-6 leading-relaxed">
          더 나은 서비스와 유익한 부동산 정보를 제공하기 위해<br className="hidden md:block" />
          현재 웹사이트를 새롭게 단장하고 있습니다.<br/>
          빠른 시일 내에 새로운 모습으로 찾아뵙겠습니다.
        </p>
      </div>

      {/* 우측 하단 플로팅 액션 버튼 (acro-sg 스타일) */}
      <div className="fixed right-6 bottom-10 z-[50] flex flex-col gap-3">
        <button
          onClick={() => setInquiryType('매도/임대')}
          className="group relative flex items-center justify-end"
        >
          <span className="absolute right-16 px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-gray-700">
            매도/임대 의뢰
          </span>
          <div className="w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
            <span className="text-gray-900 font-bold text-xs text-center leading-tight">매도<br/>임대</span>
          </div>
        </button>
        <button
          onClick={() => setInquiryType('매수/임차')}
          className="group relative flex items-center justify-end"
        >
          <span className="absolute right-16 px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-gray-700">
            매수/임차 의뢰
          </span>
          <div className="w-14 h-14 bg-[#1A7F8E] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
            <span className="text-white font-bold text-xs text-center leading-tight">매수<br/>임차</span>
          </div>
        </button>
        <button
          onClick={() => setInquiryType('공간솔루션')}
          className="group relative flex items-center justify-end"
        >
          <span className="absolute right-16 px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-gray-700">
            공간솔루션 의뢰
          </span>
          <div className="w-14 h-14 bg-gray-700 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform border border-gray-600">
            <span className="text-white font-bold text-[10px] text-center leading-tight">공간<br/>솔루션</span>
          </div>
        </button>
      </div>

      {/* 하단 푸터 (지도 및 회사 정보 - 표시광고법 준수) */}
      <div className="relative z-10">
        <Footer />
      </div>

      {/* 문의 모달 팝업 */}
      {inquiryType && (
        <InquiryModal
          inquiryType={inquiryType}
          onClose={() => setInquiryType(null)}
        />
      )}
    </main>
  )
}
