import Link from "next/link"
import { Logo } from "@/components/brand/logo"

interface FooterProps {
  navLinks?: { label: string; href: string }[]
  year?: number
}

export function Footer({
  navLinks = [
    { label: "Docs", href: "/docs" },
    { label: "Terms", href: "/terms" },
    { label: "Login", href: "/login" },
  ],
  year = new Date().getFullYear(),
}: FooterProps = {}) {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <Logo href="/" size="sm" />

        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <p className="text-sm text-muted-foreground">
          {`© ${year} FeedFlow. All rights reserved.`}
        </p>
      </div>
    </footer>
  )}