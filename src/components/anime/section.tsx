import { useCallback, useEffect, useState } from "react";
import Card from "@/components/anime/card";
import ErrorBoundary from "@/components/ErrorBoundary";
import FilterBar, {
  type FilterConfig,
  type FilterOption,
} from "@/components/filter-bar";
import {
  typesOptions,
  statusOptions,
  yearOptions,
  orderByOptions,
  sortOptions,
  LIMIT_ANIME,
  KEY_LOCAL_STORAGE,
} from "@/const";
import { IconBook, IconDeviceTv, IconBookmarkOff } from "@tabler/icons-react";
import type { Anime, PaginationParse } from "@/types/anime";

const optionsViews = [
  { slug: "anime", name: "Anime", icon: <IconDeviceTv size={14} /> },
  { slug: "manga", name: "Manga", icon: <IconBook size={14} /> },
];
const filtersInitial = {
  orderBy: { slug: "mal_id", label: "Default" },
  sort: { slug: "desc", label: "Desc" },
  type: { slug: "", label: "All" },
  status: { slug: "", label: "All" },
  year: { slug: "", label: "All Years" },
};

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

interface SectionProps {
  watchListMode?: boolean;
}

export default function Section({ watchListMode = false }: SectionProps) {
  const [tab, setTab] = useState(optionsViews[0].slug);

  const [dataAnimes, setDataAnimes] = useState<Anime[]>([]);
  const [dataPagination, setDataPagination] = useState<PaginationParse | null>(
    null,
  );
  const [filters, setFilters] = useState(filtersInitial);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(
    async ({ page }: { page: number }) => {
      setIsLoading(true);

      try {
        if (watchListMode) {
          const storage = loadFromStorage();
          const items = storage[tab as keyof typeof storage];

          setDataAnimes(
            items.map((item) => ({
              mal_id: item.mal_id,
              title: item.title,
              title_english: item.title_english || "",
              title_japanese: item.title_japanese || "",
              images: item.images,
              type: item.type,
              rating: item.rating || "",
              status: item.status || "",
              url: "",
              trailer: { youtube_id: "", url: "", embed_url: "" },
              approved: false,
              titles: [],
              title_synonyms: [],
              source: "",
              episodes: 0,
              airing: false,
              aired: {
                from: "",
                to: "",
                prop: {
                  from: { day: 0, month: 0, year: 0 },
                  to: { day: 0, month: 0, year: 0 },
                  string: "",
                },
                string: "",
              },
              duration: "",
              score: 0,
              scored_by: 0,
              rank: 0,
              popularity: 0,
              members: 0,
              favorites: 0,
              synopsis: "",
              background: "",
              season: "",
              year: 0,
              broadcast: { day: "", time: "", timezone: "", string: "" },
              producers: [],
              licensors: [],
              studios: [],
              genres: [],
              explicit_genres: [],
              themes: [],
              demographics: [],
              relations: [],
              theme: { openings: [], endings: [] },
              external: [],
              streaming: [],
            })),
          );
          setIsLoading(false);
          return;
        }

        const body: Record<string, unknown> = {
          page,
          section: tab,
        };

        if (searchQuery.trim()) {
          body.query = searchQuery.trim();
        } else {
          body.status = filters.status.slug;
          body.type = filters.type.slug;
          body.year = filters.year.slug;
          body.order_by = filters.orderBy.slug;
          body.sort = filters.sort.slug;
        }

        const res = await fetch("/api/route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const { data, pagination } = await res.json();

        if (data) {
          setDataAnimes(data);
          setDataPagination(pagination);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      filters.status.slug,
      filters.type.slug,
      filters.year.slug,
      filters.orderBy.slug,
      filters.sort.slug,
      tab,
      searchQuery,
      watchListMode,
    ],
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData({
      page: 1,
    });
  }, [fetchData]);

  const handleNextPage = () => {
    if (watchListMode) {
      if (dataPagination && dataPagination.hasNextPage) {
        setDataPagination((prev) =>
          prev ? { ...prev, currentPage: prev.currentPage + 1 } : null,
        );
      }
    } else {
      if (dataPagination?.hasNextPage)
        fetchData({ page: dataPagination.currentPage + 1 });
    }
  };

  const handlePrevPage = () => {
    if (watchListMode) {
      if (dataPagination && dataPagination.currentPage > 1) {
        setDataPagination((prev) =>
          prev ? { ...prev, currentPage: prev.currentPage - 1 } : null,
        );
      }
    } else {
      if (dataPagination && dataPagination.currentPage > 1)
        fetchData({ page: dataPagination.currentPage - 1 });
    }
  };

  const handleChangeTab = (slug: string) => {
    setTab(slug);
    setFilters(filtersInitial);
    setSearchQuery("");
  };

  const handleFilterChange = (key: string, option: FilterOption) => {
    setFilters((prev) => ({ ...prev, [key]: option }));
  };

  const renderFilters = (): FilterConfig[] => {
    const tabKey = tab as keyof typeof typesOptions;
    return [
      { key: "orderBy", label: "Sort By", options: orderByOptions },
      { key: "sort", label: "Order", options: sortOptions },
      { key: "type", label: "Type", options: typesOptions[tabKey] || [] },
      { key: "status", label: "Status", options: statusOptions[tabKey] || [] },
      { key: "year", label: "Year", options: yearOptions[tabKey] || [] },
    ];
  };

  return (
    <ErrorBoundary>
      <section className="space-y-8 pt-14 min-h-dvh">
        {/* Header with title + controls */}
        <article className="flex flex-col gap-6">
          {/* Tab switcher */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-3">
              <h2 className="section-title">
                {watchListMode ? "My Watchlist" : "Browse"}
              </h2>
              <div className="flex items-center gap-1 bg-surface rounded-xl border border-border p-1">
                {optionsViews.map((option) => (
                  <button
                    key={option.slug}
                    type="button"
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider cursor-pointer transition-all duration-300 ${
                      option.slug === tab
                        ? "bg-accent text-bg shadow-[0_0_16px_-4px_rgba(167,139,250,0.3)]"
                        : "text-text-muted hover:text-text-primary hover:bg-white/4"
                    }`}
                    onClick={() => handleChangeTab(option.slug)}
                  >
                    {option.icon}
                    {option.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            filters={renderFilters()}
            values={filters}
            onChange={handleFilterChange}
            showSearch={true}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={`Search ${tab}...`}
            // searchIcon={<IconSearch size={16} />}
          />
        </article>

        {/* Cards grid */}
        <section className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
          {isLoading ? (
            Array(LIMIT_ANIME)
              .fill({})
              .map((_, i) => (
                <Card
                  key={i}
                  id={i}
                  title={""}
                  rating={""}
                  image={""}
                  index={i}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs h-4 bg-text-muted animate-pulse rounded w-2/4 uppercase tracking-wider font-medium"></span>
                  </div>
                </Card>
              ))
          ) : watchListMode && dataAnimes.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
              <IconBookmarkOff size={64} className="text-text-muted mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No favorites yet
              </h3>
              <p className="text-text-muted text-sm">
                Start adding anime or manga to your watchlist!
              </p>
            </div>
          ) : (
            dataAnimes.map((anime: Anime, i: number) => (
              <Card
                id={anime.mal_id}
                key={anime.mal_id}
                title={anime.title}
                rating={anime.rating}
                image={anime.images.webp.image_url}
                section={tab}
                index={i}
              >
                <div className="flex items-center gap-1.5">
                  {anime.type === "anime" ? (
                    <IconDeviceTv size={12} className="text-accent" />
                  ) : (
                    <IconBook size={12} className="text-accent-pink" />
                  )}
                  <span className="text-xs text-text-muted uppercase tracking-wider font-medium">
                    {anime.type}
                  </span>
                </div>
              </Card>
            ))
          )}
        </section>

        <div className="mt-4">
          {dataPagination && (
            <div className="flex items-center justify-center gap-5">
              <button
                disabled={dataPagination.currentPage === 1}
                onClick={handlePrevPage}
                className="cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)]"
              >
                Previous
              </button>
              <span className="text-sm text-text-muted uppercase tracking-wider font-medium">
                Page {dataPagination.currentPage} of {dataPagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={
                  dataPagination.currentPage === dataPagination.totalPages
                }
                className="cursor-pointer group flex items-center gap-2 bg-accent hover:bg-accent/90 text-bg px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.4)]"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </ErrorBoundary>
  );
}
