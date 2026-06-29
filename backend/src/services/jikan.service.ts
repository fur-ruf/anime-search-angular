import axios from 'axios';
import { CacheService } from './cache.service';
import { Anime, AnimeSearchResponse } from '../models';

const JIKAN_API = 'https://api.jikan.moe/v4';

export class JikanService {
  private cache: CacheService;
  private logger: Console;

  constructor() {
    this.cache = new CacheService(5 * 60 * 1000);
    this.logger = console; 
  }

  async searchAnime(params: {
    q?: string;
    genres?: string;
    min_score?: number;
    order_by?: string;
    limit?: number;
    page?: number;
  }): Promise<Anime[]> {
    const cacheKey = `search:${JSON.stringify(params)}`;
    
    const cached = this.cache.get<Anime[]>(cacheKey);
    if (cached) {
      this.logger.info(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    try {
      this.logger.info(`Запрос к Jikan API: ${JSON.stringify(params)}`);
      
      const response = await axios.get<AnimeSearchResponse>(
        `${JIKAN_API}/anime`,
        { params }
      );

      const data = response.data.data;
      this.cache.set(cacheKey, data);
      
      this.logger.info(`Jikan API вернул ${data.length} результатов`);
      return data;
    } catch (error) {
      this.logger.error(`Ошибка Jikan API:`, error);
      throw error;
    }
  }

  async getAnimeById(id: number): Promise<Anime> {
    const cacheKey = `detail:${id}`;
    
    const cached = this.cache.get<Anime>(cacheKey);
    if (cached) {
      this.logger.info(`Cache HIT: ${cacheKey}`);
      return cached;
    }

    try {
      const response = await axios.get<{ data: Anime }>(
        `${JIKAN_API}/anime/${id}`
      );
      
      const anime = response.data.data;
      this.cache.set(cacheKey, anime);
      
      this.logger.info(`Получено аниме #${id}: ${anime.title}`);
      return anime;
    } catch (error) {
      this.logger.error(`Ошибка получения аниме #${id}:`, error);
      throw error;
    }
  }

  async getGenres(): Promise<string[]> {
    const cacheKey = 'genres:all';
    
    const cached = this.cache.get<string[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get<{ data: Array<{ name: string }> }>(
        `${JIKAN_API}/genres/anime`
      );
      
      const genres = response.data.data.map(g => g.name);
      this.cache.set(cacheKey, genres);
      
      this.logger.info(`Получено ${genres.length} жанров`);
      return genres;
    } catch (error) {
      this.logger.error(`Ошибка получения жанров:`, error);
      throw error;
    }
  }

  clearCache(): void {
    this.cache.clear();
    this.logger.info('Кэш очищен');
  }

  getCacheStats(): { size: number; keys: string[] } {
    return this.cache.getStats();
  }
}