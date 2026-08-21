import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <h1 className="text-6xl font-bold text-text">404</h1>
      <p className="mt-4 text-xl text-text-muted">Page not found</p>
      <Link href="/" className="btn-noir btn-noir-primary mt-8">
        Go back home
      </Link>
    </main>
  );
}
