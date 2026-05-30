import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { jikanApi } from "@/lib/jikan";
import { AddToListButton } from "@/components/anime/AddToListButton";

interface AnimePageProps {
  params: { id: string };
}

function getTitle(anime: any) {
  return anime?.title_english || anime?.title || null;
}

function getImage(images: any) {
  return (
    images?.jpg?.large_image_url ||
    images?.jpg?.image_url ||
    images?.webp?.large_image_url ||
    images?.webp?.image_url ||
    null
  );
}

// ---- Streamed sections ----

async function CharactersSection({ id }: { id: number }) {
  const res = await jikanApi.getCharacters(id).catch(() => null);
  const characters = (res as any)?.data ?? [];
  const mainCharacters = characters
    .sort((a: any, b: any) => (a.role === "Main" ? -1 : 1))
    .slice(0, 12);

  if (!mainCharacters.length) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-text-main">Characters</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mainCharacters.map((c: any) => {
          const japaneseVA = c.voice_actors?.find((va: any) => va.language === "Japanese");
          const charImage =
            c.character.images?.jpg?.image_url ||
            c.character.images?.webp?.image_url || null;
          const vaImage =
            japaneseVA?.person?.images?.jpg?.image_url ||
            japaneseVA?.person?.images?.webp?.image_url || null;

          return (
            <div key={c.character.mal_id}
              className="card p-0 overflow-hidden hover:border-primary/40 transition-colors">
              <div className="relative w-full aspect-square bg-muted">
                {charImage ? (
                  <Image src={charImage} alt={c.character.name} fill
                    className="object-cover object-top" sizes="150px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-subtle text-xs p-2 text-center">
                    {c.character.name}
                  </div>
                )}
                <div className={`absolute top-2 left-2 text-white text-xs font-bold px-2 py-0.5 rounded-full ${
                  c.role === "Main" ? "bg-primary" : "bg-black/60"
                }`}>
                  {c.role}
                </div>
              </div>
              <div className="p-2">
                <p className="text-text-main text-xs font-bold leading-tight line-clamp-1">
                  {c.character.name}
                </p>
                {japaneseVA && (
                  <div className="flex items-center gap-1.5 mt-2 border-t border-muted/30 pt-2">
                    {vaImage ? (
                      <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-muted">
                        <Image src={vaImage} alt={japaneseVA.person.name}
                          fill className="object-cover" sizes="24px" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted flex-shrink-0" />
                    )}
                    <p className="text-subtle text-xs line-clamp-1">{japaneseVA.person.name}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function SequelsPrequelsSection({ id }: { id: number }) {
  const res = await jikanApi.getRelations(id).catch(() => null);
  const relations = (res as any)?.data ?? [];

  // Only sequels and prequels, only anime type
  const sequelPrequel = relations
    .filter((r: any) => r.relation === "Sequel" || r.relation === "Prequel")
    .map((r: any) => ({
      ...r,
      entry: r.entry.filter((e: any) => e.type === "anime"),
    }))
    .filter((r: any) => r.entry.length > 0);

  if (!sequelPrequel.length) return null;

  // Fetch details for each entry to get images and english titles
  const allEntries = sequelPrequel.flatMap((r: any) =>
    r.entry.map((e: any) => ({ ...e, relation: r.relation }))
  );

  const detailsMap: Record<number, any> = {};
  await Promise.allSettled(
    allEntries.map(async (entry: any) => {
      const detail = await jikanApi.getAnimeById(entry.mal_id).catch(() => null);
      if (detail?.data) detailsMap[entry.mal_id] = detail.data;
    })
  );

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-text-main">Sequels & Prequels</h2>
      <div className="space-y-5">
        {sequelPrequel.map((relation: any) => (
          <div key={relation.relation}>
            <h3 className="text-subtle text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-primary rounded-full inline-block" />
              {relation.relation}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relation.entry.map((entry: any) => {
                const details = detailsMap[entry.mal_id];
                const image = details ? getImage(details.images) : null;
                const title = details ? (getTitle(details) ?? entry.name) : entry.name;
                return (
                  <Link key={entry.mal_id} href={`/anime/${entry.mal_id}`}>
                    <div className="group cursor-pointer">
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface"
                        style={{ border: "0.5px solid #1E2A3A" }}>
                        {image ? (
                          <Image src={image} alt={title} fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="150px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-3">
                            <span className="text-subtle text-xs text-center leading-tight">{title}</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-xs font-bold leading-tight line-clamp-2 text-text-main group-hover:text-primary transition-colors">
                        {title}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function RecommendationsSection({ id }: { id: number }) {
  const res = await jikanApi.getRecommendations(id).catch(() => null);
  // Reduced to 6
  const recommendations = (res as any)?.data?.slice(0, 6) ?? [];

  if (!recommendations.length) return null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-text-main">You Might Also Like</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {recommendations.map((rec: any) => {
          const recImage = getImage(rec.entry.images);
          const recTitle = getTitle(rec.entry) ?? rec.entry.title;
          return (
            <Link key={rec.entry.mal_id} href={`/anime/${rec.entry.mal_id}`}>
              <div className="group cursor-pointer">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface"
                  style={{ border: "0.5px solid #1E2A3A" }}>
                  {recImage ? (
                    <Image src={recImage} alt={recTitle} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="150px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-2">
                      <span className="text-subtle text-xs text-center">{recTitle}</span>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs font-bold leading-tight line-clamp-2 text-text-main group-hover:text-primary transition-colors">
                  {recTitle}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// Skeletons
function CharactersSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-surface rounded w-36 mb-4" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="card p-0 overflow-hidden">
            <div className="aspect-square bg-muted" />
            <div className="p-2 space-y-1.5">
              <div className="h-3 bg-muted rounded" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SequelsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-surface rounded w-48 mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] rounded-xl bg-surface" />
            <div className="h-3 bg-surface rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RecommendationsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-surface rounded w-48 mb-4" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <div className="aspect-[2/3] rounded-xl bg-surface" />
            <div className="h-3 bg-surface rounded mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Main page ----

export default async function AnimePage({ params }: AnimePageProps) {
  const id = parseInt(params.id);
  const animeRes = await jikanApi.getAnimeFull(id).catch(() => null);
  if (!animeRes) notFound();

  const { data } = animeRes as any;
  const posterImage = getImage(data.images);

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Hero — loads immediately */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          {posterImage ? (
            <Image
              src={posterImage}
              alt={getTitle(data) ?? data.title}
              width={240}
              height={340}
              className="rounded-xl object-cover shadow-2xl"
              style={{ width: 240, height: "auto" }}
            />
          ) : (
            <div className="w-60 h-80 rounded-xl bg-surface border border-muted flex items-center justify-center">
              <span className="text-subtle text-sm text-center px-4">{getTitle(data) ?? data.title}</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-text-main">
              {getTitle(data) ?? data.title}
            </h1>
            {data.title_english && data.title !== data.title_english && (
              <p className="text-subtle mt-1">{data.title}</p>
            )}
          </div>

          {data.score && (
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 border border-primary/30 rounded-xl px-4 py-2 text-center">
                <div className="text-primary text-3xl font-bold">{data.score}</div>
                <div className="text-subtle text-xs">MAL Score</div>
              </div>
              {data.rank && (
                <div className="text-center">
                  <div className="text-text-main font-bold">#{data.rank}</div>
                  <div className="text-subtle text-xs">Ranked</div>
                </div>
              )}
              {data.popularity && (
                <div className="text-center">
                  <div className="text-text-main font-bold">#{data.popularity}</div>
                  <div className="text-subtle text-xs">Popularity</div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {data.type && <Chip text={data.type} />}
            {data.episodes && <Chip text={`${data.episodes} episodes`} />}
            {data.status && <Chip text={data.status} />}
            {data.year && (
              <Chip text={`${data.season ? data.season + " " : ""}${data.year}`} />
            )}
            {data.rating && <Chip text={data.rating} />}
          </div>

          <div className="flex flex-wrap gap-2">
            {data.genres.map((g: any) => (
              <Link key={g.mal_id} href={`/search?genre=${g.mal_id}`}
                className="bg-primary/20 text-primary rounded-full px-3 py-1 text-sm font-bold hover:bg-primary/40 transition-colors">
                {g.name}
              </Link>
            ))}
          </div>

          {data.studios.length > 0 && (
            <p className="text-subtle text-sm">
              Studio: {data.studios.map((s: any) => s.name).join(", ")}
            </p>
          )}

          <AddToListButton
            malId={data.mal_id}
            title={getTitle(data) ?? data.title}
            imageUrl={posterImage ?? ""}
            totalEpisodes={data.episodes}
          />
        </div>
      </div>

      {/* Synopsis */}
      {data.synopsis && (
        <div className="card">
          <h2 className="text-xl font-bold mb-3 text-text-main">Synopsis</h2>
          <p className="text-subtle leading-relaxed">{data.synopsis}</p>
        </div>
      )}

      {/* Trailer */}
      {data.trailer?.youtube_id && (
        <div className="card">
          <h2 className="text-xl font-bold mb-3 text-text-main">Trailer</h2>
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${data.trailer.youtube_id}`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Characters */}
      <Suspense fallback={<CharactersSkeleton />}>
        <CharactersSection id={id} />
      </Suspense>

      {/* Sequels & Prequels */}
      <Suspense fallback={<SequelsSkeleton />}>
        <SequelsPrequelsSection id={id} />
      </Suspense>

      {/* Recommendations */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <RecommendationsSection id={id} />
      </Suspense>

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
