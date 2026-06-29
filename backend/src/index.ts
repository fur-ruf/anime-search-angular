import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { JikanService } from './services/jikan.service';
import { SearchService } from './services/search.service';
import { SearchFilters } from './models';

dotenv.config(); // подгрузка переменных окружения из энвов

const app = express();
const PORT = process.env.PORT || 3000;
const jikanService = new JikanService();
const searchService = new SearchService(jikanService);

app.use(cors({
  origin: ['http://localhost:4200', 'https://anime-smart-search.netlify.app'],
  credentials: true
}));
app.use(express.json());

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
    const filters: SearchFilters = {
      q: req.query.q as string,
      genres: req.query.genres ? (req.query.genres as string).split(',') : undefined,
      minScore: req.query.minScore ? parseFloat(req.query.minScore as string) : undefined,
      maxScore: req.query.maxScore ? parseFloat(req.query.maxScore as string) : undefined,
      minYear: req.query.minYear ? parseInt(req.query.minYear as string) : undefined,
      maxYear: req.query.maxYear ? parseInt(req.query.maxYear as string) : undefined,
      status: req.query.status as any,
      type: req.query.type as any,
      sortBy: (req.query.sortBy as any) || 'score',
      sortOrder: (req.query.sortOrder as any) || 'desc',
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      minEpisodes: req.query.minEpisodes ? parseInt(req.query.minEpisodes as string) : undefined,
      maxEpisodes: req.query.maxEpisodes ? parseInt(req.query.maxEpisodes as string) : undefined
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error'
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch genres'
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
  } catch (error) {
    res.status(404).json({
      success: false,
      error: 'Anime not found'
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
  } catch (error) {
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

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

export default app;