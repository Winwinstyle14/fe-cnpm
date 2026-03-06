import React, { useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { BarChartOutlined, DownloadOutlined } from '@ant-design/icons'

// ─── helpers ────────────────────────────────────────────────────────────────
const fmt = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' Tr'
  if (n >= 1_000) return (n / 1_000).toFixed(0) + 'K'
  return String(n)
}
const fmtVND = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n ?? 0)

const dateStr = (d) => new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })

// ─── custom tooltip ──────────────────────────────────────────────────────────
const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1e2535', border: '1px solid #2a3347', borderRadius: 8, padding: '10px 14px' }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#818cf8' }}>{fmtVND(payload[0].value)}</div>
    </div>
  )
}

const HBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1e2535', border: '1px solid #2a3347', borderRadius: 8, padding: '10px 14px', maxWidth: 220 }}>
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#38ef7d' }}>Tổng chi tiêu: {fmtVND(payload[0].value)}</div>
    </div>
  )
}

// ─── PIE colors ───────────────────────────────────────────────────────────────
const PIE_COLORS = ['#6366f1', '#38ef7d', '#f59e0b', '#ef4444']

const PAYMENT_LABEL = {
  later_money: 'Tiền mặt',
  paypal: 'PayPal',
  vnpay: 'VNPay',
  momo: 'MoMo',
}

// ─── Main component ───────────────────────────────────────────────────────────
// ─── Sample data khi chưa có đơn hàng thực ─────────────────────────────────
const generateSampleOrders = () => {
  const customers = [
    { name: 'Nguyễn Thảo Nguyên', phone: '0901234567' },
    { name: 'Ngô Hữu Huy',        phone: '0912345678' },
    { name: 'Vũ Ngọc Phan',       phone: '0923456789' },
    { name: 'Phùng Khắc Toàn',    phone: '0934567890' },
    { name: 'Tạ Minh Quang',      phone: '0945678901' },
    { name: 'Nguyễn Đức Hạnh',    phone: '0956789012' },
    { name: 'Trần Đăng Khoa',     phone: '0967890123' },
    { name: 'Nguyễn Minh Hiệu',   phone: '0978901234' },
    { name: 'Vũ Đức Thắng',       phone: '0989012345' },
    { name: 'Lê Ngọc Huyền',      phone: '0990123456' },
  ]
  const products = [
    'MÀN HÌNH STEELSERIES Pro',
    'LOA LENOVO TUF 387',
    'PC GIGABYTE Standard 510',
    'LOA HP Gaming 619',
    'TAI NGHE HP Ultra 535',
    'Chuột Logitech G502',
    'Bàn phím Keychron K2',
  ]
  const payments = ['later_money', 'paypal', 'later_money', 'later_money', 'paypal']
  const orders = []
  const now = new Date()
  for (let i = 60; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const count = Math.floor(Math.random() * 4)
    for (let j = 0; j < count; j++) {
      const cust = customers[Math.floor(Math.random() * customers.length)]
      const items = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
        const p = products[Math.floor(Math.random() * products.length)]
        const amount = Math.floor(Math.random() * 3) + 1
        const price = (Math.floor(Math.random() * 50) + 5) * 100000
        return { name: p, amount, price }
      })
      const totalPrice = items.reduce((s, it) => s + it.price * it.amount, 0)
      orders.push({
        createdAt: d.toISOString(),
        totalPrice,
        shippingAddress: { fullName: cust.name, phone: cust.phone },
        paymentMethod: payments[Math.floor(Math.random() * payments.length)],
        orderItems: items,
      })
    }
  }
  return orders
}

