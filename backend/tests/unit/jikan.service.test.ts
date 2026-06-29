import axios from 'axios';
import { JikanService } from '../../src/services/jikan.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('JikanService', () => {
  let service: JikanService;

  beforeEach(() => {
    service = new JikanService();
    jest.clearAllMocks();
  });

  describe('searchAnime', () => {
    it('should return anime list from API', async () => {
      const mockData = {
        data: [
          { mal_id: 1, title: 'Naruto', score: 8.5 },
          { mal_id: 2, title: 'Bleach', score: 8.0 }
        ]
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await service.searchAnime({ q: 'Naruto', limit: 5 });

      expect(result).toEqual(mockData.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.jikan.moe/v4/anime',
        { params: { q: 'Naruto', limit: 5 } }
      );
    });

    it('should return cached data on second call', async () => {
      const mockData = {
        data: [{ mal_id: 1, title: 'Naruto', score: 8.5 }]
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const first = await service.searchAnime({ q: 'Naruto' });
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);

      const second = await service.searchAnime({ q: 'Naruto' });
      expect(mockedAxios.get).toHaveBeenCalledTimes(1); 

      expect(first).toEqual(second);
    });

    it('should handle API errors', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.searchAnime({ q: 'Naruto' })).rejects.toThrow('API Error');
    });
  });

  describe('getAnimeById', () => {
    it('should return anime by ID', async () => {
      const mockData = { data: { mal_id: 1, title: 'Cowboy Bebop', score: 9.0 } };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await service.getAnimeById(1);

      expect(result).toEqual(mockData.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.jikan.moe/v4/anime/1'
      );
    });

    it('should return cached anime on second call', async () => {
      const mockData = { data: { mal_id: 1, title: 'Cowboy Bebop', score: 9.0 } };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const first = await service.getAnimeById(1);
      const second = await service.getAnimeById(1);

      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(first).toEqual(second);
    });
  });

  describe('getGenres', () => {
    it('should return list of genres', async () => {
      const mockData = {
        data: [
          { name: 'Action' },
          { name: 'Comedy' },
          { name: 'Drama' }
        ]
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await service.getGenres();

      expect(result).toEqual(['Action', 'Comedy', 'Drama']);
    });
  });
});