import { KEY_LOCAL_STORAGE } from "@/const"

export const getLocalStorage = (): number[] => {
    const storage = localStorage.getItem(KEY_LOCAL_STORAGE)
    if (storage)
        return JSON.parse(storage)

    return []
}