import { Navbar } from "@/components/marketing/navbar";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-screen py-16 px-4">
        <h1 className="text-4xl font-bold mb-4">Contact</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
          Have questions, suggestions, or want to get in touch? Fill out the form below or email us at <a href="mailto:support@feedflow.com" className="text-primary underline">support@feedflow.com</a>.
        </p>
        <form className="w-full max-w-md space-y-4">
          <input type="text" placeholder="Your Name" className="w-full border rounded px-3 py-2" required />
          <input type="email" placeholder="Your Email" className="w-full border rounded px-3 py-2" required />
          <textarea placeholder="Your Message" className="w-full border rounded px-3 py-2 min-h-[120px]" required />
          <button type="submit" className="w-full bg-primary text-white rounded px-4 py-2 font-semibold hover:opacity-90">Send</button>
        </form>
      </main>
    </>
  );
}
