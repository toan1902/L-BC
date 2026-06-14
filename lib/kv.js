// lib/kv.js — dùng Upstash Redis
import { Redis } from '@upstash/redis'
import { DEFAULT_MEMBERS, DEFAULT_EXPENSES } from './data'

let redis
function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redis
}

export async function getMembers() {
  try {
    const data = await getRedis().get('ldbc:members')
    return data || DEFAULT_MEMBERS
  } catch {
    return DEFAULT_MEMBERS
  }
}

export async function saveMembers(members) {
  try {
    await getRedis().set('ldbc:members', members)
  } catch(e) {
    console.error('saveMembers error:', e)
  }
}

export async function getExpenses() {
  try {
    const data = await getRedis().get('ldbc:expenses')
    return data || DEFAULT_EXPENSES
  } catch {
    return DEFAULT_EXPENSES
  }
}

export async function saveExpenses(expenses) {
  try {
    await getRedis().set('ldbc:expenses', expenses)
  } catch(e) {
    console.error('saveExpenses error:', e)
  }
}
