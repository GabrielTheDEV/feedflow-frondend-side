import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Authentication middleware for FeedFlow
 * Handles session validation and route protection
 * 
 * Flow:
 * - /dashboard/* requires auth → redirect to /login if no session
 * - /login requires no auth → redirect to /dashboard if logged in
 * - / (root) redirects to /dashboard if logged in
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: "", ...options })
          response.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  // Protege dashboard
  if (pathname.startsWith("/dashboard") && !user) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se já está logado, não deixa acessar login
  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (pathname === "/" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/",
  ],
}
