// pages/api/seed.js — nhập dữ liệu từ báo cáo CSV vào Upstash
// Chỉ dùng 1 lần, sau đó xoá file này khỏi GitHub

const KV_URL = process.env.UPSTASH_REDIS_REST_URL 
  || process.env.KV_REST_API_URL 
  || 'https://flying-beetle-165184.upstash.io'
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN 
  || process.env.KV_REST_API_TOKEN 
  || 'gQAAAAAAAoVAAAIgcDFkNjFkNGNhMzc5OGE0ZGM5YTUyZjdjY2EzMTkyZWRkYg'

const MEMBERS = [
  {id:1, name:'Lê Văn Vương',  role:'Chủ tịch',        phone:'0945820779', paid:5000000, pm:'tien-mat',      paidDate:'2026-06-12'},
  {id:2, name:'Lê Quốc Hùng',  role:'Phó chủ tịch',    phone:'0886575868', paid:0,       pm:'',              paidDate:''},
  {id:3, name:'Lê Thị Quỳnh',  role:'Phó chủ tịch',    phone:'0906515888', paid:0,       pm:'',              paidDate:''},
  {id:4, name:'Lê Tấn Dũng',   role:'Phó chủ tịch',    phone:'0889334747', paid:0,       pm:'',              paidDate:''},
  {id:5, name:'Lê Quang Toàn', role:'Chánh văn phòng',  phone:'0823047047', paid:3000000, pm:'chuyen-khoan', paidDate:'2026-06-15'},
  {id:6, name:'Lê Long',        role:'Uỷ viên',          phone:'0984553246', paid:0,       pm:'',              paidDate:''},
  {id:7, name:'Lê Văn Khâm',   role:'Uỷ viên',          phone:'0379786574', paid:1000000, pm:'tien-mat',      paidDate:'2026-06-12'},
  {id:8, name:'Lê Thị Lan',    role:'Uỷ viên',          phone:'0973887878', paid:1000000, pm:'chuyen-khoan', paidDate:'2026-07-30'},
]

const EXPENSES = [
  {id:1, date:'2026-06-16', desc:'Tiệc tiếp đón Anh Lê Văn Hoàn, Uỷ viên Ban Chấp Hành Câu lạc bộ doanh nhân họ lê Việt Nam', cat:'tiep-khach', amount:1856000, person:'Lê Văn Vương'},
  {id:2, date:'2026-06-16', desc:'Hoa viếng mẹ vợ a Lê Long LĐBC', cat:'khac', amount:600000, person:'Lê Quang Toàn'},
  {id:3, date:'2026-07-30', desc:'Chi tiền phổ nhạc, bài hát Hào Khí Họ Lê', cat:'hanh-chinh', amount:5000000, person:'Lê Văn Vương'},
]

async function kvSet(key, value) {
  const r = await fetch(`${KV_URL}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  })
  return r.json()
}

export default async function handler(req, res) {
  try {
    const r1 = await kvSet('ldbc:members', MEMBERS)
    const r2 = await kvSet('ldbc:expenses', EXPENSES)
    return res.json({
      ok: true,
      message: 'Đã nhập dữ liệu thành công!',
      members: r1,
      expenses: r2,
      summary: {
        soThanhVien: MEMBERS.length,
        daDong: MEMBERS.filter(m=>m.paid>0).length,
        tongThu: MEMBERS.reduce((a,m)=>a+m.paid,0),
        soKhoanChi: EXPENSES.length,
        tongChi: EXPENSES.reduce((a,e)=>a+e.amount,0),
      }
    })
  } catch(e) {
    return res.status(500).json({ error: e.message })
  }
}
