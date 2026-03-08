import { ReactNode } from "react"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from "@/components/dashboard/sidebar"

interface DashboardLayoutProps {
  children: ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar user={{
        name: user.user_metadata?.name || user.email?.split("@")[0],
        email: user.email,
        image: user.user_metadata?.avatar_url,
      }} />
      {/* Main Content */}
      <main className="flex-1 md:ml-64 md:pt-0 pt-16 overflow-auto bg-[#F8FAFC]">
        {children}
      </main>
    </div>
  )
}
