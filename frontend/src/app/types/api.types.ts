export interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  title_synonyms?: string[];
  images: {
    jpg: {
      image_url: string;
      small_image_url?: string;
      large_image_url?: string;
    };
    webp?: {
      image_url: string;
      small_image_url?: string;
      large_image_url?: string;
    };
  };
  type: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from?: string;
    to?: string;
    prop?: {
      from: { day: number; month: number; year: number };
      to: { day: number; month: number; year: number };
    };
  };
  year?: number;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis?: string;
  background?: string;
  rating?: string;
  genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  explicit_genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  themes: Array<{ mal_id: number; type: string; name: string; url: string }>;
  demographics: Array<{ mal_id: number; type: string; name: string; url: string }>;
  producers: Array<{ mal_id: number; type: string; name: string; url: string }>;
  licensors: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios: Array<{ mal_id: number; type: string; name: string; url: string }>;
  duration: string;
  trailer?: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  season?: string;
}

export interface SearchFilters {
  q?: string;
  genres?: string[];
  genresIds?: number[];
  minScore?: number;
  maxScore?: number;
  minYear?: number;
  maxYear?: number;
  status?: 'Finished Airing' | 'Currently Airing' | 'Not yet aired';
  type?: 'TV' | 'Movie' | 'OVA' | 'Special' | 'ONA' | 'Music';
  sortBy?: 'score' | 'popularity' | 'rank' | 'year' | 'title' | 'members' | 'favorites';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  minEpisodes?: number;
  maxEpisodes?: number;
}

export interface SearchResponse {
  success: boolean;
  data: Anime[];
  total: number;
  suggestions: string[];
  filters: SearchFilters;
  executionTime: number;
}

export interface AnimeDetailResponse {
  success: boolean;
  data: Anime;
}

export interface GenresResponse {
  success: boolean;
  data: string[];
}

export interface RecommendationsResponse {
  success: boolean;
  data: Anime[];
}
