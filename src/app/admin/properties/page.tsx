'use client'

import { useEffect, useState } from 'react'
import { supabase, type Property, type PropertyCategory } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X, Upload, Star } from 'lucide-react'

const CATEGORIES: PropertyCategory[] = ['고시원/호스텔', '오피스', '상가', '아파트', '기타']

const STATUS_LABELS = {
  available: '매물 있음',
  pending: '협의중',
  sold: '거래완료',
}

const EMPTY_FORM = {
  title: '', category: '고시원/호스텔' as PropertyCategory,
  price: '', area: '', floor: '', address: '',
  description: '', is_featured: false, status: 'available' as Property['status'],
}

export default function PropertiesAdmin() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const { data } = await supabase.from('properties').select('*').order('created_at', { ascending: false })
    setProperties(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setImageFiles([])
    setShowModal(true)
  }

  const openEdit = (p: Property) => {
    setEditing(p)
    setForm({ title: p.title, category: p.category, price: p.price, area: p.area || '', floor: p.floor || '', address: p.address || '', description: p.description || '', is_featured: p.is_featured, status: p.status })
    setImageFiles([])
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('properties').delete().eq('id', id)
    fetch()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrls: string[] = editing?.images ?? []
      for (const file of imageFiles) {
        const ext = file.name.split('.').pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data } = await supabase.storage.from('properties').upload(path, file)
        if (data) {
          const { data: url } = supabase.storage.from('properties').getPublicUrl(data.path)
          imageUrls = [...imageUrls, url.publicUrl]
        }
      }
      if (editing) {
        await supabase.from('properties').update({ ...form, images: imageUrls, updated_at: new Date().toISOString() }).eq('id', editing.id)
      } else {
        await supabase.from('properties').insert({ ...form, images: imageUrls })
      }
      setShowModal(false)
      fetch()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매물 관리</h1>
          <p className="text-gray-500 text-sm mt-1">매물 등록, 수정, 삭제</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A7F8E] text-white text-sm font-medium rounded-xl hover:bg-[#156e7b] transition-colors">
          <Plus size={18} /> 매물 등록
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">매물명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">카테고리</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">가격</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">추천</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">로딩 중...</td></tr>
            ) : properties.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">등록된 매물이 없습니다.</td></tr>
            ) : properties.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{p.price}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.status === 'available' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                    {STATUS_LABELS[p.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {p.is_featured && <Star size={16} className="text-amber-400 fill-amber-400" />}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-[#1A7F8E] hover:bg-[#e8f4f6] rounded-lg transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editing ? '매물 수정' : '매물 등록'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">매물명 *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as PropertyCategory }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] bg-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Property['status'] }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] bg-white">
                    <option value="available">매물 있음</option>
                    <option value="pending">협의중</option>
                    <option value="sold">거래완료</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">가격 *</label>
                <input required value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                  placeholder="예: 보증 1억 / 월 300만원"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">면적</label>
                  <input value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))}
                    placeholder="예: 99㎡ (30평)"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">층수</label>
                  <input value={form.floor} onChange={e => setForm(p => ({ ...p, floor: e.target.value }))}
                    placeholder="예: 3층"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">이미지 업로드</label>
                <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#1A7F8E] transition-colors">
                  <Upload size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{imageFiles.length > 0 ? `${imageFiles.length}개 선택됨` : '이미지 선택 (여러 장 가능)'}</span>
                  <input type="file" multiple accept="image/*" className="hidden"
                    onChange={e => setImageFiles(Array.from(e.target.files ?? []))} />
                </label>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
                  className="w-4 h-4 accent-[#1A7F8E]" />
                <span className="text-sm text-gray-700">추천 매물로 표시</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
                  취소
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-[#1A7F8E] text-white text-sm font-medium rounded-xl hover:bg-[#156e7b] disabled:opacity-60">
                  {saving ? '저장 중...' : editing ? '수정 완료' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
