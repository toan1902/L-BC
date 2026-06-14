import { DEFAULT_MEMBERS, DEFAULT_EXPENSES } from './data'

const URL = () => process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const TOKEN = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

async function kvGet(key) {
  const r = await fetch(`${URL()}/get/${key}`, {
    headers: { Authorization: `Bearer ${TOKEN()}` }, cache: 'no-store'
  })
  const j = await r.json()
  if (!j.result) return null
  try { return JSON.parse(j.result) } catch { return j.result }
}

async function kvSet(key, value) {
  await fetch(`${URL()}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  })
}

export async function getMembers() {
  try { return (await kvGet('ldbc:members')) || DEFAULT_MEMBERS } catch { return DEFAULT_MEMBERS }
}
export async function saveMembers(m) { await kvSet('ldbc:members', m) }
export async function getExpenses() {
  try { return (await kvGet('ldbc:expenses')) || DEFAULT_EXPENSES } catch { return DEFAULT_EXPENSES }
}
export async function saveExpenses(e) { await kvSet('ldbc:expenses', e) }
