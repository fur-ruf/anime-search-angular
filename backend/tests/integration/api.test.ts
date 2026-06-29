import request from 'supertest';
import app from '../../src/index';

jest.mock('../../src/services/jikan.service', () => {
  const mockAnime = {
    mal_id: 1,
    title: 'Attack on Titan',
    title_english: 'Attack on Titan',
    score: 9.12,
    year: 2013,
    status: 'Finished Airing',
    genres: [{ mal_id: 1, type: 'anime', name: 'Action', url: '' }],
    episodes: 25,
    type: 'TV',
    airing: false,
    aired: { from: '2013-04-07', to: '2013-09-29' },
    images: { jpg: { image_url: 'https://example.com/image.jpg' } },
    members: 1000000,
    favorites: 100000,
    popularity: 1,
    rank: 1,
    scored_by: 1000000,
    titles: [],
    duration: '24 min',
    rating: 'R - 17+',
    synopsis: 'Test synopsis',
    background: 'Test background',
    explicit_genres: [],
    themes: [],
    demographics: [],
    producers: [],
    licensors: [],
    studios: [],
    season: 'spring',
    broadcast: undefined,
    trailer: undefined,
    approved: true,
    source: 'Manga',
    url: 'https://myanimelist.net/anime/1'
  };

  return {
    JikanService: jest.fn().mockImplementation(() => ({
      searchAnime: jest.fn().mockResolvedValue([mockAnime]),
      getAnimeById: jest.fn().mockImplementation((id: number) => {
        if (id === 999999999) throw new Error('Not found');
        return Promise.resolve(mockAnime);
      }),
      getGenres: jest.fn().mockResolvedValue(['Action', 'Comedy', 'Drama']),
      getRecommendations: jest.fn().mockResolvedValue([mockAnime]),
      getCacheStats: jest.fn().mockReturnValue({ size: 0, keys: [] }),
      clearCache: jest.fn().mockResolvedValue(undefined)
    }))
  };
});

describe('API Integration Tests', () => {
  let server: any;

  beforeAll(() => {
    server = app.listen(3001); 
  });

  afterAll((done) => {
    server.close(done); 
  });

  describe('GET /health', () => {
    it('should return OK status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/api');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Anime Smart Search API');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('GET /api/anime/search', () => {
    it('should return results with query', async () => {
      const response = await request(app)
        .get('/api/anime/search')
        .query({ q: 'Naruto', limit: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.total).toBeDefined();
    }, 5000);

    it('should apply filters correctly', async () => {
      const response = await request(app)
        .get('/api/anime/search')
        .query({
          q: 'Attack',
          minScore: 8,
          sortBy: 'score',
          limit: 5
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      
      if (response.body.data.length > 0) {
        response.body.data.forEach((anime: any) => {
          expect(anime.score).toBeGreaterThanOrEqual(8);
        });
      }
    }, 5000);

    it('should handle invalid params gracefully', async () => {
      const response = await request(app)
        .get('/api/anime/search')
        .query({ minScore: 'invalid' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    }, 5000);
  });

  describe('GET /api/anime/:id', () => {
    it('should return anime by ID', async () => {
      const response = await request(app).get('/api/anime/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.mal_id).toBe(1);
    }, 5000);

    it('should return 404 for non-existent anime', async () => {
      const response = await request(app).get('/api/anime/999999999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Anime not found');
    }, 5000);
  });

  describe('GET /api/anime/genres', () => {
    it('should return list of genres', async () => {
      const response = await request(app).get('/api/anime/genres');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    }, 5000);
  });

  describe('GET /api/anime/:id/recommendations', () => {
    it('should return recommendations for anime', async () => {
      const response = await request(app).get('/api/anime/1/recommendations');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
    }, 5000);
  });

  describe('Cache endpoints', () => {
    it('should return cache stats', async () => {
      const response = await request(app).get('/api/test/cache-stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stats).toBeDefined();
    });

    it('should clear cache', async () => {
      const response = await request(app).delete('/api/test/cache');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Cache cleared successfully');
    });
  });
});