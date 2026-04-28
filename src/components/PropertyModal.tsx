'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Phone, MessageCircle, Building2, Check, Send } from 'lucide-react'
import Image from 'next/image'
import { supabase, type Property } from '@/lib/supabase'

interface PropertyModalProps {
  property: Property
  onClose: () => void
}

const COMPANY_INFO = {
  name: '아리원 공인중개사사무소',
  ceo: '조정일',
  address: '서울시 종로구 경희궁길 28 5층',
  registration: '11110-2026-00003',
  phone: '010-9142-3205',
}

function PhoneMockup({ property, onSubmitSuccess }: { property: Property; onSubmitSuccess: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!agreed) return
    setLoading(true)
    try {
      await supabase.from('inquiries').insert({
        type: 'brokerage',
        name: form.name,
        phone: form.phone,
        message: form.message || `${property.title} 문의`,
        property_type: property.category,
        privacy_agreed: true,
        status: 'new',
      })
      setSubmitted(true)
      setTimeout(onSubmitSuccess, 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    /* 스마트폰 외관 */
    <div className="relative mx-auto" style={{ width: '240px', height: '480px' }}>
      {/* 폰 바디 */}
      <div className="absolute inset-0 bg-gray-800 rounded-[40px] shadow-2xl border-4 border-gray-700">
        {/* 측면 버튼들 */}
        <div className="absolute -right-1.5 top-20 w-1 h-10 bg-gray-600 rounded-r-full" />
        <div className="absolute -left-1.5 top-16 w-1 h-7 bg-gray-600 rounded-l-full" />
        <div className="absolute -left-1.5 top-28 w-1 h-7 bg-gray-600 rounded-l-full" />
        <div className="absolute -left-1.5 top-40 w-1 h-14 bg-gray-600 rounded-l-full" />
      </div>

      {/* 화면 영역 */}
      <div className="absolute inset-1.5 bg-white rounded-[34px] overflow-hidden flex flex-col">
        {/* Dynamic Island / 노치 */}
        <div className="flex justify-center pt-2 flex-shrink-0">
          <div className="w-24 h-6 bg-gray-900 rounded-full" />
        </div>

        {/* 앱 상태바 */}
        <div className="flex items-center justify-between px-4 py-1 flex-shrink-0">
          <span className="text-xs font-semibold text-gray-900">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-0.5">
              {[3, 4, 4, 4].map((h, i) => <div key={i} style={{ height: `${h * 3}px`, width: '3px' }} className="bg-gray-900 rounded-sm" />)}
            </div>
            <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0" y="2" width="11" height="7" rx="1.5" stroke="#111" strokeWidth="1.2" fill="none" /><rect x="11.5" y="3.5" width="2" height="4" rx="0.5" fill="#111" /><rect x="1" y="3" width="9" height="5" rx="0.5" fill="#111" /></svg>
          </div>
        </div>

        {/* 앱 헤더 */}
        <div className="bg-[#1A7F8E] px-4 py-3 flex-shrink-0">
          <p className="text-white text-xs font-bold">아리원 부동산</p>
          <p className="text-white/80 text-xs truncate">{property.title}</p>
        </div>

        {/* 폼 내용 (스크롤) */}
        <div className="flex-1 overflow-y-auto px-3 py-3" style={{ scrollbarWidth: 'none' }}>
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 bg-[#e8f4f6] rounded-full flex items-center justify-center">
                <Check size={24} className="text-[#1A7F8E]" />
              </div>
              <p className="text-xs font-semibold text-gray-900 text-center">문의가 접수됐습니다!</p>
              <p className="text-xs text-gray-500 text-center">곧 연락드리겠습니다.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
              <div>
                <p className="text-xs text-gray-500 mb-1">이름</p>
                <input
                  required value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="홍길동"
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs border-0 focus:outline-none focus:ring-1 focus:ring-[#1A7F8E]"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">연락처</p>
                <input
                  required type="tel" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="010-0000-0000"
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs border-0 focus:outline-none focus:ring-1 focus:ring-[#1A7F8E]"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">문의사항</p>
                <textarea
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="궁금하신 점을 입력해 주세요."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl text-xs border-0 focus:outline-none focus:ring-1 focus:ring-[#1A7F8E] resize-none"
                />
              </div>

              {/* 개인정보 동의 */}
              <label className="flex items-start gap-2 cursor-pointer">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`mt-0.5 w-3.5 h-3.5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-[#1A7F8E] border-[#1A7F8E]' : 'border-gray-300'}`}
                >
                  {agreed && <Check size={8} className="text-white" strokeWidth={3} />}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <span className="text-gray-700 font-medium">[필수]</span> 개인정보 수집·이용 동의
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPrivacy(true); }} className="ml-1 text-[#1A7F8E] hover:underline font-medium">[보기]</button>
                    <br /><span className="text-gray-400" style={{ fontSize: '10px' }}>이름·연락처 수집 / 상담 완료 후 1년 보관</span>
                  </p>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full py-2.5 bg-[#1A7F8E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-95 transition-transform"
              >
                <Send size={12} />
                {loading ? '전송 중...' : '연락받기'}
              </button>
            </form>
          )}
        </div>

        {/* 홈 인디케이터 */}
        <div className="flex justify-center pb-2 flex-shrink-0">
          <div className="w-24 h-1 bg-gray-300 rounded-full" />
        </div>
      </div>
      {/* 개인정보 처리방침 모달 */}
      {showPrivacy && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">개인정보 수집·이용에 대한 안내</h3>
              <button onClick={() => setShowPrivacy(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                아리원 공인중개사사무소는 서비스 제공을 위해서 아래와 같이 개인정보를 수집합니다.<br/>
                정보주체는 본 개인정보의 수집 및 이용에 관한 동의를 거부할 권리가 있으나, 서비스 제공에 필요한 최소한의 개인정보에 동의해야 서비스를 이용할 수 있습니다.
              </p>
              <table className="w-full text-sm border border-gray-200 mb-6">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 py-3 px-4 text-gray-700 font-semibold text-center w-1/3">목적</th>
                    <th className="border border-gray-200 py-3 px-4 text-gray-700 font-semibold text-center w-1/3">항목</th>
                    <th className="border border-gray-200 py-3 px-4 text-gray-700 font-semibold text-center w-1/3">보유기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 py-4 px-4 text-gray-600 text-center">매물 상담 및 연락 서비스 제공</td>
                    <td className="border border-gray-200 py-4 px-4 text-gray-600 text-center">이름, 연락처, 문의 내용</td>
                    <td className="border border-gray-200 py-4 px-4 text-gray-600 text-center">상담 완료 후 1년</td>
                  </tr>
                </tbody>
              </table>
              <button
                onClick={() => setShowPrivacy(false)}
                className="w-full py-3.5 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PropertyModal({ property, onClose }: PropertyModalProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setCurrentImage(p => Math.max(0, p - 1))
      if (e.key === 'ArrowRight') setCurrentImage(p => Math.min((property.images?.length || 1) - 1, p + 1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, property.images?.length])

  const images = property.images && property.images.length > 0 ? property.images : []

  const detailRows = [
    { label: '유형', value: property.category },
    { label: '보증금', value: property.deposit || '-' },
    { label: '월세', value: property.monthly_rent || property.price },
    { label: '권리금', value: property.premium || '-' },
    { label: '면적', value: property.area || '-' },
    { label: '층수', value: property.floor || '-' },
    { label: '주소', value: property.address || '-' },
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 flex items-start md:items-center justify-center p-0 md:p-4 overflow-auto">
      <div className="bg-white w-full min-h-screen md:min-h-0 md:rounded-2xl md:max-w-5xl flex flex-col md:max-h-[92vh]">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">{property.title}</h2>
            <p className="text-[#1A7F8E] font-semibold text-sm">{property.price}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={22} className="text-gray-600" />
          </button>
        </div>

        {/* 바디 */}
        <div className="flex flex-1 overflow-hidden">

          {/* 좌측: 갤러리 + 상세 */}
          <div className="flex-1 overflow-y-auto">
            {/* 사진 갤러리 */}
            <div className="relative bg-gray-100 h-64 md:h-72 flex-shrink-0">
              {images.length > 0 ? (
                <>
                  <Image src={images[currentImage]} alt={property.title} fill className="object-cover" />
                  {images.length > 1 && (
                    <>
                      <button onClick={() => setCurrentImage(p => Math.max(0, p - 1))} disabled={currentImage === 0}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30">
                        <ChevronLeft size={18} />
                      </button>
                      <button onClick={() => setCurrentImage(p => Math.min(images.length - 1, p + 1))} disabled={currentImage === images.length - 1}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full shadow flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30">
                        <ChevronRight size={18} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button key={i} onClick={() => setCurrentImage(i)}
                            className={`h-1.5 rounded-full transition-all ${i === currentImage ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
                        ))}
                      </div>
                    </>
                  )}
                  {/* 하단 썸네일 스트립 */}
                  {images.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 flex gap-2 px-4 pb-10 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                      {images.map((img, i) => (
                        <button key={i} onClick={() => setCurrentImage(i)}
                          className={`flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === currentImage ? 'border-white' : 'border-transparent opacity-50'}`}>
                          <Image src={img} alt="" width={40} height={40} className="object-cover w-full h-full" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9]">
                  <Building2 size={48} className="text-[#1A7F8E] opacity-30 mb-2" />
                  <span className="text-sm text-[#1A7F8E] opacity-60">사진 준비 중</span>
                </div>
              )}
            </div>

            {/* 상세 정보 */}
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">매물 상세 정보</h3>
              <table className="w-full text-sm border-collapse mb-4">
                <tbody>
                  {detailRows.map(row => (
                    <tr key={row.label} className="border-b border-gray-100">
                      <td className="py-2.5 pr-4 text-gray-500 font-medium w-20 whitespace-nowrap">{row.label}</td>
                      <td className="py-2.5 text-gray-900">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {property.description && (
                <div className="p-4 bg-gray-50 rounded-xl mb-4">
                  <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
                </div>
              )}

              {/* 법적 고지 (고정) */}
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
                <p className="text-xs font-bold text-gray-700 mb-2">■ 중개업체 정보 (공인중개사법 제18조의2)</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span><strong className="text-gray-700">업체명</strong> {COMPANY_INFO.name}</span>
                  <span><strong className="text-gray-700">대표자</strong> {COMPANY_INFO.ceo}</span>
                  <span className="col-span-2"><strong className="text-gray-700">주소</strong> {COMPANY_INFO.address}</span>
                  <span><strong className="text-gray-700">등록번호</strong> {COMPANY_INFO.registration}</span>
                  <span><strong className="text-gray-700">연락처</strong> {COMPANY_INFO.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 우측: 스마트폰 목업 (데스크탑) */}
          <div className="hidden md:flex flex-col items-center justify-center w-72 flex-shrink-0 border-l border-gray-100 bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            <p className="text-sm font-semibold text-gray-700 mb-1 text-center">앱으로 바로 문의하기</p>
            <p className="text-xs text-gray-400 mb-6 text-center">아래 정보를 입력하면<br/>담당자가 연락드립니다.</p>
            <PhoneMockup property={property} onSubmitSuccess={() => setFormSubmitted(true)} />
            {formSubmitted && (
              <p className="mt-4 text-xs text-[#1A7F8E] font-medium text-center">✓ 접수 완료! 곧 연락드립니다.</p>
            )}
          </div>
        </div>

        {/* 모바일 하단 Sticky */}
        <div className="md:hidden flex gap-3 px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <a href="tel:010-9142-3205"
            className="flex-1 py-3 bg-[#1A7F8E] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
            <Phone size={16} /> 전화하기
          </a>
          <a href="https://pf.kakao.com/_ariwon" target="_blank" rel="noopener noreferrer"
            className="flex-1 py-3 bg-[#FEE500] text-gray-900 text-sm font-bold rounded-xl flex items-center justify-center gap-2">
            <MessageCircle size={16} /> 카카오톡
          </a>
        </div>
      </div>
    </div>
  )
}
