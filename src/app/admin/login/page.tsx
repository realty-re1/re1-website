'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } else {
      router.push('/admin')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/images/re1-알파.png" alt="아리원" width={140} height={40} className="h-10 w-auto mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">관리자 로그인</h1>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
            <input
              required type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="ji@realty-re1.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
            <div className="relative">
              <input
                required type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] focus:ring-1 focus:ring-[#1A7F8E] pr-12"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#1A7F8E] text-white font-semibold rounded-xl hover:bg-[#156e7b] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
            <LogIn size={18} />
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          아리원 공인중개사사무소 내부 시스템
        </p>
      </div>
    </div>
  )
}
