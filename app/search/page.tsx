import { jikanApi } from "@/lib/jikan";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { SearchBar } from "@/components/anime/SearchBar";

const GENRES = [
  { id: 1, name: "Action" }, { id: 2, name: "Adventure" },
  { id: 4, name: "Comedy" }, { id: 8, name: "Drama" },
  { id: 10, name: "Fantasy" }, { id: 14, name: "Horror" },
  { id: 22, name: "Romance" }, { id: 24, name: "Sci-Fi" },
  { id: 36, name: "Slice of Life" }, { id: 37, name: "Supernatural" },
  { id: 7, name: "Mystery" }, { id: 27, name: "Shounen" },
];

interface SearchPageProps {
  searchParams: { q?: string; genre?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q;
  const genreId = searchParams.genre ? parseInt(searchParams.genre) : null;

  let results = null;
  if (query) {
    results = await jikanApi.searchAnime(query);
  } else if (genreId) {
    results = await jikanApi.getAnimeByGenre(genreId);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search Anime</h1>

      <SearchBar defaultValue={query} />

      {/* Genre pills */}
      <div>
        <p className="text-subtle text-sm mb-3">Browse by Genre</p>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <a
              key={g.id}
              href={`/search?genre=${g.id}`}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
                genreId === g.id
                  ? "bg-primary text-white"
                  : "bg-muted text-text-main hover:bg-primary/50"
              }`}
            >
              {g.name}
            </a>
          ))}
        </div>
      </div>

      {/* Results */}
      {results && (
        <div>
          <p className="text-subtle text-sm mb-4">
            {results.data.length} results
            {query ? ` for "${query}"` : ""}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.data.map((anime) => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
        </div>
      )}

      {!results && (
        <div className="text-center py-20 text-subtle">
          <p className="text-4xl mb-3">🔍</p>
          <p>Search for an anime title or pick a genre above</p>
        </div>
      )}
    </div>
  );
}
