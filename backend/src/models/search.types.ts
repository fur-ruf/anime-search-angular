import { Anime } from "./anime.types";

export interface AnimeSearchResponse {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
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