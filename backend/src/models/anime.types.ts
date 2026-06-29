export interface Anime {
  mal_id: number;
  url?: string; 

  images: {
    jpg: {
      image_url: string;
      small_image_url?: string;
      large_image_url?: string;
    };
    webp?: {
      image_url: string;
      small_image_url?: string;
      large_image_url?: string;
    };
  };
  
  titles: Array<{
    type: string; 
    title: string;
  }>;
  title: string;
  title_english?: string; 
  title_japanese?: string;
  title_synonyms?: string[]; 
  
  type: 'TV' | 'Movie' | 'OVA' | 'Special' | 'ONA' | 'Music'; 
  episodes: number;
  status: 'Finished Airing' | 'Currently Airing' | 'Not yet aired'; 
  airing: boolean; 
  
  aired: {
    from?: string; 
    to?: string;
    prop?: {
      from: { day: number; month: number; year: number };
      to: { day: number; month: number; year: number };
    };
  };
  year?: number; 
  season?: 'winter' | 'spring' | 'summer' | 'fall'; 
  
  score: number; 
  scored_by: number; 
  rank: number; 
  popularity: number; 
  members: number;
  favorites: number; 

  synopsis?: string; 
  background?: string; 

  rating?: string;
  
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }>;
  explicit_genres: Array<{ mal_id: number; type: string; name: string; url: string }>;
  themes: Array<{ mal_id: number; type: string; name: string; url: string }>;
  demographics: Array<{ mal_id: number; type: string; name: string; url: string }>;

  producers: Array<{ mal_id: number; type: string; name: string; url: string }>;
  licensors: Array<{ mal_id: number; type: string; name: string; url: string }>;
  studios: Array<{ mal_id: number; type: string; name: string; url: string }>;
  
  duration: string; 
  broadcast?: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
  trailer?: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  approved?: boolean;
  source?: string; 
}