import React, { useMemo } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService'
import { orderContant } from '../../contant'
import { convertPrice } from '../../utils'
import Loading from '../../components/LoadingComponent/Loading'
import {
  WrapperPage, WrapperCard, WrapperHeaderGrid,
  WrapperInfoBox, WrapperLabel, WrapperContentInfo,
  WrapperTableHeader, WrapperProductRow, WrapperNameProduct,
  WrapperCell, WrapperSummary, WrapperSummaryRow, WrapperTotalRow
} from './style'
import { EnvironmentOutlined, CarOutlined, CreditCardOutlined } from '@ant-design/icons'

const DetailsOrderPage = () => {
  const params = useParams()
  const { state } = useLocation()
  const { id } = params

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token)
    return res.data
  }

  const { isLoading, data } = useQuery(
    { queryKey: ['orders-details', id], queryFn: fetchDetailsOrder },
    { enabled: !!id }
  )

  const priceMemo = useMemo(() => {
    return data?.orderItems?.reduce((total, cur) => total + cur.price * cur.amount, 0) ?? 0
  }, [data])

  return (
    <Loading isLoading={isLoading}>
      <WrapperPage>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 16px' }}>

          {/* Page title */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
              Mã đơn: <span style={{ color: '#6366f1', fontWeight: 600 }}>#{id?.slice(-8).toUpperCase()}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#111827' }}>Chi tiết đơn hàng</h2>
          </div>

          {/* Info cards row */}
          <WrapperHeaderGrid>
            <WrapperInfoBox>
              <WrapperLabel>
                <EnvironmentOutlined style={{ color: '#6366f1' }} /> Địa chỉ người nhận
              </WrapperLabel>
              <WrapperContentInfo>
                <div className="name-info">{data?.shippingAddress?.fullName}</div>
                <div className="info-row"><span>Địa chỉ:</span> {data?.shippingAddress?.address}, {data?.shippingAddress?.city}</div>
                <div className="info-row"><span>Điện thoại:</span> {data?.shippingAddress?.phone}</div>
              </WrapperContentInfo>
            </WrapperInfoBox>

            <WrapperInfoBox>
              <WrapperLabel>
                <CarOutlined style={{ color: '#6366f1' }} /> Hình thức giao hàng
              </WrapperLabel>
              <WrapperContentInfo>
                <div className="info-row"><span className="highlight">FAST</span> Giao hàng tiết kiệm</div>
                <div className="info-row"><span>Phí giao hàng:</span> {convertPrice(data?.shippingPrice)}</div>
              </WrapperContentInfo>
            </WrapperInfoBox>

            <WrapperInfoBox>
              <WrapperLabel>
                <CreditCardOutlined style={{ color: '#6366f1' }} /> Thanh toán
              </WrapperLabel>
              <WrapperContentInfo>
                <div className="info-row">{orderContant.payment[data?.paymentMethod]}</div>
                <div className={`status-tag ${data?.isPaid ? 'paid' : 'unpaid'}`}>
                  {data?.isPaid ? '✓ Đã thanh toán' : '○ Chưa thanh toán'}
                </div>
              </WrapperContentInfo>
            </WrapperInfoBox>
          </WrapperHeaderGrid>

          {/* Products table */}
          <WrapperCard style={{ marginTop: '20px' }}>
            <WrapperTableHeader>
              <div style={{ flex: 1 }}>Sản phẩm</div>
              <WrapperCell header>Đơn giá</WrapperCell>
              <WrapperCell header>Số lượng</WrapperCell>
              <WrapperCell header>Giảm giá</WrapperCell>
              <WrapperCell header>Thành tiền</WrapperCell>
            </WrapperTableHeader>

            {data?.orderItems?.map((order, idx) => (
              <WrapperProductRow key={idx}>
                <WrapperNameProduct>
                  <img
                    src={order?.image}
                    alt={order?.name}
                    style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #f0f0f0', background: '#fafafa', padding: '4px', flexShrink: 0 }}
                  />
                  <div style={{ marginLeft: '12px', overflow: 'hidden' }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '320px' }}>
                      {order?.name}
                    </div>
                  </div>
                </WrapperNameProduct>
                <WrapperCell>{convertPrice(order?.price)}</WrapperCell>
                <WrapperCell>x{order?.amount}</WrapperCell>
                <WrapperCell discount>
                  {order?.discount ? `-${convertPrice(order.price * order.amount * order.discount / 100)}` : '—'}
                </WrapperCell>
                <WrapperCell bold>
                  {convertPrice(order?.price * order?.amount)}
                </WrapperCell>
              </WrapperProductRow>
            ))}

            {/* Summary */}
            <WrapperSummary>
              <WrapperSummaryRow>
                <span>Tạm tính</span>
                <span>{convertPrice(priceMemo)}</span>
              </WrapperSummaryRow>
              <WrapperSummaryRow>
                <span>Phí vận chuyển</span>
                <span>{convertPrice(data?.shippingPrice)}</span>
              </WrapperSummaryRow>
              <WrapperTotalRow>
                <span>Tổng cộng</span>
                <span>{convertPrice(data?.totalPrice)}</span>
              </WrapperTotalRow>
            </WrapperSummary>
          </WrapperCard>

        </div>
      </WrapperPage>
    </Loading>
  )
}

export default DetailsOrderPage