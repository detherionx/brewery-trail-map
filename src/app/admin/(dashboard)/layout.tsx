import Link from "next/link";
import { logout } from "./logout/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-3">
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/admin/breweries" className="font-medium text-neutral-900">
            Breweries
          </Link>
        </nav>
        <form action={logout}>
          <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-900">
            Sign out
          </button>
        </form>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
