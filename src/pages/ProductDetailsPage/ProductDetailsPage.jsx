import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { HomeOutlined, RightOutlined } from '@ant-design/icons'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div style={{ width: '100%', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '16px' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', color: '#6b7280', marginBottom: '16px'
        }}>
          <span
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', color: '#6366f1', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <HomeOutlined /> Trang chủ
          </span>
          <RightOutlined style={{ fontSize: '10px' }} />
          <span style={{ color: '#374151' }}>Chi tiết sản phẩm</span>
        </div>

        <ProductDetailsComponent idProduct={id} />
      </div>
    </div>
  )
}

export default ProductDetailsPage