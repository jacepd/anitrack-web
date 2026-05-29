import { Anime } from "@/lib/jikan";
import { AnimeCard } from "./AnimeCard";
import Link from "next/link";

interface AnimeRowProps {
  title: string;
  anime: Anime[];
  viewAllHref?: string;
}

export function AnimeRow({ title, anime, viewAllHref }: AnimeRowProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-text-main">{title}</h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-sm text-accent hover:text-primary transition-colors font-bold">
            See all →
          </Link>
        )}
      </div>
      <div className="anime-grid">
        {anime.map((a) => (
          <AnimeCard key={a.mal_id} anime={a} />
        ))}
      </div>
    </section>
  );
}
