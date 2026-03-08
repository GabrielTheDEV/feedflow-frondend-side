export default function IntegrationsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground mt-2">
          Connect FeedFlow with your favorite tools
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Slack Integration */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Slack</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get instant notifications when users report bugs
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#E01E5A] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.29 8.41a2.4 2.4 0 00-2.4-2.4 2.4 2.4 0 00-2.4 2.4v2.4h2.4a2.4 2.4 0 012.4 2.4 2.4 2.4 0 01-2.4 2.4H9.64a2.4 2.4 0 01-2.4-2.4 2.4 2.4 0 012.4-2.4h2.4V8.41a2.4 2.4 0 00-2.4-2.4 2.4 2.4 0 00-2.4 2.4v6.35a2.4 2.4 0 002.4 2.4 2.4 2.4 0 002.4-2.4v-2.4H9.64a2.4 2.4 0 00-2.4 2.4 2.4 2.4 0 002.4 2.4h9.65a2.4 2.4 0 002.4-2.4V8.41z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Status: <span className="text-yellow-600 font-medium">Not Connected</span>
          </p>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Connect Slack
          </button>
        </div>

        {/* GitHub Integration */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">GitHub</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Automatically create GitHub issues from bug reports
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Status: <span className="text-yellow-600 font-medium">Not Connected</span>
          </p>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Connect GitHub
          </button>
        </div>

        {/* Jira Integration */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Jira</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Turn incoming feedback into Jira issues automatically
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M11.537 11.176h-.006c-1.196 0-2.168.972-2.168 2.168v7.292a1.902 1.902 0 0 0 3.249 1.345 1.889 1.889 0 0 0 .55-1.345v-7.292c0-1.196-.972-2.168-2.168-2.168Zm0-9.812c-1.196 0-2.168.972-2.168 2.168v7.292c0 1.196.972 2.168 2.168 2.168h.006a2.168 2.168 0 0 0 2.168-2.168V3.532c0-1.196-.972-2.168-2.168-2.168h-.006Zm7.29 7.999h-7.293c-1.196 0-2.168.972-2.168 2.168v.006c0 1.196.972 2.168 2.168 2.168h7.293a1.902 1.902 0 0 0 1.345-3.249 1.889 1.889 0 0 0-1.345-.55Zm-9.818 0H1.716a1.902 1.902 0 1 0 0 3.804h7.293a2.168 2.168 0 0 0 2.168-2.168v-.006a2.168 2.168 0 0 0-2.168-2.168Z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Status: <span className="text-yellow-600 font-medium">Not Connected</span>
          </p>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Connect Jira
          </button>
        </div>

        {/* Trello Integration */}
        <div className="bg-white rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Trello</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Send user reports to Trello boards and lists
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M2.5 4.75A2.25 2.25 0 0 1 4.75 2.5h14.5a2.25 2.25 0 0 1 2.25 2.25v14.5a2.25 2.25 0 0 1-2.25 2.25H4.75A2.25 2.25 0 0 1 2.5 19.25V4.75Zm4.25 1.5a.75.75 0 0 0-.75.75v5.5c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-5.5a.75.75 0 0 0-.75-.75h-3.5Zm0 8a.75.75 0 0 0-.75.75v2c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 0-.75-.75h-3.5Zm7-8a.75.75 0 0 0-.75.75v10c0 .414.336.75.75.75h3.5a.75.75 0 0 0 .75-.75V7a.75.75 0 0 0-.75-.75h-3.5Z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Status: <span className="text-yellow-600 font-medium">Not Connected</span>
          </p>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Connect Trello
          </button>
        </div>
      </div>
    </div>
  )
}
