const BASE_URL = "https://api.jikan.moe/v4";

export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: { image_url: string; large_image_url: string };
    webp: { image_url: string; large_image_url: string };
  };
  synopsis?: string;
  score?: number;
  rank?: number;
  popularity?: number;
  episodes?: number;
  status: string;
  aired: { string: string };
  genres: { mal_id: number; name: string }[];
  studios: { mal_id: number; name: string }[];
  rating?: string;
  type?: string;
  season?: string;
  year?: number;
  trailer?: { youtube_id?: string };
}

export interface Character {
  character: {
    mal_id: number;
    name: string;
    images: {
      jpg: { image_url: string };
      webp: { image_url: string };
    };
  };
  role: string;
  voice_actors: {
    person: { name: string };
    language: string;
  }[];
}

export interface Relation {
  relation: string;
  entry: {
    mal_id: number;
    name: string;
    type: string;
    url: string;
  }[];
}

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: { count: number; total: number; per_page: number };
  };
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function jikanFetch<T>(endpoint: string): Promise<T> {
  await delay(350);
  const res = await fetch(`${BASE_URL}${endpoint}`, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Jikan error: ${res.status}`);
  return res.json();
}

export const jikanApi = {
  searchAnime: (query: string, page = 1) =>
    jikanFetch<JikanResponse<Anime[]>>(
      `/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20&sfw=true`
    ),
  getAnime: (id: number) =>
    jikanFetch<JikanResponse<Anime>>(`/anime/${id}`),
  getAnimeFull: (id: number) =>
    jikanFetch<JikanResponse<Anime>>(`/anime/${id}/full`),
  getTopAnime: (page = 1, filter?: "airing" | "upcoming" | "bypopularity") =>
    jikanFetch<JikanResponse<Anime[]>>(
      `/top/anime?page=${page}${filter ? `&filter=${filter}` : ""}`
    ),
  getCurrentSeason: (page = 1) =>
    jikanFetch<JikanResponse<Anime[]>>(`/seasons/now?page=${page}`),
  getUpcomingSeason: (page = 1) =>
    jikanFetch<JikanResponse<Anime[]>>(`/seasons/upcoming?page=${page}`),
  getAnimeByGenre: (genreId: number, page = 1) =>
    jikanFetch<JikanResponse<Anime[]>>(
      `/anime?genres=${genreId}&page=${page}&order_by=score&sort=desc`
    ),
  getGenres: () =>
    jikanFetch<JikanResponse<{ mal_id: number; name: string; count: number }[]>>(
      `/genres/anime`
    ),
  getRecommendations: (id: number) =>
    jikanFetch<JikanResponse<{ entry: Anime }[]>>(
      `/anime/${id}/recommendations`
    ),
  getCharacters: (id: number) =>
    jikanFetch<JikanResponse<Character[]>>(
      `/anime/${id}/characters`
    ),
  getRelations: (id: number) =>
    jikanFetch<JikanResponse<Relation[]>>(
      `/anime/${id}/relations`
    ),
  // Fetch a related anime's details by mal_id
  getAnimeById: (id: number) =>
    jikanFetch<JikanResponse<Anime>>(`/anime/${id}`),
};
