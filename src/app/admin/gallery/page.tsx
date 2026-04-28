'use client'

import { useEffect, useState } from 'react'
import { supabase, type DesignGallery } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react'

const EMPTY_FORM = {
  title: '',
  type: 'before_after' as DesignGallery['type'],
  description: '',
}

export default function GalleryAdmin() {
  const [items, setItems] = useState<DesignGallery[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<DesignGallery | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  const fetch = async () => {
    setLoading(true)
    const { data } = await supabase.from('design_gallery').select('*').order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const uploadFile = async (file: File, bucket: string) => {
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { data } = await supabase.storage.from(bucket).upload(path, file)
    if (!data) return null
    const { data: url } = supabase.storage.from(bucket).getPublicUrl(data.path)
    return url.publicUrl
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let payload: Partial<DesignGallery> = { ...form }
      if (form.type === 'before_after') {
        if (beforeFile) payload.before_image = await uploadFile(beforeFile, 'gallery') ?? editing?.before_image
        if (afterFile) payload.after_image = await uploadFile(afterFile, 'gallery') ?? editing?.after_image
      } else {
        const urls = await Promise.all(portfolioFiles.map(f => uploadFile(f, 'gallery')))
        payload.portfolio_images = [
          ...(editing?.portfolio_images ?? []),
          ...urls.filter(Boolean) as string[],
        ]
      }
      if (editing) {
        await supabase.from('design_gallery').update(payload).eq('id', editing.id)
      } else {
        await supabase.from('design_gallery').insert(payload)
      }
      setShowModal(false)
      fetch()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('design_gallery').delete().eq('id', id)
    fetch()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">갤러리 관리</h1>
          <p className="text-gray-500 text-sm mt-1">Before/After 및 포트폴리오 관리</p>
        </div>
        <button onClick={() => { setEditing(null); setForm(EMPTY_FORM); setBeforeFile(null); setAfterFile(null); setPortfolioFiles([]); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A7F8E] text-white text-sm font-medium rounded-xl hover:bg-[#156e7b] transition-colors">
          <Plus size={18} /> 항목 추가
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-10 text-center text-gray-400 text-sm">로딩 중...</div>
        ) : items.length === 0 ? (
          <div className="col-span-3 py-10 text-center text-gray-400 text-sm">등록된 갤러리 항목이 없습니다.</div>
        ) : items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9] flex items-center justify-center relative">
              {(item.before_image || (item.portfolio_images && item.portfolio_images[0])) ? (
                <img
                  src={item.before_image || item.portfolio_images![0]}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon size={32} className="text-[#1A7F8E] opacity-40" />
              )}
              <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-white/80 text-gray-700">
                {item.type === 'before_after' ? 'Before/After' : '포트폴리오'}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setEditing(item); setForm({ title: item.title, type: item.type, description: item.description || '' }); setShowModal(true) }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Pencil size={13} /> 수정
                </button>
                <button onClick={() => handleDelete(item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-red-500 border border-red-100 rounded-lg hover:bg-red-50">
                  <Trash2 size={13} /> 삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editing ? '갤러리 수정' : '갤러리 추가'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">유형</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as DesignGallery['type'] }))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] bg-white">
                  <option value="before_after">Before / After</option>
                  <option value="portfolio">시공 포트폴리오</option>
                </select>
              </div>

              {form.type === 'before_after' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Before 이미지</label>
                    <label className="flex flex-col items-center gap-1 px-3 py-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#1A7F8E] text-center">
                      <Upload size={18} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{beforeFile ? beforeFile.name : '업로드'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => setBeforeFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">After 이미지</label>
                    <label className="flex flex-col items-center gap-1 px-3 py-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#1A7F8E] text-center">
                      <Upload size={18} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{afterFile ? afterFile.name : '업로드'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={e => setAfterFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">포트폴리오 이미지</label>
                  <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#1A7F8E]">
                    <Upload size={18} className="text-gray-400" />
                    <span className="text-sm text-gray-500">{portfolioFiles.length > 0 ? `${portfolioFiles.length}개 선택됨` : '여러 장 선택 가능'}</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={e => setPortfolioFiles(Array.from(e.target.files ?? []))} />
                  </label>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] resize-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50">
                  취소
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-[#1A7F8E] text-white text-sm font-medium rounded-xl hover:bg-[#156e7b] disabled:opacity-60">
                  {saving ? '저장 중...' : editing ? '수정 완료' : '추가하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
