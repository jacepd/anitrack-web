import Image from "next/image";
import { notFound } from "next/navigation";
import { jikanApi } from "@/lib/jikan";
import { AddToListButton } from "@/components/anime/AddToListButton";

interface AnimePageProps {
  params: { id: string };
}

export default async function AnimePage({ params }: AnimePageProps) {
  const anime = await jikanApi.getAnimeFull(parseInt(params.id)).catch(() => null);
  if (!anime) notFound();

  const { data } = anime;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0">
          <Image
            src={data.images.jpg.large_image_url}
            alt={data.title}
            width={240}
            height={340}
            className="rounded-xl object-cover shadow-2xl"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              {data.title_english ?? data.title}
            </h1>
            {data.title_english && (
              <p className="text-subtle mt-1">{data.title}</p>
            )}
          </div>

          {/* Score */}
          {data.score && (
            <div className="flex items-center gap-4">
              <div className="bg-accent/20 rounded-xl px-4 py-2 text-center">
                <div className="text-accent text-3xl font-bold">{data.score}</div>
                <div className="text-subtle text-xs">MAL Score</div>
              </div>
              {data.rank && (
                <div className="text-subtle text-sm">Ranked #{data.rank}</div>
              )}
              {data.popularity && (
                <div className="text-subtle text-sm">Popularity #{data.popularity}</div>
              )}
            </div>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-2">
            {data.type && <Chip text={data.type} />}
            {data.episodes && <Chip text={`${data.episodes} episodes`} />}
            {data.status && <Chip text={data.status} />}
            {data.year && (
              <Chip text={`${data.season ? data.season + " " : ""}${data.year}`} />
            )}
            {data.rating && <Chip text={data.rating} />}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2">
            {data.genres.map((g) => (
              <a
                key={g.mal_id}
                href={`/search?genre=${g.mal_id}`}
                className="bg-primary/20 text-primary rounded-full px-3 py-1 text-sm font-bold hover:bg-primary/40 transition-colors"
              >
                {g.name}
              </a>
            ))}
          </div>

          {/* Studios */}
          {data.studios.length > 0 && (
            <p className="text-subtle text-sm">
              Studio: {data.studios.map((s) => s.name).join(", ")}
            </p>
          )}

          {/* Add to List */}
          <AddToListButton
            malId={data.mal_id}
            title={data.title_english ?? data.title}
            imageUrl={data.images.jpg.large_image_url}
            totalEpisodes={data.episodes}
          />
        </div>
      </div>

      {/* Synopsis */}
      {data.synopsis && (
        <div className="card">
          <h2 className="text-xl font-bold mb-3">Synopsis</h2>
          <p className="text-subtle leading-relaxed">{data.synopsis}</p>
        </div>
      )}

      {/* Trailer */}
      {data.trailer?.youtube_id && (
        <div className="card">
          <h2 className="text-xl font-bold mb-3">Trailer</h2>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${data.trailer.youtube_id}`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ text }: { text: string }) {
  return (
    <span className="bg-muted text-text-main rounded-full px-3 py-1 text-sm">
      {text}
    </span>
  );
}
