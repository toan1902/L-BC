export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { password } = req.body
  const PASS = process.env.ADMIN_PASSWORD || 'ldbc2025'
  const TOKEN = process.env.ADMIN_TOKEN || 'ldbc-token-2025'
  if (password === PASS) {
    return res.json({ ok: true, token: TOKEN })
  }
  return res.status(401).json({ error: 'Sai mat khau' })
}
