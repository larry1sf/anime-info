import { API_URL } from "@/const"
import type { tResAnimeFull } from "@/types/api"

interface tFetchApi { stage: string, rating?: string, searchParams?: string, itemsPerPage?: number, id?: number }
export const fetchApi = async ({ id, rating = "", stage = "", searchParams = "", itemsPerPage }: tFetchApi = { stage: "home" }) => {
    const itemId = id ? `/${id}` : ""
    const itemsType = stage === "home" || stage === "favorites" ? "" : `&type=${stage}`
    const itemsRating = rating ? `&rating=${rating}` : ""
    const itemsLimit = `?limit=${itemsPerPage ?? 1}`

    const url = `${API_URL}/anime${itemId}${itemsLimit}${itemsType}${itemsRating}${searchParams}`

    const fetchDataWithRetry = async (url: string, retryCount = 0): Promise<Response | null> => {
        try {
            const response = await fetch(url);

            if (response.status === 429) {
                console.error("Demasiadas peticiones. Error 429!");

                if (retryCount < 5) { // Limitar el número de reintentos
                    await new Promise(resolve => setTimeout(resolve, 350));
                    return fetchDataWithRetry(url, retryCount + 1);
                } else {
                    console.error("Máximo número de reintentos alcanzado");
                    return null;
                }
            }

            return response;
        } catch (error) {
            console.error("error: ", error);
            return null;
        }
    };

    const data = await fetchDataWithRetry(url);

    if (data != null) return await data.json() as tResAnimeFull;
    return null;
}
