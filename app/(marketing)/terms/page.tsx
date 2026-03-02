import { Scale, Shield, Eye, FileText, AlertTriangle, RefreshCw } from "lucide-react"
import { Navbar } from "@/components/marketing/navbar"
import { Footer } from "@/components/marketing/footer"

const sections = [
  {
    icon: FileText,
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using FeedFlow, you agree to be bound by these Terms of Service. If you do not agree, do not use the service. FeedFlow reserves the right to update these terms at any time, and continued use constitutes acceptance of any modifications.",
  },
  {
    icon: Scale,
    title: "2. Use of Service",
    content:
      'FeedFlow provides an embeddable bug reporting widget with AI-powered analysis. You may use the service for lawful purposes only. You agree not to reverse-engineer, decompile, or attempt to extract the source code of the widget or API. Each account is issued a unique API key that must be kept confidential. Sharing your API key or using it in a manner that violates these terms may result in account suspension.',
  },
  {
    icon: Shield,
    title: "3. Privacy & Data Collection",
    content:
      "FeedFlow collects feedback data submitted through the widget, including text descriptions, screenshots, browser metadata, and page URLs. Authentication is handled exclusively via Google OAuth through Supabase, meaning we do not store your Google password. We may use anonymized, aggregated data for improving our AI severity analysis models. Your personal data is never sold to third parties.",
  },
  {
    icon: Eye,
    title: "4. Data Retention & Security",
    content:
      "Feedback data is stored securely using industry-standard encryption. You may request deletion of your data at any time by contacting our support team. We retain feedback data for the duration of your active subscription. Upon account termination, data is permanently deleted within 30 days.",
  },
  {
    icon: AlertTriangle,
    title: "5. Limitation of Liability",
    content:
      'FeedFlow is provided "as is" without warranty of any kind, express or implied. We do not guarantee that the service will be uninterrupted, error-free, or that the AI severity classifications will be 100% accurate. In no event shall FeedFlow be liable for any indirect, incidental, special, or consequential damages.',
  },
  {
    icon: RefreshCw,
    title: "6. Changes to Terms",
    content:
      "We reserve the right to modify these Terms of Service at any time. When we do, we will update the date at the top of this page. We encourage users to periodically review these terms. Your continued use of FeedFlow after any changes constitutes your acceptance of the new terms.",
  },
]

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="px-6 pb-24 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-muted-foreground">Last updated: February 2026</p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.title}
                className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#EC4899]/10">
                    <section.icon className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
                </div>
                <p className="leading-relaxed text-muted-foreground">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
