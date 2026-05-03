import { API_URL, LIMIT_ANIME } from "@/const";
import type { Image, SectionsAnime } from "@/types";

const resDefault = {
  data: null,
  error: {
    message: "No hubo ningun error",
    status: 200,
  },
};

const fetchAPI = (url: string) => {
  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    },
  });
};

interface ErrorApi {
  status: number;
  type: string;
  message: string;
  error: string;
}

export async function getAnimeCharacters(
  id: number,
  section: string = "anime",
) {
  const url = `${API_URL}/${section}/${id}/characters`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error al recibir los datos de la api en la url: ${url}`,
          status: res.status,
        },
      };
    }
    const json = (await res.json()) as {
      data: import("@/types/anime").AnimeCharacterEntry[];
    };
    if (json && json.data) {
      return {
        data: json.data,
        error: { message: "No hubo ningun error", status: 200 },
      };
    }
    return {
      ...resDefault,
      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch {
    return {
      ...resDefault,
      error: {
        message: `Error al querer solicitar datos a la url: ${url}`,
        status: 500,
      },
    };
  }
}

export async function getCharacterFullById(id: number) {
  const url = `${API_URL}/characters/${id}/full`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error al recibir los datos de la api en la url: ${url}`,
          status: res.status,
        },
      };
    }
    const json = (await res.json()) as {
      data: import("@/types/anime").CharacterFull;
    };
    if (json && json.data) {
      return {
        data: json.data,
        error: { message: "No hubo ningun error", status: 200 },
      };
    }
    return {
      ...resDefault,
      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch {
    return {
      ...resDefault,
      error: {
        message: `Error al querer solicitar datos a la url: ${url}`,
        status: 500,
      },
    };
  }
}

export async function getCharacterPicturesById(id: number) {
  const url = `${API_URL}/characters/${id}/pictures`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error al recibir los datos de la api en la url: ${url}`,
          status: res.status,
        },
      };
    }
    const json = (await res.json()) as {
      data: import("@/types/anime").CharacterPicture[];
    };
    if (json && json.data) {
      return {
        data: json.data,
        error: { message: "No hubo ningun error", status: 200 },
      };
    }
    return {
      ...resDefault,
      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch {
    return {
      ...resDefault,
      error: {
        message: `Error al querer solicitar datos a la url: ${url}`,
        status: 500,
      },
    };
  }
}

export async function getGenres(section: string) {
  const url = `${API_URL}/genres/${section}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error al recibir los datos de la api en la url: ${url}`,
          status: res.status,
        },
      };
    }
    const json = (await res.json()) as {
      data: import("@/types/anime").Genre[];
    };
    if (json && json.data) {
      return {
        data: json.data,
        error: { message: "No hubo ningun error", status: 200 },
      };
    }
    return {
      ...resDefault,
      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch {
    return {
      ...resDefault,
      error: {
        message: `Error al querer solicitar datos a la url: ${url}`,
        status: 500,
      },
    };
  }
}

export async function getProducerById(id: number) {
  const url = `${API_URL}/producers/${id}/full`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error al recibir los datos de la api en la url: ${url}`,
          status: res.status,
        },
      };
    }
    const json = (await res.json()) as {
      data: import("@/types/anime").Producer;
    };
    if (json && json.data) {
      return {
        data: json.data,
        error: { message: "No hubo ningun error", status: 200 },
      };
    }
    return {
      ...resDefault,
      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch {
    return {
      ...resDefault,
      error: {
        message: `Error al querer solicitar datos a la url: ${url}`,
        status: 500,
      },
    };
  }
}

export async function getAnimesByProducer(id: number, page: number = 1) {
  const url = `${API_URL}/anime?page=${page}&producers=${id}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error al recibir los datos de la api en la url: ${url}`,
          status: res.status,
        },
      };
    }
    const json = (await res.json()) as {
      data: import("@/types/anime").Anime[];
      pagination: import("@/types/anime").Pagination;
    };
    if (json && json.data && json.pagination) {
      return {
        data: json.data,
        pagination: {
          hasNextPage: json.pagination.has_next_page,
          currentPage: json.pagination.current_page,
          totalPages: Math.ceil(
            json.pagination.items.total / json.pagination.items.per_page,
          ),
        },
        error: { message: "No hubo ningun error", status: 200 },
      };
    }
    return {
      ...resDefault,
      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch {
    return {
      ...resDefault,
      error: {
        message: `Error al querer solicitar datos a la url: ${url}`,
        status: 500,
      },
    };
  }
}

