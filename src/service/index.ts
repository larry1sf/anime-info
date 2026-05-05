interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

export async function fetchWithRetry(
  url: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;

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
        const waitTime =
          retryDelay * Math.pow(2, attempt) + Math.random() * 500;
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

export const fetchAPI = (url: string, options?: FetchOptions) => {
  return fetchWithRetry(url, options);
};

export const resDefault = {
  data: null,
  error: {
    message: "No hubo ningun error",
    status: 200,
  },
};
