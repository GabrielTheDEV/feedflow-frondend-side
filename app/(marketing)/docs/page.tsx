"use client"

import { useState } from "react"
import { Copy, Check, Code, Zap, Brain, Bell, ChevronRight } from "lucide-react"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"
import { Button } from "@/components/ui/button"

const sidebarItems = [
  { id: "getting-started", label: "Getting Started", icon: Zap },
  { id: "installation", label: "Installation", icon: Code },
  { id: "ai-analysis", label: "AI Analysis", icon: Brain },
  { id: "slack-integration", label: "Slack Integration", icon: Bell },
]

function CodeBlock({ code, language = "html" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-[#0f172a]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-xs text-white/50">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="text-sm leading-relaxed text-white/80">{code}</code>
      </pre>
    </div>
  )
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("getting-started")

  const widgetScript = `<!-- FeedFlow Widget -->
<script
  src="https://cdn.feedflow.app/widget.js"
  data-api-key="YOUR_API_KEY"
  data-position="bottom-right"
  data-color="#8B5CF6"
  async
></script>`

  const advancedConfig = `<!-- FeedFlow Widget - Advanced Configuration -->
<script>
  window.FeedFlowConfig = {
    apiKey: "YOUR_API_KEY",
    position: "bottom-right",
    primaryColor: "#8B5CF6",
    screenshotEnabled: true,
    metadata: {
      userId: "user_123",
      plan: "pro"
    }
  };
</script>
<script
  src="https://cdn.feedflow.app/widget.js"
  async
></script>`

  const slackWebhook = `// Example: Slack Webhook Payload (handled automatically)
{
  "channel": "#bug-reports",
  "username": "FeedFlow Bot",
  "icon_emoji": ":bug:",
  "attachments": [{
    "color": "#ef4444",
    "title": "New Bug Report - High Severity",
    "fields": [
      { "title": "Description", "value": "Button not responsive on mobile" },
      { "title": "Page", "value": "https://app.example.com/checkout" },
      { "title": "AI Severity", "value": "High" }
    ]
  }]
}`

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="px-6 pb-24 pt-32">
        <div className="mx-auto flex max-w-6xl gap-8">
          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-28">
              <h3 className="mb-4 text-sm font-semibold text-foreground">Documentation</h3>
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      activeSection === item.id
                        ? "bg-[#8B5CF6]/10 font-medium text-[#8B5CF6]"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="min-w-0 flex-1">
            <div className="mb-12">
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Documentation
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Learn how to integrate FeedFlow into your application in minutes.
              </p>
            </div>

            <div className="space-y-16">
              {/* Getting Started */}
              <section id="getting-started">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Getting Started</h2>
                <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    FeedFlow works by injecting a lightweight widget into your website. Here is the complete flow:
                  </p>
                  <div className="space-y-4">
                    {[
                      {
                        step: "1",
                        title: "Inject the Script",
                        description:
                          "Add the FeedFlow script tag to your HTML. Use your unique API key from the Settings page.",
                      },
                      {
                        step: "2",
                        title: "Users Report Feedback",
                        description:
                          "A floating button appears on your site. Users click it to submit bug reports with optional screenshots.",
                      },
                      {
                        step: "3",
                        title: "AI Processes the Report",
                        description:
                          "Our AI analyzes the text and screenshot to automatically classify severity (Low, Medium, or High).",
                      },
                      {
                        step: "4",
                        title: "Team Gets Notified",
                        description:
                          "A formatted notification is sent to your configured Slack channel with all details and severity badge.",
                      },
                    ].map((s) => (
                      <div key={s.step} className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-sm font-bold text-white">
                          {s.step}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{s.title}</h3>
                          <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Installation */}
              <section id="installation">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Installation</h2>
                <div className="space-y-6">
                  <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Basic Setup</h3>
                    <p className="mb-6 leading-relaxed text-muted-foreground">
                      {'Add this snippet before the closing </body> tag of your HTML. Replace YOUR_API_KEY with the key from your dashboard Settings page.'}
                    </p>
                    <CodeBlock code={widgetScript} language="html" />
                  </div>

                  <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Advanced Configuration</h3>
                    <p className="mb-6 leading-relaxed text-muted-foreground">
                      For more control, you can pass a configuration object with custom metadata, colors, and features.
                    </p>
                    <CodeBlock code={advancedConfig} language="html" />
                  </div>
                </div>
              </section>

              {/* AI Analysis */}
              <section id="ai-analysis">
                <h2 className="mb-4 text-2xl font-bold text-foreground">AI Analysis</h2>
                <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                  <p className="mb-6 leading-relaxed text-muted-foreground">
                    Every feedback submitted through FeedFlow is analyzed by our AI pipeline. The system evaluates the
                    text description and screenshot (if provided) to classify the severity:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
                      <span className="rounded-full bg-[#bbf7d0] px-3 py-1 text-xs font-semibold text-[#166534]">Low</span>
                      <span className="text-sm text-muted-foreground">
                        Minor cosmetic issues, typos, suggestions for improvement.
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
                      <span className="rounded-full bg-[#fef08a] px-3 py-1 text-xs font-semibold text-[#854d0e]">Medium</span>
                      <span className="text-sm text-muted-foreground">
                        Functional bugs that affect usability but have workarounds.
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border p-4">
                      <span className="rounded-full bg-[#fecaca] px-3 py-1 text-xs font-semibold text-[#991b1b]">High</span>
                      <span className="text-sm text-muted-foreground">
                        Critical issues causing data loss, crashes, or security vulnerabilities.
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Slack Integration */}
              <section id="slack-integration">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Slack Integration</h2>
                <div className="space-y-6">
                  <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                    <p className="mb-6 leading-relaxed text-muted-foreground">
                      FeedFlow sends formatted notifications to your Slack workspace whenever a new report is created.
                      Configure the webhook URL in your dashboard Settings page.
                    </p>
                    <CodeBlock code={slackWebhook} language="json" />
                  </div>
                  <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">Setup Steps</h3>
                    <ol className="space-y-3">
                      {[
                        "Go to your Slack workspace and create an Incoming Webhook.",
                        "Copy the webhook URL.",
                        "Paste it in your FeedFlow dashboard under Settings > Integrations.",
                        "Choose which severity levels trigger notifications.",
                      ].map((step, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-[#8B5CF6]" />
                          <span className="leading-relaxed text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-16 rounded-[2.5rem] border border-border bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5 p-8 text-center">
              <h3 className="text-lg font-semibold text-foreground">Need help?</h3>
              <p className="mt-2 text-muted-foreground">
                If you have questions or run into issues, reach out at{" "}
                <span className="font-medium text-[#8B5CF6]">support@feedflow.app</span>
              </p>
              <Button
                className="mt-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white hover:opacity-90"
                asChild
              >
                <a href="mailto:support@feedflow.app">Contact Support</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
