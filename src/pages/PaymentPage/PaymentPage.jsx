import { Form, Radio } from 'antd'
import React, { useEffect, useState, useMemo } from 'react'
import { WrapperLeft, WrapperRight, WrapperInfo, WrapperTotal, WrapperLabel, WrapperRadioGroup, WrapperOptionCard } from './style'
import { useDispatch, useSelector } from 'react-redux'
import { convertPrice } from '../../utils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom'
import { removeAllOrderProduct } from '../../redux/slides/orderSlide'
import * as PaymentService from '../../services/PaymentService'
import {
  EnvironmentOutlined, CarOutlined, CreditCardOutlined,
  DollarOutlined, TagOutlined, CheckCircleFilled, LockOutlined
} from '@ant-design/icons'

const PaymentPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [delivery, setDelivery] = useState('fast')
  const [payment, setPayment] = useState('later_money')
  const [sdkReady, setSdkReady] = useState(false)
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({ name: '', phone: '', address: '', city: '' })
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => { form.setFieldsValue(stateUserDetails) }, [form, stateUserDetails])
  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({ city: user?.city, name: user?.name, address: user?.address, phone: user?.phone })
    }
  }, [isOpenModalUpdateInfo])

  const priceMemo = useMemo(() =>
    order?.orderItemsSlected?.reduce((total, cur) => total + cur.price * cur.amount, 0) ?? 0
  , [order])

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      return total + (priceMemo * ((cur.discount ?? 0) * cur.amount) / 100)
    }, 0)
    return Number(result) || 0
  }, [order])

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo > 200000) return 10000
    if (priceMemo === 0) return 0
    return 20000
  }, [priceMemo])

  const totalPriceMemo = useMemo(() =>
    Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
  , [priceMemo, priceDiscountMemo, diliveryPriceMemo])

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data
    return UserService.updateUser(id, { ...rests }, token)
  })

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data
    return OrderService.createOrder({ ...rests }, token)
  })

  const { isLoading } = mutationUpdate
  const { data: dataAdd, isLoading: isLoadingAddOrder, isSuccess, isError } = mutationAddOrder

  useEffect(() => {
    if (isSuccess && dataAdd?.status === 'OK') {
      const arrayOrdered = order?.orderItemsSlected?.map(e => e.product)
      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }))
      message.success('Đặt hàng thành công')
      navigate('/orderSuccess', { state: { delivery, payment, orders: order?.orderItemsSlected, totalPriceMemo } })
    } else if (isSuccess && dataAdd?.status === 'ERR') {
      message.error(dataAdd?.message || 'Đặt hàng thất bại')
    } else if (isError) {
      message.error('Lỗi kết nối, vui lòng thử lại')
    }
  }, [isSuccess, isError])

  const handleAddOrder = () => {
    const missing = []
    if (!user?.name)    missing.push('họ tên')
    if (!user?.phone)   missing.push('số điện thoại')
    if (!user?.address) missing.push('địa chỉ')
    if (!user?.city)    missing.push('thành phố')

    if (missing.length > 0) {
      message.error(`Vui lòng cập nhật: ${missing.join(', ')}`)
      setIsOpenModalUpdateInfo(true)
      return
    }
    if (!order?.orderItemsSlected?.length) {
      message.error('Chưa có sản phẩm nào được chọn')
      return
    }

    mutationAddOrder.mutate({
      token: user?.access_token,
      orderItems: order?.orderItemsSlected,
      fullName: user?.name,
      address: user?.address,
      phone: user?.phone,
      city: user?.city,
      paymentMethod: payment,
      itemsPrice: priceMemo,
      shippingPrice: diliveryPriceMemo,
      totalPrice: totalPriceMemo,
      user: user?.id,
      email: user?.email
    })
  }

  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails
    if (name && address && city && phone) {
      mutationUpdate.mutate({ id: user?.id, token: user?.access_token, ...stateUserDetails }, {
        onSuccess: () => {
          dispatch(updateUser({ name, address, city, phone }))
          setIsOpenModalUpdateInfo(false)
        }
      })
    }
  }

  const handleCancleUpdate = () => {
    setStateUserDetails({ name: '', phone: '', address: '', city: '' })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }

  const addPaypalScript = async () => {
    const { data } = await PaymentService.getConfig()
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
    script.async = true
    script.onload = () => setSdkReady(true)
    document.body.appendChild(script)
  }

  useEffect(() => {
    if (!window.paypal) addPaypalScript()
    else setSdkReady(true)
  }, [])

  const DELIVERY_OPTIONS = [
    { value: 'fast', label: 'FAST', sub: 'Giao hàng tiết kiệm', color: '#f59e0b', icon: '🚚' },
    { value: 'gojek', label: 'GO_JEK', sub: 'Giao hàng nhanh', color: '#22c55e', icon: '🛵' },
  ]

  const PAYMENT_OPTIONS = [
    { value: 'later_money', label: 'Tiền mặt khi nhận hàng', sub: 'Trả tiền khi nhận hàng tại địa chỉ của bạn', icon: <DollarOutlined style={{ fontSize: '20px', color: '#22c55e' }} /> },
    { value: 'paypal', label: 'PayPal', sub: 'Thanh toán trực tuyến qua PayPal', icon: <CreditCardOutlined style={{ fontSize: '20px', color: '#0070ba' }} /> },
  ]

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }}>
      <Loading isLoading={isLoadingAddOrder}>
        <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '24px 16px' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <CreditCardOutlined style={{ fontSize: '22px', color: '#6366f1' }} />
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>Thanh toán</h2>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <WrapperLeft>
              <WrapperInfo>
                <WrapperLabel>
                  <EnvironmentOutlined style={{ color: '#6366f1' }} /> Địa chỉ nhận hàng
                </WrapperLabel>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>{user?.name}</div>
                    <div style={{ fontSize: '13px', color: '#4b5563' }}>
                      📍 {user?.address}{user?.city ? `, ${user?.city}` : ''}<br />
                      📞 {user?.phone}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpenModalUpdateInfo(true)}
                    style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600, background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer' }}
                  >
                    Thay đổi
                  </button>
                </div>
              </WrapperInfo>

              <WrapperInfo>
                <WrapperLabel>
                  <CarOutlined style={{ color: '#6366f1' }} /> Phương thức giao hàng
                </WrapperLabel>
                <WrapperRadioGroup onChange={(e) => setDelivery(e.target.value)} value={delivery}>
                  {DELIVERY_OPTIONS.map(opt => (
                    <WrapperOptionCard key={opt.value} selected={delivery === opt.value} onClick={() => setDelivery(opt.value)}>
                      <Radio value={opt.value} />
                      <span style={{ fontSize: '18px' }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: opt.color }}>{opt.label}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{opt.sub}</div>
                      </div>
                      {delivery === opt.value && <CheckCircleFilled style={{ color: '#6366f1', marginLeft: 'auto', fontSize: '16px' }} />}
                    </WrapperOptionCard>
                  ))}
                </WrapperRadioGroup>
              </WrapperInfo>

              <WrapperInfo>
                <WrapperLabel>
                  <CreditCardOutlined style={{ color: '#6366f1' }} /> Phương thức thanh toán
                </WrapperLabel>
                <WrapperRadioGroup onChange={(e) => setPayment(e.target.value)} value={payment}>
                  {PAYMENT_OPTIONS.map(opt => (
                    <WrapperOptionCard key={opt.value} selected={payment === opt.value} onClick={() => setPayment(opt.value)}>
                      <Radio value={opt.value} />
                      <span>{opt.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{opt.label}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{opt.sub}</div>
                      </div>
                      {payment === opt.value && <CheckCircleFilled style={{ color: '#6366f1', marginLeft: 'auto', fontSize: '16px' }} />}
                    </WrapperOptionCard>
                  ))}
                </WrapperRadioGroup>
              </WrapperInfo>

              <WrapperInfo>
                <WrapperLabel>
                  <TagOutlined style={{ color: '#6366f1' }} /> Sản phẩm đặt hàng ({order?.orderItemsSlected?.length})
                </WrapperLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                  {order?.orderItemsSlected?.map((item) => (
                    <div key={item.product} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                      <div style={{ width: '52px', height: '52px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fff', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={item.image} alt={item.name} style={{ width: '46px', height: '46px', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>x{item.amount}</div>
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444', flexShrink: 0 }}>
                        {convertPrice(item.price * item.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </WrapperInfo>
            </WrapperLeft>

            <WrapperRight>
              <WrapperInfo>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TagOutlined style={{ color: '#6366f1' }} /> Tóm tắt đơn hàng
                </div>
                {[
                  { label: 'Tạm tính', value: convertPrice(priceMemo) },
                  { label: 'Giảm giá', value: priceDiscountMemo > 0 ? `-${convertPrice(priceDiscountMemo)}` : '—', color: '#22c55e' },
                  { label: 'Phí giao hàng', value: diliveryPriceMemo === 0 ? 'Miễn phí' : convertPrice(diliveryPriceMemo), color: diliveryPriceMemo === 0 ? '#22c55e' : undefined },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: row.color ?? '#111827' }}>{row.value}</span>
                  </div>
                ))}
              </WrapperInfo>

              <WrapperTotal>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>Tổng cộng</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#ef4444' }}>{convertPrice(totalPriceMemo)}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>Đã gồm VAT</div>
                </div>
              </WrapperTotal>

              <button
                onClick={handleAddOrder}
                style={{
                  width: '100%', height: '50px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#fff', border: 'none', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)', transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Xác nhận đặt hàng
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '11px', color: '#9ca3af' }}>
                <LockOutlined /> Thanh toán bảo mật · Đổi trả 30 ngày
              </div>
            </WrapperRight>
          </div>
        </div>

        <ModalComponent title="Cập nhật địa chỉ giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
          <Loading isLoading={isLoading}>
            <Form name="basic" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} autoComplete="on" form={form}>
              {[
                { label: 'Họ tên', name: 'name' },
                { label: 'Thành phố', name: 'city' },
                { label: 'Điện thoại', name: 'phone' },
                { label: 'Địa chỉ', name: 'address' },
              ].map(f => (
                <Form.Item key={f.name} label={f.label} name={f.name} rules={[{ required: true, message: `Vui lòng nhập ${f.label.toLowerCase()}!` }]}>
                  <InputComponent value={stateUserDetails[f.name]} onChange={handleOnchangeDetails} name={f.name} />
                </Form.Item>
              ))}
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  )
}

export default PaymentPage