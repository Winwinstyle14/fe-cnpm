import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { WrapperContentProfile, WrapperUploadFile } from './style'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSlide'
import { Upload } from 'antd'
import { UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, CameraOutlined, SaveOutlined } from '@ant-design/icons'
import { getBase64 } from '../../utils'

const FIELDS = [
  { key: 'name',    label: 'Họ tên',       icon: <UserOutlined />,        type: 'text',  placeholder: 'Nhập họ tên' },
  { key: 'email',   label: 'Email',         icon: <MailOutlined />,        type: 'email', placeholder: 'Nhập email' },
  { key: 'phone',   label: 'Điện thoại',   icon: <PhoneOutlined />,       type: 'tel',   placeholder: 'Nhập số điện thoại' },
  { key: 'address', label: 'Địa chỉ',      icon: <EnvironmentOutlined />, type: 'text',  placeholder: 'Nhập địa chỉ' },
]

const ProfilePage = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', avatar: '' })

  useEffect(() => {
    setForm({
      name:    user?.name    ?? '',
      email:   user?.email   ?? '',
      phone:   user?.phone   ?? '',
      address: user?.address ?? '',
      avatar:  user?.avatar  ?? '',
    })
  }, [user])

  const mutation = useMutationHooks(async (data) => {
    const { id, access_token, ...rests } = data
    return await UserService.updateUser(id, rests, access_token)
  })

  const { isLoading, isSuccess, isError } = mutation

  // Sau khi update thành công: fetch lại user rồi cập nhật redux — KHÔNG reload trang
  useEffect(() => {
    if (isSuccess) {
      message.success('Cập nhật thành công')
      UserService.getDetailsUser(user?.id, user?.access_token).then((res) => {
        dispatch(updateUser({ ...res?.data, access_token: user?.access_token }))
      })
    } else if (isError) {
      message.error('Cập nhật thất bại')
    }
  }, [isSuccess, isError])

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setForm(prev => ({ ...prev, avatar: file.preview }))
  }

  const handleUpdate = () => {
    mutation.mutate({ id: user?.id, access_token: user?.access_token, ...form })
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: '40px 16px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Title */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserOutlined style={{ color: '#6366f1' }} /> Thông tin cá nhân
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9ca3af' }}>Cập nhật thông tin tài khoản của bạn</p>
        </div>

        <Loading isLoading={isLoading}>
          <WrapperContentProfile>

            {/* Avatar section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ position: 'relative' }}>
                {form.avatar ? (
                  <img src={form.avatar} alt="avatar" style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e0e7ff', boxShadow: '0 2px 8px rgba(99,102,241,0.2)' }} />
                ) : (
                  <div style={{ width: '88px', height: '88px', borderRadius: '50%', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #e0e7ff' }}>
                    <UserOutlined style={{ fontSize: '36px', color: '#6366f1' }} />
                  </div>
                )}
                <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1} showUploadList={false}>
                  <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 6px rgba(99,102,241,0.4)',
                  }}>
                    <CameraOutlined style={{ fontSize: '13px', color: '#fff' }} />
                  </div>
                </WrapperUploadFile>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>{user?.name || 'Người dùng'}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>{user?.email}</div>
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                    {f.label}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '14px', pointerEvents: 'none' }}>
                      {f.icon}
                    </span>
                    <input
                      type={f.type}
                      value={form[f.key]}
                      placeholder={f.placeholder}
                      disabled={f.key === 'email'}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                      style={{
                        width: '100%', height: '42px',
                        paddingLeft: '38px', paddingRight: '12px',
                        border: '1.5px solid #e5e7eb', borderRadius: '8px',
                        fontSize: '14px', color: f.key === 'email' ? '#9ca3af' : '#111827',
                        background: f.key === 'email' ? '#f9fafb' : '#fff',
                        outline: 'none', boxSizing: 'border-box',
                        transition: 'border-color 0.2s',
                        cursor: f.key === 'email' ? 'not-allowed' : 'text',
                      }}
                      onFocus={e => { if (f.key !== 'email') e.target.style.borderColor = '#6366f1' }}
                      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                    />
                  </div>
                  {f.key === 'email' && (
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af' }}>Email không thể thay đổi</p>
                  )}
                </div>
              ))}
            </div>

            {/* Save button */}
            <button
              onClick={handleUpdate}
              style={{
                width: '100%', height: '46px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '15px', fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(99,102,241,0.35)', transition: 'all 0.2s',
                marginTop: '4px',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <SaveOutlined /> Lưu thay đổi
            </button>

          </WrapperContentProfile>
        </Loading>
      </div>
    </div>
  )
}

export default ProfilePage