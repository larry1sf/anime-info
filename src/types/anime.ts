import type { Prop, Image, Title, VoiceActor } from "@/types/index";
import type { CharacterImage } from "@/types/character";

export interface Anime {
  mal_id: number;
  url: string;
  images: { [key: string]: Image };
  trailer: Trailer;
  approved: boolean;
  titles: Title[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  broadcast: Broadcast;
  producers: Demographic[];
  licensors: Demographic[];
  studios: Demographic[];
  genres: Demographic[];
  explicit_genres: Demographic[];
  themes: Demographic[];
  demographics: Demographic[];
  relations: AnimeRelation[];
  theme: Theme;
  external: External[];
  streaming: External[];
}

export interface Aired {
  from: string;
  to: string;
  prop: Prop;
  string: string;
}

export interface Broadcast {
  day: string;
  time: string;
  timezone: string;
  string: string;
}

export interface Demographic {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Trailer {
  youtube_id: string;
  url: string;
  embed_url: string;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface RelationEntry {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface Theme {
  openings: string[];
  endings: string[];
}

export interface External {
  name: string;
  url: string;
}

export interface AnimeRelation {
  relation: string;
  entry: RelationEntry[];
}

export interface AnimeCharacterEntry {
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: CharacterImage;
      webp: CharacterImage;
    };
    name: string;
  };
  role: string;
  voice_actors: VoiceActor[];
}

export interface PaginationParse {
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

export interface Genre {
  mal_id: number;
  name: string;
  url: string;
  count: number;
}

export interface Producer {
  mal_id: number;
  url: string;
  titles: Title[];
  images: {
    jpg: {
      image_url: string;
    };
    webp?: {
      image_url: string;
      small_image_url?: string;
    };
  };
  favorites: number;
  count: number;
  established: string;
  about: string;
  external: {
    name: string;
    url: string;
  }[];
}
