'use client'

import { useState, useEffect } from 'react'
import { X, Check, Send } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface InquiryModalProps {
  inquiryType: string
  onClose: () => void
}

export default function InquiryModal({ inquiryType, onClose }: InquiryModalProps) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!agreed) return
    setLoading(true)
    try {
      const type = inquiryType === '공간솔루션' ? 'design' : 'brokerage'
      const { error } = await supabase.from('inquiries').insert({
        type,
        name: form.name,
        phone: form.phone,
        message: form.message || `${inquiryType} 문의드립니다.`,
        status: 'new',
      })

      if (error) {
        console.error('Supabase error:', error)
        alert('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
        return
      }

      // 텔레그램 알림 전송
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          message: form.message || `${inquiryType} 문의드립니다.`,
          property_type: inquiryType,
        })
      }).catch(err => console.error('Notify error:', err))

      setSubmitted(true)
      setTimeout(onClose, 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
      {/* 닫기 버튼 (모달 밖) */}
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white">
        <X size={24} />
      </button>

      {/* 스마트폰 목업 */}
      <div className="relative" style={{ width: '280px', height: '560px' }}>
        <div className="absolute inset-0 bg-gray-800 rounded-[44px] shadow-2xl border-[6px] border-gray-700">
          <div className="absolute -right-2 top-24 w-1.5 h-12 bg-gray-600 rounded-r-full" />
          <div className="absolute -left-2 top-20 w-1.5 h-8 bg-gray-600 rounded-l-full" />
          <div className="absolute -left-2 top-32 w-1.5 h-16 bg-gray-600 rounded-l-full" />
        </div>

        <div className="absolute inset-1.5 bg-white rounded-[36px] overflow-hidden flex flex-col text-gray-900">
          <div className="flex justify-center pt-2.5 flex-shrink-0">
            <div className="w-28 h-7 bg-gray-900 rounded-full" />
          </div>

          <div className="flex items-center justify-between px-5 py-2 flex-shrink-0">
            <span className="text-xs font-semibold text-gray-900">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="18" height="12" viewBox="0 0 14 10"><rect x="0" y="2" width="11" height="7" rx="1.5" stroke="#111" strokeWidth="1.2" fill="none" /><rect x="11.5" y="3.5" width="2" height="4" rx="0.5" fill="#111" /><rect x="1" y="3" width="9" height="5" rx="0.5" fill="#111" /></svg>
            </div>
          </div>

          <div className="bg-gray-900 px-5 py-4 flex-shrink-0">
            <p className="text-white text-sm font-bold">아리원 공인중개사사무소</p>
            <p className="text-white/80 text-xs mt-0.5">{inquiryType} 접수</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: 'none' }}>
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 bg-[#e8f4f6] rounded-full flex items-center justify-center">
                  <Check size={32} className="text-[#1A7F8E]" />
                </div>
                <p className="text-sm font-bold text-gray-900 text-center">의뢰가 접수되었습니다!</p>
                <p className="text-xs text-gray-500 text-center">담당자가 내용을 확인한 후<br/>빠르게 연락드리겠습니다.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1.5">이름</p>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="홍길동" className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-1 focus:ring-gray-900" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1.5">연락처</p>
                  <input required type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="010-0000-0000" className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-1 focus:ring-gray-900" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1.5">상담 내용</p>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="매물 조건, 희망 지역 등을 자유롭게 적어주세요." rows={4} className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm border-0 focus:outline-none focus:ring-1 focus:ring-gray-900 resize-none" />
                </div>

                <label className="flex items-start gap-2 cursor-pointer mt-1">
                  <div onClick={() => setAgreed(!agreed)} className={`mt-0.5 w-4 h-4 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                    {agreed && <Check size={10} className="text-white" strokeWidth={3} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <span className="text-gray-800 font-medium">[필수]</span> 개인정보 수집·이용 동의
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPrivacy(true); }} className="ml-1 text-gray-900 underline font-medium">[보기]</button>
                      <br /><span className="text-gray-400" style={{ fontSize: '10px' }}>이름·연락처 수집 / 상담 완료 후 1년 보관</span>
                    </p>
                  </div>
                </label>

                <button type="submit" disabled={loading || !agreed} className="w-full mt-2 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform">
                  <Send size={14} />
                  {loading ? '전송 중...' : '상담 의뢰하기'}
                </button>
              </form>
            )}
          </div>

          <div className="flex justify-center pb-3 flex-shrink-0">
            <div className="w-28 h-1.5 bg-gray-200 rounded-full" />
          </div>
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
