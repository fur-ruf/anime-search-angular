"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const jikan_service_1 = require("./services/jikan.service");
const search_service_1 = require("./services/search.service");
dotenv_1.default.config(); // подгрузка переменных окружения из энвов
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const jikanService = new jikan_service_1.JikanService();
const searchService = new search_service_1.SearchService(jikanService);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
app.get('/api', (req, res) => {
    res.json({
        message: 'Anime Smart Search API',
        version: '1.0.0',
        endpoints: [
            'GET  /health',
            'GET  /api',
            'GET  /api/anime/search?q=Naruto&minScore=8',
            'GET  /api/anime/genres',
            'GET  /api/anime/:id',
            'GET  /api/anime/:id/recommendations',
            'GET  /api/test/cache-stats',
            'DELETE /api/test/cache'
        ]
    });
});
app.get('/api/anime/search', async (req, res) => {
    try {
        const filters = {
            q: req.query.q,
            genres: req.query.genres ? req.query.genres.split(',') : undefined,
            minScore: req.query.minScore ? parseFloat(req.query.minScore) : undefined,
            maxScore: req.query.maxScore ? parseFloat(req.query.maxScore) : undefined,
            minYear: req.query.minYear ? parseInt(req.query.minYear) : undefined,
            maxYear: req.query.maxYear ? parseInt(req.query.maxYear) : undefined,
            status: req.query.status,
            type: req.query.type,
            sortBy: req.query.sortBy || 'score',
            sortOrder: req.query.sortOrder || 'desc',
            limit: req.query.limit ? parseInt(req.query.limit) : 20,
            offset: req.query.offset ? parseInt(req.query.offset) : 0,
            minEpisodes: req.query.minEpisodes ? parseInt(req.query.minEpisodes) : undefined,
            maxEpisodes: req.query.maxEpisodes ? parseInt(req.query.maxEpisodes) : undefined
        };
        const result = await searchService.smartSearch(filters);
        res.json({
            success: true,
            data: result.results,
            total: result.total,
            suggestions: result.suggestions,
            filters: result.filters,
            executionTime: result.executionTime
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Internal Server Error'
        });
    }
});
app.get('/api/anime/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const anime = await searchService.getAnimeById(id);
        res.json({
            success: true,
            data: anime
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error: 'Anime not found'
        });
    }
});
app.get('/api/anime/genres', async (req, res) => {
    try {
        const genres = await searchService.getGenres();
        res.json({
            success: true,
            data: genres
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch genres'
        });
    }
});
app.get('/api/anime/:id/recommendations', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const recommendations = await searchService.getRecommendations(id);
        res.json({
            success: true,
            data: recommendations
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            error: 'Recommendations not found'
        });
    }
});
app.get('/api/test/cache-stats', (req, res) => {
    const stats = jikanService.getCacheStats();
    res.json({
        success: true,
        stats
    });
});
app.delete('/api/test/cache', (req, res) => {
    jikanService.clearCache();
    res.json({
        success: true,
        message: 'Cache cleared successfully'
    });
});
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});
app.use((err, req, res, next) => {
    console.error(`Ошибка сервера: ${err.message}`, err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error'
    });
});
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`API: http://localhost:${PORT}/api`);
});
exports.default = app;
//# sourceMappingURL=index.js.map