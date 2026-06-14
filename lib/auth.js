// lib/auth.js
export function checkAdmin(req) {
  const token = req.cookies?.admin_token || req.headers?.authorization
  return token === process.env.ADMIN_TOKEN
}

export function setAdminCookie(res) {
  res.setHeader('Set-Cookie', `admin_token=${process.env.ADMIN_TOKEN}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`)
}

export function clearAdminCookie(res) {
  res.setHeader('Set-Cookie', 'admin_token=; Path=/; HttpOnly; Max-Age=0')
}
