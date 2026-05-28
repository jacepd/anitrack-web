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
    <nav className="bg-surface border-b border-muted/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary">
          AniTrack
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                pathname === link.href
                  ? "bg-primary/20 text-primary"
                  : "text-subtle hover:text-text-main hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-primary text-sm font-bold">
                    {profile?.display_name?.[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <span className="text-sm font-bold hidden sm:block">
                  {profile?.display_name}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="text-subtle hover:text-red-400 text-sm transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-secondary text-sm py-1.5 px-3">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary text-sm py-1.5 px-3">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-muted/30">
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
