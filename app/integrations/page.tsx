import { Navbar } from "@/components/marketing/navbar";

export default function IntegrationsPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Integrations</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
          Discover and connect with the main integrations to enhance your FeedFlow experience. Soon, you will be able to connect tools like Slack, Jira, Trello, and more to automate and optimize your workflow.
        </p>
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-gray-400 text-center">
          <span>Integrations coming soon!</span>
        </div>
      </main>
    </>
  );
}
