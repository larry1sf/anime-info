export type SectionsAnime = "anime" | "manga"
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