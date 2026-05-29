import { jikanApi } from "@/lib/jikan";
import { AnimeRow } from "@/components/anime/AnimeRow";
import Link from "next/link";

export default async function HomePage() {
  const [trending, seasonal, upcoming] = await Promise.all([
    jikanApi.getTopAnime(1, "bypopularity"),
    jikanApi.getCurrentSeason(),
    jikanApi.getUpcomingSeason(),
  ]);

  return (
    <div className="space-y-12">

      {/* Cinematic Hero */}
      <section className="relative -mx-4 px-8 py-20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0D0D1A 0%, #111827 50%, #1E2A3A 100%)" }}>

        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }}
        />

        {/* Blue glow top right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #3B82F6, transparent)" }}
        />

        {/* Subtle glow bottom left */}
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-5 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #60A5FA, transparent)" }}
        />

        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/15 text-primary text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-widest uppercase border border-primary/20">
            🎌 Your Anime Universe
          </div>

          <h1 className="text-6xl font-bold leading-tight mb-5 text-text-main">
            Track. Discover.<br />
            <span className="gradient-text">Share.</span>
          </h1>

          <p className="text-subtle text-lg leading-relaxed mb-8 max-w-lg">
            The ultimate anime tracking experience. Keep track of everything
            you have watched, discover new series, and connect with fellow fans.
          </p>

          <div className="flex gap-3 mb-12">
            <Link href="/auth/signup" className="btn-primary px-8 py-3 text-base">
              Get started — it&apos;s free
            </Link>
            <Link href="/search" className="btn-secondary px-8 py-3 text-base">
              Browse anime
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10">
            {[
              { value: "20,000+", label: "Anime titles" },
              { value: "Free", label: "Always" },
              { value: "Live", label: "Seasonal data" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-subtle text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rows */}
      <AnimeRow title="🔥 Trending Now" anime={trending.data.slice(0, 14)} viewAllHref="/search" />
      <AnimeRow title="📺 This Season" anime={seasonal.data.slice(0, 14)} />
      <AnimeRow title="🗓️ Coming Soon" anime={upcoming.data.slice(0, 14)} />

    </div>
  );
}
