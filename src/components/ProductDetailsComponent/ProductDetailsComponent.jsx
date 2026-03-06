import { Image, Rate } from 'antd'
import React, { useState, useEffect, useMemo } from 'react'
import { PlusOutlined, MinusOutlined, ShoppingCartOutlined, ThunderboltOutlined, EnvironmentOutlined, CheckCircleFilled } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice, initFacebookSDK } from '../../utils'
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'
import {
  WrapperLayout, WrapperImageCol, WrapperInfoCol,
  WrapperName, WrapperMeta, WrapperPriceBox,
  WrapperAddress, WrapperQtyControl, WrapperQtyBtn,
  WrapperQtyInput, WrapperActions, WrapperBadge,
  WrapperFeatures, WrapperFeatureItem
} from '../../components/ProductDetailsComponent/style'

const ProductDetailsComponent = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1)
  const user = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)
  const [errorLimitOrder, setErrorLimitOrder] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => { initFacebookSDK() }, [])

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey?.[1]
    if (id) {
      const res = await ProductService.getDetailsProduct(id)
      return res.data
    }
  }

  const { isLoading, data: productDetails } = useQuery(
    ['product-details', idProduct],
    fetchGetDetailsProduct,
    { enabled: !!idProduct }
  )

  useEffect(() => {
    const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
    if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
      setErrorLimitOrder(false)
    } else if (productDetails?.countInStock === 0) {
      setErrorLimitOrder(true)
    }
  }, [numProduct])

  useEffect(() => {
    if (order.isSucessOrder) {
      message.success('Đã thêm vào giỏ hàng')
    }
    return () => { dispatch(resetOrder()) }
  }, [order.isSucessOrder])

  const handleChangeCount = (type) => {
    if (type === 'increase' && numProduct < productDetails?.countInStock) {
      setNumProduct(n => n + 1)
    } else if (type === 'decrease' && numProduct > 1) {
      setNumProduct(n => n - 1)
    }
  }

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate('/sign-in', { state: location?.pathname })
    } else {
      const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
      if ((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
        dispatch(addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInstock: productDetails?.countInStock
          }
        }))
      } else {
        setErrorLimitOrder(true)
      }
    }
  }

  const discountedPrice = useMemo(() => {
    if (!productDetails?.discount || !productDetails?.price) return null
    return productDetails.price * (1 - productDetails.discount / 100)
  }, [productDetails])

  return (
    <Loading isLoading={isLoading}>
      <WrapperLayout>
        {/* LEFT — Image */}
        <WrapperImageCol>
          <div className="image-wrap">
            <Image
              src={productDetails?.image}
              alt={productDetails?.name}
              preview={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            {productDetails?.discount > 0 && (
              <WrapperBadge>-{productDetails.discount}%</WrapperBadge>
            )}
          </div>
          <LikeButtonComponent
            dataHref={process.env.REACT_APP_IS_LOCAL
              ? "https://developers.facebook.com/docs/plugins/"
              : window.location.href}
          />
        </WrapperImageCol>

        {/* RIGHT — Info */}
        <WrapperInfoCol>
          {/* Name */}
          <WrapperName>{productDetails?.name}</WrapperName>

          {/* Rating + sold */}
          <WrapperMeta>
            <Rate allowHalf value={productDetails?.rating} disabled style={{ fontSize: '14px', color: '#faad14' }} />
            <span className="rating-val">{productDetails?.rating}</span>
            <span className="divider">|</span>
            <span className="sold">Đã bán 1000+</span>
            {productDetails?.countInStock > 0
              ? <span className="in-stock"><CheckCircleFilled /> Còn hàng</span>
              : <span className="out-stock">Hết hàng</span>
            }
          </WrapperMeta>

          {/* Price */}
          <WrapperPriceBox>
            <div className="price-main">{convertPrice(productDetails?.price)}</div>
            {discountedPrice && (
              <div className="price-discount">
                <span className="original">{convertPrice(productDetails?.price)}</span>
                <span className="save">Tiết kiệm {productDetails?.discount}%</span>
              </div>
            )}
          </WrapperPriceBox>

          {/* Delivery address */}
          <WrapperAddress>
            <EnvironmentOutlined style={{ color: '#6366f1' }} />
            <span>Giao đến </span>
            <span className="address">{user?.address || 'Chọn địa chỉ'}</span>
            <span className="change">Đổi địa chỉ</span>
          </WrapperAddress>

          {/* Features */}
          <WrapperFeatures>
            {['Hàng chính hãng 100%', 'Miễn phí đổi trả 30 ngày', 'Bảo hành theo nhà sản xuất'].map(f => (
              <WrapperFeatureItem key={f}>
                <CheckCircleFilled style={{ color: '#22c55e', fontSize: '13px' }} />
                <span>{f}</span>
              </WrapperFeatureItem>
            ))}
          </WrapperFeatures>

          {/* Quantity */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '10px', fontWeight: 500 }}>Số lượng</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <WrapperQtyControl>
                <WrapperQtyBtn onClick={() => handleChangeCount('decrease')} disabled={numProduct <= 1}>
                  <MinusOutlined />
                </WrapperQtyBtn>
                <WrapperQtyInput
                  value={numProduct}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    if (v >= 1 && v <= productDetails?.countInStock) setNumProduct(v)
                  }}
                />
                <WrapperQtyBtn onClick={() => handleChangeCount('increase')} disabled={numProduct >= productDetails?.countInStock}>
                  <PlusOutlined />
                </WrapperQtyBtn>
              </WrapperQtyControl>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                {productDetails?.countInStock} sản phẩm có sẵn
              </span>
            </div>
            {errorLimitOrder && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
                Sản phẩm đã đạt giới hạn số lượng trong kho
              </div>
            )}
          </div>

          {/* Action buttons */}
          <WrapperActions>
            <button className="btn-buy" onClick={handleAddOrderProduct}>
              <ShoppingCartOutlined /> Chọn mua
            </button>
            <button className="btn-later">
              <ThunderboltOutlined /> Mua trả sau
            </button>
          </WrapperActions>
        </WrapperInfoCol>
      </WrapperLayout>

      {/* Comments */}
      <div style={{ marginTop: '24px', background: '#fff', borderRadius: '12px', padding: '20px' }}>
        <CommentComponent
          dataHref={process.env.REACT_APP_IS_LOCAL
            ? "https://developers.facebook.com/docs/plugins/comments#configurator"
            : window.location.href}
          width="1270"
        />
      </div>
    </Loading>
  )
}

export default ProductDetailsComponent