import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Feedbacks</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all bug reports from your application
        </p>
      </div>

      {/* Placeholder Content */}
      <div className="grid gap-6">
        <div className="bg-white rounded-xl border border-border p-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            No feedbacks yet
          </h2>
          <p className="text-muted-foreground mb-6">
            Start by installing the FeedFlow widget in your application to receive bug reports from your users.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild>
              <Link href="/dashboard/widget">
                Get Widget Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs">Read Documentation</Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: "Total Feedbacks", value: "0" },
            { label: "Critical Issues", value: "0" },
            { label: "Resolved", value: "0" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-border p-6"
            >
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
