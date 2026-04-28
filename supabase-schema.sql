-- 매물 테이블
create table properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text not null check (category in ('고시원/호스텔', '오피스', '상가', '아파트', '기타')),
  price text not null,
  area text,
  floor text,
  address text,
  description text,
  images text[] default '{}',
  is_featured boolean default false,
  status text default 'available' check (status in ('available', 'pending', 'sold')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 디자인 갤러리 테이블
create table design_gallery (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null check (type in ('before_after', 'portfolio')),
  before_image text,
  after_image text,
  portfolio_images text[] default '{}',
  description text,
  created_at timestamptz default now()
);

-- 고객 의뢰/상담 테이블
create table inquiries (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('brokerage', 'design')),
  name text not null,
  phone text not null,
  email text,
  property_type text,
  budget text,
  area_size text,
  desired_location text,
  move_in_date text,
  design_style text,
  message text,
  status text default 'new' check (status in ('new', 'contacted', 'in_progress', 'completed')),
  created_at timestamptz default now()
);

-- Storage 버킷
insert into storage.buckets (id, name, public) values ('properties', 'properties', true);
insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true);

-- RLS 정책 (읽기는 공개, 쓰기는 인증된 사용자만)
alter table properties enable row level security;
alter table design_gallery enable row level security;
alter table inquiries enable row level security;

create policy "공개 읽기" on properties for select using (true);
create policy "관리자 쓰기" on properties for all using (auth.role() = 'authenticated');

create policy "공개 읽기" on design_gallery for select using (true);
create policy "관리자 쓰기" on design_gallery for all using (auth.role() = 'authenticated');

create policy "의뢰 등록" on inquiries for insert using (true);
create policy "관리자 읽기/수정" on inquiries for select using (auth.role() = 'authenticated');
create policy "관리자 업데이트" on inquiries for update using (auth.role() = 'authenticated');
