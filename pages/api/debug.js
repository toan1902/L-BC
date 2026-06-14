// pages/api/debug.js - chỉ dùng để test, xoá sau
export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  
  if (!url || !token) {
    return res.json({ 
      error: 'Thiếu biến môi trường',
      KV_REST_API_URL: url ? 'có' : 'KHÔNG CÓ',
      KV_REST_API_TOKEN: token ? 'có' : 'KHÔNG CÓ',
      allEnvKeys: Object.keys(process.env).filter(k => k.includes('KV') || k.includes('UPSTASH') || k.includes('REDIS'))
    })
  }

  try {
    const r = await fetch(`${url}/set/test/hello`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await r.json()
    return res.json({ ok: true, upstash: data, url: url.substring(0,30)+'...' })
  } catch(e) {
    return res.json({ error: e.message })
  }
}
