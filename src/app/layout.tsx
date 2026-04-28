import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-noto',
})

export const metadata: Metadata = {
  title: '아리원 공인중개사사무소 | Real Estate One',
  description: '서울 종로구 프리미엄 부동산 중개 및 하이엔드 공간 디자인. 오피스, 상가, 고시원, 호스텔 전문.',
  keywords: '부동산, 공인중개사, 종로구, 오피스, 상가, 고시원, 호스텔, 인테리어, 공간디자인',
  openGraph: {
    title: '아리원 공인중개사사무소',
    description: '프리미엄 부동산 중개 & 하이엔드 공간 디자인',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <head>
        <meta name="referrer" content="no-referrer-when-downgrade" />
      </head>
      <body className="min-h-full font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  )
}
