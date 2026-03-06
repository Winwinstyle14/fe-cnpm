import React, { useEffect } from 'react'
import Loading from '../../components/LoadingComponent/Loading'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux'
import { convertPrice } from '../../utils'
import { WrapperContainer, WrapperListOrder, WrapperItemOrder, WrapperStatusBadge, WrapperProductRow, WrapperFooterItem } from './style'
import { useLocation, useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/Message'
import { FileTextOutlined, CloseCircleOutlined, CheckCircleOutlined, ClockCircleOutlined, ShoppingOutlined } from '@ant-design/icons'

const MyOrderPage = () => {
  const location = useLocation()
  const { state } = location
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  const fetchMyOrder = async () => {
    // Ưu tiên lấy từ Redux (user đã login), fallback về location.state
    const userId = user?.id || state?.id
    const token = user?.access_token || state?.token
    const res = await OrderService.getOrderByUserId(userId, token)
    return res.data
  }

  const queryOrder = useQuery(
    { queryKey: ['orders', user?.id], queryFn: fetchMyOrder },
    { enabled: !!(user?.id || state?.id) }
  )
  const { isLoading, data } = queryOrder

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data
    return OrderService.cancelOrder(id, token, orderItems, userId)
  })

  const { isLoading: isLoadingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel, data: dataCancel } = mutation

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === 'OK') {
      message.success('Hủy đơn thành công')
      queryOrder.refetch()
    } else if (isSuccessCancel && dataCancel?.status === 'ERR') {
      message.error(dataCancel?.message)
    } else if (isErrorCancel) {
      message.error('Có lỗi xảy ra')
    }
  }, [isErrorCancel, isSuccessCancel])

  const handleCanceOrder = (order) => {
    mutation.mutate({
      id: order._id,
      token: user?.access_token,
      orderItems: order?.orderItems,
      userId: user?.id
    })
  }

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, { state: { token: user?.access_token } })
  }

  return (
    <Loading isLoading={isLoading || isLoadingCancel}>
      <WrapperContainer>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}>

          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <ShoppingOutlined style={{ fontSize: '22px', color: '#6366f1' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>
              Đơn hàng của tôi
              {data?.length > 0 && (
                <span style={{ fontSize: '14px', fontWeight: 400, color: '#9ca3af', marginLeft: '8px' }}>
                  ({data.length} đơn)
                </span>
              )}
            </h2>
          </div>

          {/* Empty state */}
          {data?.length === 0 && (
            <div style={{ background: '#fff', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
              <ShoppingOutlined style={{ fontSize: '48px', marginBottom: '12px', display: 'block' }} />
              <div style={{ fontSize: '15px', fontWeight: 500 }}>Bạn chưa có đơn hàng nào</div>
              <button
                onClick={() => navigate('/')}
                style={{ marginTop: '16px', padding: '8px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
              >
                Mua sắm ngay
              </button>
            </div>
          )}

          <WrapperListOrder>
            {data?.map((order, idx) => (
              <WrapperItemOrder key={order?._id}>

                {/* Header: order index + status badges */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>
                    <span style={{ fontWeight: 600, color: '#374151' }}>Đơn #{String(idx + 1).padStart(3, '0')}</span>
                    <span style={{ margin: '0 8px', color: '#e5e7eb' }}>·</span>
                    <span>{order?.orderItems?.length} sản phẩm</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <WrapperStatusBadge delivered={order.isDelivered}>
                      {order.isDelivered
                        ? <><CheckCircleOutlined /> Đã giao hàng</>
                        : <><ClockCircleOutlined /> Chờ giao hàng</>
                      }
                    </WrapperStatusBadge>
                    <WrapperStatusBadge paid={order.isPaid}>
                      {order.isPaid
                        ? <><CheckCircleOutlined /> Đã thanh toán</>
                        : <><ClockCircleOutlined /> Chưa thanh toán</>
                      }
                    </WrapperStatusBadge>
                  </div>
                </div>

                {/* Product list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                  {order?.orderItems?.map((item) => (
                    <WrapperProductRow key={item?._id}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fafafa', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={item?.image} alt={item?.name} style={{ width: '54px', height: '54px', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, marginLeft: '12px' }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item?.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '3px' }}>x{item?.amount}</div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#374151', flexShrink: 0 }}>
                        {convertPrice(item?.price)}
                      </div>
                    </WrapperProductRow>
                  ))}
                </div>

                {/* Footer */}
                <WrapperFooterItem>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', fontWeight: 700 }}>
                    <span style={{ color: '#6b7280', fontWeight: 400, fontSize: '13px' }}>Tổng cộng:</span>
                    <span style={{ color: '#ef4444', fontSize: '18px' }}>{convertPrice(order?.totalPrice)}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleCanceOrder(order)}
                      style={{
                        height: '36px', padding: '0 16px',
                        border: '1.5px solid #fca5a5', borderRadius: '8px',
                        background: '#fff', color: '#ef4444',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#ef4444' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#fca5a5' }}
                    >
                      <CloseCircleOutlined /> Hủy đơn
                    </button>
                    <button
                      onClick={() => handleDetailsOrder(order?._id)}
                      style={{
                        height: '36px', padding: '0 16px',
                        border: '1.5px solid #a5b4fc', borderRadius: '8px',
                        background: '#fff', color: '#6366f1',
                        fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.borderColor = '#6366f1' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#a5b4fc' }}
                    >
                      <FileTextOutlined /> Xem chi tiết
                    </button>
                  </div>
                </WrapperFooterItem>
              </WrapperItemOrder>
            ))}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  )
}

export default MyOrderPage