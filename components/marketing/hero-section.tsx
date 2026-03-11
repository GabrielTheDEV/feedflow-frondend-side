"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 pt-20">
      {/* Subtle gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#8B5CF6]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#EC4899]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
       

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Capture bugs.
          <br />
          <span className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] bg-clip-text text-transparent">
            Let AI handle the rest.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
        >
          FeedFlow embeds a lightweight widget into your app. Users report bugs with screenshots, and our AI
          automatically classifies severity and notifies your team on Slack.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-8 text-base text-white shadow-lg shadow-[#8B5CF6]/25 hover:opacity-90"
            asChild
          >
            <Link href="/login">
              Start for Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-xl px-8 text-base" asChild>
            <Link href="/docs">Read the Docs</Link>
          </Button>
        </motion.div>

        {/* Mock UI preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-20 max-w-3xl"
        >
          <div className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-6 py-4">
              <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
              <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
              <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
              <span className="ml-4 text-xs text-muted-foreground">feedflow.app/dashboard</span>
            </div>
            <div className="p-6">
              <div className="grid gap-3">
                {[
                  { id: "#1024", title: "Button not responsive on mobile", severity: "High", color: "bg-[#fecaca] text-[#991b1b]" },
                  { id: "#1023", title: "Dark mode flicker on page load", severity: "Medium", color: "bg-[#fef08a] text-[#854d0e]" },
                  { id: "#1022", title: "Typo in onboarding tooltip", severity: "Low", color: "bg-[#bbf7d0] text-[#166534]" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-border px-5 py-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-medium text-muted-foreground">{item.id}</span>
                      <span className="text-sm font-medium text-foreground">{item.title}</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.color}`}>
                      {item.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
