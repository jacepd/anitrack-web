"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/mylist", label: "My List" },
  { href: "/social", label: "Social" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 bg-secondary border-b border-muted/40">
      <div className="max-w-7xl mx-auto px-8 h-20 grid grid-cols-3 items-center">

        {/* Logo — left */}
        <Link href="/" className="text-2xl font-bold tracking-widest gradient-text">
          ANITRACK
        </Link>

        {/* Nav links — centered */}
        <div className="hidden md:flex items-center justify-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-5 py-2.5 rounded-lg transition-colors font-bold ${
                pathname === link.href
                  ? "bg-surface text-text-main"
                  : "text-subtle hover:text-text-main hover:bg-surface/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth — right */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/search"
            className="hidden lg:flex items-center gap-2 bg-surface rounded-lg px-4 py-2 text-subtle hover:text-text-main transition-colors"
            style={{ border: "0.5px solid #1E2A3A" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="text-sm">Search...</span>
          </Link>

          {user ? (
            <>
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm font-bold">
                  {profile?.display_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span className="text-sm text-text-main font-bold hidden xl:block">
                  {profile?.display_name}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="text-sm text-subtle hover:text-red-400 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-outline text-sm py-1.5 px-4">
                Sign in
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm py-1.5 px-4">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden flex border-t border-muted/40">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 py-2 text-center text-xs font-bold transition-colors ${
              pathname === link.href ? "text-primary" : "text-subtle"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