// nueva generacion
export async function getTopAnime() {
  const url = `${API_URL}/top/anime?limit=10`;
  try {
    const res = await fetchAPI(url);

    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error al recibir los datos de la api en la url: ${url}`,
          status: res.status,
        },
      };
    }

    const json = (await res.json()) as {
      data: import("@/types/anime").Anime[];
      pagination: import("@/types/anime").Pagination;
    };
    if (json) {
      return {
        data: json.data,
        error: { message: "No hubo ningun error", status: 200 },
      };
    }
    return {
      ...resDefault,
      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch {
    return {
      ...resDefault,
      error: {
        message: `Error al querer solicitar datos a la url: ${url}`,
        status: 500,
      },
    };
  }
}

export async function getWatchRecentEpisodes() {
  const url = `${API_URL}/watch/promos?limit=10`;
  try {
    const res = await fetchAPI(url);

    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error al recibir los datos de la api en la url: ${url}`,
          status: res.status,
        },
      };
    }
    const json = (await res.json()) as {
      data: {
        title: string;
        entry: {
          mal_id: number;
          images: { [key: string]: Image };
          title: string;
        };
        trailer: {
          youtube_id: number;
          title: string;
          url: string;
          images: { [key: string]: Image };
          embed_url: string;
        };
      }[];
    };

    if (!!json.data) {
      const resFormated = json.data.map((item) => ({
        title: item.title,
        entry: {
          images: item.entry.images,
          title: item.entry.title,
          id: item.entry.mal_id,
        },
        episodes: {
          youtubeId: item.trailer.youtube_id,
          url: item.trailer.url,
          images: item.trailer.images,
          embedUrl: item.trailer.embed_url,
        },
      }));
      return {
        data: resFormated,
        error: { message: "No hubo ningun error", status: 200 },
      };
    }

    return {
      ...resDefault,
      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch {
    return {
      ...resDefault,
      error: {
        message: `Error al querer solicitar datos a la url: ${url}`,
        status: 500,
      },
    };
  }
}

export async function getAnime({
  limit = LIMIT_ANIME,
  page = 1,
  query,
  rating,
  type,
  status,
  sectionSearch = "anime",
}: {
  limit?: number;
  page?: number;
  query?: string;
  rating?: string;
  type?: string;
  status?: string;
  sectionSearch?: SectionsAnime;
} = {}) {
  let url = `${API_URL}/${sectionSearch}?limit=${limit}&page=${page}`;
  if (query) url += `&q=${query}`;
  if (rating) url += `&rating=${rating}`;
  if (type) url += `&type=${type}`;
  if (status) url += `&status=${status}`;

  try {
    const res = await fetchAPI(url);
    if (!res.ok) {
      return {
        ...resDefault,
        pagination: null,
        error: {
          message: `Error al recibir los datos de la api en la url: ${res.url}`,
          status: res.status,
        },
      };
    }

    const { data, pagination } = (await res.json()) as {
      data: import("@/types/anime").Anime[];
      pagination: import("@/types/anime").Pagination;
    };

    if (data && pagination) {
      const {
        has_next_page,
        current_page,
        items: { per_page, total },
      } = pagination;

      return {
        ...resDefault,
        data,
        pagination: {
          hasNextPage: has_next_page,
          currentPage: current_page,
          totalPages: Math.ceil(total / per_page),
        },
      };
    }
    return {
      ...resDefault,
      pagination: null,
      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch (error) {
    return {
      ...resDefault,
      pagination: null,
      error: {
        message: `Error al querer solicitar datos a la url: ${url}`,
        status: 500,
      },
    };
  }
}

export async function getAnimeById(id: number, section: string = "anime") {
  const url = `${API_URL}/${section}/${id}/full`;
  try {
    const data = await fetchAPI(url);
    if (!data.ok) {
      const { status, message } = (await data.json()) as ErrorApi;
      return {
        data: null,
        error: {
          message,
          status,
        },
      };
    }
    const { data: result } = (await data.json()) as {
      data: import("@/types/anime").Anime;
    };
    if (result) {
      return {
        data: result,
        error: {
          message: "No hubo ningun error",
          status: 200,
        },
      };
    }
    return {
      ...resDefault,

      error: {
        message: `No se recibieron datos de la api en la url: ${url}`,
        status: 404,
      },
    };
  } catch (error) {
    return {
      data: null,
      error: {
        message: "Error al pedir los datos del anime por id a la api",
        status: 500,
      },
    };
  }
}