const KpiStats = ({ orders = [] }) => {
  const displayOrders = orders.length > 0 ? orders : generateSampleOrders()
  const [groupBy, setGroupBy] = useState('day') // day | month
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // ── filter orders by date range ───────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!fromDate && !toDate) return displayOrders
    return displayOrders.filter(o => {
      const d = new Date(o.createdAt)
      if (fromDate && d < new Date(fromDate)) return false
      if (toDate && d > new Date(toDate + 'T23:59:59')) return false
      return true
    })
  }, [orders, fromDate, toDate])

  // ── revenue chart data ────────────────────────────────────────────────────
  const revenueData = useMemo(() => {
    const map = {}
    filtered.forEach(o => {
      const d = new Date(o.createdAt)
      const key = groupBy === 'day'
        ? d.toISOString().slice(0, 10)
        : d.toISOString().slice(0, 7)
      map[key] = (map[key] ?? 0) + (o.totalPrice ?? 0)
    })
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({
        date: groupBy === 'day' ? dateStr(date) : date.slice(0, 7),
        value,
      }))
  }, [filtered, groupBy])

  // ── top 10 customers ──────────────────────────────────────────────────────
  const topCustomers = useMemo(() => {
    const map = {}
    filtered.forEach(o => {
      const name = o.shippingAddress?.fullName || 'Ẩn danh'
      const phone = String(o.shippingAddress?.phone || '')
      const key = `${name} (${phone.slice(-4)})`
      map[key] = (map[key] ?? 0) + (o.totalPrice ?? 0)
    })
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, total]) => ({ name, total }))
  }, [filtered])

  // ── top 5 products ────────────────────────────────────────────────────────
  const topProducts = useMemo(() => {
    const map = {}
    filtered.forEach(o => {
      o.orderItems?.forEach(item => {
        const key = item.name?.slice(0, 28) || 'SP không tên'
        map[key] = (map[key] ?? 0) + (item.amount ?? 1)
      })
    })
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, sold]) => ({ name, sold }))
  }, [filtered])

  // ── payment method ratio ──────────────────────────────────────────────────
  const paymentData = useMemo(() => {
    const map = {}
    filtered.forEach(o => {
      const m = o.paymentMethod || 'other'
      map[m] = (map[m] ?? 0) + 1
    })
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1
    return Object.entries(map).map(([method, count]) => ({
      name: PAYMENT_LABEL[method] || method,
      value: count,
      pct: Math.round(count / total * 100),
    }))
  }, [filtered])

  // ── summary ───────────────────────────────────────────────────────────────
  const totalRevenue = filtered.reduce((s, o) => s + (o.totalPrice ?? 0), 0)
  const totalOrders = filtered.length
  const isSample = orders.length === 0

  // ── export CSV ───────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [['Ngày', 'Doanh thu']]
    revenueData.forEach(r => rows.push([r.date, r.value]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'bao-cao-doanh-thu.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '20px', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BarChartOutlined style={{ fontSize: 20, color: '#818cf8' }} />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#818cf8' }}>
            Thống kê KPI Doanh thu &amp; SP Bán Chạy
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
            style={{ background: '#1e2535', border: '1px solid #4a5568', borderRadius: 8, color: '#f1f5f9', padding: '6px 10px', fontSize: 12, fontWeight: 500 }} />
          <span style={{ color: '#475569', fontSize: 12 }}>→</span>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
            style={{ background: '#1e2535', border: '1px solid #4a5568', borderRadius: 8, color: '#f1f5f9', padding: '6px 10px', fontSize: 12, fontWeight: 500 }} />
          <button onClick={handleExport} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: '#fff',
            border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 12,
            fontWeight: 700, cursor: 'pointer',
          }}>
            <DownloadOutlined /> Xuất Báo Cáo (Excel)
          </button>
        </div>
      </div>

      {/* ── Summary pills ── */}
      {isSample && (
        <div style={{ background: '#fef9c3', border: '1px solid #fde047', borderRadius: 8, padding: '6px 14px', marginBottom: 12, fontSize: 12, color: '#92400e', display: 'inline-block' }}>
          ⚠️ Đang hiển thị dữ liệu mẫu — chưa có đơn hàng thực
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Tổng doanh thu', value: fmtVND(totalRevenue), color: '#818cf8' },
          { label: 'Số đơn hàng',    value: totalOrders,           color: '#38ef7d' },
        ].map(p => (
          <div key={p.label} style={{ background: '#1e2535', border: '1px solid #2a3347', borderRadius: 10, padding: '10px 18px' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{p.label}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: p.color }}>{p.value}</div>
          </div>
        ))}
      </div>

      {/* ── Revenue chart ── */}
      <div style={{ background: '#1a2236', borderRadius: 14, border: '1px solid #2a3347', padding: '18px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#cbd5e1' }}>Biểu đồ doanh thu</div>
          <select value={groupBy} onChange={e => setGroupBy(e.target.value)}
            style={{ background: '#1e2535', border: '1px solid #4a5568', borderRadius: 7, color: '#f1f5f9', padding: '5px 10px', fontSize: 12, fontWeight: 600 }}>
            <option value="day">Theo ngày</option>
            <option value="month">Theo tháng</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }} barSize={14}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={fmt} tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={52} />
            <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
            <Bar dataKey="value" name="Doanh thu" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: 16 }}>

        {/* Top 10 customers */}
        <div style={{ background: '#1a2236', borderRadius: 14, border: '1px solid #2a3347', padding: '18px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', fontWeight: 700, marginBottom: 14 }}>Top 10 Khách hàng</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topCustomers} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" horizontal={false} />
              <XAxis type="number" tickFormatter={fmt} tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={110} tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<HBarTooltip />} cursor={{ fill: 'rgba(251,191,36,0.07)' }} />
              <Bar dataKey="total" name="Tổng tiền" radius={[0, 4, 4, 0]}>
                {topCustomers.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#f59e0b' : i < 3 ? '#fbbf24' : '#38ef7d'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 products */}
        <div style={{ background: '#1a2236', borderRadius: 14, border: '1px solid #2a3347', padding: '18px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', fontWeight: 700, marginBottom: 14 }}>Top 5 Sản phẩm bán chạy nhất</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProducts} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a3347" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(56,239,125,0.07)' }} contentStyle={{ background: '#1e2535', border: '1px solid #2a3347', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="sold" name="Đã bán" fill="#38ef7d" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment pie */}
        <div style={{ background: '#1a2236', borderRadius: 14, border: '1px solid #2a3347', padding: '18px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', fontWeight: 700, marginBottom: 14 }}>Tỉ lệ Phương thức TT</div>
          {paymentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={paymentData} cx="50%" cy="45%" outerRadius={90} innerRadius={50} dataKey="value"
                  label={({ pct }) => `${pct}%`} labelLine={false}
                  style={{ fontSize: 12, fontWeight: 800, fill: '#ffffff' }}>
                  {paymentData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend iconType="circle" iconSize={8}
                  formatter={(v) => <span style={{ color: '#cbd5e1', fontSize: 12, fontWeight: 600 }}>{v}</span>} />
                <Tooltip contentStyle={{ background: '#1e2535', border: '1px solid #2a3347', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#94a3b8', fontSize: 13 }}>
              Chưa có dữ liệu
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KpiStats