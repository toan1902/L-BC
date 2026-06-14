// lib/kv.js — gọi thẳng Upstash REST API, không cần package
import { DEFAULT_MEMBERS, DEFAULT_EXPENSES } from './data'

async function kvGet(key) {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  const r = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await r.json()
  if (!data.result) return null
  try { return JSON.parse(data.result) } catch { return data.result }
}

async function kvSet(key, value) {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return
  await fetch(`${url}/set/${key}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(value)
  })
}

export async function getMembers() {
  try {
    const data = await kvGet('ldbc:members')
    return data || DEFAULT_MEMBERS
  } catch(e) {
    console.error('getMembers:', e.message)
    return DEFAULT_MEMBERS
  }
}

export async function saveMembers(members) {
  try { await kvSet('ldbc:members', members) }
  catch(e) { console.error('saveMembers:', e.message) }
}

export async function getExpenses() {
  try {
    const data = await kvGet('ldbc:expenses')
    return data || DEFAULT_EXPENSES
  } catch(e) {
    console.error('getExpenses:', e.message)
    return DEFAULT_EXPENSES
  }
}

export async function saveExpenses(expenses) {
  try { await kvSet('ldbc:expenses', expenses) }
  catch(e) { console.error('saveExpenses:', e.message) }
}
