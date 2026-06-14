// pages/api/login.js
import { setAdminCookie } from '../../lib/auth'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password } = req.body
  if (password === process.env.ADMIN_PASSWORD) {
    setAdminCookie(res)
    return res.json({ ok: true })
  }
  return res.status(401).json({ error: 'Sai mật khẩu' })
}
