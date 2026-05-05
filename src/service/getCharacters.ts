import { API_URL, LIMIT_ANIME } from "@/const";
import type {
  Character,
  CharacterListResponse,
  // PaginationParse,
} from "@/types/character";
import { fetchAPI } from "@/service/index";

const resDefault = {
  data: null,
  error: {
    message: "No hubo ningun error",
    status: 200,
  },
};

export async function getAnimeCharacters(
  id: number,
  section: string = "anime",
) {
  const url = `${API_URL}/${section}/${id}/characters`;

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

export async function getCharacters(params?: {
  page?: number;
  q?: string;
  order_by?: string;
  sort?: string;
  letter?: string;
  limit?: number;
}) {
  const {
    page = 1,
    q = "",
    order_by = "mal_id",
    sort = "desc",
    letter = "",
    limit = LIMIT_ANIME,
  } = params || {};

  let url = `${API_URL}/characters?page=${page}&limit=${limit}&order_by=${order_by}&sort=${sort}`;

  if (q) url += `&q=${encodeURIComponent(q)}`;
  if (letter) url += `&letter=${letter}`;

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

    const json = (await res.json()) as CharacterListResponse;
    if (json && json.data) {
      const pagination = {
        hasNextPage: json.pagination.has_next_page,
        currentPage: json.pagination.current_page,
        totalPages: Math.ceil(
          json.pagination.items.total / json.pagination.items.per_page,
        ),
      };

      return {
        data: json.data,
        pagination,
        error: { message: "No hubo ningun error", status: 200 },
      };
    }
    console.log(json);

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

export async function getCharacterAnime(id: number) {
  const url = `${API_URL}/characters/${id}/anime`;

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
      data: Character["anime"];
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

export async function getCharacterManga(id: number) {
  const url = `${API_URL}/characters/${id}/manga`;

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
      data: Character["manga"];
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
