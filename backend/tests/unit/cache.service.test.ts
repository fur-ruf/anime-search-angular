import { CacheService } from '../../src/services/cache.service';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService(1000); 
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      const key = 'test-key';
      const value = { name: 'Test' };

      cache.set(key, value);
      const result = cache.get<typeof value>(key);

      expect(result).toEqual(value);
    });

    it('should return null for non-existent key', () => {
      const result = cache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return null for expired data', (done) => {
      const key = 'expiring-key';
      cache.set(key, 'data');

      setTimeout(() => {
        const result = cache.get(key);
        expect(result).toBeNull();
        done();
      }, 1100);
    });
  });

  describe('has and delete', () => {
    it('should check if key exists', () => {
      const key = 'test-key';
      cache.set(key, 'data');

      expect(cache.has(key)).toBe(true);
      expect(cache.has('non-existent')).toBe(false);
    });

    it('should delete a key', () => {
      const key = 'test-key';
      cache.set(key, 'data');
      cache.delete(key);

      expect(cache.has(key)).toBe(false);
    });
  });

  describe('clear and stats', () => {
    it('should clear all data', () => {
      cache.set('key1', 'data1');
      cache.set('key2', 'data2');

      cache.clear();

      expect(cache.getStats().size).toBe(0);
    });

    it('should return correct stats', () => {
      cache.set('key1', 'data1');
      cache.set('key2', 'data2');

      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });
  });
});