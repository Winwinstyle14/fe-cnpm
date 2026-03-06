import React, { useEffect, useState } from 'react'
import { EyeFilled, EyeInvisibleFilled, MailOutlined, LockOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import jwt_decode from "jwt-decode"
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const location  = useLocation()
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const mutation = useMutationHooks(data => UserService.loginUser(data))
  const { data, isLoading, isSuccess } = mutation

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem('access_token',  JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      if (data?.access_token) {
        const decoded = jwt_decode(data?.access_token)
        if (decoded?.id) handleGetDetailsUser(decoded?.id, data?.access_token)
      }
      navigate(location?.state || '/')
    }
  }, [isSuccess])

  const handleGetDetailsUser = async (id, token) => {
    const refreshToken = JSON.parse(localStorage.getItem('refresh_token'))
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }))
  }

  const handleSignIn = () => mutation.mutate({ email, password })

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSignIn() }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        display: 'flex', width: '820px', minHeight: '480px',
        borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>

        {/* ── LEFT: Form ── */}
        <div style={{
          flex: 1, padding: '48px 44px',
          background: 'rgba(255,255,255,0.97)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          {/* Logo text */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Thủy Lợi Shop
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Đăng nhập
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '14px', color: '#94a3b8' }}>
              Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.
            </p>
          </div>

          {/* Email field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <MailOutlined style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px', zIndex: 1 }} />
              <input
                type="email"
                placeholder="abc@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: '100%', height: '46px', paddingLeft: '42px', paddingRight: '14px',
                  border: '1.5px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '14px', color: '#0f172a', background: '#f8fafc',
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <LockOutlined style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px', zIndex: 1 }} />
              <input
                type={isShowPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  width: '100%', height: '46px', paddingLeft: '42px', paddingRight: '42px',
                  border: '1.5px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '14px', color: '#0f172a', background: '#f8fafc',
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
              <span
                onClick={() => setIsShowPassword(!isShowPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', fontSize: '16px' }}
              >
                {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
              </span>
            </div>
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>
              Quên mật khẩu?
            </span>
          </div>

          {/* Error */}
          {data?.status === 'ERR' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#dc2626', fontWeight: 500 }}>
              ⚠️ {data?.message}
            </div>
          )}

          {/* Submit button */}
          <Loading isLoading={isLoading}>
            <button
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              style={{
                width: '100%', height: '48px',
                background: (!email.length || !password.length)
                  ? '#e5e7eb'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: (!email.length || !password.length) ? '#9ca3af' : '#fff',
                border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 700, cursor: (!email.length || !password.length) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: (!email.length || !password.length) ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
              }}
              onMouseEnter={e => { if (email.length && password.length) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Đăng nhập
            </button>
          </Loading>

          {/* Sign up link */}
          <p style={{ margin: '20px 0 0', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
            Chưa có tài khoản?{' '}
            <span
              onClick={() => navigate('/sign-up')}
              style={{ color: '#6366f1', fontWeight: 700, cursor: 'pointer' }}
            >
              Tạo tài khoản
            </span>
          </p>
        </div>

        {/* ── RIGHT: Visual panel ── */}
        <div style={{
          width: '300px', flexShrink: 0,
          background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '40px 32px', position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '130px', height: '130px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Logo icon */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '22px', marginBottom: '24px',
            background: 'linear-gradient(135deg, #6366f1, #38ef7d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
            fontSize: '36px',
          }}>
            💧
          </div>

          <h3 style={{ margin: '0 0 10px', fontSize: '20px', fontWeight: 800, color: '#fff', textAlign: 'center', letterSpacing: '-0.3px' }}>
            Thủy Lợi Shop
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 1.6 }}>
            Tiện ích & Linh hoạt như dòng chảy
          </p>

          {/* Feature pills */}
          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {['🚀 Giao hàng nhanh', '🔒 Thanh toán an toàn', '💎 Sản phẩm chính hãng'].map((text, i) => (
              <div key={i} style={{
                padding: '9px 14px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.8)',
              }}>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage