"use client"
import { createBrowserClient } from '@supabase/ssr'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !anonKey) {
  throw new Error("Not configured. Please contact support.")
}

export const supabase = createBrowserClient(url, anonKey)
