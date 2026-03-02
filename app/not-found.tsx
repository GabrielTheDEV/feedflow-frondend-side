export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#8B5CF6]/10 px-4 py-16">
      <div className="text-8xl font-extrabold text-primary mb-4">404</div>
      <h1 className="text-3xl font-bold mb-2 text-foreground">Page not found</h1>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Oops! The page you are looking for does not exist or has been moved.<br />
        Please check the URL or return to the homepage.
      </p>
      <a href="/" className="px-6 py-2 rounded-lg bg-primary text-white font-medium shadow hover:bg-primary/90 transition">Back to Home</a>
    </div>
  );
}
