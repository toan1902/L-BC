// lib/kv.js
import { kv } from '@vercel/kv'
import { DEFAULT_MEMBERS, DEFAULT_EXPENSES } from './data'

export async function getMembers() {
  try {
    const data = await kv.get('ldbc:members')
    return data || DEFAULT_MEMBERS
  } catch {
    return DEFAULT_MEMBERS
  }
}

export async function saveMembers(members) {
  await kv.set('ldbc:members', members)
}

export async function getExpenses() {
  try {
    const data = await kv.get('ldbc:expenses')
    return data || DEFAULT_EXPENSES
  } catch {
    return DEFAULT_EXPENSES
  }
}

export async function saveExpenses(expenses) {
  await kv.set('ldbc:expenses', expenses)
}
