// pages/api/expenses.js
import { checkAdmin } from '../../lib/auth'
import { getExpenses, saveExpenses } from '../../lib/kv'

export default async function handler(req, res) {
  if (!checkAdmin(req)) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'POST') {
    const expenses = await getExpenses()
    const newExp = { ...req.body, id: Date.now() }
    await saveExpenses([...expenses, newExp])
    return res.json({ ok: true, expense: newExp })
  }
  if (req.method === 'DELETE') {
    const expenses = await getExpenses()
    await saveExpenses(expenses.filter(e => e.id !== req.body.id))
    return res.json({ ok: true })
  }
  return res.status(405).end()
}
