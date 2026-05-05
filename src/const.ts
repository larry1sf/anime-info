export const API_URL = import.meta.env.API_URL || "sin api url";
export const KEY_LOCAL_STORAGE = "favorite-anime-info";
export const LIMIT_ANIME = 10;
export const OPTION_DISPATCH = {
  SET_DATA: "sdasd",
  SET_LOADING: "a",
  SET_IS_INITIAL: "2",
};

export const ratingsOptions = {
  anime: [
    { slug: "", label: "All" },
    { slug: "g", label: "General" },
    { slug: "pg", label: "Children" },
    { slug: "pg-13", label: "Teens" },
    { slug: "r", label: "Mature" },
    { slug: "r+", label: "Adults" },
    { slug: "rx", label: "Hentai" },
  ],
  manga: [],
};

export const typesOptions = {
  anime: [
    { slug: "", label: "All" },
    { slug: "tv", label: "TV" },
    { slug: "movie", label: "Movie" },
    { slug: "ova", label: "OVA" },
    { slug: "special", label: "Special" },
    { slug: "ona", label: "ONA" },
    { slug: "music", label: "Music" },
    { slug: "tv_special", label: "TV Special" },
  ],
  manga: [
    { slug: "", label: "All" },
    { slug: "manga", label: "Manga" },
    { slug: "novel", label: "Novel" },
    { slug: "lightnovel", label: "Light Novel" },
    { slug: "oneshot", label: "One Shot" },
    { slug: "doujin", label: "Doujin" },
    { slug: "manhwa", label: "Manhwa" },
    { slug: "manhua", label: "Manhua" },
  ],
};

export const statusOptions = {
  anime: [
    { slug: "", label: "All" },
    { slug: "airing", label: "Airing" },
    { slug: "complete", label: "Complete" },
    { slug: "upcoming", label: "Upcoming" },
  ],
  manga: [
    { slug: "", label: "All" },
    { slug: "publishing", label: "Publishing" },
    { slug: "complete", label: "Complete" },
    { slug: "hiatus", label: "Hiatus" },
    { slug: "discontinued", label: "Discontinued" },
    { slug: "upcoming", label: "Upcoming" },
  ],
};

export const yearOptions = {
  anime: [
    { slug: "", label: "All Years" },
    { slug: "2025", label: "2025" },
    { slug: "2024", label: "2024" },
    { slug: "2023", label: "2023" },
    { slug: "2022", label: "2022" },
    { slug: "2021", label: "2021" },
    { slug: "2020", label: "2020" },
    { slug: "2010s", label: "2010s" },
    { slug: "2000s", label: "2000s" },
    { slug: "1990s", label: "1990s" },
  ],
  manga: [
    { slug: "", label: "All Years" },
    { slug: "2025", label: "2025" },
    { slug: "2024", label: "2024" },
    { slug: "2023", label: "2023" },
    { slug: "2022", label: "2022" },
    { slug: "2021", label: "2021" },
    { slug: "2020", label: "2020" },
    { slug: "2010s", label: "2010s" },
    { slug: "2000s", label: "2000s" },
    { slug: "1990s", label: "1990s" },
  ],
};

export const sourceOptions = {
  anime: [
    { slug: "", label: "All Sources" },
    { slug: "manga", label: "Manga" },
    { slug: "light_novel", label: "Light Novel" },
    { slug: "visual_novel", label: "Visual Novel" },
    { slug: "original", label: "Original" },
    { slug: "novel", label: "Novel" },
    { slug: "web_novel", label: "Web Novel" },
    { slug: "game", label: "Game" },
    { slug: "picture_book", label: "Picture Book" },
  ],
  manga: [
    { slug: "", label: "All Sources" },
    { slug: "manga", label: "Manga" },
    { slug: "light_novel", label: "Light Novel" },
    { slug: "novel", label: "Novel" },
    { slug: "web_novel", label: "Web Novel" },
    { slug: "game", label: "Game" },
  ],
};

export const sortOptions = [
  { slug: "", label: "Default" },
  { slug: "desc", label: "Desc" },
  { slug: "asc", label: "Asc" },
];

export const orderByOptions = [
  { slug: "mal_id", label: "Default" },
  { slug: "title", label: "Title" },
  { slug: "score", label: "Score" },
  { slug: "popularity", label: "Popularity" },
  { slug: "members", label: "Members" },
  { slug: "start_date", label: "Start Date" },
  { slug: "end_date", label: "End Date" },
];

export const formatNumber = (num: number) => {
  if (!num) return "N/A";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return "Unknown";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
