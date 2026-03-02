export default function WidgetPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Widget</h1>
        <p className="text-muted-foreground mt-2">
          Installation code and configuration
        </p>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Installation */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Installation</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Add this script to your website to enable the FeedFlow widget
          </p>
          <div className="relative">
            <pre className="bg-secondary p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground">
{`<script>
  (function() {
    const script = document.createElement('script');
    script.src = 'https://cdn.feedflow.app/widget.js';
    script.async = true;
    script.dataset.apiKey = 'pk_live_...';
    document.head.appendChild(script);
  })();
</script>`}
            </pre>
            <button className="absolute top-4 right-4 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              Copy
            </button>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Configuration</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Customize the widget behavior
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Position</label>
              <select className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option>Bottom Right</option>
                <option>Bottom Left</option>
                <option>Top Right</option>
                <option>Top Left</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Theme</label>
              <select className="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-background text-sm">
                <option>Auto (match system)</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <button className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
