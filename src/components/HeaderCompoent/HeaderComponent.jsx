import { Badge, Col, Popover } from 'antd'
import React, { useState, useEffect } from 'react'
import {
  WrapperContentPopup, WrapperHeader, WrapperHeaderAccount,
  WrapperTextHeader, WrapperTextHeaderSmall, WrapperSearchBar
} from './style'
import { UserOutlined, CaretDownOutlined, ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading'
import { searchProduct } from '../../redux/slides/productSlide'

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const [isOpenPopup, setIsOpenPopup] = useState(false)
  const [focused, setFocused] = useState(false)
  const order = useSelector((state) => state.order)
  const [loading, setLoading] = useState(false)

  const handleNavigateLogin = () => navigate('/sign-in')

  const handleLogout = async () => {
    setLoading(true)
    await UserService.logoutUser()
    dispatch(resetUser())
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
    setLoading(false)
  }, [user?.name, user?.avatar])

  const handleClickNavigate = (type) => {
    if (type === 'profile') navigate('/profile-user')
    else if (type === 'admin') navigate('/system/admin')
    else if (type === 'my-order') navigate('/my-order', { state: { id: user?.id, token: user?.access_token } })
    else handleLogout()
    setIsOpenPopup(false)
  }

  const onSearch = (e) => {
    const value = e.target.value
    setSearch(value)
    dispatch(searchProduct(value.toLowerCase().trim()))
  }

  const handleSearchSubmit = () => {
    dispatch(searchProduct(search.toLowerCase().trim()))
  }

  const content = (
    <div style={{ minWidth: '160px' }}>
      <WrapperContentPopup onClick={() => handleClickNavigate('profile')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && <WrapperContentPopup onClick={() => handleClickNavigate('admin')}>Quản lí hệ thống</WrapperContentPopup>}
      <WrapperContentPopup onClick={() => handleClickNavigate('my-order')}>Đơn hàng của tôi</WrapperContentPopup>
      <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
    </div>
  )

  return (
    <div style={{ width: '100%', background: 'linear-gradient(135deg, #0a0f1e 0%, #111827 60%, #0d1f0d 100%)', borderBottom: '1px solid rgba(34,197,94,0.15)' }}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>

        {/* ===== LOGO ===== */}
        <Col span={5} style={{ display: 'flex', alignItems: 'center' }}>
          <WrapperTextHeader to='/'>
            {/* SVG icon nước / thủy lợi */}
            <span className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2C14 2 5 10.5 5 16.5C5 21.2 9.03 25 14 25C18.97 25 23 21.2 23 16.5C23 10.5 14 2 14 2Z" fill="url(#waterGrad)" />
                <path d="M10 17C10 17 11 14 14 13C17 12 18 14 18 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
                <defs>
                  <linearGradient id="waterGrad" x1="14" y1="2" x2="14" y2="25" gradientUnits="userSpaceOnUse">
                    <linearGradient id="waterGrad" x1="14" y1="2" x2="14" y2="25" gradientUnits="userSpaceOnUse" />
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#16a34a" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="logo-text">
              <span className="logo-main">Thủy Lợi</span>
              <span className="logo-sub">SHOP</span>
            </span>
          </WrapperTextHeader>
        </Col>

        {/* ===== SEARCH ===== */}
        {!isHiddenSearch && (
          <Col span={11}>
            <WrapperSearchBar focused={focused ? 1 : 0}>
              <input
                className="search-input"
                placeholder="Tìm kiếm sản phẩm..."
                value={search}
                onChange={onSearch}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
              <button className="search-btn" onClick={handleSearchSubmit}>
                <SearchOutlined style={{ fontSize: '16px' }} />
                <span>Tìm kiếm</span>
              </button>
            </WrapperSearchBar>
          </Col>
        )}

        {/* ===== RIGHT ACTIONS ===== */}
        <Col span={8} style={{ display: 'flex', gap: '32px', alignItems: 'center', marginLeft: '32px' }}>
          <Loading isLoading={loading}>
            <WrapperHeaderAccount>
              <div className="avatar-wrap">
                {userAvatar
                  ? <img src={userAvatar} alt="avatar" style={{ height: '32px', width: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(34,197,94,0.5)' }} />
                  : <UserOutlined style={{ fontSize: '18px', color: '#9ca3af' }} />
                }
              </div>
              {user?.email ? (
                <Popover content={content} trigger="click" open={isOpenPopup}>
                  <div
                    className="user-name"
                    onClick={() => setIsOpenPopup(prev => !prev)}
                    style={{ cursor: 'pointer', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {userName?.length ? userName : user?.email}
                    <CaretDownOutlined style={{ fontSize: '10px', marginLeft: '4px', opacity: 0.6 }} />
                  </div>
                </Popover>
              ) : (
                <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall style={{ display: 'block', fontWeight: 600 }}>Đăng nhập</WrapperTextHeaderSmall>
                  <WrapperTextHeaderSmall style={{ opacity: 0.6 }}>/ Đăng ký</WrapperTextHeaderSmall>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>

          {!isHiddenCart && (
            <div
              onClick={() => navigate('/order')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}
            >
              <Badge count={order?.orderItems?.length} size="small" style={{ backgroundColor: '#22c55e' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '7px',
                  border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(34,197,94,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                >
                  <ShoppingCartOutlined style={{ fontSize: '20px', color: '#e5e7eb' }} />
                </div>
              </Badge>
              <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default HeaderComponent