import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'
import { orderContant } from '../../contant'
import { CheckCircleFilled, ShoppingOutlined, HomeOutlined, CarOutlined, CreditCardOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = location
  const user = useSelector((state) => state.user)

  // Guard: nếu không có state thì về trang chủ
  if (!state) {
    navigate('/')
    return null
  }

  const { delivery, payment, orders = [], totalPriceMemo } = state

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>

        {/* Success header */}
        <div style={{ background: '#fff', borderRadius: '14px', padding: '32px', textAlign: 'center', marginBottom: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <CheckCircleFilled style={{ fontSize: '56px', color: '#22c55e', marginBottom: '12px', display: 'block' }} />
          <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800, color: '#111827' }}>Đặt hàng thành công!</h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Cảm ơn bạn đã mua hàng. Đơn hàng đang được xử lý.</p>
        </div>

        {/* Delivery + Payment info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CarOutlined style={{ color: '#6366f1' }} /> Phương thức giao hàng
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b' }}>
              {orderContant.delivery[delivery] || delivery}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Giao hàng tiết kiệm</div>
          </div>

          <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <CreditCardOutlined style={{ color: '#6366f1' }} /> Phương thức thanh toán
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>
              {orderContant.payment[payment] || payment}
            </div>
          </div>
        </div>

        {/* Order items */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '16px', boxShadow: '0 1px 6px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShoppingOutlined style={{ color: '#6366f1' }} /> Sản phẩm đã đặt ({orders.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.map((order, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={order.image} alt={order.name} style={{ width: '54px', height: '54px', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>x{order.amount}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#374151', flexShrink: 0 }}>
                  {convertPrice(order.price * order.amount)}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Tổng cộng</span>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#ef4444' }}>{convertPrice(totalPriceMemo)}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/my-order', { state: { id: user?.id, token: user?.access_token } })}
            style={{
              flex: 1, height: '46px',
              background: '#fff', color: '#6366f1',
              border: '1.5px solid #a5b4fc', borderRadius: '10px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            <ShoppingOutlined /> Xem đơn hàng
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              flex: 1, height: '46px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <HomeOutlined /> Về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess