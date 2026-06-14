// pages/api/login.js
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LDBC@2025'
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'ldbc-token-2025'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password } = req.body
  if (password === ADMIN_PASSWORD) {
    return res.json({ ok: true, token: ADMIN_TOKEN })
  }
  return res.status(401).json({ error: 'Sai mật khẩu' })
}
