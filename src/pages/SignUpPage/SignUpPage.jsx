import React, { useEffect, useState } from 'react'
import { EyeFilled, EyeInvisibleFilled, MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'

const SignUpPage = () => {
  const navigate = useNavigate()
  const [isShowPassword,        setIsShowPassword]        = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const mutation = useMutationHooks(data => UserService.signupUser(data))
  const { data, isLoading, isSuccess, isError } = mutation

  useEffect(() => {
    if (isSuccess) { message.success(); navigate('/sign-in') }
    else if (isError) { message.error() }
  }, [isSuccess, isError])

  const handleSignUp = () => mutation.mutate({ email, password, confirmPassword })
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSignUp() }

  const inputStyle = {
    width: '100%', height: '46px', paddingLeft: '42px', paddingRight: '42px',
    border: '1.5px solid #e5e7eb', borderRadius: '10px',
    fontSize: '14px', color: '#0f172a', background: '#f8fafc',
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
    fontFamily: "'Poppins', sans-serif",
  }

  const fields = [
    {
      label: 'Email', placeholder: 'abc@gmail.com', type: 'email',
      value: email, onChange: e => setEmail(e.target.value),
      icon: <MailOutlined />, showToggle: false,
    },
    {
      label: 'Mật khẩu', placeholder: '••••••••',
      type: isShowPassword ? 'text' : 'password',
      value: password, onChange: e => setPassword(e.target.value),
      icon: <LockOutlined />, showToggle: true,
      show: isShowPassword, toggle: () => setIsShowPassword(p => !p),
    },
    {
      label: 'Xác nhận mật khẩu', placeholder: '••••••••',
      type: isShowConfirmPassword ? 'text' : 'password',
      value: confirmPassword, onChange: e => setConfirmPassword(e.target.value),
      icon: <LockOutlined />, showToggle: true,
      show: isShowConfirmPassword, toggle: () => setIsShowConfirmPassword(p => !p),
    },
  ]

  const isValid = email.length && password.length && confirmPassword.length
  const passwordMatch = password && confirmPassword && password !== confirmPassword

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      fontFamily: "'Poppins', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Inject Poppins */}
      {!document.getElementById('poppins-font') && (() => {
        const l = document.createElement('link'); l.id = 'poppins-font'; l.rel = 'stylesheet'
        l.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap'
        document.head.appendChild(l); return null
      })()}

      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        display: 'flex', width: '820px',
        borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>

        {/* ── LEFT: Form ── */}
        <div style={{
          flex: 1, padding: '44px 44px 36px',
          background: 'rgba(255,255,255,0.97)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#6366f1', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Thủy Lợi Shop
            </div>
            <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              Tạo tài khoản
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#94a3b8' }}>
              Đăng ký để bắt đầu mua sắm ngay hôm nay!
            </p>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '8px' }}>
            {fields.map((f, i) => (
              <div key={i}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {f.label}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px', zIndex: 1 }}>
                    {f.icon}
                  </span>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={f.value}
                    onChange={f.onChange}
                    onKeyDown={handleKeyDown}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                  {f.showToggle && (
                    <span onClick={f.toggle} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#94a3b8', fontSize: '16px' }}>
                      {f.show ? <EyeFilled /> : <EyeInvisibleFilled />}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Password mismatch warning */}
          {passwordMatch && (
            <div style={{ fontSize: '12px', color: '#ef4444', marginBottom: '8px', fontWeight: 500 }}>
              ⚠️ Mật khẩu xác nhận không khớp
            </div>
          )}

          {/* API Error */}
          {data?.status === 'ERR' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#dc2626', fontWeight: 500 }}>
              ⚠️ {data?.message}
            </div>
          )}

          {/* Submit */}
          <Loading isLoading={isLoading}>
            <button
              disabled={!isValid || !!passwordMatch}
              onClick={handleSignUp}
              style={{
                width: '100%', height: '48px', marginTop: '8px',
                background: (!isValid || passwordMatch)
                  ? '#e5e7eb'
                  : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: (!isValid || passwordMatch) ? '#9ca3af' : '#fff',
                border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 700,
                cursor: (!isValid || passwordMatch) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: (!isValid || passwordMatch) ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
                fontFamily: "'Poppins', sans-serif",
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              onMouseEnter={e => { if (isValid && !passwordMatch) e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <UserAddOutlined /> Đăng ký
            </button>
          </Loading>

          <p style={{ margin: '18px 0 0', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
            Đã có tài khoản?{' '}
            <span onClick={() => navigate('/sign-in')} style={{ color: '#6366f1', fontWeight: 700, cursor: 'pointer' }}>
              Đăng nhập
            </span>
          </p>
        </div>

        {/* ── RIGHT: Visual ── */}
        <div style={{
          width: '300px', flexShrink: 0,
          background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '40px 32px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)' }} />
          <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '130px', height: '130px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />
          <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)' }} />

          <div style={{
            width: '80px', height: '80px', borderRadius: '22px', marginBottom: '24px',
            background: 'linear-gradient(135deg, #6366f1, #38ef7d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(99,102,241,0.5)', fontSize: '36px',
          }}>
            💧
          </div>

          <h3 style={{ margin: '0 0 10px', fontSize: '20px', fontWeight: 800, color: '#fff', textAlign: 'center', letterSpacing: '-0.3px', fontFamily: "'Poppins', sans-serif" }}>
            Thủy Lợi Shop
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 1.6 }}>
            Tiện ích & Linh hoạt như dòng chảy
          </p>

          <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {['🎁 Ưu đãi thành viên mới', '📦 Theo dõi đơn hàng realtime', '💬 Hỗ trợ 24/7'].map((text, i) => (
              <div key={i} style={{
                padding: '9px 14px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.8)',
                fontFamily: "'Poppins', sans-serif",
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

export default SignUpPage