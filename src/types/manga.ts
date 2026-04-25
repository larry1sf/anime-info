import type { Prop, Image, Title } from "@/types/index";

export interface Manga {
    mal_id: number;
    url: string;
    images: { [key: string]: Image };
    approved: boolean;
    titles: Title[];
    title: string;
    title_english: string;
    title_japanese: string;
    type: string;
    chapters: number;
    volumes: number;
    status: string;
    publishing: boolean;
    published: Published;
    score: number;
    scored_by: number;
    rank: number;
    popularity: number;
    members: number;
    favorites: number;
    synopsis: string;
    background: string;
    authors: Author[];
    serializations: Author[];
    genres: Author[];
    explicit_genres: Author[];
    themes: Author[];
    demographics: Author[];
}

export interface Author {
    mal_id: number;
    type: string;
    name: string;
    url: string;
}

export interface Published {
    from: string;
    to: string;
    prop: Prop;
}

