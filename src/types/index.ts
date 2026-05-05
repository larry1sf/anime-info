export type SectionsAnime = "anime" | "manga";

export interface Image {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface Prop {
  from: From;
  to: From;
  string: string;
}

export interface From {
  day: number;
  month: number;
  year: number;
}

export interface Title {
  type: string;
  title: string;
}

export interface PaginationParse {
  hasNextPage: boolean;
  currentPage: number;
  totalPages: number;
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
