import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <h1 className="text-6xl font-bold text-text">403</h1>
      <p className="mt-4 text-xl text-text-muted">You don&apos;t have access to this page</p>
      <Link href="/" className="btn-noir btn-noir-primary mt-8">
        Go back home
      </Link>
    </div>
  );
}
