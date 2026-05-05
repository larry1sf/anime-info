import { API_URL } from "@/const";
import { fetchAPI } from "@/service/index";

interface SearchResult {
  mal_id: number;
  title: string;
  images: { jpg: { image_url: string; small_image_url: string } };
  type: string;
  year: number | null;
}

interface SearchResponse {
  anime: SearchResult[];
  manga: SearchResult[];
}

export async function searchAnimeAndManga(
  query: string,
  limit: number = 6,
): Promise<SearchResponse> {
  const [animeRes, mangaRes] = await Promise.all([
    fetchAPI(`${API_URL}/anime?limit=${limit}&q=${encodeURIComponent(query)}`),
    fetchAPI(`${API_URL}/manga?limit=${limit}&q=${encodeURIComponent(query)}`),
  ]);

  const animeData = await animeRes.json();
  const mangaData = await mangaRes.json();

  const anime: SearchResult[] = (animeData.data || []).map(
    (r: SearchResult) => ({
      ...r,
      _type: "anime",
    }),
  );

  const manga: SearchResult[] = (mangaData.data || []).map(
    (r: SearchResult) => ({
      ...r,
      _type: "manga",
    }),
  );

  return { anime, manga };
}
