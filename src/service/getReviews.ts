import { API_URL } from "@/const";

const resDefault = {
  data: null,
  pagination: null,
  error: {
    message: "No hubo ningún error",
    status: 200,
  },
};

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

async function fetchWithRetry(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  };

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        ...fetchOptions,
        headers: {
          ...defaultHeaders,
          ...fetchOptions.headers,
        },
      });

      if (res.ok) {
        return res;
      }

      if (res.status === 429) {
        const waitTime = retryDelay * Math.pow(2, attempt) + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        lastError = new Error(`Rate limited (429). Retrying...`);
        continue;
      }

      return res;
    } catch (error) {
      lastError = error as Error;
      if (attempt < retries - 1) {
        const waitTime = retryDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error("Failed after retries");
}

export interface Review {
  mal_id: number;
  url: string;
  type: "anime" | "manga";
  reactions: {
    overall: number;
    nice: number;
    love_it: number;
    funny: number;
    confusing: number;
    informative: number;
    well_written: number;
    creative: number;
  };
  date: string;
  review: string;
  score: number;
  tags: string[];
  is_spoiler: boolean;
  is_preliminary: boolean;
  user: {
    username: string;
    url: string;
    images: {
      jpg: {
        image_url: string;
      };
      webp: {
        image_url: string;
      };
    };
  };
  entry: {
    mal_id: number;
    url: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
      webp: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    title: string;
  };
}

export interface ReviewsResponse {
  data: Review[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number | null;
  };
}

interface GetReviewsOptions {
  type: "anime" | "manga";
  page?: number;
  preliminary?: boolean;
  spoilers?: boolean;
}

export async function getReviews({
  type,
  page = 1,
  preliminary = true,
  spoilers = false,
}: GetReviewsOptions): Promise<{
  data: Review[] | null;
  pagination: ReviewsResponse["pagination"] | null;
  error: { message: string; status: number };
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      preliminary: preliminary.toString(),
      spoilers: spoilers.toString(),
    });

    const res = await fetchWithRetry(
      `${API_URL}/reviews/${type}?${params.toString()}`
    );

    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error fetching ${type} reviews`,
          status: res.status,
        },
      };
    }

    const json = (await res.json()) as ReviewsResponse;

    return {
      data: json.data,
      pagination: json.pagination,
      error: { message: "Success", status: 200 },
    };
  } catch (error) {
    return {
      ...resDefault,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      },
    };
  }
}

interface GetAnimeReviewsOptions {
  id: number;
  page?: number;
  preliminary?: boolean;
  spoilers?: boolean;
}

export async function getAnimeReviews({
  id,
  page = 1,
  preliminary = true,
  spoilers = false,
}: GetAnimeReviewsOptions): Promise<{
  data: Review[] | null;
  pagination: ReviewsResponse["pagination"] | null;
  error: { message: string; status: number };
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      preliminary: preliminary.toString(),
      spoilers: spoilers.toString(),
    });

    const res = await fetchWithRetry(
      `${API_URL}/anime/${id}/reviews?${params.toString()}`
    );

    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error fetching anime reviews for id ${id}`,
          status: res.status,
        },
      };
    }

    const json = (await res.json()) as ReviewsResponse;

    return {
      data: json.data,
      pagination: json.pagination,
      error: { message: "Success", status: 200 },
    };
  } catch (error) {
    return {
      ...resDefault,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      },
    };
  }
}

interface GetMangaReviewsOptions {
  id: number;
  page?: number;
  preliminary?: boolean;
  spoilers?: boolean;
}

export async function getMangaReviews({
  id,
  page = 1,
  preliminary = true,
  spoilers = false,
}: GetMangaReviewsOptions): Promise<{
  data: Review[] | null;
  pagination: ReviewsResponse["pagination"] | null;
  error: { message: string; status: number };
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      preliminary: preliminary.toString(),
      spoilers: spoilers.toString(),
    });

    const res = await fetchWithRetry(
      `${API_URL}/manga/${id}/reviews?${params.toString()}`
    );

    if (!res.ok) {
      return {
        ...resDefault,
        error: {
          message: `Error fetching manga reviews for id ${id}`,
          status: res.status,
        },
      };
    }

    const json = (await res.json()) as ReviewsResponse;

    return {
      data: json.data,
      pagination: json.pagination,
      error: { message: "Success", status: 200 },
    };
  } catch (error) {
    return {
      ...resDefault,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
        status: 500,
      },
    };
  }
}