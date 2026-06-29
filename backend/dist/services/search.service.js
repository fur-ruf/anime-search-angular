"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const fuse_config_1 = require("../config/fuse.config");
const transliteration_1 = require("transliteration");
class SearchService {
    constructor(jikanService) {
        this.jikanService = jikanService;
        this.logger = console;
    }
    async smartSearch(filters) {
        const startTime = Date.now();
        const { q, genres = [], minScore, maxScore, minYear, maxYear, status, type, sortBy = "score", sortOrder = "desc", limit = 20, offset = 0, minEpisodes, maxEpisodes, } = filters;
        let searchQuery = q;
        if (q && /[а-яё]/i.test(q)) {
            searchQuery = (0, transliteration_1.transliterate)(q);
            this.logger.info(`Транслитерация: "${q}" → "${searchQuery}"`);
        }
        this.logger.info(`Умный поиск: "${searchQuery || "все"}" с фильтрами`, filters);
        const API_MAX_LIMIT = 25;
        let results = await this.jikanService.searchAnime({
            q: searchQuery || undefined,
            limit: API_MAX_LIMIT,
            order_by: sortBy === "popularity" ? "score" : sortBy,
            min_score: minScore || undefined,
        });
        if (searchQuery && searchQuery.length >= 2) {
            results = this.applyFuzzySearch(results, searchQuery);
        }
        results = this.applyFilters(results, {
            genres,
            minScore,
            maxScore,
            minYear,
            maxYear,
            status,
            type,
            minEpisodes,
            maxEpisodes,
        });
        results = this.sortResults(results, sortBy, sortOrder);
        const suggestions = this.generateSuggestions(results, searchQuery);
        const total = results.length;
        const paginated = results.slice(offset, offset + limit);
        const executionTime = Date.now() - startTime;
        this.logger.info(`Найдено ${total} результатов за ${executionTime}мс`);
        return {
            results: paginated,
            total,
            suggestions,
            filters,
            executionTime,
        };
    }
    applyFuzzySearch(data, query) {
        if (data.length === 0)
            return [];
        const fuse = (0, fuse_config_1.createAnimeFuse)(data);
        const result = fuse.search(query, { limit: 50 });
        this.logger.info(`Нечеткий поиск: найдено ${result.length} совпадений`);
        return result.map((item) => item.item);
    }
    applyFilters(data, filters) {
        let filtered = data;
        this.logger.info(`Начало фильтрации: ${data.length} элементов`);
        if (filters.genres && filters.genres.length > 0) {
            const before = filtered.length;
            filtered = filtered.filter((anime) => {
                const animeGenres = anime.genres.map((g) => g.name.toLowerCase());
                return filters.genres.some((genre) => animeGenres.includes(genre.toLowerCase()));
            });
            this.logger.info(`После фильтра жанров: ${filtered.length} элементов (было ${before})`);
        }
        if (filters.minScore !== undefined && filters.minScore !== null) {
            const before = filtered.length;
            filtered = filtered.filter((a) => {
                const score = a.score;
                if (score === undefined ||
                    score === null ||
                    typeof score !== "number" ||
                    isNaN(score)) {
                    return false;
                }
                return score >= filters.minScore;
            });
            this.logger.info(`После фильтра по minScore (${filters.minScore}): ${filtered.length} элементов (было ${before})`);
        }
        if (filters.maxScore !== undefined && filters.maxScore !== null) {
            const before = filtered.length;
            filtered = filtered.filter((a) => {
                const score = a.score;
                if (score === undefined ||
                    score === null ||
                    typeof score !== "number" ||
                    isNaN(score)) {
                    return false;
                }
                return score <= filters.maxScore;
            });
            this.logger.info(`После фильтра по maxScore (${filters.maxScore}): ${filtered.length} элементов (было ${before})`);
        }
        if (filters.minYear) {
            const before = filtered.length;
            filtered = filtered.filter((a) => a.year && a.year >= filters.minYear);
            this.logger.info(`После фильтра по minYear (${filters.minYear}): ${filtered.length} элементов (было ${before})`);
        }
        if (filters.maxYear) {
            const before = filtered.length;
            filtered = filtered.filter((a) => a.year && a.year <= filters.maxYear);
            this.logger.info(`После фильтра по maxYear (${filters.maxYear}): ${filtered.length} элементов (было ${before})`);
        }
        if (filters.status) {
            const before = filtered.length;
            filtered = filtered.filter((a) => a.status === filters.status);
            this.logger.info(`После фильтра по status (${filters.status}): ${filtered.length} элементов (было ${before})`);
        }
        if (filters.type) {
            const before = filtered.length;
            filtered = filtered.filter((a) => a.type === filters.type);
            this.logger.info(`После фильтра по type (${filters.type}): ${filtered.length} элементов (было ${before})`);
        }
        if (filters.minEpisodes) {
            const before = filtered.length;
            filtered = filtered.filter((a) => a.episodes >= filters.minEpisodes);
            this.logger.info(`После фильтра по minEpisodes (${filters.minEpisodes}): ${filtered.length} элементов (было ${before})`);
        }
        if (filters.maxEpisodes) {
            const before = filtered.length;
            filtered = filtered.filter((a) => a.episodes <= filters.maxEpisodes);
            this.logger.info(`После фильтра по maxEpisodes (${filters.maxEpisodes}): ${filtered.length} элементов (было ${before})`);
        }
        this.logger.info(`Итог фильтрации: ${filtered.length} из ${data.length} элементов`);
        return filtered;
    }
    sortResults(data, sortBy, sortOrder) {
        const sorted = [...data];
        switch (sortBy) {
            case "score":
                sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
                break;
            case "popularity":
                sorted.sort((a, b) => (a.popularity || 999999) - (b.popularity || 999999));
                break;
            case "rank":
                sorted.sort((a, b) => (a.rank || 999999) - (b.rank || 999999));
                break;
            case "year":
                sorted.sort((a, b) => (b.year || 0) - (a.year || 0));
                break;
            case "title":
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "members":
                sorted.sort((a, b) => (b.members || 0) - (a.members || 0));
                break;
            case "favorites":
                sorted.sort((a, b) => (b.favorites || 0) - (a.favorites || 0));
                break;
            default:
                sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
        }
        if (sortOrder === "asc") {
            sorted.reverse();
        }
        return sorted;
    }
    generateSuggestions(results, query) {
        if (!query || query.length < 2)
            return [];
        const titles = results.map((a) => a.title);
        const unique = [...new Set(titles)];
        return unique.slice(0, 5);
    }
    async getAnimeById(id) {
        return this.jikanService.getAnimeById(id);
    }
    async getGenres() {
        return this.jikanService.getGenres();
    }
    async getRecommendations(id) {
        const startTime = Date.now();
        this.logger.info(`Запрос рекомендаций для аниме #${id}`);
        try {
            const recommendations = await this.jikanService.getRecommendations(id);
            const executionTime = Date.now() - startTime;
            this.logger.info(`Найдено ${recommendations.length} рекомендаций за ${executionTime}мс`);
            return recommendations;
        }
        catch (error) {
            this.logger.error(`Ошибка получения рекомендаций для #${id}:`, error);
            return [];
        }
    }
}
exports.SearchService = SearchService;
//# sourceMappingURL=search.service.js.map