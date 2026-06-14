// pages/api/login.js
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password } = req.body
  if (password && password === process.env.ADMIN_PASSWORD) {
    return res.json({ ok: true, token: process.env.ADMIN_TOKEN })
  }
  return res.status(401).json({ error: 'Sai mật khẩu' })
}
