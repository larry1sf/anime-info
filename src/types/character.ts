export interface CharacterImage {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface VoiceActorPerson {
  mal_id: number;
  url: string;
  images: { jpg: { image_url: string } };
  name: string;
}

export interface VoiceActor {
  person: VoiceActorPerson;
  language: string;
}

export interface CharacterAnime {
  role: string;
  anime: {
    mal_id: number;
    url: string;
    images: {
      jpg: CharacterImage;
      webp: CharacterImage;
    };
    title: string;
    title_english?: string;
    title_japanese?: string;
    type: string;
    episodes?: number;
    status?: string;
    aired?: {
      from: string;
      to: string;
      string: string;
    };
    score?: number;
    members?: number;
  };
}

export interface CharacterManga {
  role: string;
  manga: {
    mal_id: number;
    url: string;
    images: {
      jpg: CharacterImage;
      webp: CharacterImage;
    };
    title: string;
    title_english?: string;
    title_japanese?: string;
    type: string;
    chapters?: number;
    volumes?: number;
    status?: string;
    published?: {
      from: string;
      to: string;
      string: string;
    };
    score?: number;
    members?: number;
  };
}

export interface Character {
  mal_id: number;
  url: string;
  images: {
    jpg: CharacterImage;
    webp: CharacterImage;
  };
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
  birthday?: string;
  age?: string;
  anime?: CharacterAnime[];
  manga?: CharacterManga[];
}

export interface CharacterListResponse {
  data: Character[];
  pagination: {
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface PaginationParse {
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
}

export interface FilterOption {
  slug: string;
  label: string;
}
