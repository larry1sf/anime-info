import { API_URL } from "@/const";
import type { Anime, tResAnimeFull } from "@/types/api";


interface FetchOptions {
  retries?: number;
  delay?: number;
}

/**
 * Función para hacer fetch con reintentos automáticos
 * Maneja errores 429 (rate limit) y errores de red
 */
export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { retries = 5, delay = 300 } = options;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url);

      // Si recibimos rate limit (429) y aún tenemos reintentos, esperamos y reintentamos
      if (response.status === 429 && attempt < retries) {
        console.log(`Rate limit alcanzado, reintentando en ${delay}ms (intento ${attempt}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Si la respuesta es exitosa o es el último intento, retornamos
      if (response.ok || attempt === retries) {
        return response;
      }

      // Para otros errores, reintentamos
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      // Error de red, reintentamos si quedan intentos
      if (attempt < retries) {
        console.log(`Error de red, reintentando en ${delay}ms (intento ${attempt}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }

  // Si todos los reintentos fallaron, retornamos error
  return new Response(null, { status: 500, statusText: "Todos los reintentos fallaron" });
}

/**
 * Obtiene lista de animes
 * @param limit - Cantidad de animes a obtener (por defecto 12)
 */
export async function fetchAnime(limit: number = 12): Promise<tResAnimeFull> {
  const response = await fetchWithRetry(`${API_URL}/anime?limit=${limit}`);
  if (response.ok) {
    return await response.json();
  }
  // Retornar datos vacíos en caso de error
  return { data: [], pagination: { last_visible_page: 1, has_next_page: false, current_page: 1, items: { count: 0, total: 0, per_page: limit } } };
}

/**
 * Obtiene lista de animes top/populares
 * @param limit - Cantidad de animes a obtener (por defecto 12)
 */
export async function fetchTopAnime(limit: number = 12): Promise<tResAnimeFull> {
  const response = await fetchWithRetry(`${API_URL}/top/anime?limit=${limit}`);
  if (response.ok) {
    return await response.json();
  }
  return { data: [], pagination: { last_visible_page: 1, has_next_page: false, current_page: 1, items: { count: 0, total: 0, per_page: limit } } };
}

/**
 * Obtiene recomendaciones de animes
 * @param limit - Cantidad de recomendaciones a obtener (por defecto 12)
 */
export async function fetchRecommendations(limit: number = 12): Promise<{ data: any[] }> {
  const response = await fetchWithRetry(`${API_URL}/recommendations/anime?limit=${limit}`);
  if (response.ok) {
    return await response.json();
  }
  return { data: [] };
}

// Tipos para los episodios
interface WatchEpisodesData {
  data: {
    entry: {
      mal_id: number;
      title: string;
      images: { webp: { image_url: string } };
    };
    episodes: Array<{
      mal_id: number;
      title: string;
      premium: boolean;
    }>;
  }[];
}

/**
 * Obtiene episodios recientes
 */
export async function fetchRecentEpisodes(): Promise<WatchEpisodesData> {
  try {
    const response = await fetchWithRetry(`${API_URL}/watch/episodes`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error("Error al obtener episodios recientes:", e);
  }
  return { data: [] };
}

/**
 * Obtiene episodios populares
 */
export async function fetchPopularEpisodes(): Promise<WatchEpisodesData> {
  try {
    const response = await fetchWithRetry(`${API_URL}/watch/episodes/popular`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error("Error al obtener episodios populares:", e);
  }
  return { data: [] };
}

/**
 * Obtiene el anime por id
 */

export async function fetchAnimeById(id: number): Promise<{ data: Anime }> {
  const response = await fetchWithRetry(`${API_URL}/anime/${id}`);
  if (response.ok) {
    return await response.json();
  }
  // Retornar datos vacíos en caso de error
  return {
    "data": {
      "mal_id": 0,
      "url": "string",
      "images": {
        "jpg": {
          "image_url": "string",
          "small_image_url": "string",
          "large_image_url": "string"
        },
        "webp": {
          "image_url": "string",
          "small_image_url": "string",
          "large_image_url": "string"
        }
      },
      "trailer": {
        "youtube_id": "string",
        "url": "string",
        "embed_url": "string"
      },
      "approved": true,
      "titles": [
        {
          "type": "string",
          "title": "string"
        }
      ],
      "title": "string",
      "title_english": "string",
      "title_japanese": "string",
      "title_synonyms": [
        "string"
      ],
      "type": "TV",
      "source": "string",
      "episodes": 0,
      "status": "Finished Airing",
      "airing": true,
      "aired": {
        "from": "string",
        "to": "string",
        "prop": {
          "from": {
            "day": 0,
            "month": 0,
            "year": 0
          },
          "to": {
            "day": 0,
            "month": 0,
            "year": 0
          },
          "string": "string"
        }
      },
      "duration": "string",
      "rating": "G - All Ages",
      "score": 0.1,
      "scored_by": 0,
      "rank": 0,
      "popularity": 0,
      "members": 0,
      "favorites": 0,
      "synopsis": "string",
      "background": "string",
      "season": "summer",
      "year": 0,
      "broadcast": {
        "day": "string",
        "time": "string",
        "timezone": "string",
        "string": "string"
      },
      "producers": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "licensors": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "studios": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "genres": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "explicit_genres": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "themes": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ],
      "demographics": [
        {
          "mal_id": 0,
          "type": "string",
          "name": "string",
          "url": "string"
        }
      ]
    }
  };
}