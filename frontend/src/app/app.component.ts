import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AnimeService } from './services/anime.service';
import { SearchFilters } from './types/api.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  animeList: any[] = [];
  loading = false;
  error = '';

  constructor(
    private animeService: AnimeService,
    private router: Router
  ) {}

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
      },
      error: (err: any) => {
        this.error = 'Ошибка загрузки: ' + (err.message || 'Неизвестная ошибка');
        this.loading = false;
      }
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  isDetailPage(): boolean {
    return this.router.url.includes('/anime/');
  }
}
