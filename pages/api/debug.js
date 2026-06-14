export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url) return res.json({ error: 'KV_REST_API_URL không có' })
  if (!token) return res.json({ error: 'KV_REST_API_TOKEN không có' })
  try {
    // Test set
    await fetch(`${url}/set/ping/pong`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    })
    // Test get
    const r = await fetch(`${url}/get/ping`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await r.json()
    return res.json({ ok: true, ping: data.result, url: url.slice(0,40) })
  } catch(e) {
    return res.json({ error: e.message })
  }
}
