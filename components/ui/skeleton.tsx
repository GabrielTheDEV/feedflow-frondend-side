import { cn } from '@/lib/utils'


function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  // bg-[oklch(0.97_0_0)] é o mesmo do --muted, bem suave
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-[oklch(0.97_0_0)] animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }
