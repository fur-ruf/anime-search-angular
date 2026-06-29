import { Anime } from "./anime.types";
import { SearchFilters } from "./search.types";

export interface SearchResult {
  results: Anime[];
  total: number;
  suggestions: string[];
  filters: SearchFilters; 
  executionTime: number; 
}