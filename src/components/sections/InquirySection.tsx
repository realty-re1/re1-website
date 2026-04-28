'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Send } from 'lucide-react'

type InquiryType = 'brokerage' | 'design'

const PROPERTY_TYPES = ['고시원/호스텔', '오피스', '상가', '아파트', '기타']
const DESIGN_STYLES = ['모던 미니멀', '클래식 럭셔리', '내추럴 우드', '인더스트리얼', '기타']
const BUDGETS_BROKERAGE = ['5천만원 미만', '5천~1억', '1억~3억', '3억~5억', '5억 이상', '협의']
const BUDGETS_DESIGN = ['1천만원 미만', '1천~3천만원', '3천~5천만원', '5천만원 이상', '협의']

export default function InquirySection() {
  const [activeType, setActiveType] = useState<InquiryType>('brokerage')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    property_type: '',
    budget: '',
    area_size: '',
    desired_location: '',
    move_in_date: '',
    design_style: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.from('inquiries').insert({
        type: activeType,
        ...form,
      })
      if (!error) setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section id="inquiry" className="py-20 px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle size={64} className="text-[#1A7F8E] mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">의뢰가 접수되었습니다</h3>
          <p className="text-gray-500">빠른 시간 내에 연락드리겠습니다.<br />대표 조정일 (010-9142-3205)</p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', property_type: '', budget: '', area_size: '', desired_location: '', move_in_date: '', design_style: '', message: '' }) }}
            className="mt-8 px-6 py-3 border border-[#1A7F8E] text-[#1A7F8E] rounded-lg hover:bg-[#e8f4f6] transition-colors"
          >
            추가 의뢰하기
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="inquiry" className="py-20 px-6 bg-white">
      <div id="inquiry-sell" className="max-w-2xl mx-auto">
        <div id="design-inquiry">
          <div className="text-center mb-10">
            <p className="text-[#1A7F8E] text-sm font-medium tracking-widest uppercase mb-2">Contact</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">의뢰 / 상담 신청</h2>
            <p className="text-gray-500">아래 양식을 작성해 주시면 빠르게 연락드리겠습니다.</p>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-xl">
            <button
              onClick={() => setActiveType('brokerage')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeType === 'brokerage' ? 'bg-white text-[#1A7F8E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              중개 의뢰 / 매물 내놓기
            </button>
            <button
              onClick={() => setActiveType('design')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${activeType === 'design' ? 'bg-white text-[#1A7F8E] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              공간 솔루션 상담
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이름 <span className="text-red-400">*</span></label>
                <input required name="name" value={form.name} onChange={handleChange}
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처 <span className="text-red-400">*</span></label>
                <input required name="phone" value={form.phone} onChange={handleChange}
                  placeholder="010-0000-0000" type="tel"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
              <input name="email" value={form.email} onChange={handleChange}
                placeholder="example@email.com" type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] transition-colors" />
            </div>

            {activeType === 'brokerage' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">매물 종류</label>
                    <select name="property_type" value={form.property_type} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] bg-white transition-colors">
                      <option value="">선택해 주세요</option>
                      {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">예산</label>
                    <select name="budget" value={form.budget} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] bg-white transition-colors">
                      <option value="">선택해 주세요</option>
                      {BUDGETS_BROKERAGE.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">희망 지역</label>
                    <input name="desired_location" value={form.desired_location} onChange={handleChange}
                      placeholder="예: 종로구, 중구"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">희망 입주일</label>
                    <input name="move_in_date" value={form.move_in_date} onChange={handleChange}
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] transition-colors" />
                  </div>
                </div>
              </>
            )}

            {activeType === 'design' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">공간 면적</label>
                    <input name="area_size" value={form.area_size} onChange={handleChange}
                      placeholder="예: 33㎡ (10평)"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">디자인 스타일</label>
                    <select name="design_style" value={form.design_style} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] bg-white transition-colors">
                      <option value="">선택해 주세요</option>
                      {DESIGN_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">시공 예산</label>
                  <select name="budget" value={form.budget} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] bg-white transition-colors">
                    <option value="">선택해 주세요</option>
                    {BUDGETS_DESIGN.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">상세 내용</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder={activeType === 'brokerage' ? '원하시는 매물 조건이나 현재 보유 매물에 대해 자세히 알려주세요.' : '리모델링하실 공간의 현재 상태, 원하시는 분위기 등을 알려주세요.'}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] transition-colors resize-none" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1A7F8E] text-white font-semibold rounded-xl hover:bg-[#156e7b] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? '제출 중...' : (<><Send size={18} /> 의뢰 신청하기</>)}
            </button>

            <p className="text-center text-xs text-gray-400">
              또는 바로 전화 문의: <a href="tel:010-9142-3205" className="text-[#1A7F8E] font-medium">010-9142-3205</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
