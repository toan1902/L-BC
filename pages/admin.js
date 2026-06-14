// pages/admin.js — Trang admin, chỉ anh Toàn
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { CAT_LABELS, PM_LABELS } from '../lib/data'

function fmt(n) { return Number(n || 0).toLocaleString('vi-VN') }
function today() { return new Date().toISOString().slice(0,10) }

const TOKEN_KEY = 'ldbc_admin_token'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [token, setToken] = useState('')
  const [pw, setPw] = useState('')
  const [pwErr, setPwErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ members: [], expenses: [] })
  const [tab, setTab] = useState('thu')
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Check saved token on load
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY)
    if (saved) { setToken(saved); setAuthed(true); fetchData(saved) }
    else { fetch('/api/data').then(r => r.ok ? r.json() : null).then(d => d && setData(d)) }
  }, [])

  function authHeader(t) {
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (t || token) }
  }

  async function login(e) {
    e.preventDefault()
    setLoading(true)
    setPwErr('')
    const r = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    })
    setLoading(false)
    if (r.ok) {
      const { token: tk } = await r.json()
      localStorage.setItem(TOKEN_KEY, tk)
      setToken(tk)
      setAuthed(true)
      fetchData(tk)
    } else {
      setPwErr('Sai mật khẩu, thử lại')
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setAuthed(false)
    setToken('')
  }

  async function fetchData(tk) {
    const r = await fetch('/api/data')
    if (r.ok) setData(await r.json())
  }

  async function updateMemberPaid(idx, field, val) {
    const members = [...data.members]
    members[idx] = { ...members[idx], [field]: val }
    if (field === 'paid') {
      const num = parseInt(String(val).replace(/[^0-9]/g,'')) || 0
      members[idx].paid = num
      if (num > 0 && !members[idx].paidDate) members[idx].paidDate = today()
      if (num === 0) { members[idx].paidDate = ''; members[idx].pm = '' }
    }
    setData(d => ({...d, members}))
  }

  async function saveMembersNow() {
    setSaving(true)
    const r = await fetch('/api/members', {
      method: 'PUT',
      headers: authHeader(),
      body: JSON.stringify({ members: data.members })
    })
    setSaving(false)
    if (r.status === 401) { alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'); logout(); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function addMember(m) {
    const r = await fetch('/api/members', { method: 'POST', headers: authHeader(), body: JSON.stringify(m) })
    if (r.ok) { fetchData(); setModal(null) }
  }

  async function deleteMember(id) {
    if (!confirm('Xoá thành viên này?')) return
    await fetch('/api/members', { method: 'DELETE', headers: authHeader(), body: JSON.stringify({ id }) })
    fetchData()
  }

  async function addExpense(exp) {
    const r = await fetch('/api/expenses', { method: 'POST', headers: authHeader(), body: JSON.stringify(exp) })
    if (r.ok) { fetchData(); setModal(null) }
  }

  async function deleteExpense(id) {
    if (!confirm('Xoá khoản chi này?')) return
    await fetch('/api/expenses', { method: 'DELETE', headers: authHeader(), body: JSON.stringify({ id }) })
    fetchData()
  }

  function exportCSV() {
    const rows = data.members.map((m,i) => [i+1,m.name,m.role,m.phone,m.paid,m.pm?PM_LABELS[m.pm]:'-',m.paidDate||'-',m.paid>0?'Đã đóng':'Chưa đóng'].join(','))
    const csv = '\uFEFF' + 'STT,Họ và tên,Chức vụ,Điện thoại,Đã đóng (₫),Hình thức,Ngày đóng,Tình trạng\n' + rows.join('\n')
    dl(csv, 'LDBC_HoiPhi_' + today() + '.csv')
  }

  function exportBaoCao() {
    const totalPaid = data.members.reduce((a,m) => a+m.paid, 0)
    const totalChi = data.expenses.reduce((a,e) => a+e.amount, 0)
    const lines = [
      '\uFEFF=== BÁO CÁO THU CHI CLB DOANH NHÂN HỌ LÊ ĐẮK LẮK (LĐBC) ===',
      'Ngày xuất: ' + new Date().toLocaleDateString('vi-VN'), '',
      '--- HỘI PHÍ ---', 'STT,Họ và tên,Chức vụ,Điện thoại,Đã đóng (₫),Hình thức,Ngày đóng,Tình trạng',
      ...data.members.map((m,i) => [i+1,m.name,m.role,m.phone,m.paid,m.pm?PM_LABELS[m.pm]:'-',m.paidDate||'-',m.paid>0?'Đã đóng':'Chưa đóng'].join(',')),
      `Tổng thu: ${fmt(totalPaid)} đồng`, '',
      '--- KHOẢN CHI ---', 'STT,Ngày,Nội dung,Danh mục,Số tiền (₫),Người chi',
      ...data.expenses.map((e,i) => [i+1,e.date,'"'+e.desc+'"',CAT_LABELS[e.cat],e.amount,e.person].join(',')),
      `Tổng chi: ${fmt(totalChi)} đồng`,
      `Tồn quỹ: ${fmt(totalPaid-totalChi)} đồng`,
    ]
    dl(lines.join('\n'), 'LDBC_BaoCao_' + today() + '.csv')
  }

  function dl(content, filename) {
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(content)
    a.download = filename; a.click()
  }

  // ─── Login screen ───
  if (!authed) return (
    <>
      <Head><title>Admin — LĐBC</title></Head>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">LĐ</div>
          <h1>Đăng nhập Admin</h1>
          <p>CLB Doanh Nhân Họ Lê Đắk Lắk</p>
          <form onSubmit={login}>
            <input className="login-input" type="password" placeholder="Nhập mật khẩu admin" value={pw} onChange={e=>setPw(e.target.value)} autoFocus />
            <button className="login-btn" type="submit" disabled={loading}>{loading ? 'Đang kiểm tra...' : 'Đăng nhập'}</button>
            {pwErr && <div className="error-msg">{pwErr}</div>}
          </form>
          <div style={{marginTop:16,fontSize:11,color:'#999'}}><a href="/" style={{color:'#534AB7'}}>← Xem trang công khai</a></div>
        </div>
      </div>
    </>
  )

  const { members, expenses } = data
  const totalPaid = members.reduce((a,m) => a+(m.paid||0), 0)
  const totalChi = expenses.reduce((a,e) => a+(e.amount||0), 0)

  // ─── Admin dashboard ───
  return (
    <>
      <Head><title>Admin — LĐBC Hội phí</title></Head>

      <div className="admin-bar">
        <span>🔐 Chế độ Admin — CLB Doanh Nhân Họ Lê Đắk Lắk</span>
        <span style={{display:'flex',gap:16,alignItems:'center'}}>
          <a href="/">← Xem trang công khai</a>
          <button onClick={logout} style={{background:'rgba(255,255,255,0.2)',border:'none',color:'#fff',padding:'4px 10px',borderRadius:4,cursor:'pointer',fontSize:12}}>Đăng xuất</button>
        </span>
      </div>

      <div className="container">
        <div className="topbar">
          <div className="topbar-left">
            <div className="logo">LĐ</div>
            <div>
              <div className="club-title">Quản lý hội phí — ADMIN</div>
              <div className="club-sub">Trang này chỉ anh Toàn truy cập được</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn" onClick={exportCSV}>📥 Xuất hội phí CSV</button>
            <button className="btn btn-primary" onClick={exportBaoCao}>📊 Xuất báo cáo</button>
          </div>
        </div>

        <div className="metrics">
          <div className="metric"><div className="metric-label">Tổng thu</div><div className="metric-val" style={{color:'#085041'}}>{fmt(totalPaid)}</div><div className="metric-sub">₫</div></div>
          <div className="metric"><div className="metric-label">Đã đóng</div><div className="metric-val">{members.filter(m=>m.paid>0).length}/{members.length}</div><div className="metric-sub">thành viên</div></div>
          <div className="metric"><div className="metric-label">Tổng chi</div><div className="metric-val" style={{color:'#A32D2D'}}>{fmt(totalChi)}</div><div className="metric-sub">₫</div></div>
          <div className="metric"><div className="metric-label">Tồn quỹ</div><div className="metric-val" style={{color:'#534AB7'}}>{fmt(totalPaid-totalChi)}</div><div className="metric-sub">₫</div></div>
        </div>

        <div className="tabs">
          <div className={`tab ${tab==='thu'?'active':''}`} onClick={()=>setTab('thu')}>Hội phí</div>
          <div className={`tab ${tab==='chi'?'active':''}`} onClick={()=>setTab('chi')}>Khoản chi</div>
        </div>

        <div className={`section ${tab==='thu'?'active':''}`}>
          <div className="card">
            <div className="card-head">
              <span className="card-title">Nhập trực tiếp ô "Đã đóng" rồi nhấn Lưu</span>
              <div className="row-actions">
                <button className="btn" onClick={()=>setModal('member')}>+ Thêm thành viên</button>
                <button className="btn btn-primary" onClick={saveMembersNow} disabled={saving}>
                  {saved ? '✓ Đã lưu!' : saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
                </button>
              </div>
            </div>
            <div style={{overflowX:'auto'}}>
            <table style={{minWidth:700,tableLayout:'auto'}}>
              <thead><tr>
                <th style={{width:28}}>#</th>
                <th style={{minWidth:120}}>Họ và tên</th>
                <th style={{minWidth:110}}>Chức vụ</th>
                <th style={{minWidth:105}}>Điện thoại</th>
                <th style={{minWidth:120,textAlign:'right'}}>Đã đóng (₫)</th>
                <th style={{minWidth:110,textAlign:'center'}}>Hình thức</th>
                <th style={{minWidth:110}}>Ngày đóng</th>
                <th style={{minWidth:80,textAlign:'center'}}>Trạng thái</th>
                <th style={{width:50}}></th>
              </tr></thead>
              <tbody>
                {members.map((m,i) => (
                  <tr key={m.id || i}>
                    <td style={{color:'#999'}}>{i+1}</td>
                    <td style={{fontWeight:600}}>{m.name}</td>
                    <td style={{fontSize:11,color:'#666'}}>{m.role}</td>
                    <td style={{fontSize:11,color:'#666'}}>{m.phone}</td>
                    <td style={{padding:'5px 10px'}}>
                      <input className="amount-input" type="text"
                        value={m.paid > 0 ? fmt(m.paid) : ''}
                        placeholder="0"
                        onChange={e => updateMemberPaid(i, 'paid', parseInt(e.target.value.replace(/[^0-9]/g,''))||0)}
                        style={{width:110}}
                      />
                    </td>
                    <td style={{textAlign:'center',padding:'5px 8px'}}>
                      <select className="small" value={m.pm || ''} onChange={e => updateMemberPaid(i, 'pm', e.target.value)}>
                        <option value="">—</option>
                        <option value="tien-mat">Tiền mặt</option>
                        <option value="chuyen-khoan">Chuyển khoản</option>
                      </select>
                    </td>
                    <td>
                      <input type="date" style={{fontSize:11,border:'0.5px solid #ddd',borderRadius:4,padding:'2px 4px',background:'#F8F7F5'}}
                        value={m.paidDate || ''}
                        onChange={e => updateMemberPaid(i, 'paidDate', e.target.value)}
                      />
                    </td>
                    <td style={{textAlign:'center'}}>
                      <span className={`badge ${m.paid>0?'b-paid':'b-none'}`}>{m.paid>0?'Đã đóng':'Chưa đóng'}</span>
                    </td>
                    <td>
                      <button className="btn btn-danger" style={{padding:'3px 7px',fontSize:11}} onClick={()=>deleteMember(m.id)}>Xoá</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        <div className={`section ${tab==='chi'?'active':''}`}>
          <div className="card">
            <div className="card-head">
              <span className="card-title">Khoản chi</span>
              <button className="btn btn-primary" onClick={()=>setModal('expense')}>+ Ghi khoản chi</button>
            </div>
            <div style={{overflowX:'auto'}}>
            <table style={{minWidth:560,tableLayout:'auto'}}>
              <thead><tr>
                <th style={{width:28}}>#</th>
                <th style={{minWidth:85}}>Ngày</th>
                <th>Nội dung</th>
                <th style={{minWidth:90}}>Danh mục</th>
                <th style={{minWidth:110,textAlign:'right'}}>Số tiền (₫)</th>
                <th style={{minWidth:100}}>Người chi</th>
                <th style={{width:50}}></th>
              </tr></thead>
              <tbody>
                {expenses.length === 0
                  ? <tr><td colSpan={7} style={{textAlign:'center',color:'#999',padding:20}}>Chưa có khoản chi</td></tr>
                  : expenses.map((e,i) => (
                    <tr key={e.id || i}>
                      <td style={{color:'#999'}}>{i+1}</td>
                      <td style={{fontSize:11,color:'#666',whiteSpace:'nowrap'}}>{e.date}</td>
                      <td style={{fontSize:12}}>{e.desc}</td>
                      <td style={{fontSize:11}}>{CAT_LABELS[e.cat]||e.cat}</td>
                      <td style={{textAlign:'right',fontWeight:600,color:'#A32D2D',fontVariantNumeric:'tabular-nums',whiteSpace:'nowrap'}}>{fmt(e.amount)}</td>
                      <td style={{fontSize:11,color:'#666',whiteSpace:'nowrap'}}>{e.person}</td>
                      <td>
                        <button className="btn btn-danger" style={{padding:'3px 7px',fontSize:11}} onClick={()=>deleteExpense(e.id)}>Xoá</button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>

      {modal === 'member' && <MemberModal members={members} onSave={addMember} onClose={()=>setModal(null)} />}
      {modal === 'expense' && <ExpenseModal members={members} onSave={addExpense} onClose={()=>setModal(null)} />}
    </>
  )
}

function MemberModal({ onSave, onClose }) {
  const [f, setF] = useState({ name:'', role:'Hội viên', phone:'', paid:0, pm:'', paidDate:'' })
  const up = (k, v) => setF(p => ({...p, [k]: v}))
  return (
    <div className="modal-overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <h3>Thêm thành viên</h3>
        <div className="fg"><label>Họ và tên *</label><input value={f.name} onChange={e=>up('name',e.target.value)} /></div>
        <div className="fg"><label>Chức vụ</label>
          <select value={f.role} onChange={e=>up('role',e.target.value)}>
            {['Hội viên','Uỷ viên','Chánh văn phòng','Phó chủ tịch','Chủ tịch'].map(r=><option key={r}>{r}</option>)}
          </select>
        </div>
        <div className="fg"><label>Điện thoại</label><input value={f.phone} onChange={e=>up('phone',e.target.value)} /></div>
        <div className="fg"><label>Đã đóng (₫)</label><input type="number" value={f.paid} onChange={e=>up('paid',parseInt(e.target.value)||0)} /></div>
        <div className="fg"><label>Hình thức</label>
          <select value={f.pm} onChange={e=>up('pm',e.target.value)}>
            <option value="">— Chưa đóng —</option>
            <option value="tien-mat">Tiền mặt</option>
            <option value="chuyen-khoan">Chuyển khoản</option>
          </select>
        </div>
        <div className="modal-btns">
          <button className="btn" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={()=>f.name&&onSave({...f,id:Date.now()})}>Lưu</button>
        </div>
      </div>
    </div>
  )
}

function ExpenseModal({ members, onSave, onClose }) {
  const [f, setF] = useState({ date: today(), desc:'', cat:'hanh-chinh', amount:0, person: members[0]?.name||'' })
  const up = (k, v) => setF(p => ({...p, [k]: v}))
  return (
    <div className="modal-overlay open" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <h3>Ghi khoản chi</h3>
        <div className="fg"><label>Ngày *</label><input type="date" value={f.date} onChange={e=>up('date',e.target.value)} /></div>
        <div className="fg"><label>Nội dung *</label><textarea value={f.desc} onChange={e=>up('desc',e.target.value)} /></div>
        <div className="fg"><label>Danh mục</label>
          <select value={f.cat} onChange={e=>up('cat',e.target.value)}>
            {Object.entries(CAT_LABELS).map(([k,v])=><option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="fg"><label>Số tiền (₫)</label><input type="number" value={f.amount} onChange={e=>up('amount',parseInt(e.target.value)||0)} /></div>
        <div className="fg"><label>Người chi</label>
          <select value={f.person} onChange={e=>up('person',e.target.value)}>
            {members.map(m=><option key={m.id||m.name}>{m.name}</option>)}
          </select>
        </div>
        <div className="modal-btns">
          <button className="btn" onClick={onClose}>Hủy</button>
          <button className="btn btn-primary" onClick={()=>f.desc&&f.amount>0&&onSave({...f,id:Date.now()})}>Lưu</button>
        </div>
      </div>
    </div>
  )
}
