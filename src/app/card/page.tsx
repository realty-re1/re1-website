'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Home, MessageCircle, Phone, X, Send, ChevronDown } from 'lucide-react'

const LINKS = {
  home: 'https://realty-re1.com',
  blog: 'https://blog.naver.com/realty-re1',
  youtube: 'https://youtube.com/@re1_realty',
  instagram: 'https://instagram.com/re1_realty',
}

const PROPERTY_TYPES = ['매도/매입', '임대/임차', '공간 솔루션', '기타 문의']

function InquiryForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '', property_type: '매도/매입' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const submit = async () => {
    if (!form.name || !form.phone || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0f1a1c] rounded-t-3xl p-6 pb-10 space-y-4 animate-slide-up">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white font-semibold text-lg">중개 의뢰 / 문의</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={22} />
          </button>
        </div>

        {status === 'done' ? (
          <div className="text-center py-10 space-y-3">
            <div className="text-4xl">✅</div>
            <p className="text-white font-medium">문의가 접수되었습니다</p>
            <p className="text-gray-400 text-sm">빠른 시일 내 연락드리겠습니다.</p>
            <button onClick={onClose} className="mt-4 w-full py-3 bg-[#1A7F8E] rounded-xl text-white font-medium">
              닫기
            </button>
          </div>
        ) : (
          <>
            {/* 문의 유형 */}
            <div className="relative">
              <select
                value={form.property_type}
                onChange={e => setForm(f => ({ ...f, property_type: e.target.value }))}
                className="w-full bg-[#1c2e31] text-white rounded-xl px-4 py-3 appearance-none text-sm focus:outline-none focus:ring-1 focus:ring-[#1A7F8E]"
              >
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <input
              type="text"
              placeholder="성함"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-[#1c2e31] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1A7F8E]"
            />
            <input
              type="tel"
              placeholder="연락처"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full bg-[#1c2e31] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#1A7F8E]"
            />
            <textarea
              placeholder="문의 내용을 입력해 주세요"
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={4}
              className="w-full bg-[#1c2e31] text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#1A7F8E]"
            />

            {status === 'error' && (
              <p className="text-red-400 text-xs text-center">전송 실패. 잠시 후 다시 시도해주세요.</p>
            )}

            <button
              onClick={submit}
              disabled={status === 'sending' || !form.name || !form.phone || !form.message}
              className="w-full py-3.5 bg-[#1A7F8E] hover:bg-[#156d7a] disabled:opacity-40 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Send size={16} />
              {status === 'sending' ? '전송 중...' : '문의 보내기'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function CardPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <main className="min-h-screen bg-[#0a1214] flex flex-col items-center justify-center px-6 py-12">
      {showForm && <InquiryForm onClose={() => setShowForm(false)} />}

      {/* 프로필 */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <Image
          src="/images/re1-알파.png"
          alt="아리원 공인중개사사무소"
          width={180}
          height={50}
          className="h-12 w-auto object-contain"
        />
        <div className="text-center space-y-1">
          <p className="text-white font-semibold text-lg">대표공인중개사 조정일</p>
          <p className="text-gray-500 text-xs mt-1">서울시 종로구 경희궁길 28, 5층</p>
        </div>
        <a
          href="tel:010-9142-3205"
          className="flex items-center gap-2 text-gray-300 text-sm hover:text-white transition-colors"
        >
          <Phone size={14} className="text-[#1A7F8E]" />
          010-9142-3205
        </a>
      </div>

      {/* 버튼 목록 */}
      <div className="w-full max-w-xs space-y-3">
        {/* 중개의뢰/문의 */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center gap-4 px-5 py-4 bg-[#1A7F8E] hover:bg-[#156d7a] rounded-2xl text-white font-semibold transition-colors shadow-lg shadow-[#1A7F8E]/20"
        >
          <MessageCircle size={22} />
          <span>중개 의뢰 / 문의하기</span>
        </button>

        {/* 홈페이지 */}
        <a
          href={LINKS.home}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-4 px-5 py-4 bg-[#1c2e31] hover:bg-[#233d42] rounded-2xl text-white font-medium transition-colors"
        >
          <Home size={20} className="text-[#1A7F8E]" />
          <span>홈페이지 바로가기</span>
        </a>

        {/* 블로그 */}
        <a
          href={LINKS.blog}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-4 px-5 py-4 bg-[#1c2e31] hover:bg-[#233d42] rounded-2xl text-white font-medium transition-colors"
        >
          <Image src="/images/naver-blog.png" alt="네이버 블로그" width={22} height={22} className="object-contain" />
          <span>네이버 블로그</span>
        </a>

        {/* 유튜브 */}
        <a
          href={LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-4 px-5 py-4 bg-[#1c2e31] hover:bg-[#233d42] rounded-2xl text-white font-medium transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          <span>유튜브 채널</span>
        </a>

        {/* 인스타그램 */}
        <a
          href={LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center gap-4 px-5 py-4 bg-[#1c2e31] hover:bg-[#233d42] rounded-2xl text-white font-medium transition-colors"
        >
          <Image src="/images/instagram.png" alt="인스타그램" width={22} height={22} className="object-contain" />
          <span>인스타그램</span>
        </a>
      </div>

      <p className="mt-10 text-xs text-gray-600">© 2026 아리원 공인중개사사무소</p>

      <style jsx global>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </main>
  )
}
