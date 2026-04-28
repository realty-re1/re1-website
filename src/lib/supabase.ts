import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder'
)

export type PropertyCategory = '고시원/호스텔' | '오피스' | '상가' | '아파트' | '기타'
export type PropertyTag = '급매' | '고수익' | '공간솔루션'

export interface Property {
  id: string
  title: string
  category: PropertyCategory
  price: string
  deposit?: string
  monthly_rent?: string
  premium?: string
  area: string
  floor: string
  address: string
  description: string
  images: string[]
  is_featured: boolean
  tags: PropertyTag[]
  status: 'available' | 'pending' | 'sold'
  created_at: string
  updated_at: string
}

export interface DesignGallery {
  id: string
  title: string
  type: 'before_after' | 'portfolio'
  before_image?: string
  after_image?: string
  portfolio_images?: string[]
  description: string
  created_at: string
}

export interface Inquiry {
  id: string
  type: 'brokerage' | 'design'
  name: string
  phone: string
  email?: string
  property_id?: string
  property_type?: PropertyCategory
  budget?: string
  area_size?: string
  desired_location?: string
  move_in_date?: string
  design_style?: string
  message: string
  privacy_agreed: boolean
  status: 'new' | 'contacted' | 'in_progress' | 'completed'
  created_at: string
}
