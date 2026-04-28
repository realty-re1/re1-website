'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X, Upload, Building2 } from 'lucide-react'

interface MakeoverProject {
  id: string
  title: string
  description: string
  before_images: string[]
  after_images: string[]
  type: string
  created_at: string
}

const EMPTY_FORM = { title: '', description: '' }

export default function MakeoverAdmin() {
  const [projects, setProjects] = useState<MakeoverProject[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<MakeoverProject | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [beforeFiles, setBeforeFiles] = useState<File[]>([])
  const [afterFiles, setAfterFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('design_gallery')
      .select('*')
      .eq('type', 'before_after')
      .order('created_at', { ascending: false })
    setProjects(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchProjects() }, [])

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const urls: string[] = []
    for (const file of files) {
      const ext = file.name.split('.').pop()
      const path = `makeover/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data } = await supabase.storage.from('gallery').upload(path, file)
      if (data) {
        const { data: url } = supabase.storage.from('gallery').getPublicUrl(data.path)
        urls.push(url.publicUrl)
      }
    }
    return urls
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    try {
      const newBeforeUrls = await uploadFiles(beforeFiles)
      const newAfterUrls = await uploadFiles(afterFiles)

      const beforeImages = [...(editing?.before_images ?? []), ...newBeforeUrls]
      const afterImages = [...(editing?.after_images ?? []), ...newAfterUrls]

      if (editing) {
        await supabase.from('design_gallery').update({
          title: form.title,
          description: form.description,
          before_images: beforeImages,
          after_images: afterImages,
        }).eq('id', editing.id)
      } else {
        await supabase.from('design_gallery').insert({
          title: form.title,
          description: form.description,
          type: 'before_after',
          before_images: beforeImages,
          after_images: afterImages,
        })
      }
      setShowModal(false)
      setBeforeFiles([])
      setAfterFiles([])
      fetchProjects()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    await supabase.from('design_gallery').delete().eq('id', id)
    fetchProjects()
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setBeforeFiles([])
    setAfterFiles([])
    setShowModal(true)
  }

  const openEdit = (p: MakeoverProject) => {
    setEditing(p)
    setForm({ title: p.title, description: p.description || '' })
    setBeforeFiles([])
    setAfterFiles([])
    setShowModal(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">메이크오버 관리</h1>
          <p className="text-gray-500 text-sm mt-1">아리원 메이크오버 Before/After 프로젝트 관리</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A7F8E] text-white text-sm font-medium rounded-xl hover:bg-[#156e7b] transition-colors">
          <Plus size={18} /> 프로젝트 등록
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-10 text-center text-gray-400 text-sm">로딩 중...</div>
        ) : projects.length === 0 ? (
          <div className="col-span-3 py-10 text-center text-gray-400 text-sm">등록된 프로젝트가 없습니다.</div>
        ) : projects.map(project => {
          const thumb = project.after_images?.[0] ?? project.before_images?.[0]
          return (
            <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-44 bg-gray-100">
                {thumb ? (
                  <img src={thumb} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#e8f4f6] to-[#c5e4e9] flex items-center justify-center">
                    <Building2 size={32} className="text-[#1A7F8E] opacity-40" />
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="text-xs bg-gray-900/60 text-white px-2 py-1 rounded-full">
                    Before {project.before_images?.length ?? 0}장
                  </span>
                  <span className="text-xs bg-[#1A7F8E]/80 text-white px-2 py-1 rounded-full">
                    After {project.after_images?.length ?? 0}장
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{project.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{project.description}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(project)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Pencil size={13} /> 수정
                  </button>
                  <button onClick={() => handleDelete(project.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs text-red-500 border border-red-100 rounded-lg hover:bg-red-50">
                    <Trash2 size={13} /> 삭제
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 등록/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editing ? '프로젝트 수정' : '프로젝트 등록'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">프로젝트 제목 *</label>
                <input required value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="예: 종로 고시원 → 프리미엄 게스트하우스"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">프로젝트 설명</label>
                <textarea value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3} placeholder="시공 내용, 사용 마감재, 효과 등을 입력해 주세요."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1A7F8E] resize-none" />
              </div>

              {/* Before 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Before 사진 (시공 전)
                  {editing && editing.before_images?.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400">기존 {editing.before_images.length}장 유지됨</span>
                  )}
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition-colors">
                  <Upload size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">{beforeFiles.length > 0 ? `${beforeFiles.length}장 선택됨` : '사진 선택 (여러 장 가능)'}</p>
                    <p className="text-xs text-gray-400">JPG, PNG 권장</p>
                  </div>
                  <input type="file" multiple accept="image/*" className="hidden"
                    onChange={e => setBeforeFiles(Array.from(e.target.files ?? []))} />
                </label>
              </div>

              {/* After 이미지 업로드 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  After 사진 (시공 후)
                  {editing && editing.after_images?.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400">기존 {editing.after_images.length}장 유지됨</span>
                  )}
                </label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-[#1A7F8E]/40 rounded-xl cursor-pointer hover:border-[#1A7F8E] transition-colors bg-[#e8f4f6]/30">
                  <Upload size={18} className="text-[#1A7F8E]" />
                  <div>
                    <p className="text-sm text-gray-600">{afterFiles.length > 0 ? `${afterFiles.length}장 선택됨` : '사진 선택 (여러 장 가능)'}</p>
                    <p className="text-xs text-gray-400">JPG, PNG 권장</p>
                  </div>
                  <input type="file" multiple accept="image/*" className="hidden"
                    onChange={e => setAfterFiles(Array.from(e.target.files ?? []))} />
                </label>
              </div>

              <div className="flex gap-3 pt-1">
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
