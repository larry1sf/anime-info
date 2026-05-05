import { useState, useEffect } from "react";
import { IconBookmarkFilled, IconBookmarkPlus } from "@tabler/icons-react";
import { LIMIT_ANIME, KEY_LOCAL_STORAGE } from "@/const";
import type { Anime } from "@/types/anime";

interface WatchListItem {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: Anime["images"];
  type: string;
  rating?: string;
  status?: string;
}

interface WatchListStorage {
  anime: WatchListItem[];
  manga: WatchListItem[];
}

const loadFromStorage = (): WatchListStorage => {
  if (typeof window === "undefined") return { anime: [], manga: [] };
  const stored = localStorage.getItem(KEY_LOCAL_STORAGE);
  if (!stored) return { anime: [], manga: [] };
  try {
    return JSON.parse(stored) as WatchListStorage;
  } catch {
    return { anime: [], manga: [] };
  }
};

const saveToStorage = (data: WatchListStorage) => {
  if (data) localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(data));
};

const colorActive =
  "cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)] border border-accent/90";
const colorDefault =
  "cursor-pointer flex items-center gap-2 bg-transparent hover:bg-white/10 glass text-text-primary px-5 py-2.5 rounded-xl text-sm font-semibold border border-border hover:border-border-hover transition-all duration-300";
const colorDisabled =
  "cursor-not-allowed opacity-50 flex items-center gap-2 bg-transparent glass text-text-muted px-5 py-2.5 rounded-xl text-sm font-semibold border border-border/50 transition-all duration-300";

export default function WatchList({
  anime,
  section,
}: {
  anime: Anime;
  section: "anime" | "manga";
}) {
  const [isFollow, setIsFollow] = useState(false);
  const [isLimit, setIsLimit] = useState(false);
  const [, setStorage] = useState<WatchListStorage>({
    anime: [],
    manga: [],
  });

  const item: WatchListItem = {
    mal_id: anime.mal_id,
    title: anime.title,
    title_english: anime.title_english,
    title_japanese: anime.title_japanese,
    images: anime.images,
    type: anime.type,
    rating: anime.rating,
    status: anime.status,
  };

  useEffect(() => {
    const data = loadFromStorage();
    setStorage(data);
    const exists = data[section].some((item) => item.mal_id === anime.mal_id);
    setIsFollow(exists);
    setIsLimit(Object.values(data).flat().length >= LIMIT_ANIME && !exists);
  }, [anime.mal_id, section]);

  const handleClick = () => {
    if (isLimit) return;

    const currentStorage = loadFromStorage();
    const existsIndex = currentStorage[section].findIndex(
      (item) => item.mal_id === anime.mal_id,
    );

    let newStorage: WatchListStorage;

    if (existsIndex !== -1) {
      newStorage = {
        ...currentStorage,
        [section]: currentStorage[section].filter(
          (_, index) => index !== existsIndex,
        ),
      };
      setIsFollow(false);
      setIsLimit(false);
    } else {
      if (Object.values(currentStorage).flat().length >= LIMIT_ANIME) {
        setIsLimit(true);
        return;
      }
      newStorage = {
        ...currentStorage,
        [section]: [...currentStorage[section], item],
      };
      setIsFollow(true);
    }

    saveToStorage(newStorage);
    setStorage(newStorage);
  };

  const colorBtn = isFollow
    ? colorActive
    : isLimit
      ? colorDisabled
      : colorDefault;

  return (
    <button onClick={handleClick} className={`${colorBtn} w-full mb-6`}>
      {isFollow ? (
        <IconBookmarkFilled size={16} />
      ) : (
        <IconBookmarkPlus size={16} />
      )}

      {isFollow
        ? "Remove from Watch List"
        : isLimit
          ? "Watch List Full (10)"
          : "Add to Watch List"}
    </button>
  );
}
