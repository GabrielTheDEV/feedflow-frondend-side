import { Navbar } from "@/components/marketing/navbar";

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Choose your plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="rounded-xl border bg-white p-8 flex flex-col items-center shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Starter</h2>
            <div className="text-4xl font-bold mb-4">$29</div>
            <ul className="mb-6 text-muted-foreground text-sm list-disc list-inside">
              <li>Basic bug reporting</li>
              <li>Email support</li>
            </ul>
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition">Choose Starter</button>
          </div>
          <div className="rounded-xl border bg-white p-8 flex flex-col items-center shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Pro</h2>
            <div className="text-4xl font-bold mb-4">$49</div>
            <ul className="mb-6 text-muted-foreground text-sm list-disc list-inside">
              <li>Everything in Starter</li>
              <li>Slack integration</li>
              <li>Priority support</li>
            </ul>
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition">Choose Pro</button>
          </div>
          <div className="rounded-xl border bg-white p-8 flex flex-col items-center shadow-md">
            <h2 className="text-2xl font-semibold mb-2">Enterprise</h2>
            <div className="text-4xl font-bold mb-4">$129</div>
            <ul className="mb-6 text-muted-foreground text-sm list-disc list-inside">
              <li>Everything in Pro</li>
              <li>Custom integrations</li>
              <li>Dedicated manager</li>
            </ul>
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition">Contact Sales</button>
          </div>
        </div>
      </div>
    </>
  );
}
