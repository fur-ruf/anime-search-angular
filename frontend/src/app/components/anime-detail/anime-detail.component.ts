import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AnimeService } from '../../services/anime.service';
import { Anime } from '../../types/api.types';

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './anime-detail.component.html',
  styleUrls: ['./anime-detail.component.css']
})
export class AnimeDetailComponent implements OnInit, OnDestroy {
  anime: Anime | null = null;
  recommendations: Anime[] = [];
  loading = true;
  error = '';
  private routeSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animeService: AnimeService
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadAnimeDetails(parseInt(id));
      }
    });
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  goToAnime(id: number) {
    this.router.navigate(['/anime', id]);
  }

  loadAnimeDetails(id: number) {
    this.loading = true;
    this.error = '';
    this.anime = null;
    this.recommendations = [];

    this.animeService.getAnimeById(id).subscribe({
      next: (response) => {
        this.anime = response.data;
        this.loading = false;
        this.loadRecommendations(id);
        window.scrollTo(0, 0);
      },
      error: (err) => {
        this.error = 'Ошибка загрузки: ' + (err.message || 'Неизвестная ошибка');
        this.loading = false;
      }
    });
  }

  loadRecommendations(id: number) {
    this.animeService.getRecommendations(id).subscribe({
      next: (response) => {
        this.recommendations = response.data;
      },
      error: () => {
        console.error('Не удалось загрузить рекомендации');
      }
    });
  }
}
