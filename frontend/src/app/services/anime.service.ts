import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Anime,
  SearchFilters,
  SearchResponse,
  AnimeDetailResponse,
  GenresResponse,
  RecommendationsResponse
} from '../types/api.types';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  search(filters: SearchFilters): Observable<SearchResponse> {
    const params = this.buildSearchParams(filters);
    return this.http.get<SearchResponse>(`${this.baseUrl}/anime/search`, { params });
  }

  getAnimeById(id: number): Observable<AnimeDetailResponse> {
    return this.http.get<AnimeDetailResponse>(`${this.baseUrl}/anime/${id}`);
  }

  getGenres(): Observable<GenresResponse> {
    return this.http.get<GenresResponse>(`${this.baseUrl}/anime/genres`);
  }

  getRecommendations(id: number): Observable<RecommendationsResponse> {
    return this.http.get<RecommendationsResponse>(
      `${this.baseUrl}/anime/${id}/recommendations`
    );
  }

  private buildSearchParams(filters: SearchFilters): HttpParams {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          params = params.set(key, value.join(','));
        } else {
          params = params.set(key, String(value));
        }
      }
    });

    return params;
  }
}
