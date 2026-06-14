// lib/kv.js — KHÔNG dùng package, gọi thẳng Upstash REST API
import { DEFAULT_MEMBERS, DEFAULT_EXPENSES } from './data'

const getURL = () => process.env.KV_REST_API_URL
const getToken = () => process.env.KV_REST_API_TOKEN

async function kvGet(key) {
  const r = await fetch(`${getURL()}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    cache: 'no-store'
  })
  const json = await r.json()
  if (!json.result) return null
  try { return JSON.parse(json.result) } catch { return json.result }
}

async function kvSet(key, value) {
  const body = JSON.stringify(value)
  await fetch(`${getURL()}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body
  })
}

export async function getMembers() {
  try { return (await kvGet('ldbc:members')) || DEFAULT_MEMBERS }
  catch { return DEFAULT_MEMBERS }
}
export async function saveMembers(members) {
  await kvSet('ldbc:members', members)
}
export async function getExpenses() {
  try { return (await kvGet('ldbc:expenses')) || DEFAULT_EXPENSES }
  catch { return DEFAULT_EXPENSES }
}
export async function saveExpenses(expenses) {
  await kvSet('ldbc:expenses', expenses)
}
