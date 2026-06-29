import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimeService } from './services/anime.service';
import { SearchFilters } from './types/api.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  animeList: any[] = [];
  loading = false;
  error = '';

  constructor(private animeService: AnimeService) {}

  ngOnInit() {
    this.search('Naruto');
  }

  search(query: string) {
    if (!query || query.trim().length < 2) return;

    this.loading = true;
    this.error = '';
    this.animeList = [];

    const filters: SearchFilters = {
      q: query.trim(),
      limit: 12,
      sortBy: 'score'
    };

    this.animeService.search(filters).subscribe({
      next: (response: any) => {
        this.animeList = response.data;
        this.loading = false;
        console.log('Найдено:', response.total, 'аниме');
      },
      error: (err: any) => {
        this.error = 'Ошибка загрузки: ' + (err.message || 'Неизвестная ошибка');
        this.loading = false;
        console.error('Search error:', err);
      }
    });
  }

  goToDetail(id: number) {
    console.log('Переход к аниме #' + id);
  }
}
