import { Routes } from '@angular/router';
import { AnimeDetailComponent } from './components/anime-detail/anime-detail.component';

export const routes: Routes = [
  { path: 'anime/:id', component: AnimeDetailComponent }
];
