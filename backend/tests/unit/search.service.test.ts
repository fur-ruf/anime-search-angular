import { SearchService } from '../../src/services/search.service';
import { JikanService } from '../../src/services/jikan.service';
import { Anime } from '../../src/models';

jest.mock('../../src/services/jikan.service');

describe('SearchService', () => {
  let searchService: SearchService;
  let mockJikanService: jest.Mocked<JikanService>;

  const mockAnime: Anime[] = [
    {
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
      images: { jpg: { image_url: '' } },
      members: 0,
      favorites: 0,
      popularity: 0,
      rank: 0,
      scored_by: 0,
      titles: [],
      duration: '',
      rating: 'R - 17+',
      synopsis: '',
      background: '',
      explicit_genres: [],
      themes: [],
      demographics: [],
      producers: [],
      licensors: [],
      studios: []
    },
    {
      mal_id: 2,
      title: 'Naruto',
      title_english: 'Naruto',
      score: 8.5,
      year: 2002,
      status: 'Finished Airing',
      genres: [{ mal_id: 2, type: 'anime', name: 'Adventure', url: '' }],
      episodes: 220,
      type: 'TV',
      airing: false,
      aired: { from: '2002-10-03', to: '2007-02-08' },
      images: { jpg: { image_url: '' } },
      members: 0,
      favorites: 0,
      popularity: 0,
      rank: 0,
      scored_by: 0,
      titles: [],
      duration: '',
      rating: 'PG-13',
      synopsis: '',
      background: '',
      explicit_genres: [],
      themes: [],
      demographics: [],
      producers: [],
      licensors: [],
      studios: []
    },
    {
      mal_id: 3,
      title: 'One Piece',
      title_english: 'One Piece',
      score: 8.2,
      year: 1999,
      status: 'Currently Airing',
      genres: [{ mal_id: 3, type: 'anime', name: 'Action', url: '' }],
      episodes: 1000,
      type: 'TV',
      airing: true,
      aired: { from: '1999-10-20', to: '' },
      images: { jpg: { image_url: '' } },
      members: 0,
      favorites: 0,
      popularity: 0,
      rank: 0,
      scored_by: 0,
      titles: [],
      duration: '',
      rating: 'PG-13',
      synopsis: '',
      background: '',
      explicit_genres: [],
      themes: [],
      demographics: [],
      producers: [],
      licensors: [],
      studios: []
    }
  ];

  beforeEach(() => {
    mockJikanService = new JikanService() as jest.Mocked<JikanService>;
    searchService = new SearchService(mockJikanService);
  });

  describe('smartSearch', () => {
    it('should return results with query', async () => {
      mockJikanService.searchAnime.mockResolvedValueOnce(mockAnime);

      const result = await searchService.smartSearch({
        q: 'Attack',
        limit: 10
      });

      expect(result.results).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should apply minScore filter correctly', async () => {
      mockJikanService.searchAnime.mockResolvedValueOnce(mockAnime);

      const result = await searchService.smartSearch({
        q: 'Attack',
        minScore: 9,
        limit: 10
      });

      expect(result.results.length).toBeGreaterThan(0);
      result.results.forEach(anime => {
        expect(anime.score).toBeGreaterThanOrEqual(9);
      });
    });

    it('should apply status filter correctly', async () => {
      mockJikanService.searchAnime.mockResolvedValueOnce(mockAnime);

      const result = await searchService.smartSearch({
        status: 'Currently Airing',
        limit: 10
      });

      result.results.forEach(anime => {
        expect(anime.status).toBe('Currently Airing');
      });
    });

    it('should apply year filter correctly', async () => {
      mockJikanService.searchAnime.mockResolvedValueOnce(mockAnime);

      const result = await searchService.smartSearch({
        minYear: 2010,
        limit: 10
      });

      result.results.forEach(anime => {
        expect(anime.year).toBeGreaterThanOrEqual(2010);
      });
    });

    it('should generate suggestions', async () => {
      mockJikanService.searchAnime.mockResolvedValueOnce(mockAnime);

      const result = await searchService.smartSearch({
        q: 'Attack',
        limit: 10
      });

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('getAnimeById', () => {
    it('should return anime by ID', async () => {
      mockJikanService.getAnimeById.mockResolvedValueOnce(mockAnime[0]);

      const result = await searchService.getAnimeById(1);

      expect(result).toEqual(mockAnime[0]);
      expect(mockJikanService.getAnimeById).toHaveBeenCalledWith(1);
    });
  });

  describe('getGenres', () => {
    it('should return list of genres', async () => {
      const genres = ['Action', 'Comedy', 'Drama'];
      mockJikanService.getGenres.mockResolvedValueOnce(genres);

      const result = await searchService.getGenres();

      expect(result).toEqual(genres);
    });
  });
});