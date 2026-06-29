"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JikanService = void 0;
const axios_1 = __importDefault(require("axios"));
const cache_service_1 = require("./cache.service");
const JIKAN_API = "https://api.jikan.moe/v4";
class JikanService {
    constructor() {
        this.cache = new cache_service_1.CacheService(5 * 60 * 1000);
        this.logger = console;
    }
    async searchAnime(params) {
        const cacheKey = `search:${JSON.stringify(params)}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            this.logger.info(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        try {
            this.logger.info(`Запрос к Jikan API: ${JSON.stringify(params)}`);
            const response = await axios_1.default.get(`${JIKAN_API}/anime`, { params });
            const data = response.data.data;
            this.cache.set(cacheKey, data);
            this.logger.info(`Jikan API вернул ${data.length} результатов`);
            return data;
        }
        catch (error) {
            this.logger.error(`Ошибка Jikan API:`, error);
            throw error;
        }
    }
    async getAnimeById(id) {
        const cacheKey = `detail:${id}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            this.logger.info(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        try {
            const response = await axios_1.default.get(`${JIKAN_API}/anime/${id}`);
            const anime = response.data.data;
            this.cache.set(cacheKey, anime);
            this.logger.info(`Получено аниме #${id}: ${anime.title}`);
            return anime;
        }
        catch (error) {
            this.logger.error(`Ошибка получения аниме #${id}:`, error);
            throw error;
        }
    }
    async getGenres() {
        const cacheKey = "genres:all";
        const cached = this.cache.get(cacheKey);
        if (cached) {
            return cached;
        }
        try {
            const response = await axios_1.default.get(`${JIKAN_API}/genres/anime`);
            const genres = response.data.data.map((g) => g.name);
            this.cache.set(cacheKey, genres);
            this.logger.info(`Получено ${genres.length} жанров`);
            return genres;
        }
        catch (error) {
            this.logger.error(`Ошибка получения жанров:`, error);
            throw error;
        }
    }
    async getRecommendations(id) {
        const cacheKey = `recommendations:${id}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            this.logger.info(`Cache HIT: ${cacheKey}`);
            return cached;
        }
        try {
            this.logger.info(`Запрос рекомендаций к Jikan API: /anime/${id}/recommendations`);
            const response = await axios_1.default.get(`${JIKAN_API}/anime/${id}/recommendations`);
            const recommendations = response.data.data
                .slice(0, 10)
                .map((rec) => rec.entry);
            this.cache.set(cacheKey, recommendations);
            this.logger.info(`Получено ${recommendations.length} рекомендаций для аниме #${id}`);
            return recommendations;
        }
        catch (error) {
            this.logger.error(`Ошибка получения рекомендаций для #${id}:`, error);
            return [];
        }
    }
    clearCache() {
        this.cache.clear();
        this.logger.info("Кэш очищен");
    }
    getCacheStats() {
        return this.cache.getStats();
    }
}
exports.JikanService = JikanService;
//# sourceMappingURL=jikan.service.js.map