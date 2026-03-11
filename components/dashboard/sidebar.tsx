"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, BarChart3, Zap, Settings, FileText, Menu, X, Folders, BookOpenText, Contact } from "lucide-react"
import { useEffect, useState } from "react"
import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { AvatarInitial } from '@/components/ui/avatar-initial'
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase/client"

interface DashboardSidebarProps {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
  onLogout?: () => void
}

const navItems = [
  {
    label: "Collections",
    href: "/dashboard/collections",
    icon: Folders,
  },
  {
    label: "Integrations",
    href: "/dashboard/integrations",
    icon: FileText,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const othersItems = [
  {
    label: "Documentation",
    href: "/dashboard/documentation",
    icon: BookOpenText,
  },
  {
    label: "Contact",
    href: "/dashboard/contact",
    icon: Contact,
  },
  
]

export function DashboardSidebar({ user, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    if (onLogout) {
      onLogout()
      return
    }

    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  useEffect(() => {
    navItems.forEach((item) => {
      router.prefetch(item.href)
    })
  }, [router])

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <Logo href="/dashboard" size="md" />
      </div>

      {/* Workspace Selector */}
      {/* <div className="px-6 py-4 border-b border-border">
        <div className="text-xs text-muted-foreground mb-2">WORKSPACE</div>
        <button className="w-full px-3 py-2 rounded-lg bg-secondary text-sm font-medium text-foreground hover:bg-secondary/80 transition-colors text-left">
          Developer mode
        </button>
      </div> */}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isDashboardRoot = item.href === "/dashboard"
            const isActive = isDashboardRoot
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
        <div className="px-6 py-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">OTHER</div>
        </div>
        <div className="space-y-2">
          {othersItems.map((item) => {
            const Icon = item.icon
            const isDashboardRoot = item.href === "/dashboard"
            const isActive = isDashboardRoot
              ? pathname === "/dashboard"
              : pathname === item.href || pathname.startsWith(item.href + "/")

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="px-6 py-4 border-t border-border">
        {user ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 w-full focus:outline-none">
                <AvatarInitial name={user.name} size={40} />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="space-y-4">
              {/* Perfil */}
              <div className="flex items-center gap-3">
                <AvatarInitial name={user.name} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mb-2">Account</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <AvatarInitial name={user.name} size={64} />
                    <div>
                      <div className="text-lg font-semibold">Profile</div>
                      <div className="text-sm text-muted-foreground">Edit your information</div>
                    </div>
                  </div>
                  <form className="space-y-4">
                    <div className="flex gap-2">
                      <input type="text" className="input w-full" placeholder="First name" defaultValue={user.name?.split(' ')[0] || ''} />
                      <input type="text" className="input w-full" placeholder="Last name" defaultValue={user.name?.split(' ')[1] || ''} />
                    </div>
                    <div>
                      <input type="email" className="input w-full" placeholder="Email" defaultValue={user.email || ''} disabled />
                    </div>
                    <div>
                      <select className="input w-full">
                        <option>Engineering</option>
                        <option>Product</option>
                        <option>Design</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <DialogClose asChild>
                      <Button variant="default" className="w-full mt-4">Save</Button>
                    </DialogClose>
                  </form>
                </DialogContent>
              </Dialog>
              <Button variant="ghost" className="w-full mb-2 text-muted-foreground">Help</Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </PopoverContent>
          </Popover>
        ) : (
          <Button asChild className="w-full">
            <Link href="/login">Sign In</Link>
          </Button>
        )}
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-background border-r border-border">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-4 z-40">
        <Logo size="sm" showText={false} />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-secondary rounded-lg"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileOpen(false)}>
          <aside className="absolute left-0 top-0 h-screen w-64 bg-background border-r border-border">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
