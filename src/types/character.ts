import type { VoiceActor } from "@/types/index";

export interface CharacterImage {
  image_url: string;
  small_image_url: string;
  large_image_url?: string;
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

export interface FilterOption {
  slug: string;
  label: string;
}

export interface CharacterFull {
  mal_id: number;
  url: string;
  images: {
    jpg: CharacterImage;
    webp: CharacterImage;
  };
  age?: string;
  birthday?: string;
  name: string;
  name_kanji: string;
  nicknames: string[];
  favorites: number;
  about: string;
  anime: {
    role: string;
    anime: {
      mal_id: number;
      url: string;
      images: {
        jpg: CharacterImage & { large_image_url?: string };
        webp: CharacterImage & { large_image_url?: string };
      };
      title: string;
    };
  }[];
  manga: {
    role: string;
    manga: {
      mal_id: number;
      url: string;
      images: {
        jpg: CharacterImage & { large_image_url?: string };
        webp: CharacterImage & { large_image_url?: string };
      };
      title: string;
    };
  }[];
  voices: VoiceActor[];
}

export interface CharacterPicture {
  jpg: {
    image_url: string;
    large_image_url?: string;
  };
  webp: {
    image_url: string;
    large_image_url?: string;
  };
}
