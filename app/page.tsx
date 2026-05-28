import { jikanApi } from "@/lib/jikan";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { AnimeRow } from "@/components/anime/AnimeRow";

export default async function HomePage() {
  const [trending, seasonal, upcoming] = await Promise.all([
    jikanApi.getTopAnime(1, "bypopularity"),
    jikanApi.getCurrentSeason(),
    jikanApi.getUpcomingSeason(),
  ]);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-primary mb-3 tracking-tight">
          AniTrack
        </h1>
        <p className="text-subtle text-lg max-w-xl mx-auto">
          Track every anime you've watched, discover what's airing now,
          and share your list with friends.
        </p>
      </section>

      {/* Trending */}
      <AnimeRow title="🔥 Trending Now" anime={trending.data.slice(0, 12)} />

      {/* This Season */}
      <AnimeRow title="📺 This Season" anime={seasonal.data.slice(0, 12)} />

      {/* Upcoming */}
      <AnimeRow title="🗓️ Coming Soon" anime={upcoming.data.slice(0, 12)} />
    </div>
  );
}
