export const dynamic = 'force-dynamic'

import { supabaseAdmin } from '@/lib/supabase'
import { Building2, ImageIcon, MessageSquare, TrendingUp } from 'lucide-react'

async function getStats() {
  const [properties, gallery, inquiries, newInquiries] = await Promise.all([
    supabaseAdmin.from('properties').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('design_gallery').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('inquiries').select('id', { count: 'exact', head: true }),
    supabaseAdmin.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ])
  return {
    properties: properties.count ?? 0,
    gallery: gallery.count ?? 0,
    inquiries: inquiries.count ?? 0,
    newInquiries: newInquiries.count ?? 0,
  }
}

async function getRecentInquiries() {
  const { data } = await supabaseAdmin
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: '신규', color: 'bg-blue-100 text-blue-700' },
  contacted: { label: '연락완료', color: 'bg-yellow-100 text-yellow-700' },
  in_progress: { label: '진행중', color: 'bg-orange-100 text-orange-700' },
  completed: { label: '완료', color: 'bg-green-100 text-green-700' },
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const recentInquiries = await getRecentInquiries()

  const STAT_CARDS = [
    { label: '등록 매물', value: stats.properties, icon: Building2, color: 'text-[#1A7F8E]', bg: 'bg-[#e8f4f6]' },
    { label: '갤러리 항목', value: stats.gallery, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: '전체 의뢰', value: stats.inquiries, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: '신규 의뢰', value: stats.newInquiries, icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 text-sm mt-1">아리원 공인중개사사무소 관리 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon size={20} className={card.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* 최근 의뢰 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">최근 의뢰/상담</h2>
          <a href="/admin/inquiries" className="text-sm text-[#1A7F8E] hover:underline">전체 보기</a>
        </div>
        <div className="divide-y divide-gray-50">
          {recentInquiries.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-400 text-sm">아직 의뢰가 없습니다.</div>
          ) : (
            recentInquiries.map((item: any) => (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                    <span className="text-xs text-gray-400">{item.phone}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.type === 'brokerage' ? '중개의뢰' : '공간상담'} &middot; {item.property_type || item.design_style || '-'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_LABELS[item.status]?.color}`}>
                    {STATUS_LABELS[item.status]?.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
