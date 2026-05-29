import Link from "next/link";
import Image from "next/image";
import { Anime } from "@/lib/jikan";

export function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface"
          style={{ border: "0.5px solid #1E2A3A" }}>
          <Image
            src={anime.images.jpg.image_url}
            alt={anime.title_english ?? anime.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 14vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Score badge */}
          {anime.score && (
            <div className="absolute top-2 left-2 bg-black/75 rounded-md px-1.5 py-0.5 text-xs font-bold text-accent">
              ★ {anime.score}
            </div>
          )}

          {/* Airing badge */}
          {anime.status === "Currently Airing" && (
            <div className="absolute top-2 right-2 bg-primary/90 rounded-md px-1.5 py-0.5 text-xs font-bold text-white">
              Airing
            </div>
          )}

          {/* Title slide up on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-xs font-bold leading-tight line-clamp-2">
              {anime.title_english ?? anime.title}
            </p>
          </div>
        </div>

        <p className="mt-2 text-sm font-bold leading-tight line-clamp-2 text-text-main group-hover:text-primary transition-colors">
          {anime.title_english ?? anime.title}
        </p>
        {anime.year && (
          <p className="text-subtle text-xs mt-0.5">{anime.year}</p>
        )}
      </div>
    </Link>
  );
}
