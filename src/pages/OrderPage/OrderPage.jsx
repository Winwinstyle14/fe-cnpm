import { Checkbox, Form } from 'antd'
import React, { useEffect, useState, useMemo } from 'react'
import {
  CustomCheckbox, WrapperCountOrder, WrapperInfo, WrapperItemOrder,
  WrapperLeft, WrapperListOrder, WrapperRight, WrapperStyleHeader,
  WrapperStyleHeaderDelivery, WrapperTotal
} from './style'
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, EnvironmentOutlined, TagOutlined, CarOutlined } from '@ant-design/icons'
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom'
import StepComponent from '../../components/StepConponent/StepComponent'

const OrderPage = () => {
  const order = useSelector((state) => state.order)
  const user = useSelector((state) => state.user)
  const [listChecked, setListChecked] = useState([])
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
  const [stateUserDetails, setStateUserDetails] = useState({ name: '', phone: '', address: '', city: '' })
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      setListChecked(listChecked.filter((item) => item !== e.target.value))
    } else {
      setListChecked([...listChecked, e.target.value])
    }
  }

  const handleChangeCount = (type, idProduct, limited) => {
    if (type === 'increase' && !limited) dispatch(increaseAmount({ idProduct }))
    else if (type === 'decrease' && !limited) dispatch(decreaseAmount({ idProduct }))
  }

  const handleDeleteOrder = (idProduct) => dispatch(removeOrderProduct({ idProduct }))

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) setListChecked(order?.orderItems?.map((item) => item?.product))
    else setListChecked([])
  }

  useEffect(() => { dispatch(selectedOrder({ listChecked })) }, [listChecked])
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

  const deliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) return 0
    if (priceMemo >= 200000) return 10000
    return 20000
  }, [priceMemo])

  const totalPriceMemo = useMemo(() =>
    Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
  , [priceMemo, priceDiscountMemo, deliveryPriceMemo])

  const handleRemoveAllOrder = () => {
    if (listChecked?.length > 0) dispatch(removeAllOrderProduct({ listChecked }))
  }

  const handleAddCard = () => {
    if (!order?.orderItemsSlected?.length) {
      message.error('Vui lòng chọn sản phẩm')
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true)
    } else {
      navigate('/payment')
    }
  }

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data
    return UserService.updateUser(id, { ...rests }, token)
  })

  const { isLoading } = mutationUpdate

  const handleCancleUpdate = () => {
    setStateUserDetails({ name: '', email: '', phone: '', isAdmin: false })
    form.resetFields()
    setIsOpenModalUpdateInfo(false)
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

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value })
  }

  const itemsDelivery = [
    { title: '20.000đ', description: 'Dưới 200.000đ' },
    { title: '10.000đ', description: '200k – 500k' },
    { title: 'Miễn phí', description: 'Trên 500.000đ' },
  ]

  const currentStep = deliveryPriceMemo === 10000 ? 2 : deliveryPriceMemo === 20000 ? 1 : order.orderItemsSlected?.length === 0 ? 0 : 3

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '1270px', margin: '0 auto', padding: '24px 16px' }}>

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <ShoppingCartOutlined style={{ fontSize: '22px', color: '#6366f1' }} />
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827' }}>
            Giỏ hàng
            <span style={{ fontSize: '14px', fontWeight: 400, color: '#9ca3af', marginLeft: '8px' }}>
              ({order?.orderItems?.length} sản phẩm)
            </span>
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

          {/* ===== LEFT ===== */}
          <WrapperLeft>
            {/* Delivery step */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px 20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <CarOutlined style={{ color: '#6366f1' }} /> Phí vận chuyển
              </div>
              <WrapperStyleHeaderDelivery>
                <StepComponent items={itemsDelivery} current={currentStep} />
              </WrapperStyleHeaderDelivery>
            </div>

            {/* Table header */}
            <WrapperStyleHeader>
              <div style={{ width: '380px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CustomCheckbox
                  onChange={handleOnchangeCheckAll}
                  checked={listChecked?.length === order?.orderItems?.length && order?.orderItems?.length > 0}
                />
                <span style={{ fontWeight: 600, fontSize: '13px', color: '#374151' }}>
                  Tất cả ({order?.orderItems?.length})
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Thành tiền</span>
                <DeleteOutlined
                  onClick={handleRemoveAllOrder}
                  style={{ fontSize: '15px', cursor: listChecked.length > 0 ? 'pointer' : 'not-allowed', color: listChecked.length > 0 ? '#ef4444' : '#d1d5db' }}
                />
              </div>
            </WrapperStyleHeader>

            {/* Items */}
            <WrapperListOrder>
              {order?.orderItems?.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '12px', padding: '60px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                  <ShoppingCartOutlined style={{ fontSize: '40px', marginBottom: '12px', display: 'block' }} />
                  Giỏ hàng trống
                </div>
              ) : order?.orderItems?.map((item) => (
                <WrapperItemOrder key={item?.product}>
                  {/* Left: checkbox + img + name */}
                  <div style={{ width: '380px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CustomCheckbox onChange={onChange} value={item?.product} checked={listChecked.includes(item?.product)} />
                    <div style={{ width: '68px', height: '68px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0f0f0', background: '#fafafa', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={item?.image} alt={item?.name} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item?.name}
                      </div>
                      {item?.discount > 0 && (
                        <span style={{ fontSize: '11px', background: '#fef2f2', color: '#ef4444', padding: '1px 6px', borderRadius: '4px', fontWeight: 600, marginTop: '4px', display: 'inline-block' }}>
                          -{item.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: price + qty + total + delete */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151', minWidth: '90px' }}>
                      {convertPrice(item?.price)}
                    </span>

                    <WrapperCountOrder>
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}
                        onClick={() => handleChangeCount('decrease', item?.product, item?.amount === 1)}>
                        <MinusOutlined style={{ fontSize: '10px', color: '#6b7280' }} />
                      </button>
                      <WrapperInputNumber defaultValue={item?.amount} value={item?.amount} size="small" min={1} max={item?.countInstock} />
                      <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 8px', display: 'flex', alignItems: 'center' }}
                        onClick={() => handleChangeCount('increase', item?.product, item?.amount === item?.countInstock)}>
                        <PlusOutlined style={{ fontSize: '10px', color: '#6b7280' }} />
                      </button>
                    </WrapperCountOrder>

                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444', minWidth: '90px', textAlign: 'right' }}>
                      {convertPrice(item?.price * item?.amount)}
                    </span>

                    <DeleteOutlined
                      onClick={() => handleDeleteOrder(item?.product)}
                      style={{ fontSize: '16px', color: '#9ca3af', cursor: 'pointer', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                    />
                  </div>
                </WrapperItemOrder>
              ))}
            </WrapperListOrder>
          </WrapperLeft>

          {/* ===== RIGHT ===== */}
          <WrapperRight>
            {/* Address */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', width: '100%' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <EnvironmentOutlined style={{ color: '#6366f1' }} /> Địa chỉ giao hàng
              </div>
              <div style={{ fontSize: '13px', color: '#374151', fontWeight: 500, marginBottom: '8px' }}>
                {user?.name && <div style={{ fontWeight: 700, color: '#111827' }}>{user.name}</div>}
                {user?.address && user?.city ? `${user.address}, ${user.city}` : 'Chưa có địa chỉ'}
              </div>
              <span onClick={() => setIsOpenModalUpdateInfo(true)}
                style={{ fontSize: '12px', color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>
                Thay đổi địa chỉ →
              </span>
            </div>

            {/* Summary */}
            <WrapperInfo>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TagOutlined style={{ color: '#6366f1' }} /> Tóm tắt đơn hàng
              </div>
              {[
                { label: 'Tạm tính', value: convertPrice(priceMemo) },
                { label: 'Giảm giá', value: priceDiscountMemo > 0 ? `-${convertPrice(priceDiscountMemo)}` : '—', color: '#22c55e' },
                { label: 'Phí giao hàng', value: deliveryPriceMemo === 0 ? 'Miễn phí' : convertPrice(deliveryPriceMemo), color: deliveryPriceMemo === 0 ? '#22c55e' : undefined },
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
              onClick={handleAddCard}
              style={{
                width: '100%', height: '48px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99,102,241,0.35)', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Đặt hàng ngay
            </button>

            <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center' }}>
              🔒 Thanh toán bảo mật · Đổi trả 30 ngày
            </div>
          </WrapperRight>
        </div>
      </div>

      {/* Modal */}
      <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
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
    </div>
  )
}

export default OrderPage