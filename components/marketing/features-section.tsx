"use client"

import { Brain, Slack, Camera, Shield, Zap, Globe } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "AI Severity Analysis",
    description:
      "Our AI automatically classifies each bug report as Low, Medium, or High severity, helping your team prioritize effortlessly.",
  },
  {
    icon: Slack,
    title: "Slack Integration",
    description:
      "Get instant notifications on your Slack channel whenever a new bug is reported. Never miss critical feedback again.",
  },
  {
    icon: Camera,
    title: "Screenshot Capture",
    description:
      "Users can attach screenshots directly to their reports, giving your team full visual context without extra steps.",
  },
  {
    icon: Shield,
    title: "Domain Whitelist",
    description:
      "Control exactly which domains can use your widget. Keep your API key secure with domain-level restrictions.",
  },
  {
    icon: Zap,
    title: "Lightweight Widget",
    description:
      "A single script tag. Under 10KB gzipped. Zero dependencies. It loads asynchronously and never slows down your app.",
  },
  {
    icon: Globe,
    title: "Multi-Project Support",
    description:
      "Manage multiple projects from a single dashboard. Each project gets its own API key and configuration.",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function FeaturesSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to ship better software
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            FeedFlow combines AI-powered analysis, real-time notifications, and a dead-simple widget to close the
            feedback loop faster than ever.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group rounded-[2.5rem] border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#EC4899]/10">
                <feature.icon className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
