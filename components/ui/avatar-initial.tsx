import React from 'react'

interface AvatarInitialProps {
  name?: string | null
  size?: number
  className?: string
}

export function AvatarInitial({ name, size = 40, className }: AvatarInitialProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() || ''
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground font-bold select-none ${className || ''}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {initial}
    </div>
  )
}
