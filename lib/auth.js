// lib/auth.js
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'ldbc-token-2025'

export function checkAdmin(req) {
  const auth = req.headers?.authorization || ''
  const token = auth.replace('Bearer ', '').trim()
  return token === ADMIN_TOKEN
}
