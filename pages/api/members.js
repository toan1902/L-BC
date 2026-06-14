// pages/api/members.js
import { checkAdmin } from '../../lib/auth'
import { getMembers, saveMembers } from '../../lib/kv'

export default async function handler(req, res) {
  if (!checkAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'PUT') {
    await saveMembers(req.body.members)
    return res.json({ ok: true })
  }
  if (req.method === 'POST') {
    const members = await getMembers()
    const newMember = { ...req.body, id: Date.now() }
    await saveMembers([...members, newMember])
    return res.json({ ok: true, member: newMember })
  }
  if (req.method === 'DELETE') {
    const members = await getMembers()
    await saveMembers(members.filter(m => m.id !== req.body.id))
    return res.json({ ok: true })
  }
  return res.status(405).end()
}
