// pages/api/debug.js
export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  const envKeys = Object.keys(process.env).filter(k => 
    k.includes('KV') || k.includes('UPSTASH') || k.includes('REDIS')
  )
  
  if (!url || !token) {
    return res.json({ 
      status: 'MISSING ENV VARS',
      envKeys,
      KV_REST_API_URL: url ? 'CÓ' : 'KHÔNG CÓ',
      KV_REST_API_TOKEN: token ? 'CÓ' : 'KHÔNG CÓ'
    })
  }

  try {
    const r = await fetch(`${url}/set/test/hello`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await r.json()
    return res.json({ 
      status: 'OK - Upstash kết nối thành công!', 
      result: data,
      url: url.substring(0,40)+'...'
    })
  } catch(e) {
    return res.json({ status: 'LỖI', error: e.message })
  }
}
