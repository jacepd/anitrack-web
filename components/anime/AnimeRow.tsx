import { Anime } from "@/lib/jikan";
import { AnimeCard } from "./AnimeCard";

interface AnimeRowProps {
  title: string;
  anime: Anime[];
}

export function AnimeRow({ title, anime }: AnimeRowProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {anime.map((a) => (
          <AnimeCard key={a.mal_id} anime={a} />
        ))}
      </div>
    </section>
  );
}
