export default async function handler(req, res) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url) return res.json({ error: 'Không tìm thấy URL — kiểm tra biến môi trường' })
  try {
    await fetch(`${url}/set/ping/pong`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    const r = await fetch(`${url}/get/ping`, { headers: { Authorization: `Bearer ${token}` } })
    const d = await r.json()
    return res.json({ ok: true, ping: d.result, url: url.slice(0,40) })
  } catch(e) {
    return res.json({ error: e.message })
  }
}
