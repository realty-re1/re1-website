'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { Phone, Mail, MapPin } from 'lucide-react'
import Script from 'next/script'

const NAVER_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID ?? ''
const LAT = 37.5725
const LNG = 126.9708

function NaverMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const initialized = useRef(false)

  const initMap = () => {
    if (initialized.current || !mapRef.current) return
    const naver = (window as any).naver
    if (!naver?.maps) return
    initialized.current = true

    const center = new naver.maps.LatLng(LAT, LNG)
    const map = new naver.maps.Map(mapRef.current, {
      center,
      zoom: 17,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: { position: naver.maps.Position.TOP_RIGHT },
    })
    new naver.maps.Marker({
      position: center,
      map,
      title: '아리원 공인중개사사무소',
    })
  }

  useEffect(() => {
    if ((window as any).naver?.maps) initMap()
  }, [])

  return (
    <>
      {NAVER_CLIENT_ID && (
        <Script
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_CLIENT_ID}`}
          onLoad={initMap}
          strategy="afterInteractive"
        />
      )}
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden">
        {!NAVER_CLIENT_ID && (
          <div className="w-full h-full bg-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2">
            <MapPin size={32} className="text-[#1A7F8E] opacity-60" />
            <p className="text-sm text-gray-500 font-medium">서울시 종로구 경희궁길 28 5층</p>
            <a
              href="https://map.naver.com/v5/search/서울시 종로구 경희궁길 28"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#1A7F8E] underline"
            >
              네이버 지도에서 보기
            </a>
            <p className="text-xs text-gray-400 mt-1">(.env.local에 NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 설정 필요)</p>
          </div>
        )}
      </div>
    </>
  )
}

export default function Footer() {
  return (
    <footer id="footer" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* 좌측: 네이버 지도 */}
          <div className="order-2 lg:order-1">
            <h3 className="text-base font-semibold mb-4 text-white">오시는 길</h3>
            <div className="h-72 lg:h-80">
              <NaverMap />
            </div>
          </div>

          {/* 우측: 회사 정보 */}
          <div className="order-1 lg:order-2 flex flex-col gap-7 items-start justify-end lg:pl-16">
            <Image
              src="/images/re1-알파.png"
              alt="아리원 공인중개사사무소"
              width={150}
              height={42}
              className="h-10 w-auto object-contain"
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-[#1A7F8E] mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">서울시 종로구 경희궁길 28 5층</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-[#1A7F8E] flex-shrink-0" />
                <a href="tel:010-9142-3205" className="text-gray-300 hover:text-white transition-colors">
                  010-9142-3205
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-[#1A7F8E] flex-shrink-0" />
                <a href="mailto:info@realty-re1.com" className="text-gray-300 hover:text-white transition-colors">
                  info@realty-re1.com
                </a>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-5">
              <p className="text-xs text-gray-500">
                대표: 조정일&nbsp;&nbsp;|&nbsp;&nbsp;등록번호: 11110-2026-00003
              </p>
            </div>

            <div className="flex gap-3">
              <a href="https://blog.naver.com/realty-re1" target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-800 text-gray-400 text-xs rounded-lg hover:bg-[#03C75A] hover:text-white transition-colors">
                네이버 블로그
              </a>
              <a href="https://youtube.com/@re1_realty" target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-800 text-gray-400 text-xs rounded-lg hover:bg-[#FF0000] hover:text-white transition-colors">
                유튜브
              </a>
              <a href="https://instagram.com/re1_realty" target="_blank" rel="noopener noreferrer"
                className="px-3 py-1.5 bg-gray-800 text-gray-400 text-xs rounded-lg hover:bg-[#E1306C] hover:text-white transition-colors">
                인스타그램
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 px-6 py-4">
        <p className="max-w-7xl mx-auto text-center text-xs text-gray-600">
          © 2026 아리원 공인중개사사무소 (Real Estate One). All rights reserved.
        </p>
      </div>
    </footer>
  )
}
