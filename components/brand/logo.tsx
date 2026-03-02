import Link from "next/link"

interface LogoProps {
  href?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({
  href = "/",
  size = "md",
  showText = true,
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  const logoContent = (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-gradient-to-br from-[#6366F1] to-[#8B5CF6]`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full p-1.5"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="8" y1="9" x2="16" y2="9" />
          <line x1="8" y1="13" x2="14" y2="13" />
        </svg>
      </div>
      {showText && (
        <span
          className={`${textSizes[size]} font-bold text-foreground`}
        >
          FeedFlow
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
