// pages/api/data.js
import { getMembers, getExpenses } from '../../lib/kv'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()
  const [members, expenses] = await Promise.all([getMembers(), getExpenses()])
  res.json({ members, expenses })
}
