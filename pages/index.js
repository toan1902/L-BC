// pages/index.js  — Trang công khai, chỉ xem
import { useEffect, useState, useRef } from 'react'
import { CAT_LABELS, PM_LABELS } from '../lib/data'
import Head from 'next/head'

const CAT_COLORS = {
  'su-kien': '#378ADD', 'hanh-chinh': '#7F77DD',
  'dao-tao': '#639922', 'tiep-khach': '#EF9F27', 'khac': '#888780'
}

function fmt(n) { return Number(n || 0).toLocaleString('vi-VN') }

const DAYS = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy']

export default function Home() {
  const [data, setData] = useState({ members: [], expenses: [] })
  const [tab, setTab] = useState('thu')
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const barRef = useRef(null)
  const donutRef = useRef(null)
  const barChart = useRef(null)
  const donutChart = useRef(null)

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const hh = String(now.getHours()).padStart(2,'0')
      const mm = String(now.getMinutes()).padStart(2,'0')
      const ss = String(now.getSeconds()).padStart(2,'0')
      setTime(`${hh}:${mm}:${ss}`)
      setDate(`${DAYS[now.getDay()]}, ngày ${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()}`)
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])

  // Fetch data
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData)
    const t = setInterval(() => {
      fetch('/api/data').then(r => r.json()).then(setData)
    }, 30000)
    return () => clearInterval(t)
  }, [])

  // Charts
  useEffect(() => {
    if (!data.members.length) return
    const Chart = window.Chart
    if (!Chart) return

    // Bar chart
    if (barChart.current) barChart.current.destroy()
    const bCtx = barRef.current?.getContext('2d')
    if (bCtx) {
      barChart.current = new Chart(bCtx, {
        type: 'bar',
        data: {
          labels: data.members.map(m => m.name.replace(/^Lê /, 'L. ')),
          datasets: [{
            data: data.members.map(m => +(m.paid/1000000).toFixed(1)),
            backgroundColor: data.members.map(m => m.paid > 0 ? '#534AB7' : '#D3D1C7'),
            borderRadius: 4,
          }]
        },
        options: {
          indexAxis: 'y', responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: 'rgba(0,0,0,.05)' }, ticks: { font: { size: 10 }, callback: v => v + 'tr' } },
            y: { ticks: { font: { size: 11 } }, grid: { display: false } }
          }
        }
      })
    }

    // Donut
    if (donutChart.current) donutChart.current.destroy()
    const bycat = {}
    data.expenses.forEach(e => bycat[e.cat] = (bycat[e.cat] || 0) + e.amount)
    const cats = Object.keys(bycat)
    const dCtx = donutRef.current?.getContext('2d')
    if (dCtx && cats.length) {
      donutChart.current = new Chart(dCtx, {
        type: 'doughnut',
        data: {
          labels: cats.map(c => CAT_LABELS[c] || c),
          datasets: [{ data: cats.map(c => bycat[c]), backgroundColor: cats.map(c => CAT_COLORS[c] || '#888'), borderWidth: 0 }]
        },
        options: {
          responsive: true, maintainAspectRatio: false, cutout: '55%',
          plugins: { legend: { display: true, position: 'bottom', labels: { font: { size: 10 }, boxWidth: 9, padding: 7 } } }
        }
      })
    }
  }, [data, tab])

  const { members, expenses } = data
  const totalPaid = members.reduce((a, m) => a + (m.paid || 0), 0)
  const totalChi = expenses.reduce((a, e) => a + (e.amount || 0), 0)
  const paidCount = members.filter(m => m.paid > 0).length
  const ton = totalPaid - totalChi
  const tmTotal = members.filter(m => m.pm === 'tien-mat').reduce((a, m) => a + m.paid, 0)
  const ckTotal = members.filter(m => m.pm === 'chuyen-khoan').reduce((a, m) => a + m.paid, 0)

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
  const filteredExpenses = expenses.filter(e => !catFilter || e.cat === catFilter)

  return (
    <>
      <Head>
        <title>LĐBC — Quản lý hội phí</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" />
      </Head>

      <div className="container">
        {/* Top bar */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="logo">LĐ</div>
            <div>
              <div className="club-title">CLB Doanh Nhân Họ Lê Đắk Lắk — LĐBC</div>
              <div className="club-sub"><span className="live-dot" />Đang xem trực tiếp · Tự động cập nhật</div>
            </div>
          </div>
          <div className="clock">
            <div className="clock-time">{time}</div>
            <div className="clock-date">{date}</div>
          </div>
        </div>

        {/* Metrics */}
        <div className="metrics">
          <div className="metric">
            <div className="metric-label">Tổng thu hội phí</div>
            <div className="metric-val" style={{color:'#085041'}}>{fmt(totalPaid)}</div>
            <div className="metric-sub">₫</div>
          </div>
          <div className="metric">
            <div className="metric-label">Đã đóng</div>
            <div className="metric-val">{paidCount}/{members.length}</div>
            <div className="metric-sub">thành viên</div>
          </div>
          <div className="metric">
            <div className="metric-label">Tổng chi</div>
            <div className="metric-val" style={{color:'#A32D2D'}}>{fmt(totalChi)}</div>
            <div className="metric-sub">₫</div>
          </div>
          <div className="metric">
            <div className="metric-label">Tồn quỹ</div>
            <div className="metric-val" style={{color:'#534AB7'}}>{fmt(ton)}</div>
            <div className="metric-sub">₫</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className={`tab ${tab==='thu'?'active':''}`} onClick={() => setTab('thu')}>Hội phí</div>
          <div className={`tab ${tab==='chi'?'active':''}`} onClick={() => setTab('chi')}>Khoản chi</div>
        </div>

        {/* Tab: hội phí */}
        <div className={`section ${tab==='thu'?'active':''}`}>
          <div className="layout">
            <div className="card">
              <div className="card-head">
                <span className="card-title">Danh sách ban chấp hành</span>
                <input className="search-input" placeholder="Tìm tên..." value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
              <table>
                <thead><tr>
                  <th style={{width:28}}>#</th>
                  <th style={{width:130}}>Họ và tên</th>
                  <th style={{width:115}}>Chức vụ</th>
                  <th style={{width:108}}>Điện thoại</th>
                  <th style={{width:120,textAlign:'right'}}>Đã đóng (₫)</th>
                  <th style={{width:90,textAlign:'center'}}>Hình thức</th>
                  <th style={{width:85}}>Ngày đóng</th>
                  <th style={{width:80,textAlign:'center'}}>Trạng thái</th>
                </tr></thead>
                <tbody>
                  {filteredMembers.map((m,i) => (
                    <tr key={m.id || i}>
                      <td style={{color:'#999'}}>{i+1}</td>
                      <td style={{fontWeight:600}}>{m.name}</td>
                      <td style={{fontSize:11,color:'#666'}}>{m.role}</td>
                      <td style={{fontSize:11,color:'#666'}}>{m.phone}</td>
                      <td style={{textAlign:'right',fontWeight:600,color:'#085041',fontVariantNumeric:'tabular-nums'}}>{m.paid > 0 ? fmt(m.paid) : '—'}</td>
                      <td style={{textAlign:'center'}}>
                        {m.pm ? <span className={`pm-badge ${m.pm==='tien-mat'?'pm-tienmat':'pm-ck'}`}>{PM_LABELS[m.pm]}</span> : <span style={{color:'#999',fontSize:11}}>—</span>}
                      </td>
                      <td style={{fontSize:11,color:'#666'}}>{m.paidDate || '—'}</td>
                      <td style={{textAlign:'center'}}>
                        <span className={`badge ${m.paid>0?'b-paid':'b-none'}`}>{m.paid>0?'Đã đóng':'Chưa đóng'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="right-col">
              <div className="chart-card">
                <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>Thu hội phí theo thành viên</div>
                <div style={{display:'flex',gap:10,marginBottom:9,fontSize:11,color:'#666'}}>
                  <span><span style={{display:'inline-block',width:10,height:10,borderRadius:2,background:'#534AB7',marginRight:4}} />Đã đóng</span>
                  <span><span style={{display:'inline-block',width:10,height:10,borderRadius:2,background:'#D3D1C7',marginRight:4}} />Chưa đóng</span>
                </div>
                <div style={{position:'relative',width:'100%',height: Math.max(180, members.length*34+50)}}>
                  <canvas ref={barRef} role="img" aria-label="Biểu đồ hội phí" />
                </div>
                <div className="sum-list">
                  <div className="sum-row"><span className="sum-label">Đã đóng</span><span className="sum-val">{paidCount} / {members.length} người</span></div>
                  <div className="sum-row"><span className="sum-label">Tiền mặt</span><span className="sum-val">{fmt(tmTotal)} ₫</span></div>
                  <div className="sum-row"><span className="sum-label">Chuyển khoản</span><span className="sum-val">{fmt(ckTotal)} ₫</span></div>
                  <div className="sum-row" style={{borderTop:'0.5px solid #ddd',paddingTop:6,marginTop:3}}>
                    <span className="sum-label" style={{fontWeight:600}}>Tổng đã thu</span>
                    <span className="sum-val" style={{fontSize:15,color:'#085041'}}>{fmt(totalPaid)} ₫</span>
                  </div>
                </div>
              </div>

              <div className="qr-card">
                <div style={{fontSize:12,fontWeight:600,marginBottom:4}}>Chuyển khoản hội phí</div>
                <div style={{fontSize:11,color:'#666',marginBottom:8}}>Quét mã QR để chuyển khoản</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/qr-tpbank.jpg" alt="QR TPBank Lê Quang Toàn" />
                <div className="qr-name">LÊ QUANG TOÀN</div>
                <div className="qr-bank">TPBank · 4774 3939 979</div>
                <div className="qr-note">Nội dung: <strong>HoiPhi LDBC [Họ tên]</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab: khoản chi */}
        <div className={`section ${tab==='chi'?'active':''}`}>
          <div className="layout">
            <div className="card">
              <div className="card-head">
                <span className="card-title">Danh sách khoản chi</span>
                <select className="small" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
                  <option value="">Tất cả danh mục</option>
                  {Object.entries(CAT_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <table>
                <thead><tr>
                  <th style={{width:28}}>#</th>
                  <th style={{width:85}}>Ngày</th>
                  <th>Nội dung</th>
                  <th style={{width:90}}>Danh mục</th>
                  <th style={{width:110,textAlign:'right'}}>Số tiền (₫)</th>
                  <th style={{width:100}}>Người chi</th>
                </tr></thead>
                <tbody>
                  {filteredExpenses.length === 0
                    ? <tr><td colSpan={6} style={{textAlign:'center',color:'#999',padding:20,fontSize:12}}>Chưa có khoản chi</td></tr>
                    : filteredExpenses.map((e,i) => (
                      <tr key={e.id || i}>
                        <td style={{color:'#999'}}>{i+1}</td>
                        <td style={{fontSize:11,color:'#666'}}>{e.date}</td>
                        <td style={{fontSize:12}}>{e.desc}</td>
                        <td><span className="cat-pill" style={{background: CAT_COLORS[e.cat]+'22', color: CAT_COLORS[e.cat]}}>{CAT_LABELS[e.cat]||e.cat}</span></td>
                        <td style={{textAlign:'right',fontWeight:600,color:'#A32D2D',fontVariantNumeric:'tabular-nums'}}>{fmt(e.amount)}</td>
                        <td style={{fontSize:11,color:'#666'}}>{e.person}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>

            <div className="right-col">
              <div className="chart-card">
                <div className="fin-grid">
                  <div className="fin-card"><div className="fin-label">Tổng thu</div><div className="fin-val" style={{color:'#085041'}}>{fmt(totalPaid)}</div><div style={{fontSize:10,color:'#666'}}>₫</div></div>
                  <div className="fin-card"><div className="fin-label">Tổng chi</div><div className="fin-val" style={{color:'#A32D2D'}}>{fmt(totalChi)}</div><div style={{fontSize:10,color:'#666'}}>₫</div></div>
                </div>
                <div style={{background:'#F8F7F5',borderRadius:8,padding:'9px 12px',marginBottom:11}}>
                  <div style={{fontSize:11,color:'#666',marginBottom:2}}>Tồn quỹ</div>
                  <div style={{fontSize:20,fontWeight:700,fontVariantNumeric:'tabular-nums',color:ton>=0?'#085041':'#A32D2D'}}>{fmt(ton)}</div>
                  <div style={{fontSize:10,color:'#666'}}>₫</div>
                </div>
                <div style={{fontSize:12,fontWeight:600,marginBottom:8}}>Chi theo danh mục</div>
                <div style={{position:'relative',width:'100%',height:160}}>
                  <canvas ref={donutRef} role="img" aria-label="Chi theo danh mục" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
