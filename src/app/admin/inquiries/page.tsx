'use client'

import { useEffect, useState } from 'react'
import { supabase, type Inquiry } from '@/lib/supabase'
import { Phone, ChevronDown } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'new', label: '신규', color: 'bg-blue-100 text-blue-700' },
  { value: 'contacted', label: '연락완료', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'in_progress', label: '진행중', color: 'bg-orange-100 text-orange-700' },
  { value: 'completed', label: '완료', color: 'bg-green-100 text-green-700' },
]

export default function InquiriesAdmin() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const fetch = async () => {
    setLoading(true)
    let query = supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    if (filterStatus !== 'all') query = query.eq('status', filterStatus)
    const { data } = await query
    setInquiries(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [filterStatus])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('inquiries').update({ status }).eq('id', id)
    fetch()
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as Inquiry['status'] } : null)
  }

  const getStatusOption = (status: string) => STATUS_OPTIONS.find(o => o.value === status) ?? STATUS_OPTIONS[0]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">의뢰/상담 관리</h1>
          <p className="text-gray-500 text-sm mt-1">고객 문의 목록 및 상태 관리</p>
        </div>
        <div className="flex gap-2">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#1A7F8E]">
            <option value="all">전체</option>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 목록 */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {loading ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">로딩 중...</div>
            ) : inquiries.length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-400 text-sm">의뢰가 없습니다.</div>
            ) : inquiries.map(item => {
              const statusOpt = getStatusOption(item.status)
              return (
                <div
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === item.id ? 'bg-[#e8f4f6] border-l-2 border-[#1A7F8E]' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusOpt.color}`}>{statusOpt.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.type === 'brokerage' ? '중개의뢰' : '공간상담'} &middot; {item.phone}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(item.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  {item.message && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-1">{item.message}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 상세 패널 */}
        {selected && (
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">의뢰 상세</h3>

              <div className="flex flex-col gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">의뢰인</p>
                  <p className="font-medium text-gray-900">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">연락처</p>
                  <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-[#1A7F8E] font-medium hover:underline">
                    <Phone size={14} /> {selected.phone}
                  </a>
                </div>
                {selected.email && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">이메일</p>
                    <p className="text-gray-700">{selected.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">의뢰 유형</p>
                  <p className="text-gray-700">{selected.type === 'brokerage' ? '중개 의뢰' : '공간 솔루션 상담'}</p>
                </div>
                {selected.property_type && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">매물 종류</p>
                    <p className="text-gray-700">{selected.property_type}</p>
                  </div>
                )}
                {selected.budget && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">예산</p>
                    <p className="text-gray-700">{selected.budget}</p>
                  </div>
                )}
                {selected.desired_location && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">희망 지역</p>
                    <p className="text-gray-700">{selected.desired_location}</p>
                  </div>
                )}
                {selected.design_style && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">디자인 스타일</p>
                    <p className="text-gray-700">{selected.design_style}</p>
                  </div>
                )}
                {selected.message && (
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">상세 내용</p>
                    <p className="text-gray-700 text-xs leading-relaxed bg-gray-50 p-3 rounded-lg">{selected.message}</p>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-400 mb-2">상태 변경</p>
                  <div className="flex flex-col gap-1.5">
                    {STATUS_OPTIONS.map(o => (
                      <button
                        key={o.value}
                        onClick={() => updateStatus(selected.id, o.value)}
                        className={`text-xs font-medium px-3 py-2 rounded-lg text-left transition-colors ${
                          selected.status === o.value ? o.color : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>

                <a
                  href={`/admin/properties?from_inquiry=${selected.id}`}
                  className="mt-1 text-xs text-center py-2 border border-[#1A7F8E] text-[#1A7F8E] rounded-lg hover:bg-[#e8f4f6] transition-colors"
                >
                  매물로 전환 등록
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
