import React, { useState, useEffect } from 'react'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct, WrapperSliderSection, WrapperAdBanner } from './style'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'

// ---- Dữ liệu quảng cáo — thay bg bằng ảnh thật nếu muốn ----
const LEFT_ADS = [
  {
    id: 1,
    bg: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    badge: '🔥 HOT DEAL',
    title: 'CPU Intel\nCore i9',
    sub: 'Hiệu năng vượt trội',
    price: 'Từ 8.990.000đ',
    accent: '#e94560',
  },
  {
    id: 2,
    bg: 'linear-gradient(160deg, #0d0d0d 0%, #1b1b1b 50%, #2d2d2d 100%)',
    badge: '⚡ NEW',
    title: 'RTX 4060\nTi 8GB',
    sub: 'Gaming Ultra Settings',
    price: 'Từ 10.500.000đ',
    accent: '#76b900',
  },
]

const RIGHT_ADS = [
  {
    id: 3,
    bg: 'linear-gradient(160deg, #1c0533 0%, #3b0764 60%, #5b21b6 100%)',
    badge: '🎮 GAMING',
    title: 'RAM DDR5\n32GB',
    sub: 'Tốc độ 6000MHz',
    price: 'Từ 1.890.000đ',
    accent: '#a78bfa',
  },
  {
    id: 4,
    bg: 'linear-gradient(160deg, #0c1a10 0%, #14532d 50%, #166534 100%)',
    badge: '💾 SSD',
    title: 'NVMe Gen4\n2TB',
    sub: 'Đọc 7000 MB/s',
    price: 'Từ 2.290.000đ',
    accent: '#4ade80',
  },
]

const AdCard = ({ ad }) => (
  <a
    href="#"
    style={{
      display: 'block', background: ad.bg, borderRadius: '10px',
      padding: '14px 12px', textDecoration: 'none',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 2px 12px rgba(0,0,0,0.18)',
      overflow: 'hidden', position: 'relative', flex: 1,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-3px)'
      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)'
    }}
  >
    {/* Glow decoration */}
    <div style={{
      position: 'absolute', top: '-20px', right: '-20px',
      width: '80px', height: '80px', borderRadius: '50%',
      background: ad.accent, opacity: 0.15, filter: 'blur(20px)', pointerEvents: 'none',
    }} />

    <div style={{
      display: 'inline-block', fontSize: '10px', fontWeight: 700,
      color: ad.accent, background: `${ad.accent}22`,
      border: `1px solid ${ad.accent}55`,
      borderRadius: '4px', padding: '2px 6px', marginBottom: '8px',
    }}>
      {ad.badge}
    </div>

    <div style={{
      fontSize: '15px', fontWeight: 800, color: '#fff',
      lineHeight: 1.25, marginBottom: '5px', whiteSpace: 'pre-line',
    }}>
      {ad.title}
    </div>

    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginBottom: '10px' }}>
      {ad.sub}
    </div>

    <div style={{
      fontSize: '11px', fontWeight: 700, color: ad.accent,
      borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: '7px',
    }}>
      {ad.price}
    </div>
  </a>
)

// -----------------------------------------------------------------------

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const searchDebounce = useDebounce(searchProduct, 500)
  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(10)
  const [typeProducts, setTypeProducts] = useState([])

  const fetchProductAll = async (context) => {
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const res = await ProductService.getAllProduct(search, limit)
    return res
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') setTypeProducts(res?.data)
  }

  const { isLoading, data: products, isPreviousData } = useQuery(
    ['products', limit, searchDebounce],
    fetchProductAll,
    { retry: 3, retryDelay: 1000, keepPreviousData: true }
  )

  useEffect(() => { fetchAllTypeProduct() }, [])

  const isAllLoaded = products?.total === products?.data?.length

  return (
    <Loading isLoading={isLoading || loading}>
      {/* Category Bar */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '0 16px' }}>
          <WrapperTypeProduct>
            {typeProducts.map((item) => (
              <TypeProduct name={item} key={item} />
            ))}
          </WrapperTypeProduct>
        </div>
      </div>

      {/* Page Body */}
      <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '20px 16px 40px' }}>

          {/* ===== SLIDER + 2 CỘT QUẢNG CÁO ===== */}
          <WrapperSliderSection>
            {/* Left ads */}
            <WrapperAdBanner>
              {LEFT_ADS.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </WrapperAdBanner>

            {/* Slider center */}
            <div style={{
              flex: 1, minWidth: 0,
              borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.10)',
            }}>
              <SliderComponent arrImages={[slider1, slider2, slider3]} />
            </div>

            {/* Right ads */}
            <WrapperAdBanner>
              {RIGHT_ADS.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </WrapperAdBanner>
          </WrapperSliderSection>

          {/* Section Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', marginTop: '32px' }}>
            <div style={{ width: '4px', height: '24px', backgroundColor: '#9255FD', borderRadius: '2px' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#222', letterSpacing: '-0.3px' }}>
              Sản phẩm nổi bật
            </h2>
            {products?.total && (
              <span style={{ fontSize: '13px', color: '#999', marginLeft: '4px' }}>
                ({products.total} sản phẩm)
              </span>
            )}
          </div>

          {/* Products Grid */}
          <WrapperProducts>
            {products?.data?.map((product) => (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                selled={product.selled}
                discount={product.discount}
                id={product._id}
              />
            ))}
          </WrapperProducts>

          {/* Load More */}
          {!isAllLoaded && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '36px' }}>
              <WrapperButtonMore
                textbutton={isPreviousData ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                type="outline"
                styleButton={{
                  border: '1.5px solid #9255FD', color: '#9255FD',
                  width: '220px', height: '44px', borderRadius: '8px', backgroundColor: '#fff',
                }}
                disabled={isAllLoaded || products?.totalPage === 1}
                styleTextButton={{ fontWeight: 600, fontSize: '14px' }}
                onClick={() => setLimit((prev) => prev + 12)}
              />
            </div>
          )}

          {isAllLoaded && products?.data?.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '36px', color: '#aaa', fontSize: '13px' }}>
              Đã hiển thị tất cả {products.total} sản phẩm
            </div>
          )}
        </div>
      </div>
    </Loading>
  )
}

export default HomePage