import Fuse from 'fuse.js';
import { Anime } from '../models';

export const ANIME_SEARCH_KEYS = [
  'title',
  'title_english',
  'title_japanese',
  'title_synonyms',
  'synopsis'
];

export const ANIME_SEARCH_WEIGHTS = {
  title: 3,
  title_english: 3,
  title_japanese: 2,
  title_synonyms: 2,
  synopsis: 1
};

export const createAnimeFuse = (data: Anime[]): Fuse<Anime> => {
  return new Fuse(data, {
    keys: ANIME_SEARCH_KEYS.map(key => ({
      name: key,
      weight: ANIME_SEARCH_WEIGHTS[key as keyof typeof ANIME_SEARCH_WEIGHTS] || 1
    })),
    
    threshold: 0.4,
    minMatchCharLength: 2,
    shouldSort: true,
    ignoreLocation: true,
    useExtendedSearch: true,
    includeScore: true
  });
};