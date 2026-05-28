import Link from "next/link";
import Image from "next/image";
import { Anime } from "@/lib/jikan";

export function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted">
          <Image
            src={anime.images.jpg.image_url}
            alt={anime.title_english ?? anime.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          />
          {anime.score && (
            <div className="absolute top-2 left-2 bg-black/70 rounded-full px-2 py-0.5 text-xs font-bold text-accent">
              ★ {anime.score}
            </div>
          )}
        </div>
        <p className="mt-2 text-sm font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {anime.title_english ?? anime.title}
        </p>
        {anime.year && (
          <p className="text-subtle text-xs mt-0.5">{anime.year}</p>
        )}
      </div>
    </Link>
  );
}
