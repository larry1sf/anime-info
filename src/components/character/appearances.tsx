import { useState } from "react";
import PaginatedGrid from "@/components/PaginatedGrid";

interface Role {
  anime?: {
    mal_id: number;
    title: string;
    title_english?: string;
    images?: {
      webp?: { image_url: string };
      jpg?: { image_url: string };
    };
  };
  manga?: {
    mal_id: number;
    title: string;
    title_english?: string;
    images?: {
      webp?: { image_url: string };
      jpg?: { image_url: string };
    };
  };
  role: string;
}

interface AppearancesProps {
  animeRoles: Role[];
  mangaRoles: Role[];
}

export default function AppearancesList({
  animeRoles,
  mangaRoles,
}: AppearancesProps) {
  const [activeTab, setActiveTab] = useState<"anime" | "manga">("anime");

  if (animeRoles.length === 0 && mangaRoles.length === 0) return null;

  const items = activeTab === "anime" ? animeRoles : mangaRoles;

  const renderAnimeAppearance = (role: Role, index: number) => (
    <a
      key={`anime-${role.anime?.mal_id}-${index}`}
      href={`/anime/${role.anime?.mal_id}`}
      className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-border-hover transition-all duration-300"
    >
      <div className="aspect-3/4 relative overflow-hidden">
        <img
          src={
            role.anime?.images?.webp?.image_url ||
            role.anime?.images?.jpg?.image_url ||
            ""
          }
          alt={role.anime?.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent" />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-text-primary line-clamp-2 mb-1">
          {role.anime?.title_english || role.anime?.title}
        </h3>
        <p className="text-xs text-accent uppercase tracking-wider">
          {role.role}
        </p>
      </div>
    </a>
  );

  const renderMangaAppearance = (role: Role, index: number) => (
    <a
      key={`manga-${role.manga?.mal_id}-${index}`}
      href={`/manga/${role.manga?.mal_id}`}
      className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-border-hover transition-all duration-300"
    >
      <div className="aspect-3/4 relative overflow-hidden">
        <img
          src={
            role.manga?.images?.webp?.image_url ||
            role.manga?.images?.jpg?.image_url ||
            ""
          }
          alt={role.manga?.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-surface via-transparent to-transparent" />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-text-primary line-clamp-2 mb-1">
          {role.manga?.title_english || role.manga?.title}
        </h3>
        <p className="text-xs text-accent-pink uppercase tracking-wider">
          {role.role}
        </p>
      </div>
    </a>
  );

  return (
    <>
      {animeRoles.length > 0 && mangaRoles.length > 0 && (
        <div className="flex items-center gap-1 bg-surface rounded-xl border border-border p-1 w-fit mb-6">
          <button
            onClick={() => setActiveTab("anime")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-300 ${
              activeTab === "anime"
                ? "bg-accent text-bg shadow-[0_0_16px_-4px_rgba(167,139,250,0.3)]"
                : "text-text-muted hover:text-text-primary hover:bg-white/4"
            }`}
          >
            Anime ({animeRoles.length})
          </button>
          <button
            onClick={() => setActiveTab("manga")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-300 ${
              activeTab === "manga"
                ? "bg-accent-pink text-bg shadow-[0_0_16px_-4px_rgba(167,139,250,0.3)]"
                : "text-text-muted hover:text-text-primary hover:bg-white/4"
            }`}
          >
            Manga ({mangaRoles.length})
          </button>
        </div>
      )}

      {activeTab === "anime" && animeRoles.length > 0 && (
        <PaginatedGrid
          items={animeRoles}
          renderItem={renderAnimeAppearance}
          title="Anime Appearances"
          itemsPerPage={8}
          gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      )}

      {activeTab === "manga" && mangaRoles.length > 0 && (
        <PaginatedGrid
          items={mangaRoles}
          renderItem={renderMangaAppearance}
          title="Manga Appearances"
          itemsPerPage={8}
          gridCols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      )}
    </>
  );
}
