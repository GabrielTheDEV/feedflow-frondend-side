import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="py-0">
            <CardContent className="px-6 py-5">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-6 w-52" />
                  <Skeleton className="mt-2 h-4 w-80 max-w-full" />
                </div>

                <div className="flex min-w-55 flex-col gap-2">
                  <Skeleton className="h-4 w-28" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-14" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>

                <div className="flex min-w-65 flex-col gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>

                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
