// lib/kv.js — dùng Upstash Redis (biến KV_ do Vercel tự thêm)
import { Redis } from '@upstash/redis'
import { DEFAULT_MEMBERS, DEFAULT_EXPENSES } from './data'

let redis
function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

export async function getMembers() {
  try {
    const data = await getRedis().get('ldbc:members')
    return data || DEFAULT_MEMBERS
  } catch(e) {
    console.error('getMembers error:', e.message)
    return DEFAULT_MEMBERS
  }
}

export async function saveMembers(members) {
  try {
    await getRedis().set('ldbc:members', JSON.stringify(members))
  } catch(e) {
    console.error('saveMembers error:', e.message)
  }
}

export async function getExpenses() {
  try {
    const data = await getRedis().get('ldbc:expenses')
    return data || DEFAULT_EXPENSES
  } catch(e) {
    console.error('getExpenses error:', e.message)
    return DEFAULT_EXPENSES
  }
}

export async function saveExpenses(expenses) {
  try {
    await getRedis().set('ldbc:expenses', JSON.stringify(expenses))
  } catch(e) {
    console.error('saveExpenses error:', e.message)
  }
}
