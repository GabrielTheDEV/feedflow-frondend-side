export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your FeedFlow workspace
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* API Keys */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">API Keys</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Use these keys to authenticate your widget installation
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">Public Key</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value="pk_live_..."
                  disabled
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-secondary text-sm font-mono text-muted-foreground"
                />
                <button className="px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors">
                  Copy
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Secret Key</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="password"
                  value="sk_live_..."
                  disabled
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-secondary text-sm font-mono text-muted-foreground"
                />
                <button className="px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors">
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Whitelist */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Domain Whitelist</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Specify which domains can use your widget
          </p>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="example.com"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
            <button className="w-full px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium">
              Add Domain
            </button>
          </div>
        </div>


      </div>
    </div>
  )
}
