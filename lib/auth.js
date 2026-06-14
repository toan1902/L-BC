// lib/auth.js - đọc token từ header Authorization
export function checkAdmin(req) {
  const auth = req.headers?.authorization || ''
  const token = auth.replace('Bearer ', '').trim()
  return token === process.env.ADMIN_TOKEN
}
