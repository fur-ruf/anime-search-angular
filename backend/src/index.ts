import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { JikanService } from './services/jikan.service';

dotenv.config(); // подгрузка переменных окружения из энвов

const app = express();
const PORT = process.env.PORT || 3000;
const jikanService = new JikanService();

app.use(cors());
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
      '/health',
      '/api/anime/search?q=Naruto',
      '/api/anime/genres',
      '/api/anime/:id'
    ]
  });
});

app.get('/api/test/search', async (req, res) => {
  try {
    const query = req.query.q as string || 'Naruto';
    const limit = parseInt(req.query.limit as string) || 5;
    
    const results = await jikanService.searchAnime({ q: query, limit });
    
    res.json({
      success: true,
      count: results.length,
      data: results.map(a => ({
        id: a.mal_id,
        title: a.title,
        title_english: a.title_english,
        type: a.type,
        episodes: a.episodes,
        status: a.status,
        score: a.score,
        rank: a.rank,
        popularity: a.popularity,
        year: a.year,
        genres: a.genres.map(g => g.name).slice(0, 3)
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch anime' 
    });
  }
});

app.get('/api/test/anime/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const anime = await jikanService.getAnimeById(id);
    
    res.json({
      success: true,
      data: {
        id: anime.mal_id,
        title: anime.title,
        title_english: anime.title_english,
        synopsis: anime.synopsis?.slice(0, 300) + '...',
        genres: anime.genres.map(g => g.name),
        score: anime.score,
        year: anime.year,
        status: anime.status,
        episodes: anime.episodes
      }
    });
  } catch (error) {
    res.status(404).json({ 
      success: false, 
      error: 'Anime not found' 
    });
  }
});

app.get('/api/test/genres', async (req, res) => {
  try {
    const genres = await jikanService.getGenres();
    res.json({ 
      success: true, 
      count: genres.length, 
      data: genres 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch genres' 
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
  console.error('Ошибка сервера:', err);
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
