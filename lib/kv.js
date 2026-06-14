import { DEFAULT_MEMBERS, DEFAULT_EXPENSES } from './data'

const KV_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || 'https://humorous-marten-123408.upstash.io'
const KV_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || 'gQAAAAAAAeIQAAIgcDJiYWFiOTk4OWM2MmM0NDUyOGUzYjIzZWViZmUwOTk4Ng'

async function kvGet(key) {
  try {
    const r = await fetch(`${KV_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }, cache: 'no-store'
    })
    const j = await r.json()
    if (!j.result) return null
    try { return JSON.parse(j.result) } catch { return j.result }
  } catch(e) { return null }
}

async function kvSet(key, value) {
  try {
    await fetch(`${KV_URL}/set/${key}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    })
  } catch(e) { console.error('kvSet:', e.message) }
}

export async function getMembers() {
  try { return (await kvGet('ldbc:members')) || DEFAULT_MEMBERS } catch { return DEFAULT_MEMBERS }
}
export async function saveMembers(m) { await kvSet('ldbc:members', m) }
export async function getExpenses() {
  try { return (await kvGet('ldbc:expenses')) || DEFAULT_EXPENSES } catch { return DEFAULT_EXPENSES }
}
export async function saveExpenses(e) { await kvSet('ldbc:expenses', e) }
